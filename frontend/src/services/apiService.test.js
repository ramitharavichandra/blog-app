import { applyAuthHeader } from './apiService';

describe('apiService auth header interceptor', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('adds bearer token from localStorage when available', () => {
    localStorage.setItem('token', 'test-token');
    const result = applyAuthHeader({ headers: {} });

    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('does not add authorization header when token is missing', () => {
    const result = applyAuthHeader({ headers: {} });

    expect(result.headers.Authorization).toBeUndefined();
  });
});
