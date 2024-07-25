import axios from './axios.js'

export const test = () => {
    return axios.get('/test')
}