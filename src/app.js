import Inertia from 'inertia'
import Link from './link'
import Remember from './remember'

export default {
  name: 'Inertia',
  props: {
    initialPage: Object,
    resolveComponent: Function,
  },
  provide() {
    return {
      page: this.page,
    }
  },
  data() {
    return {
      page: {
        instance: null,
        props: {},
      },
    }
  },
  created() {
    Inertia.init(this.initialPage, page =>
      Promise.resolve(this.resolveComponent(page.component)).then(instance => {
        this.page.instance = instance
        this.page.props = page.props
      })
    )
  },
  render(h) {
    if (this.page.instance) {
      return h(this.page.instance, {
        key: window.location.pathname,
        props: this.page.props,
      })
    }
  },
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$inertia', { get: () => Inertia })
    Vue.mixin(Remember)
    Vue.component('InertiaLink', Link)
  },
}
