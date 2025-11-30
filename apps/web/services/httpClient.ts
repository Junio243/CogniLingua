const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_GATEWAY_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'http://localhost:3000';

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
};

export type FetchMode = 'ssr' | 'csr';

export type HttpRequestOptions = Omit<RequestInit, 'mode'> & {
  mode?: FetchMode;
  query?: Record<string, string | number | boolean | undefined>;
  /**
   * Bearer token forwarded to the API gateway.
   * When provided, an Authorization header will be appended to the request.
   */
  authToken?: string;
  /**
   * Whether cookies/session data should be forwarded automatically.
   * Enabled by default to support authenticated gateway routes.
   */
  withCredentials?: boolean;
};

function buildUrl(path: string, query?: HttpRequestOptions['query']): string {
  const url = new URL(path, BASE_URL);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  let message = `HTTP ${response.status}`;
  try {
    const errorBody = await response.json();
    if (errorBody?.message) {
      message = Array.isArray(errorBody.message) ? errorBody.message.join(', ') : String(errorBody.message);
    }
  } catch {
    // ignore
  }
  throw new Error(message);
}

function mergeHeaders(customHeaders?: HeadersInit): HeadersInit {
  if (!customHeaders) return defaultHeaders;
  return {
    ...defaultHeaders,
    ...(customHeaders instanceof Headers ? Object.fromEntries(customHeaders.entries()) : customHeaders),
  };
}

function normalizeOptions(options: HttpRequestOptions = {}): HttpRequestOptions {
  const { mode = 'ssr', headers, authToken, withCredentials = true, ...rest } = options;
  // Usar ISR no SSR para evitar fetch no-store durante o build
  const cacheConfig: any = mode === 'ssr' ? { next: { revalidate: 60 } } : {};
  const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;

  return {
    ...cacheConfig,
    ...rest,
    credentials: withCredentials ? 'include' : rest.credentials,
    headers: mergeHeaders({ ...authHeaders, ...headers }),
  };
}

async function request<T>(
  path: string,
  options: HttpRequestOptions = {},
  httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
): Promise<T> {
  const { body, query, mode: _mode, ...fetchOptions } = normalizeOptions(options);
  const url = buildUrl(path, query);
  const finalOptions: RequestInit = {
    ...fetchOptions,
    method: httpMethod,
  };
  if (body !== undefined) {
    const isFormData = body instanceof FormData;
    finalOptions.body = isFormData ? body : JSON.stringify(body);
    if (!isFormData) finalOptions.headers = mergeHeaders({ 'Content-Type': 'application/json', ...finalOptions.headers });
  }
  const response = await fetch(url, finalOptions);
  return handleResponse<T>(response);
}

export function httpGet<T>(path: string, options?: HttpRequestOptions): Promise<T> {
  return request<T>(path, options, 'GET');
}
export function httpPost<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
  return request<T>(path, { ...options, body: body as BodyInit | undefined }, 'POST');
}
export const httpClient = {
  baseUrl: BASE_URL,
  get: httpGet,
  post: httpPost,
};
export type { HttpRequestOptions as HttpClientOptions };
