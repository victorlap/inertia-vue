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
  render(h, { props, data, children }) {
    const visit = event => {
      if (shouldIntercept(event)) {
        event.preventDefault()

        Inertia.visit(props.href, {
          method: props.method,
          preserveScroll: props.preserveScroll,
          replace: props.replace,
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
        ...(data.on || {}),
        click: visit,
      },
    }, children)
  },
}
