import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

/**
 * useAuth - Custom hook to access authentication state and methods
 *
 * @returns {Object} {
 *   user,           // Current user object
 *   token,          // JWT token
 *   loading,        // Auth loading state
 *   login,          // Login function
 *   register,       // Registration function
 *   logout,         // Logout function
 *   isAuthenticated,// Boolean
 *   hasRole         // Role check function
 * }
 */
const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
        'Wrap your app with <AuthProvider> in main.jsx or App.jsx.'
    )
  }

  return context
}

export default useAuth