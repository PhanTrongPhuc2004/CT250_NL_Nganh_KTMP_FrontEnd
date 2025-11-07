// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Dùng để gửi cookie cùng với yêu cầu HTTP tới Server
});

export default instance;