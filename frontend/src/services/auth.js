import api from './api'

// Log in and return the server response (usually includes token)
export async function login(credentials) {
  try {
    const res = await api.post('/auth/login', credentials)
    return res.data
  } catch (err) {
    console.error('login error', err.message || err)
    throw err
  }
}

// Get current user info
export async function me() {
  try {
    const res = await api.get('/auth/me')
    return res.data
  } catch (err) {
    console.error('me error', err.message || err)
    throw err
  }
}
