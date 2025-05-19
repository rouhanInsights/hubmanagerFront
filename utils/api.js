const BASE_URL = "http://127.0.0.1:8000"; 

// Store token in localStorage
function saveToken(token) {
  localStorage.setItem("access_token", token);
}

// Retrieve token
function getToken() {
  return localStorage.getItem("access_token");
}

// User Signup
export async function signUp(userData) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
}

// User Login (Saves JWT Token)
export async function login(userData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (response.ok) {
    saveToken(data.access_token);
  }
  return data;
}

// Logout Function (Deletes Token)
export function logout() {
  localStorage.removeItem("access_token");
  sessionStorage.clear(); // <- just in case
  window.location.href = "/login";
}

// Get Logged-In User Info (Protected API)
export async function getUserInfo() {
  const token = localStorage.getItem("access_token");
  if (!token) return { detail: "No token found" };

  const response = await fetch("http://127.0.0.1:8000/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function requestPasswordReset(email) {
  const response = await fetch("http://127.0.0.1:8000/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return response.json();
}

export async function resetPassword(data) {
  const response = await fetch("http://127.0.0.1:8000/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

// export async function sendAudioToPipeline(audioFile) {
//   const formData = new FormData();
//   formData.append("audio", audioFile);

//   const response = await fetch("http://localhost:8000/ai/pipeline", {
//     method: "POST",
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error("Failed to process audio.");
//   }

//   return response.json();
// }

export async function sendAudioToPipeline(audioFile) {
  const token = getToken(); // ✅ use your helper

  const formData = new FormData();
  formData.append("audio", audioFile);

  const response = await fetch(`${BASE_URL}/ai/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ pass token
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to process audio.");
  }

  return response.json();
}
export async function getUserSessions() {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://localhost:8000/ai/sessions", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch user sessions.");
  }

  return response.json();
}
export async function getSessionById(id) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`http://localhost:8000/ai/session/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load session");
  }

  return response.json();
}

