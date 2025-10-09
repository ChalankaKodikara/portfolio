// src/lib/auth.js
const AUTH_KEY = "ck_auth_v1";

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || "admin";
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || "1234";

export function login(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === "1";
}
