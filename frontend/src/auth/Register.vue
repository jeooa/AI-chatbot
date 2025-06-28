<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-100 px-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-600">
        Register
      </h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your name"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
          />
        </div>
        <div class="mb-6">
          <label class="block mb-1 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>

      <p class="mt-4 text-sm text-center">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert('Registered successfully!');
          this.$router.push('/login');
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (err) {
        alert('Error connecting to server.');
      }
    },
  },
};
</script>
