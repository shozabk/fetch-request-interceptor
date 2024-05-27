type FetchInterceptor = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<{ input: RequestInfo; init?: RequestInit | undefined }>;

const originalFetch = window.fetch;

export const createFetchInterceptor = () => {
  let requestInterceptor: FetchInterceptor | null = null;

  const setRequestInterceptor = (interceptor: FetchInterceptor) => {
    requestInterceptor = interceptor;
  };

  const interceptFetch = async (
    input: RequestInfo,
    init: RequestInit | null | undefined
  ): Promise<Response> => {
    if (requestInterceptor) {
      const modified = await requestInterceptor(input, init || undefined);
      input = modified.input;
      init = modified?.init !== null ? modified.init : undefined;
    }
    return originalFetch(input, init || undefined);
  };

  (window as any).fetch = interceptFetch;

  return {
    setRequestInterceptor,
  };
};
