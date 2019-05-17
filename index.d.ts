import Inertia, {
  Page as InertiaPage,
  PageProps as InertiaPageProps,
} from 'inertia'
import { Component, FunctionalComponentOptions } from 'vue'

interface Page<TransformedProps = {}> {
  component: Component | null
  props: TransformedProps | {}
}
type AppData<TransformedProps = {}> = Page<TransformedProps>
interface AppProps<
  PageProps extends InertiaPageProps = {},
  TransformedProps = PageProps
> {
  initialPage: InertiaPage<PageProps>
  resolveComponent: (name: string) => Promise<Component>
  transformProps?: (props: PageProps) => TransformedProps
}
type App<
  PageProps extends InertiaPageProps = {},
  TransformedProps = PageProps
> = Component<
  AppData<TransformedProps>,
  never,
  never,
  AppProps<PageProps, TransformedProps>
>

interface InertiaLinkProps {
  data?: object
  href: string
  method?: string
  onClick?: (event: MouseEvent | KeyboardEvent) => void
  preserveScroll?: boolean
  replace?: boolean
}
type InertiaLink = FunctionalComponentOptions<InertiaLinkProps>

export default App
export { Inertia, InertiaLink, Page }
