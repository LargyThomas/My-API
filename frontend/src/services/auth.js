import api from './api'

export async function login(credentials) {
  try {
    const res = await api.post('/api/auth/login', credentials)
    return res.data
  } catch (err) {
    console.error('login error', err.message || err)
    throw err
  }
}

export async function me() {
  try {
    const res = await api.get('/api/auth/me')
    return res.data
  } catch (err) {
    console.error('me error', err.message || err)
    throw err
  }
}