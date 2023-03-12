import axios from "axios"

const customFetch = axios.create({
  // SINCE SET UP PROXY SO DOESN'T HAVE TO USE FULL URL (e.g http://localhost:5000)
  // baseURL: "/api/v1/",
  baseURL: "https://yard-api.onrender.com/api/v1/",
  withCredentials: true,
})

export default customFetch
