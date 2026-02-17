import { httpClient } from "../httpClient";

const API_URL = import.meta.env.VITE_API_URL as string;

export const clinicService = {
  getAll: () => httpClient.get(API_URL, '/clinics'),
  getById: (id: string) => httpClient.get(API_URL, `/clinics/${id}`),
  create: (data: unknown) => httpClient.post(API_URL, '/clinics', data),
  update: (id: string, data: unknown) => httpClient.put(API_URL, '/clinics', id, data),
  delete: (id: string) => httpClient.delete(API_URL, '/clinics', id),
};