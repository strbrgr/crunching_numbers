const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

// This object is required inside the renderPermalink function.
// It's copied directly from the plugin source code.
const position = {
  false: "push",
  true: "unshift",
}

// Copied directly from the plugin source code, with one edit
// (marked with comments)
// const renderPermalink = (slug, opts, state, idx) => {
//   const space = () =>
//     Object.assign(new state.Token("text", "", 0), {
//       content: " ",
//     })
//
//   const linkTokens = [
//     Object.assign(new state.Token("link_open", "a", 1), {
//       attrs: [
//         ["class", opts.permalinkClass],
//         ["href", opts.permalinkHref(slug, state)],
//       ],
//     }),
//     Object.assign(new state.Token("html_block", "", 0), {
//       content: `<span>#</span>`,
//     }),
//     new state.Token("link_close", "a", -1),
//   ]
//
//   if (opts.permalinkSpace) {
//     linkTokens[position[!opts.permalinkBefore]](space())
//   }
//   state.tokens[idx + 1].children[position[opts.permalinkBefore]](
//     ...linkTokens
//   )
// }

module.exports = function(eleventyConfig) {
  // Options for the `markdown-it` library
  const markdownItOptions = {
    html: true,
  }
    // Options for the `markdown-it-anchor` library
  // const markdownItAnchorOptions = {
  //   permalink: true,
  //   renderPermalink
  // }

  // const markdownLib = markdownIt(markdownItOptions).use(
  //   markdownItAnchor,
  //   markdownItAnchorOptions
  // )

  // eleventyConfig.setLibrary("md", markdownLib)

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });

  // Official plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 }
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginBundle);

  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts", "book"].indexOf(tag) === -1);
  });

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return (new Date()).toDateString();
  })

  eleventyConfig.addFilter("readableTimestamp", function(dateVal, locale = "en-us") {
    var theDate = new Date(dateVal);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    };
    return theDate.toLocaleString(locale, options);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
    ],

    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site"
    }
  };
};
