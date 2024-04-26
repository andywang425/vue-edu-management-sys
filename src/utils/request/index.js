import Request from "./request";

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : ''

const request = new Request({
    baseURL: BASE_URL  + '/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
    },
    withCredentials: true
})

export default request
