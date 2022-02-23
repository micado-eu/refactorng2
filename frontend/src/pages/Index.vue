<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <q-btn @click="login">login</q-btn>
    <q-btn @click="call">call</q-btn>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  methods: {
    login () {
      console.log(this)
      this.$keycloak.login()
    },
    call () {
      console.log('call')
      this.$axios.get('http://localhost:3000/processes')
    }
  }
}
</script>
