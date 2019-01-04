<template>
  <v-content>
    <v-container id="page">
      <template v-if="structure">
        <doc-heading v-if="structure.title">
          {{ structure.title }}
        </doc-heading>
        <div
          v-if="structure.titleText"
          class="mb-5"
        >
          <doc-text class="mb-4">
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
  </v-content>
</template>

<script>
  import { getComponent } from '@/util/helpers'
  import camelCase from 'lodash/camelCase'
  import upperFirst from 'lodash/upperFirst'
  // import NotFound from '@/pages/general/404'

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

    computed: {
      structure () {
        return this.$store.state.documentation.page
      },
      composite () {
        return `${this.namespace}-${this.page}`
      }
    },

    mounted () {
      // Wait for page animation
      setTimeout(this.init, 300)
    },

    methods: {
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
