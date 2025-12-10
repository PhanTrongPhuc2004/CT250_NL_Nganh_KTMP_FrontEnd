<template>
  <div class="chatbot-wrapper">
    <div v-if="!isOpen" @click="toggleChat" class="chat-icon">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      <div v-if="trainingContext" class="training-badge">📚</div>
    </div>

    <div v-if="isOpen" class="chat-container">
      <div class="chat-header">
        <h3>ChatBot Bóng Đá ⚽</h3>
        <div class="header-actions">
          <button @click="clearHistory" title="Xóa lịch sử" style="width: 35px; height: 15px; background-color: transparent;">
            
          </button>
          <button @click="toggleChat">
            
                <FontAwesomeIcon :icon="['fas', 'close']" />
        
          </button>
        </div>
      </div>

      <div ref="messagesContainer" class="messages">
        <div v-for="(msg, index) in messages" :key="index" class="message-wrapper">
          <div :class="['message', msg.sender === 'user' ? 'user-message' : 'bot-message']">
            {{ msg.text }}
          </div>
        </div>
        <div v-if="isLoading" class="message bot-message">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="input"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Nhập câu hỏi về bóng đá..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="!input.trim() || isLoading">
          <span v-if="!isLoading">Gửi</span>
          <svg v-else class="spinner" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import instance from '@/utils/axios'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)
const isOpen = ref(false)

watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

function toggleChat() {
  isOpen.value = !isOpen.value
}

function clearHistory() {
  messages.value = [{
    sender: 'bot',
    text: 'Xin chào! Tôi là ChatBot chuyên gia bóng đá. Hãy hỏi tôi bất cứ điều gì! ⚽'
  }]
}

onMounted(() => {
  messages.value.push({
    sender: 'bot',
    text: 'Xin chào! Tôi là ChatBot chuyên gia bóng đá. Hãy hỏi tôi bất cứ điều gì! ⚽'
  })
})

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return

  const text = input.value.trim()
  input.value = ''

  const userMsg = {
    sender: 'user',
    text,
    timestamp: new Date()
  }

  messages.value.push(userMsg)
  isLoading.value = true

  try {
    // 🔥 Gửi câu hỏi tới Backend
    const res = await instance.post('/chatbot/send-message', {
      message: text
    })

    const botReply = res.data?.reply || 'Tôi không hiểu câu hỏi này.'

    messages.value.push({
      sender: 'bot',
      text: botReply,
      timestamp: new Date()
    })

  } catch (err) {
    messages.value.push({
      sender: 'bot',
      text: 'Lỗi khi kết nối máy chủ. Vui lòng thử lại.',
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
  }
}
</script>


<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.chat-icon {
  width: 56px;
  height: 56px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  color: white;
}

.chat-icon:hover {
  background: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

.chat-container {
  width: 380px;
  height: 550px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: #3b82f6;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-actions button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.header-actions button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8fafc;
}

.message-wrapper {
  margin-bottom: 12px;
}

.message {
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
  line-height: 1.5;
}

.user-message {
  background: #3b82f6;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.bot-message {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.loading-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 8px;
}

.input-area input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.input-area input:focus {
  border-color: #3b82f6;
}

.input-area input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.input-area button {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.input-area button:hover:not(:disabled) {
  background: #2563eb;
}

.input-area button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
