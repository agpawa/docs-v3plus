let tailwindcss = require("tailwindcss");

module.exports = {
  dest: "public",
  title: "v3plus.com",
  description: "General usage guide for the V3Plus admin UI.",
  head: [
    ["link", { rel: "stylesheet", href: "/css/hljs.css" }],
  ],
  themeConfig: {
    nav: [
      { text: "Admin", link: "/admin/" },
      { text: "Public API", link: "/public-api/" }
    ],
    navbar: true,
    docsRepo: "ICVDM/docs-v3plus",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "Help improve this page!",
    sidebarDepth: 2,
    lastUpdated: "Last Updated",
    sidebar: {
      "/admin/": [
        "",
        "clients/",
        "portals/",
        "events-and-content/",
        "users/",
        "registration-forms/",
        "reports/",
        "faq/",
        "tutorial-videos/"
      ],

      "/public-api/": [""],

      "/": [""]
    }
  },
  markdown: {
    toc: {
      includeLevel: [2, 3, 4]
    },
    config: md => {
      md.use(require("markdown-it-footnote"))
        .use(require("markdown-it-highlightjs"))
        .set({ html: true })
        .set({ breaks: true });
    }
  },
  postcss: {
    plugins: [tailwindcss("tailwind.js"), require("autoprefixer")]
  },
  chainWebpack: (config, isServer) => {
    if (isServer) {
      config.devServer.hot(true);
    }
  }
};
