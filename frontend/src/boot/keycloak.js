// import Vue from 'vue'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
/*
function tokenInterceptor () {
  Vue.prototype.$axios.interceptors.request.use(config => {
    if (Vue.prototype.$keycloak.authenticated) {
      config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
}

const initOptions = {
  init: {
    onLoad: 'login-required', // or 'check-sso'
    flow: 'standard',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: false // otherwise it would reload the window every so seconds
  },
  config: {
    url: 'https://localhost:8100/auth',
    realm: 'micado',
    clientId: 'migrant'
  },
  onReady: (keycloak) => {
    console.log('onReady kc')
    tokenInterceptor()
  },
  onInitError: (error) => {
    console.log(error)
  }
}

Vue.use(VueKeyCloak, initOptions)
*/
export default async ({ Vue, router, store, app }) => {
  async function tokenInterceptor () {
    Vue.prototype.$axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
      return config
    }, error => {
      return Promise.reject(error)
    })
  }

  return new Promise(resolve => {
    Vue.use(VueKeyCloak, {
      init: {
        onLoad: 'check-sso', // or 'check-sso'
        flow: 'standard',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false // otherwise it would reload the window every so seconds
      },
      config: {
        url: 'http://localhost:8100/auth',
        realm: 'micado',
        clientId: 'migrant'
      },
      onReady: (keycloak) => {
        console.log('onReady passed')
        console.log(keycloak)
        tokenInterceptor()
        console.log(Vue)
        resolve()
      },
      onInitError: (error) => {
        console.log('we have an error')
        console.log(error)
      }
    })
  })
}

/*

const initOptions = {
  url: 'http://127.0.0.1:8080/', realm: 'keycloak-demo', clientId: 'app-vue', onLoad: 'login-required'
}

const keycloak = Keycloak(initOptions)

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload()
  } else {
    Vue.$log.info('Authenticated')

    new Vue({
      el: '#app',
      render: h => h(App, { props: { keycloak: keycloak } })
    })
  }

  // Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        Vue.$log.info('Token refreshed' + refreshed)
      } else {
        Vue.$log.warn('Token not refreshed, valid for ' +
            Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds')
      }
    }).catch(() => {
      Vue.$log.error('Failed to refresh token')
    })
  }, 6000)
}).catch(() => {
  Vue.$log.error('Authenticated Failed')
})
*/
