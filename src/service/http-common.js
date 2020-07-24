import axios from "axios";

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export default axios.create({
  baseURL: isProduction() ? '/api' : 'http://localhost:8080',
  headers: {
    "Content-type": "application/json"
  }
});