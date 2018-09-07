const webpack = require('webpack')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'e-Presensi - Kabupaten Purbalingga',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'nuxt vuex featherjs e-akun' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'icon', type: 'image/x-icon', href: '/e_presensi.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: false,
  /*
  ** Build configuration
  */
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        '_': 'lodash',
        jQuery: 'jquery',
        $: 'jquery',
        'window.jQuery': 'jquery'
      })
    ],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: 'auth'
  },
  plugins: [
    { src: '~/plugins/vuetify', ssr: true },
    { src: '~/plugins/vue-validate', ssr: true }
  ],
  env: {
    APP_NAME: process.env.APP_NAME || 'e-Presensi',
    ID_APP: process.env.ID_APP || '5a120571cbf7231cdf7e9073',
    DOMAIN: process.env.DOMAIN || 'purbalinggakab.go.id',
    HOST_URL_SSO: process.env.HOST_URL_SSO || 'https://e-akun.purbalinggakab.go.id',
    HOST_URL_EPRESENSI: process.env.HOST_URL_EPRESENSI || 'https://e-presensi.purbalinggakab.go.id',
    HOST_URL_API_EPRESENSI: process.env.HOST_URL_API_EPRESENSI || 'https://api.e-presensi.purbalinggakab.go.id'
  }
}
