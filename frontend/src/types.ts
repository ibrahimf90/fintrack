export interface Transaction {
  id: number;
  type: "income" | "expense";
  category: Category;
  amount: number;
  description: string;
  date: string;
}

export type Category =
  | "Salary"
  | "Food"
  | "Rent"
  | "Transport"
  | "Entertainment"
  | "Health"
  | "Shopping"
  | "Other";

export interface Summary {
  balance: number;
  total_income: number;
  total_expenses: number;
  by_category: CategoryTotal[];
}

export interface CategoryTotal {
  category: Category;
  total: number;
}

export interface NewTransaction {
  type: "income" | "expense";
  category: Category;
  amount: number;
  description: string;
  date: string;
}

export type FilterType = "all" | "income" | "expense";

export const CATEGORIES: Category[] = [
  "Salary",
  "Food",
  "Rent",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Other",
];
