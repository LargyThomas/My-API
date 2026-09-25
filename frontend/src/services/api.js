import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Fetch paginated animals. Returns an object with { data, pagination }
export async function getAnimals({ page = 1, limit = 20 } = {}) {
  try {
    const res = await api.get('/animals', { params: { page, limit } })
    const data = res.data && res.data.data ? res.data.data : []
    const pagination = res.data && res.data.pagination ? res.data.pagination : { page, limit }
    return { data, pagination }
  } catch (err) {
    console.error('getAnimals error:', err.message || err)
    return { data: [], pagination: { page, limit } }
  }
}

// Fetch a single animal by id or external_id. Returns the animal object or null
export async function getAnimal(id) {
  try {
    const res = await api.get(`/animals/${id}`)
    // The backend returns { message, data }
    return res.data && res.data.data ? res.data.data : null
  } catch (err) {
    console.error('getAnimal error:', err.message || err)
    return null
  }
}

export default api
