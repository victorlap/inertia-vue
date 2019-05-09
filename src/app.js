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
      default: (props) => props,
    },
  },
  data() {
    return {
      instance: null,
      props: {},
    }
  },
  created() {
    app = this
    Inertia.init(this.initialPage, page =>
      Promise.resolve(this.resolveComponent(page.component)).then(instance => {
        this.instance = instance
        this.props = this.transformProps(page.props)
      })
    )
  },
  render(h) {
    if (this.instance) {
      return h(this.instance, {
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
