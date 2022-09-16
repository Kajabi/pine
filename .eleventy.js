const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTOC = require('eleventy-plugin-toc');

const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItReplaceLink = require('markdown-it-replace-link');

module.exports = function(eleventyConfig) {
  // Navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Table of Contents
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapperClass: 'div',
  })

  // Syntax Highlighting
  eleventyConfig.addPlugin(syntaxHighlight);


  // Markdown Anchor
  const markdownItOptions = {
    html: true,
    linkify: true,
    replaceLink: (link, env) => {
      const base = process.env.MODE === 'gh_pages' ? '/sage' : '';
      if (link.startsWith('./')) {
        const splitUrl = env.page.url.split('/');
        splitUrl.splice(splitUrl.length - 1, 0, link.substr(2));
        return base + splitUrl.join('/').replace(/\/$/, '');
      }

      if (link.startsWith('../')) {
        const splitUrl = env.page.url.split('/');
        splitUrl.splice(splitUrl.length - 2, 1, link.substr(3))
        return base + splitUrl.join('/').replace(/\/$/, '')

      }

      return link;
    },
  }

  const position = { false: 'push', true: 'unshift' }
  const renderPermalink = (slug, opts, state, idx) => {
    const space = () =>
      Object.assign(new state.Token('text', '', 0), {
        content: ' ',
      });

    const linkTokens = [
      Object.assign(new state.Token('link_open', 'a', 1), {
        attrs: [
          ['class', opts.permalinkClass],
          ['href', state.env.permalink + opts.permalinkHref(slug, state)],
        ],
      }),
      Object.assign(new state.Token('html_block', '', 0), {
        content: '<span aria-label="" class="header-anchor__symbol">#</span>',
      }),
      new state.Token('link_close', 'a', -1),
    ]

    if (opts.permalinkSpace) {
      linkTokens[position[!opts.permalinkBefore]](space())
    }

    state.tokens[idx + 1].children[position[opts.permalinkBefore]](
      ...linkTokens
    )
  };

  eleventyConfig.setLibrary(
    'md',
    markdownIt(markdownItOptions).use(markdownItAnchor, {
      permalink: renderPermalink,
    })
      .use(markdownItReplaceLink)
  );

  // Code example short codes
  eleventyConfig.addPairedShortcode('example', function(code, config) {
    const defaultConfig = {
      background: undefined,
      centered: false,
      hasBorder: true,
      hasPadding: true,
      highlight: undefined,
      highlightCssComponent: undefined,
      lang: 'html',
      opened: false,
      stacked: false,
      themable: true,
    }
    const finalConfig = Object.assign(defaultConfig, JSON.parse(config || '{}'))
    const base = process.env.MODE === 'gh_pages' ? '/liquid' : ''
    const [codeWebComponent, codeCssComponent] = code
      .replaceAll(
        /url\('\/dist\/build\/assets\//g,
        `url('${base}/dist/build/assets/`
      )
      .split('<!-- CSS component -->')
      .map((c) => c.trim())
    let output = '<docs-example '
    output += `code="${encodeURIComponent(codeWebComponent)}" `

    if (codeCssComponent) {
      output += `code-css-component="${encodeURIComponent(codeCssComponent)}" `
    }

    output += `${finalConfig.centered ? ' centered' : ''}`
    output += `${finalConfig.stacked ? ' stacked' : ''}`
    output += `${finalConfig.opened ? ' opened' : ''}`
    if (finalConfig.background) {
      output += ` background="${finalConfig.background}"`
    }
    output += `${finalConfig.themable ? ' themable' : ''}`
    output += `${finalConfig.hasBorder ? ' has-border' : ''}`
    output += `${finalConfig.hasPadding ? ' has-padding' : ''}`
    if (finalConfig.styles) {
      output += ` styles='${JSON.stringify(finalConfig.styles)}'`
    }
    output += '>\n'
    output += `<div slot="code">\n\n`
    output += `\`\`\`${finalConfig.lang}${finalConfig.highlight ? '/' + finalConfig.highlight : ''
      } \n${codeWebComponent}\n\`\`\``
    output += '\n</div>'

    if (codeCssComponent) {
      output += `<div slot="codeCssComponent">\n\n`
      output += `\`\`\`${finalConfig.lang}${finalConfig.highlightCssComponent
        ? '/' + finalConfig.highlightCssComponent
        : ''
        } \n${codeCssComponent.trim()}\n\`\`\``
      output += '\n</div>'
    }

    output += `<div slot="show"${finalConfig.gap ? ` style="gap: ${finalConfig.gap}"` : ''
      }>${codeWebComponent.replaceAll(/\n\n/g, '\n')}</div>`

    if (codeCssComponent) {
      output += `<div slot="showCssComponent">${codeCssComponent.replaceAll(
        /\n\n/g,
        '\n'
      )}</div>`
    }

    output += '</docs-example>'
    return output
  })

  return {
    dir: {
      input: './libs/core/src',
      output: './_generated/doc-site',
      includes: '../../../apps/docs/_includes',
    },
    templateFormats: ['md', 'njk'],
  }
};
