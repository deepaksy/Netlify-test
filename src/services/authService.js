// src/services/authService.js
export async function loginUser(email, password) {
  const response = await fetch("http://localhost:8080/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg = body.message || response.statusText || "Login failed";
    throw new Error(msg);
  }
  // The backend returned: { message, jwt }
  const data = await response.json();
  // remap the jwt key so the frontend always gets { token }
  return { token: data.jwt, ...data };
}
