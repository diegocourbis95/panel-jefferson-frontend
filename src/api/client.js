import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://187.77.241.244:8004' })
api.interceptors.request.use(config => {
  config.headers['x-api-key'] = import.meta.env.VITE_INTERNAL_API_KEY
  return config
})
export const get = (url, config) => api.get(url, config).then(r => r.data)
export const post = (url, data, config) => api.post(url, data, config).then(r => r.data)
export const patch = (url, data) => api.patch(url, data).then(r => r.data)
export default api
