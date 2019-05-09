import Inertia from 'inertia'
import Vue from 'vue'

type AppData = {
  page: object,
}
type AppProps = {
  initialPage: object,
  resolveComponent: (name: string) => Vue.Component,
}
declare const App: Vue.Component<AppData, never, never, AppProps>

type InertiaLinkProps = {
  href: string,
  method?: string,
  preserveScroll?: boolean,
  replace?: boolean,
}
declare const InertiaLink: Vue.FunctionalComponentOptions<InertiaLinkProps>

export default App
export { Inertia, InertiaLink }
