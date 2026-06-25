import { Transaction, Summary, NewTransaction, FilterType } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + "/api"
  : "/api";

// ── Fetch all transactions (with optional filters) ─────────────────────────
export async function fetchTransactions(
  filter: FilterType = "all",
  category?: string,
): Promise<Transaction[]> {
  const params = new URLSearchParams();

  if (filter !== "all") params.append("type", filter);
  if (category && category !== "all") params.append("category", category);

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${BASE_URL}/transactions${query}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch transactions");
  }

  return res.json();
}

// ── Add a new transaction ──────────────────────────────────────────────────
export async function addTransaction(
  data: NewTransaction,
): Promise<Transaction> {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add transaction");
  }

  return res.json();
}

// ── Delete a transaction ───────────────────────────────────────────────────
export async function deleteTransaction(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete transaction");
  }
}

// ── Fetch summary (balance, income, expenses, by category) ────────────────
export async function fetchSummary(): Promise<Summary> {
  const res = await fetch(`${BASE_URL}/summary`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch summary");
  }

  return res.json();
}
