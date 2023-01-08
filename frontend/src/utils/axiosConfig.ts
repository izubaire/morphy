import axios from "axios"

const axiosInstance = axios.create({
  baseURL: REACT_APP_BACKEND_URL,
  withCredentials: true,
})

export default axiosInstance
