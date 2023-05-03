import axios from "axios";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:4000";

import { parseCookies } from "nookies";

const cokkies = parseCookies();

const api = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});
const { Authorization: token } = cokkies;

if (token) api.defaults.headers.Authorization = `${token}`;

export async function recoverUserInfo() {
  return api.get(`${API_HOST}/user `, {
    headers: {
      Cookie: token,
    },
  });
}

export default api;
