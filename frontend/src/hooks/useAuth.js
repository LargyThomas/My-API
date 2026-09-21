import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'

// useAuth now reads from AuthContext provided at app root
export default function useAuth() {
  return useContext(AuthContext)
}
