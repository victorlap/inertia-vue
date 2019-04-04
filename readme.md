# Inertia.js Vue Adapter

> **Note:** This project is in the very early stages of development and IS NOT yet intended for public consumption. If you submit an issue, I do not guarantee a response. Please do not submit pull requests without first consulting me on Twitter ([@reinink](https://twitter.com/reinink)).

## Installation

Install using NPM:

~~~sh
npm install inertiajs/inertia-vue --save
~~~

## Create root template

The first step to using Inertia.js is creating a root template. This template should include your assets, as well as a single `div` with two data attributes: `component` and `props`. This `div` is the root element that we'll use to boot Vue.js in. Here's an example:

~~~php
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link href="{{ mix('/css/app.css') }}" rel="stylesheet">
    <script src="{{ mix('/js/app.js') }}" defer></script>
</head>
<body>

<div id="app" data-component="{{ $component }}" data-props="{{ json_encode($props, JSON_FORCE_OBJECT) }}"></div>

</body>
</html>
~~~

## Setting up Webpack

Here is an example Webpack configuration that uses Laravel Mix. Note the `@` alias to the `/resources/js` directory.

~~~js
const mix = require('laravel-mix')
const path = require('path')

mix.js('resources/js/app.js', 'public/js').webpackConfig({
  output: { chunkFilename: 'js/[name].[contenthash].js' },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.js',
      '@': path.resolve('resources/js'),
    },
  },
})
~~~

## Setup dynamic imports

We recommend using code splitting with Inertia.js. To do this we need to enable [dynamic imports](https://github.com/tc39/proposal-dynamic-import). We'll use a Babel plugin to do this. First, install the plugin:

~~~sh
npm install @babel/plugin-syntax-dynamic-import --save
~~~

Next, create a `.babelrc` file in your project with the following:

~~~js
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
~~~

## Initializing Vue

Next, update your main JavaScript file with the following. All we're doing here is initializing Vue with the base Inertia component.

~~~js
import Inertia from 'inertia-vue'
import Vue from 'vue'

let app = document.getElementById('app')

new Vue({
  render: h => h(Inertia, {
    props: {
      component: app.dataset.component,
      props: JSON.parse(app.dataset.props),
      resolveComponent: (component) => {
        return import(`@/Pages/${component}`).then(module => module.default)
      },
    },
  }),
}).$mount(app)
~~~

The base Inertia component has three props:

- `component`: The name of the default (current) page component.
- `props`: The props (data) for the default (current) page component.
- `resolveComponent`: A callback that tells Inertia how to load a page component. This callback must return a promise with a page instance.

## Creating a base layout

While not required, for most projects it makes sense to create a default site layout that your specific pages can extend. Save this to `/Shared/Layout.vue`.

~~~html
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

<script>
import { InertiaLink } from 'inertia-vue'

export default {
  components: {
    InertiaLink,
  },
}
</script>
~~~

## Creating page components

With Inertia.js, each page in your application is a JavaScript component. Here's an example of a page component. Save this to `/Pages/Welcome.vue`. Note how it extends the `Layout.vue` component we created above.

~~~html
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

To create an Inertia link, use the `<inertia-link>` component:

~~~html
<template>
  <inertia-link href="/">Home</inertia-link>
</template>

<script>
import { InertiaLink } from 'inertia-vue'
export default {
  components: { InertiaLink }
}
</script>
~~~

You can specify the browser history and scroll behaviour. By default all link clicks "push" a new history state, and reset the scroll position back to the top of the page. However, you can override these defaults using the `replace` and `preserve-scroll` attributes:

~~~html
<inertia-link replace preserve-scroll href="/">Home</inertia-link>
~~~

## Manually making Inertia visits

In addition to clicking links, it's also very common to manually make Inertia visits. For example, after a successful login form submission, you may want to "redirect" to a different page. This is also easily done using the `Inertia.visit()` helper:

~~~js
import { Inertia } from 'inertia-vue'

submit() {
  axios.post('/login', this.form).then(response => {
      Inertia.visit(response.data.intendedUrl)
  })
}
~~~

And just like with an `<inertia-link>`, you can also set the browser history and scroll behaviour:

~~~js
import { Inertia } from 'inertia-vue'

Inertia.visit(url, {
  replace: true,
  preserveScroll: true,
})
~~~

In fact, since "replace" is a more common action, you can even do this:

~~~js
import { Inertia } from 'inertia-vue'

Inertia.replace(url, { preserveScroll: true })
~~~
