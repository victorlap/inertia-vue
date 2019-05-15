import Inertia from 'inertia'
import { Component, FunctionalComponentOptions } from 'vue'

interface PageProps {}

interface AppData {
  page: object,
}
interface AppProps {
  initialPage: PageProps,
  resolveComponent: (name: string) => Component,
}
declare const App: Component<AppData, never, never, AppProps>

interface InertiaLinkProps {
  href: string,
  method?: string,
  preserveScroll?: boolean,
  replace?: boolean,
}
declare const InertiaLink: FunctionalComponentOptions<InertiaLinkProps>

export default App
export { Inertia, InertiaLink }
