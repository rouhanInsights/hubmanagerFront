

// Logout Function (Deletes Token)
export function logout() {
  localStorage.removeItem("token");
  sessionStorage.clear(); // <- just in case
  window.location.href = "/login";
}
