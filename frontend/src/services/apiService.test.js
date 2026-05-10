import api from './apiService';

describe('apiService auth header interceptor', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('adds bearer token from localStorage when available', () => {
    localStorage.setItem('token', 'test-token');
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const result = interceptor({ headers: {} });

    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('does not add authorization header when token is missing', () => {
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const result = interceptor({ headers: {} });

    expect(result.headers.Authorization).toBeUndefined();
  });
});
