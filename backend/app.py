"""
FinTrack — Flask REST API
Author: Ibrahim Fayyad | github.com/ibrahimf90
"""

import os
import pymysql
import pymysql.cursors
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import date

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ── MySQL config ───────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host":    os.getenv("MYSQL_HOST", "localhost"),
    "user":    os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DB", "fintrack"),
    "port":    int(os.getenv("MYSQL_PORT", 3306)),
    "cursorclass": pymysql.cursors.DictCursor,
}

VALID_TYPES      = {"income", "expense"}
VALID_CATEGORIES = {
    "Salary", "Food", "Rent", "Transport",
    "Entertainment", "Health", "Shopping", "Other",
}


# ── Helpers ────────────────────────────────────────────────────────────────────
def get_db():
    return pymysql.connect(**DB_CONFIG)

def row_to_dict(row: dict) -> dict:
    if isinstance(row.get("date"), date):
        row["date"] = row["date"].isoformat()
    return row

def error(msg: str, code: int = 400):
    return jsonify({"error": msg}), code


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    t_type   = request.args.get("type")
    category = request.args.get("category")

    query   = "SELECT id, type, category, amount, description, date FROM transactions"
    params  = []
    clauses = []

    if t_type:
        if t_type not in VALID_TYPES:
            return error(f"Invalid type '{t_type}'.")
        clauses.append("type = %s")
        params.append(t_type)

    if category:
        if category not in VALID_CATEGORIES:
            return error(f"Invalid category '{category}'.")
        clauses.append("category = %s")
        params.append(category)

    if clauses:
        query += " WHERE " + " AND ".join(clauses)

    query += " ORDER BY date DESC, id DESC"

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(query, params)
            rows = [row_to_dict(r) for r in cur.fetchall()]
        return jsonify(rows), 200
    finally:
        conn.close()


@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.get_json(silent=True)
    if not data:
        return error("Request body must be JSON.")

    t_type      = data.get("type", "").strip()
    category    = data.get("category", "").strip()
    amount      = data.get("amount")
    description = data.get("description", "").strip()
    tx_date     = data.get("date", "").strip()

    if t_type not in VALID_TYPES:
        return error("type must be 'income' or 'expense'.")
    if category not in VALID_CATEGORIES:
        return error(f"category must be one of: {', '.join(sorted(VALID_CATEGORIES))}.")
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return error("amount must be a positive number.")
    if not tx_date:
        return error("date is required (YYYY-MM-DD).")

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO transactions (type, category, amount, description, date) VALUES (%s, %s, %s, %s, %s)",
                (t_type, category, amount, description, tx_date),
            )
            conn.commit()
            new_id = cur.lastrowid
            cur.execute(
                "SELECT id, type, category, amount, description, date FROM transactions WHERE id = %s",
                (new_id,),
            )
            row = row_to_dict(cur.fetchone())
        return jsonify(row), 201
    finally:
        conn.close()


@app.route("/api/transactions/<int:tx_id>", methods=["DELETE"])
def delete_transaction(tx_id: int):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM transactions WHERE id = %s", (tx_id,))
            if not cur.fetchone():
                return error(f"Transaction {tx_id} not found.", 404)
            cur.execute("DELETE FROM transactions WHERE id = %s", (tx_id,))
            conn.commit()
        return jsonify({"message": f"Transaction {tx_id} deleted."}), 200
    finally:
        conn.close()


@app.route("/api/summary", methods=["GET"])
def get_summary():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                  COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
                  COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses
                FROM transactions
                """
            )
            totals = cur.fetchone()
            total_income   = float(totals["total_income"])
            total_expenses = float(totals["total_expenses"])
            balance        = total_income - total_expenses

            cur.execute(
                """
                SELECT category, COALESCE(SUM(amount), 0) AS total
                FROM transactions
                WHERE type = 'expense'
                GROUP BY category
                ORDER BY total DESC
                """
            )
            by_category = [{"category": r["category"], "total": float(r["total"])} for r in cur.fetchall()]

        return jsonify({
            "balance":        balance,
            "total_income":   total_income,
            "total_expenses": total_expenses,
            "by_category":    by_category,
        }), 200
    finally:
        conn.close()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "project": "FinTrack"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)