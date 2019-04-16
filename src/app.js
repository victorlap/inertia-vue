import Inertia from 'inertia'

export default {
  name: 'Inertia',
  props: {
    component: String,
    props: Object,
    resolveComponent: Function,
  },
  provide() {
    return {
      page: this.page
    }
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
        this.page.instance = instance
        this.page.props = props
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
