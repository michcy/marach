import axios from "axios";

export const API_BASE_URL = 'http://localhost:3000';

export const login = async (user) => {
    return await axios.post(`${API_BASE_URL}/login`, user)
}

export const register = async (user) => {
    return await axios.post(`${API_BASE_URL}/register`, user)
}

export const getAllTasks = async () => {
    return await axios.get(`${API_BASE_URL}/tasks`)
}

export const searchTasks = async (query) => {
    return await axios.get(`${API_BASE_URL}/tasks/search?q=${query}`)
}
