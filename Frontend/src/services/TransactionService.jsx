import axios from "axios";

const API_URL = "http://localhost:8080/api/transactions";

export function TransactionService(token) {
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    getAll: () => api.get("").then(res => res.data),
    getById: (id) => api.get(`/${id}`).then(res => res.data),
    create: (transactionRequest) => api.post("", transactionRequest).then(res => res.data),
    update: (id, transactionRequest) => api.put(`/${id}`, transactionRequest).then(res => res.data),
    delete: (id) => api.delete(`/${id}`).then(res => res.data),
  };
}
