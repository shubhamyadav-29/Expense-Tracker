import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-tcfd.onrender.com/api",
});

export default API;