export interface ResponseModel<T = any> {
  status: number;
  message: string;
  data?: T;
}

let _authToken: string | null = null;
let _onUnauthorized: (() => void) | null = null;

export const httpClient = {
  setAuthToken(token: string | null) {
    _authToken = token;
  },

  setOnUnauthorized(callback: () => void) {
    _onUnauthorized = callback;
  },

  async request<T = any>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    baseUrl: string,
    endpoint: string,
    payload?: any
  ): Promise<ResponseModel<T>> {
    const url = `${baseUrl.replace(/\/$/, "")}${endpoint}`;
    const opts: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(_authToken ? { Authorization: `Bearer ${_authToken}` } : {}),
      },
      body: payload ? JSON.stringify(payload) : undefined,
    };
    try {
      const res = await fetch(url, opts);
      const json = await res.json();

      if (res.status === 401 && _onUnauthorized) {
        _onUnauthorized();
      }

      return {
        status: res.status,
        message: json.message ?? res.statusText,
        data: json.data ?? json,
      };
    } catch (err: any) {
      return { status: 0, message: err.message || "Network error" };
    }
  },

  get<T>(baseUrl: string, endpoint: string) {
    return this.request<T>("GET", baseUrl, endpoint);
  },
  post<T>(baseUrl: string, endpoint: string, payload: any) {
    return this.request<T>("POST", baseUrl, endpoint, payload);
  },
  put<T>(baseUrl: string, endpoint: string, id: string | number, payload: any) {
    return this.request<T>("PUT", baseUrl, `${endpoint}/${id}`, payload);
  },
  delete<T>(baseUrl: string, endpoint: string, id: string | number) {
    return this.request<T>("DELETE", baseUrl, `${endpoint}/${id}`);
  },
  patch<T>(
    baseUrl: string,
    endpoint: string,
    id: string | number,
    payload: any
  ) {
    return this.request<T>("PATCH", baseUrl, `${endpoint}/${id}`, payload);
  },
};
