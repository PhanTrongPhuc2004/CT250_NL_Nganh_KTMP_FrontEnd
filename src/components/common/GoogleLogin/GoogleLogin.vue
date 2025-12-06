<template>
  <div class="google-login">
    <!-- Google Sign In Button sẽ được render tự động -->
    <div id="googleSignInBtn" class="google-button-container"></div>
    
    <!-- Fallback button -->
    <button 
      v-if="showFallback" 
      @click="initGoogleSignIn" 
      class="btn btn-google fallback-btn"
      :disabled="loading"
    >
      <GoogleIcon />
      <span v-if="loading">Đang đăng nhập...</span>
      <span v-else>Đăng nhập với Google</span>
    </button>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import instance from '@/utils/axios'
import { ref, onMounted, onUnmounted } from 'vue'

const loading = ref(false)
const error = ref('')
const showFallback = ref(false)

const emit = defineEmits(['success', 'error'])

// Google Icon Component
const GoogleIcon = {
  template: `
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.5 9.2c0-.7-.1-1.3-.3-1.9H9v3.4h4.2c-.2 1.1-.8 2.1-1.7 2.7v2.2h2.8c1.6-1.5 2.5-3.7 2.5-6.4z"/>
      <path fill="#34A853" d="M9 17c2.3 0 4.2-.8 5.6-2.1l-2.8-2.2c-.8.5-1.8.9-2.8.9-2.1 0-3.9-1.4-4.5-3.4H1.5v2.3C2.9 15.1 5.7 17 9 17z"/>
      <path fill="#FBBC05" d="M4.5 10.3c-.2-.5-.3-1.1-.3-1.8s.1-1.3.3-1.8V4.4H1.5C.8 5.7.4 7.3.4 9s.4 3.3 1.1 4.6l3.4-2.6z"/>
      <path fill="#EA4335" d="M9 4.5c1.2 0 2.3.4 3.2 1.3l2.4-2.4C13.2 1.9 11.3 1 9 1 5.7 1 2.9 2.9 1.5 5.4l3 2.3c.6-2 2.4-3.4 4.5-3.4z"/>
    </svg>
  `
}

// Global callback function
window.handleGoogleSignIn = (response) => {
  handleCredentialResponse(response)
}

const initGoogleSignIn = () => {
  try {
    loading.value = true
    error.value = ''

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      throw new Error('Google Client ID chưa được cấu hình')
    }

    // Xóa script cũ nếu tồn tại
    const oldScript = document.getElementById('google-identity-script')
    if (oldScript) {
      oldScript.remove()
    }

    // Tạo script mới cho Google Identity Services
    const script = document.createElement('script')
    script.id = 'google-identity-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      
      if (window.google && window.google.accounts) {
        // Khởi tạo Google Identity Services
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: window.handleGoogleSignIn,
          context: 'signin',
          ux_mode: 'popup',
          auto_select: false,
          cancel_on_tap_outside: true
        })

        // Render button
        const buttonContainer = document.getElementById('googleSignInBtn')
        if (buttonContainer) {
          window.google.accounts.id.renderButton(
            buttonContainer,
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 300
            }
          )
        }

        // Hiển thị One Tap (tùy chọn)
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          }
        })

        loading.value = false
      } else {
        throw new Error('Google Identity Services không khả dụng')
      }
    }

    script.onerror = () => {
      console.error('❌ Failed to load Google Identity Services')
      showFallback.value = true
      error.value = 'Không thể tải dịch vụ Google'
      loading.value = false
      emit('error', new Error('Failed to load Google Identity Services'))
    }

    document.head.appendChild(script)

  } catch (err) {
    console.error('❌ Failed to initialize Google Sign In:', err)
    error.value = 'Không thể khởi tạo đăng nhập Google'
    showFallback.value = true
    loading.value = false
    emit('error', err)
  }
}

const handleCredentialResponse = async (response) => {
  try {
    loading.value = true
    if (!response || !response.credential) {
      throw new Error('Không nhận được thông tin đăng nhập từ Google')
    }
    const apiBaseUrl = import.meta.env.VITE_API_BE_BASE_URL || 'http://localhost:5000'
    const apiUrl = `${apiBaseUrl}/nguoidung/google`

    const backendResponse = await instance.post(apiUrl, {
      token: response.credential
    })

    const userData = backendResponse.data
    
    emit('success', userData)
    window.location.reload()
  } catch (err) {
    console.error('❌ Google login failed:', err)
    error.value = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
    emit('error', err)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  initGoogleSignIn()
})

onUnmounted(() => {
  // Cleanup
  if (window.google && window.google.accounts) {
    window.google.accounts.id.cancel()
  }
})
</script>

<style scoped>
.google-login {
  width: 100%;
}

.google-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  min-height: 44px;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #757575;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-google:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-google.fallback-btn {
  background: #4285f4;
  color: white;
  border: none;
}

.btn-google.fallback-btn:hover {
  background: #357ae8;
  box-shadow: 0 2px 6px rgba(66, 133, 244, 0.3);
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
  padding: 8px;
  background: #f8d7da;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}
</style>