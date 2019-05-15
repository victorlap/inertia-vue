import Inertia, { Page as InertiaPage } from 'inertia'
import { Component, FunctionalComponentOptions } from 'vue'

interface Page<PageProps = {}> {
  instance: Component | null,
  props: PageProps | {},
}
interface AppData<PageProps = {}> {
  page: Page<PageProps>,
}
interface AppProps {
  initialPage: InertiaPage,
  resolveComponent: (name: string) => Component,
}
type App<PageProps = {}> = Component<AppData<PageProps>, never, never, AppProps>

interface InertiaLinkProps {
  href: string,
  method?: string,
  onClick?: () => void,
  preserveScroll?: boolean,
  replace?: boolean,
}
declare const InertiaLink: FunctionalComponentOptions<InertiaLinkProps>

export default App
export { Inertia, InertiaLink, Page }
