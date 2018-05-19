let tailwindcss = require('tailwindcss');
//let sidebar = require('./sidebar').sidebar;


module.exports = {
    title: 'v3plus.com',
    description: 'General usage guide for the V3Plus admin UI.',
    head: [],
    themeConfig: {
        lastUpdated: "Last Updated",
        repo: 'ICVDM/docs-v3plus',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: 'Help improve this page!',
        sidebarDepth: 2,
        navbar: false,
        sidebar: [
            '/',
            '/clients/',
            '/portals/',
            '/events-and-content/',
            '/users/',
            '/registration-forms/',
            '/reports/',
            '/faq/',
            '/tutorial-videos/',
        ]
    },
    markdown: {
        breaks: true,
        config: md => {
            md.use(require('markdown-it-footnote'))
        }
    },
    postcss: {
        plugins: [
            tailwindcss('tailwind.js'),
            require('autoprefixer'),
        ]
    },
    chainWebpack: (config, isServer) => {
        if(isServer) {
            config
                .devServer
                .hot(true);
        }

    },
}