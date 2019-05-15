import Inertia, { Page as InertiaPage } from 'inertia'
import { Component, FunctionalComponentOptions } from 'vue'

interface Page<TransformedProps = {}> {
  instance: Component | null
  props: TransformedProps | {}
}
type AppData<TransformedProps = {}> = Page<TransformedProps>
interface AppProps<PageProps = {}, TransformedProps = PageProps> {
  initialPage: InertiaPage<PageProps>
  resolveComponent: (name: string) => Component
  transformProps?: (props: PageProps) => TransformedProps
}
type App<PageProps = {}, TransformedProps = PageProps> = Component<
  AppData<TransformedProps>,
  never,
  never,
  AppProps<PageProps, TransformedProps>
>

interface InertiaLinkProps {
  href: string
  method?: string
  onClick?: (event: HTMLInputElement | KeyboardEvent) => void
  preserveScroll?: boolean
  replace?: boolean
}
type InertiaLink = FunctionalComponentOptions<InertiaLinkProps>

export default App
export { Inertia, InertiaLink, Page }
