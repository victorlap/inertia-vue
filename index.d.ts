import Inertia, { Page as InertiaPage } from 'inertia'
import { Component, FunctionalComponentOptions } from 'vue'

interface Page<PageProps = {}> {
  instance: Component | null
  props: PageProps | {}
}
interface AppData<PageProps = {}> {
  page: Page<PageProps>
}
interface AppProps<PageProps = {}> {
  initialPage: InertiaPage<PageProps>
  resolveComponent: (name: string) => Component
}
type App<PageProps = {}> = Component<
  AppData<PageProps>,
  never,
  never,
  AppProps<PageProps>
>

interface InertiaLinkProps {
  href: string
  method?: string
  onClick?: () => void
  preserveScroll?: boolean
  replace?: boolean
}
type InertiaLink = FunctionalComponentOptions<InertiaLinkProps>

export default App
export { Inertia, InertiaLink, Page }
