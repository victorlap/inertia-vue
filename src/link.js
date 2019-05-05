import Inertia, { shouldIntercept } from 'inertia'

export default {
  functional: true,
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
  render: function(h, { props, data, children }) {
    const visit = function (event) {
      if (shouldIntercept(event)) {
        event.preventDefault()
        Inertia.visit(props.href, {
          method: props.method,
          replace: props.replace,
          preserveScroll: props.preserveScroll,
        })
      }
    }
    return h('a', {
      ...data,
      attrs: {
        ...data.attrs,
        href: props.href,
      },
      on: {
        ...data.on || {},
        click: event => {
          if (data.on && data.on.click) {
            data.on.click(event)
          }
          visit(event)
        },
      },
    }, children)
  },
}
