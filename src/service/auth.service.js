
import { BASE_URL } from "../constants";
import { fetchAPI } from "./api";
import { handleResponse } from "./handleResponse";


export async function login({ email, password }) {
  const response = await fetchAPI(`${BASE_URL}/api/instructor_login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const result = await handleResponse(response);

  console.log("Login result:", result);
  const token = result.data?.data?.token;
  const userId = result.data?.data?.loggedInUserId;

  console.log("TOKEN:", token);
  console.log("USER ID:", userId);

  if (!token) {
    throw new Error('Login failed: token not found');
  }

  return { token, userId };
}



export function logout() {
  localStorage.removeItem('authToken');
}
