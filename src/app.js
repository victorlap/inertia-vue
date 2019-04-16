import Inertia from 'inertia'
import Vue from 'vue'

export default {
  name: 'Inertia',
  props: {
    component: String,
    props: Object,
    resolveComponent: Function,
  },
  data() {
    return {
      page: {
        instance: null,
        props: null,
      }
    }
  },
  created() {
    Inertia.init(this.component, this.props, (component, props) => {
      return Promise.resolve(this.resolveComponent(component)).then(instance => {
        Vue.prototype.$page = props
        this.page = { instance, props }
      })
    })
  },
  render(h) {
    if (this.page.instance) {
      return h(this.page.instance, {
        key: window.location.pathname,
        props: this.page.props
      })
    }
  }
}
