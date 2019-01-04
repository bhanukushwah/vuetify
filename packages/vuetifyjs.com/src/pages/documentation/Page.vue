<template>
  <div>
    <core-drawer />

    <core-ad />

    <router-view />

    <core-fab />

    <core-snackbar />
  </div>
</template>

<script>
  import camelCase from 'lodash/camelCase'
  import kebabCase from 'lodash/kebabCase'
  import upperFirst from 'lodash/upperFirst'

  export default {
    name: 'Documentation',

    async asyncData ({ store, route }) {
      // console.log(route.params)
      const namespace = kebabCase(route.params.namespace)
      const page = upperFirst(camelCase(route.params.page))
      let structure

      try {
        structure = (await import(
          /* webpackChunkName: "pages" */
          `@/data/pages/${namespace}/${page}.json`
        )).default
      } catch (err) {
        console.log(err)
        structure = null
      }

      store.commit('documentation/setPage', structure)
    }
  }
</script>
