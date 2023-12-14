import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Training Documentation',
  description: 'A documentation for training certification vue.js',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],

    sidebar: [
      {
        text: 'Training',
        items: [
          {
            text: 'Chapter 1 - Vue.js Essentials',
            link: '/training/chapter-1',
          },
          {
            text: 'Chapter 2 - Vue.js Components',
            link: '/training/chapter-2',
          },
          {
            text: 'Chapter 3 - Intermediate Vue.js',
            link: '/training/chapter-3',
          },
          { text: 'Chapter 4 - Vue.js Ecosystem', link: '/training/chapter-4' },
          {
            text: 'Chapter 5 - Challenge Roundup',
            link: '/training/chapter-5',
          },
          {
            text: 'Extra',
            link: '/training/extra',
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/alvinindra/training-certification-vuejs',
      },
    ],
  },
  markdown: {
    config: (md) => {
      const render = md.render
      md.render = function (src, env) {
        return `<div v-pre>${render.call(this, src, env)}</div>`
      }
    },
  },
})
