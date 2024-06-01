import axios from 'axios'

const fetchClient = () => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const instance = axios.create(defaultOptions)

  instance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('@App:token')
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  })

  return instance
}

export default fetchClient
