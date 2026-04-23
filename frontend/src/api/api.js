import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL || "https://eduflex-if8s.onrender.com/api";
const baseURL = envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;

export default axios.create({
  baseURL
});
