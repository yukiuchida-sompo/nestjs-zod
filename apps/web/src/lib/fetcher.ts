const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const customFetcher = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  // If url is already absolute (starts with http:// or https://), use it directly
  const fullUrl = url.startsWith('http://') || url.startsWith('https://') 
    ? url 
    : `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {
      data: undefined,
      status: response.status,
      headers: response.headers,
    } as T;
  }

  const data = await response.json();
  
  // Return in Orval's expected format
  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};
