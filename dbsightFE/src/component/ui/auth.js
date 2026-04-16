// src/utils/auth.js
export const getToken = () => {
  // Option 1: localStorage (simple, but less secure)
  return localStorage.getItem('jwt_token');
  
  // Option 2: httpOnly cookie (more secure, requires backend support)
  // return document.cookie.replace(/(?:(?:^|.*;\s*)jwt_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
};

export const setToken = (token) => {
  localStorage.setItem('jwt_token', token);
};

export const clearToken = () => {
  localStorage.removeItem('jwt_token');
};