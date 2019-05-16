import Inertia from 'inertia'
import Link from './link'
import Remember from './remember'

let app = {}

export default {
  name: 'Inertia',
  props: {
    initialPage: {
      type: Object,
      required: true,
    },
    resolveComponent: {
      type: Function,
      required: true,
    },
    transformProps: {
      type: Function,
      default: props => props,
    },
  },
  data() {
    return {
      component: null,
      props: {},
    }
  },
  created() {
    app = this
    Inertia.init({
      initialPage: this.initialPage,
      resolveComponent: this.resolveComponent,
      updatePage: (component, props) => {
        this.component = component
        this.props = this.transformProps(props)
      }
    })
  },
  render(h) {
    if (this.component) {
      return h(this.component, {
        key: window.location.pathname,
        props: this.props,
      })
    }
  },
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$inertia', { get: () => Inertia })
    Object.defineProperty(Vue.prototype, '$page', { get: () => app.props })
    Vue.mixin(Remember)
    Vue.component('InertiaLink', Link)
  },
}
