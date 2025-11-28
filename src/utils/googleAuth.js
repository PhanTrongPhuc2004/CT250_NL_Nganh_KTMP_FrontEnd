export class GoogleAuth {
  constructor(clientId) {
    this.clientId = clientId
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        this.isInitialized = true
        resolve()
      }
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'))
      }
      document.head.appendChild(script)
    })
  }

  renderButton(element, callback, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Google Identity Services not initialized')
    }

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: callback,
      ...options
    })

    window.google.accounts.id.renderButton(
      element,
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: options.width || 300
      }
    )
  }

  showOneTap(callback, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Google Identity Services not initialized')
    }

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: callback,
      ...options
    })

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Có thể xử lý trường hợp One Tap không hiển thị ở đây
        console.log('One Tap not displayed:', notification.getNotDisplayedReason())
      }
    })
  }

  disableAutoSelect() {
    if (this.isInitialized) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

  revoke(accessToken, callback) {
    if (this.isInitialized) {
      window.google.accounts.oauth2.revoke(accessToken, callback)
    }
  }
}