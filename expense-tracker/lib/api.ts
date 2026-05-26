const BASE = "";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getUser(): { id: string; username: string } | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setUser(user: { id: string; username: string }) {
  localStorage.setItem("user", JSON.stringify(user));
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  login: (username: string, password: string) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  signup: (username: string, password: string) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getExpenses: (params?: { month?: number; year?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.set("month", String(params.month));
    if (params?.year) searchParams.set("year", String(params.year));
    const qs = searchParams.toString();
    return request(`/api/expenses${qs ? `?${qs}` : ""}`);
  },

  createExpense: (data: {
    description: string;
    amount: number;
    category?: string;
    date?: string;
  }) =>
    request("/api/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteExpense: (id: string) =>
    request(`/api/expenses/${id}`, { method: "DELETE" }),

  updateExpense: (
    id: string,
    data: {
      description?: string;
      amount?: number;
      category?: string;
      date?: string;
    }
  ) =>
    request(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getInsights: () => request("/api/ai/insights"),

  categorize: (description: string) =>
    request("/api/ai/categorize", {
      method: "POST",
      body: JSON.stringify({ description }),
    }),

  getPrediction: () => request("/api/ai/predict"),
};
