const SESSION_KEY = "runze-admin";

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "zizi0610";

export function isAdminSession() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function startAdminSession() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function endAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
