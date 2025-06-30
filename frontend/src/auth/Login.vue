<template>
  <div class="p-6 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" class="block w-full mb-2 p-2 border" />
      <input v-model="password" type="password" placeholder="Password" class="block w-full mb-4 p-2 border" />
      <button class="bg-blue-500 text-white px-4 py-2">Login</button>
    </form>

    <div class="mt-4">
      <div id="g_id_onload"
           :data-client_id="googleClientId"
           data-callback="handleCredentialResponse">
      </div>
      <div class="g_id_signin" data-type="standard"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      googleClientId: '', // Store the client ID here
    };
  },
  async mounted() {
    // Fetch Google Client ID from backend
    try {
      const res = await fetch('http://localhost:3000/api/config');
      const data = await res.json();
      this.googleClientId = data.googleClientId;
    } catch (error) {
      console.error('Error fetching Google Client ID:', error);
    }

    // Dynamically load Google script
    const gscript = document.createElement('script');
    gscript.src = 'https://accounts.google.com/gsi/client';
    gscript.async = true;
    gscript.defer = true;
    document.head.appendChild(gscript);

    window.handleCredentialResponse = async (response) => {
      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
      this.$router.push('/chat');
    };
  },
  methods: {
    async login() {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        this.$router.push('/chat');
      } else {
        alert(data.message || 'Login failed');
      }
    },
  },
};
</script>