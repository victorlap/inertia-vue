# Inertia.js Vue Adapter

> **Note:** This project is in the very early stages of development and IS NOT yet intended for public consumption. If you submit an issue, I do not guarantee a response. Please do not submit pull requests without first consulting me on Twitter ([@reinink](https://twitter.com/reinink)).

## Installation

Install using NPM:

~~~sh
npm install inertiajs/inertia-vue --save
~~~

## Configure server-side framework

The first step when using Inertia.js is to configure your server-side framework. This primarily includes setting up a root template and updating your endpoints to return a proper Inertia response. For an example of this, see our [Laravel adapter](https://github.com/inertiajs/inertia-laravel).

## Setting up Webpack

Here is an example Webpack configuration that uses [Laravel Mix](https://github.com/JeffreyWay/laravel-mix). Note the `@` alias to the `/resources/js` directory.

~~~js
const mix = require('laravel-mix')
const path = require('path')

mix
  .js('resources/js/app.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .webpackConfig({
    output: { chunkFilename: 'js/[name].js?id=[chunkhash]' },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.runtime.esm.js',
        '@': path.resolve('resources/js'),
      },
    },
  })
~~~

## Setup dynamic imports

By default, Inertia.js uses code splitting. To do this we need to enable [dynamic imports](https://github.com/tc39/proposal-dynamic-import). We'll use a Babel plugin to make this work. First, install the plugin:

~~~sh
npm install @babel/plugin-syntax-dynamic-import --save
~~~

Next, create a `.babelrc` file in your project with the following:

~~~json
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
~~~

Alternatively, if you're using Laravel Mix, you can put this in your `webpack.mix.js` file:

~~~js
mix.babelConfig({
  plugins: ['@babel/plugin-syntax-dynamic-import'],
})
~~~

## Initializing Vue

Next, update your main JavaScript file to boot your Inertia app. All we're doing here is initializing Vue with the base Inertia page component.

~~~js
import Inertia from 'inertia-vue'
import Vue from 'vue'

Vue.use(Inertia)

const app = document.getElementById('app')

new Vue({
  render: h => h(Inertia, {
    props: {
      initialPage: JSON.parse(app.dataset.page),
      resolveComponent: name => import(`@/Pages/${name}`).then(module => module.default),
    },
  }),
}).$mount(app)
~~~

The `resolveComponent` is a callback that tells Inertia how to load a page component. It receives a page name (string), and must return a component instance.

## Using Inertia without code splitting

It's possible to also use Inertia without code splitting. This will generate one larger JavaScript bundle, instead of many smaller ones. With this approach, the dynamic imports Babel plugin is not required.

One way to do this is manually loading all your page components:

~~~js
import Inertia from 'inertia-vue'
import Vue from 'vue'

Vue.use(Inertia)

const app = document.getElementById('app')

const pages = {
  'Dashboard/Index': require('./Pages/Dashboard/Index').default,
  'Users/Index': require('./Pages/Users/Index').default,
  'Users/Create': require('./Pages/Users/Create').default,
  // etc...
}

new Vue({
  render: h => h(Inertia, {
    props: {
      initialPage: JSON.parse(app.dataset.page),
      resolveComponent: name => pages[name],
    },
  }),
}).$mount(app)
~~~

Another option is to use `required.context` to automatically register all your page components.

~~~js
import Inertia from 'inertia-vue'
import Vue from 'vue'

Vue.use(Inertia)

const app = document.getElementById('app')

const files = require.context('./', true, /\.vue$/i)

new Vue({
  render: h => h(Inertia, {
    props: {
      initialPage: JSON.parse(app.dataset.page),
      resolveComponent: page => files(`./Pages/${page}.vue`).default,
    },
  }),
}).$mount(app)
~~~

## Creating a base layout

While not required, for most projects it makes sense to create a default site layout that your specific pages can extend. Save this to `/Shared/Layout.vue`.

~~~vue
<template>
  <main>
    <header>
      <inertia-link href="/">Home</inertia-link>
      <inertia-link href="/about">About</inertia-link>
      <inertia-link href="/contact">Contact</inertia-link>
    </header>

    <article>
      <slot />
    </article>
  </main>
</template>
~~~

## Creating page components

With Inertia.js, each page in your application is a JavaScript component. Here's an example of a page component. Save this to `/Pages/Welcome.vue`. Note how it extends the `Layout.vue` component we created above.

~~~vue
<template>
  <layout>
    <h1>Welcome</h1>
    <p>Welcome to my first Inertia.js app!</p>
  </layout>
</template>

<script>
import Layout from '@/Shared/Layout'

export default {
  components: {
    Layout,
  },
}
</script>
~~~

## Creating links

To create an Inertia link, use the `<inertia-link>` component.

~~~vue
<template>
  <inertia-link href="/">Home</inertia-link>
</template>
~~~

You can also specify the browser history and scroll behaviour. By default all link clicks "push" a new history state, and reset the scroll position back to the top of the page. However, you can override these defaults using the `replace` and `preserve-scroll` attributes.

~~~vue
<inertia-link href="/" replace preserve-scroll>Home</inertia-link>
~~~

You can also specify the method for the request. The default is `GET`, but you can also use `POST`, `PUT`, `PATCH`, and `DELETE`.

~~~vue
<inertia-link href="/logout" method="post">Logout</inertia-link>
~~~

You can add data using the `data` attribute:

~~~vue
<inertia-link href="/endpoint" method="post" :data="{ foo: bar }">Save</inertia-link>
~~~

You can also preserve a page component's local state using the `preserve-state` attribute. This will prevent a page component from fully re-rendering. This is especially helpful with forms, since you can avoid manually repopulating input fields, and can also maintain a focused input.

~~~vue
<input v-model="query" type="text" />
<inertia-link href="/search" :data="{ query }" preserve-state>Search</inertia-link>
~~~

## Manually making visits

In addition to clicking links, it's also very common to manually make Inertia visits. The following methods are available. Take note of the defaults.

~~~js
$inertia.visit(url, { method: 'get', data: {}, replace: false, preserveScroll: false, preserveState: false })
$inertia.replace(url, { method: 'get', data: {}, preserveScroll: false, preserveState: true })
$inertia.reload({ method: 'get', data: {}, preserveScroll: false, preserveState: false })
$inertia.post(url, data, { replace: false, preserveScroll: false, preserveState: true })
$inertia.put(url, data, { replace: false, preserveScroll: false, preserveState: true })
$inertia.patch(url, data, { replace: false, preserveScroll: false, preserveState: true })
$inertia.delete(url, { replace: false, preserveScroll: false, preserveState: false })
~~~

Just like with an `<inertia-link>`, you can control the history state behaviour using `replace`, scroll behaviour using `preserveScroll`, and local component state behaviour using `preserveState`.

## Accessing page data in other components

Sometimes it's necessary to access the page data (props) from a non-page component. One really common use-case for this is the site layout. For example, you may want to show the currently authenticated user in the site header. This can be done using the `$page` property. Here's a simple example:

~~~vue
<template>
  <main>
    <header>
      You are logged in as: {{ $page.auth.user.name }}

      <nav>
        <inertia-link href="/">Home</inertia-link>
        <inertia-link href="/about">About</inertia-link>
        <inertia-link href="/contact">Contact</inertia-link>
      </nav>
    </header>

    <article>
      <slot />
    </article>
  </main>
</template>
~~~

This can also be useful for other common "global" data, such as errors and flash messages.

## Remembering local component state

When navigating browser history, Inertia reloads pages using prop data cached in history state. Inertia does not, however, cache local component state, since this is beyond its reach. This can lead to outdated pages in your browser history. For example, if a user partially completes a form, then navigates away, and then returns back, the form will be reset and their work will have been lost.

To mitigate this issue, you can use the `remember` property to tell Inertia.js which local component state to cache. To do this, provide an array of keys that correspond to your component's data.

~~~js
{
  remember: {
    data: ['form'],
  },
  data() {
    return {
      form: {
        first_name: null,
        last_name: null,
        // ...
      },
    }
  },
}
~~~

If your page contains multiple components using the remember functionality, you'll need to provide a unique key for each component. For example, `Users/Create`. If you have multiple instances of the same component on the page, be sure to include a unique identifier for each of those instances. For example, `Users/Edit:{id}`.

~~~js
{
  remember: {
    data: ['form'],
    key: () => `Users/Edit:${this.user.id}`,
  },
  data() {
    return {
      form: {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        // ...
      },
    }
  },
}
~~~

You can also shortform the remember values:

~~~js
{
  // array of data keys
  remember: ['form'],

  // single data key
  remember: 'form',
}
~~~
