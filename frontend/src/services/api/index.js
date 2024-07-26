import axios from "axios"

const adminAPI = axios.create({
    baseURL: "http://localhost:3001"
  
})

export default adminAPI
