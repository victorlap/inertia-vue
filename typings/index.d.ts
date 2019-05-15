import Inertia from 'inertia'
import Vue from 'vue'

interface PageProps {}

interface AppData {
  page: object,
}
interface AppProps {
  initialPage: PageProps,
  resolveComponent: (name: string) => Vue.Component,
}
declare const App: Vue.Component<AppData, never, never, AppProps>

interface InertiaLinkProps {
  href: string,
  method?: string,
  preserveScroll?: boolean,
  replace?: boolean,
}
declare const InertiaLink: Vue.FunctionalComponentOptions<InertiaLinkProps>

export default App
export { Inertia, InertiaLink }
