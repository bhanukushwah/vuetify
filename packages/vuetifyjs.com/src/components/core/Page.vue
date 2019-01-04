<template>
  <v-container id="page">
    <template v-if="structure">
      <doc-heading v-if="structure.title">
        {{ structure.title }}
      </doc-heading>
      <div
        v-if="structure.titleText"
        class="mb-5"
      >
        <doc-text
          v-if="structure.titleText"
          class="mb-4"
        >
          {{ structure.titleText }}
        </doc-text>
      </div>

      <component
        v-for="(child, i) in structure.children"
        :key="`${composite}-${i}`"
        :is="getComponent(child.type)"
        :value="child"
      />

      <doc-contribution />
    </template>
  </v-container>
</template>

<script>
  // Utilities
  import {
    mapMutations
  } from 'vuex'
  import { getComponent } from '@/util/helpers'
  import kebabCase from 'lodash/kebabCase'
  import camelCase from 'lodash/camelCase'
  import upperFirst from 'lodash/upperFirst'
  import NotFound from '@/pages/general/404'

  export default {
    provide () {
      return {
        namespace: upperFirst(camelCase(this.namespace)),
        lang: this.lang,
        page: upperFirst(camelCase(this.page))
      }
    },

    props: {
      // Provided by router
      namespace: {
        type: String,
        default: undefined
      },
      page: {
        type: String,
        default: undefined
      },
      lang: {
        type: String,
        default: undefined
      }
    },

    // this only works in routes
    async asyncData ({ store, route }) {
      console.log('async')
      const namespace = kebabCase(route.params.namespace)
      const page = upperFirst(camelCase(route.params.page))

      try {
        console.log('here', route.params)
        store.commit('documentation/setPage', (await import(
          /* webpackChunkName: "pages" */
          `@/data/pages/${namespace}/${page}.json`
        )).default)
      } catch (err) {
        store.commit('documentation/setPage', null)
      }
    },

    // data: () => ({
    //   structure: undefined
    // }),

    computed: {
      structure () {
        return this.$store.state.documentation.page
      },
      composite () {
        return `${this.namespace}-${this.page}`
      }
    },

    created () {
      // const namespace = kebabCase(this.namespace)
      // const page = upperFirst(camelCase(this.page))

      // this.setIsLoading(true)

      // this.structure = () => ({
      //   component: import(
      //     /* webpackChunkName: "pages" */
      //     `@/data/pages/${namespace}/${page}.json`
      //   ),
      //   error: NotFound
      // })

      // try {
      //   // created doesn't block rendering
      //   // this needs to be
      //   this.structure = (await import(
      //     /* webpackChunkName: "pages" */
      //     `@/data/pages/${namespace}/${page}.json`
      //   )).default
      // } catch (err) {
      //   this.structure = false
      // }

      // this.setIsLoading(false)
    },

    mounted () {
      // Wait for page animation
      setTimeout(this.init, 300)
    },

    methods: {
      ...mapMutations('app', ['setIsLoading']),
      getComponent,
      init () {
        const sameInternal = this.$el.querySelectorAll('a.markdown--same-internal')

        Array.prototype.forEach.call(sameInternal, el => {
          el.addEventListener('click', this.onSameInternalClick)
        })

        const internal = this.$el.querySelectorAll('a.markdown--internal')

        Array.prototype.forEach.call(internal, el => {
          el.addEventListener('click', this.onInternalClick)
        })
      },
      onSameInternalClick (e) {
        e.preventDefault()

        this.$router.push(e.target)
      },
      onInternalClick (e) {
        e.preventDefault()

        this.$router.push(`/${this.lang}${e.target.getAttribute('href')}`)
      }
    }
  }
</script>

<style>
#page {
  max-width: 1185px;
}
</style>
