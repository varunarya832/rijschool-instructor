export const storage = {
    getToken: () => localStorage.getItem('authToken'),
    setToken: (token) => localStorage.setItem('authToken', token),
    clearToken: () => localStorage.removeItem('authToken'),
  };
  