<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <q-btn @click="login">login</q-btn>
    <q-btn @click="logout">logout</q-btn>
    <q-btn @click="call">call</q-btn>
    <h1>{{this.realm}}</h1>
  </q-page>
</template>

<script>
import keycloak from 'src/boot/keycloak'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import Vue from 'vue'
async function tokenInterceptor () {
  Vue.prototype.$axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
    return config
  }, error => {
    return Promise.reject(error)
  })
}
export default {
  name: 'PageIndex',
  computed: {
    realm () {
      console.log(this.$keycloak)
      return this.$store.getters['example/getRealm']
    }
  },
  methods: {
    logout () {
      this.$keycloak.logoutFn()
    },
    login () {
      const realm = prompt('Your realm')
      console.log(realm)
      console.log(this)
      /* this.$root.constructor.use({
        install(Vue, options) {
          console.log('plugin was installed');
          Vue.prototype.$test = () => console.log('plugin was called');
        },
      }); */
      // this.$keycloak.config = { url: 'http://keycloak.micado.csi.it:8100/auth', realm: realm, clientId: 'migrant' }
      console.log(keycloak)
      this.$root.constructor.use(VueKeyCloak.install(Vue, {
        init: {
          onLoad: 'check-sso', // or 'check-sso'
          flow: 'standard',
          pkceMethod: 'S256',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false // otherwise it would reload the window every so seconds
        },
        config: {
          url: 'http://keycloak.micado.csi.it:8100/auth',
          realm: realm,
          clientId: 'migrant'
        },
        onReady: (keycloak) => {
          console.log('onReady passed')
          console.log(keycloak)
          // console.log(store)
          this.$store.commit('example/setRealm', keycloak.realm)
          tokenInterceptor()
          console.log(Vue)
          // resolve()
        },
        onInitError: (error) => {
          console.log('we have an error')
          console.log(error)
        }
      })
      )
      /* .then(() => {
        console.log('finito inizializzaione keycloak')
        console.log(this)
        // this.$keycloak.login()
      }) */
      console.log(this.$keycloak)
      console.log(this)
      // alert('logging in')
    },
    call () {
      console.log('call')
      this.$axios.get('http://localhost:3000/processes')
    }
  }
}
</script>
