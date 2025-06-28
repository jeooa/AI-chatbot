<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6 flex justify-center items-center">
    <div class="w-full max-w-xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
      <div class="bg-blue-500 text-white text-lg font-semibold px-6 py-4">
        Gemini AI Chatbot
      </div>

      <div
        class="h-[400px] overflow-y-auto px-6 py-4 space-y-4 bg-gray-50"
        ref="chatArea"
      >
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="[
            'flex',
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'px-4 py-2 rounded-lg max-w-xs',
              msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-900 rounded-bl-none'
            ]"
          >
            {{ msg.text }}
          </div>
        </div>

        <div v-if="isTyping" class="flex justify-start">
          <div class="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg max-w-xs italic animate-pulse">
            Gemini is thinking...
          </div>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="flex border-t border-gray-200">
        <input
          v-model="input"
          type="text"
          class="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-medium transition"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      input: '',
      messages: [],
      isTyping: false,
    };
  },
  methods: {
    async sendMessage() {
      const message = this.input.trim();
      if (!message) return;

      this.messages.push({ sender: 'user', text: message });
      this.input = '';
      this.isTyping = true;

      const context = this.messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      try {
        const res = await axios.post('http://localhost:3000/api/chat', {
          contents: context,
        });

        this.messages.push({ sender: 'bot', text: res.data.reply });
      } catch (error) {
        this.messages.push({
          sender: 'bot',
          text: 'Error fetching response.',
        });
      } finally {
        this.isTyping = false;

        this.$nextTick(() => {
          this.$refs.chatArea.scrollTop = this.$refs.chatArea.scrollHeight;
        });
      }
    },
  },
};
</script>