import instance from '@/utils/axios'
import axios from 'axios'

export const authService = {
  async loginWithGoogle(googleData) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        googleData
      )
      
      // Lưu token
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  },

  async handleOAuthCallback(code) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BE_API_BASE_URL}/auth/google/callback`,
        { code }
      )
      
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    } catch (error) {
      console.error('OAuth callback failed:', error)
      throw error
    }
  },


  async getMe() {
    try {
      const response = await instance.get(
        `${import.meta.env.VITE_BE_API_BASE_URL}/auth/me`
      )
      return response.data
    } catch (error) {
      console.error('Get user info failed:', error)
      throw error
    }
  },

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    // Redirect về trang chủ
    window.location.href = '/'
  }
}