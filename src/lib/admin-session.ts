const SESSION_KEY = "runze-admin";
const SESSION_EVENT = "runze-admin-session";

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "zizi0610";

function notify() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function subscribeAdminSession(onChange: () => void) {
  window.addEventListener(SESSION_EVENT, onChange);
  return () => window.removeEventListener(SESSION_EVENT, onChange);
}

export function isAdminSession() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function startAdminSession() {
  sessionStorage.setItem(SESSION_KEY, "1");
  notify();
}

export function endAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
  notify();
}
