import Inertia, { shouldIntercept } from 'inertia'

export default {
  props: {
    href: String,
    method: {
      type: String,
      default: 'get',
    },
    replace: {
      type: Boolean,
      default: false,
    },
    preserveScroll: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    visit(event) {
      if (shouldIntercept(event)) {
        event.preventDefault()
        Inertia.visit(this.href, {
          method: this.method,
          replace: this.replace,
          preserveScroll: this.preserveScroll,
        })
      }
    },
  },
  render: function(h) {
    return h('a', {
      attrs: {
        href: this.href,
      },
      on: {
        click: this.visit,
      },
    }, this.$slots.default)
  },
}
