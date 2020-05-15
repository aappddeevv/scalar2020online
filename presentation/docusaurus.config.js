module.exports = {
  title: 'scalar2020online: full-stack',
  tagline: 'scalar2020online presentation',
  url: 'https://aappddeevv.github.io/scalar2020online',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'aappddeevv', // Usually your GitHub org/user name.
  projectName: 'scalar2020online', // Usually your repo name.

  // mentioned: in https://v2.docusaurus.io/docs/deployment
  // baseUrl: '/',
  // projectName: 'endiliey.github.io',
  // organizationName: 'endiliey',

  themeConfig: {
    prism: {
      additionalLanguages: ["typescript", "java", "scala"],
    },
    navbar: {
      title: 'aappddeevv scalar2020online',
      logo: {
        alt: 'scalar2020online',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/introduction/introduction',
          activeBasePath: 'docs',
          label: 'Presentation',
          position: 'left',
        },
        //{to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/aappddeevv/scalar2020online',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     {
        //       label: 'Style Guide',
        //       to: 'docs/doc1',
        //     },
        //     {
        //       label: 'Second Doc',
        //       to: 'docs/doc2',
        //     },
        //   ],
        // },
        {
          title: 'Community',
          items: [
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            // },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            {
              label: 'Twitter',
              href: 'https://twitter.com/dmillercorp',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/aappddeevv/scalar2020online',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} aappddeevv. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/aappddeevv/scalar2020online/edit/master/presentation/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/aappddeevv/scalar2020online/edit/master/presentation/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
