import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.carbonaraapp.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TU_TOKEN_DE_API'
  }
});

export default api;
