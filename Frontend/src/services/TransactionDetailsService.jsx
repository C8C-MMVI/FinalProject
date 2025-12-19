import axios from "axios";

const API_URL = "http://localhost:8080/api/transaction-details";

export function TransactionDetailsService(token) {
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    getAll: () => api.get("/").then(res => res.data),
    getById: (id) => api.get(`/${id}`).then(res => res.data),
    create: (detailsRequest) =>
      api.post("/", detailsRequest).then(res => res.data),
    update: (id, detailsRequest) =>
      api.put(`/${id}`, detailsRequest).then(res => res.data),
    delete: (id) => api.delete(`/${id}`).then(res => res.data),
  };
}
