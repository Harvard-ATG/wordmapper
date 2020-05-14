# Word Mapper

### Overview 
The goal of this project is to create a web accessible tool that enables students, faculty and other collaborators to build discontinuous word alignments between two or more texts on [graeco-arabic-studies.org](http://graeco-arabic-studies.org/), so that they can build and share glossaries to aid learning and research.

The core functionality should include the ability to:

1. Select a set of words in one text and align those with another set of words in another text or texts. Unlike other annotation tools such as [hypothes.is](https://hypothes.is/), the words need not be contiguous.
2. Build, store, display, and export a glossary of the word alignments.
3. Collaborate with other users to share and build glossaries.

The project has a client-side bookmarklet that can run as an overlay. Word alignments can be exported and imported.

### Usage

1. Install the bookmarklet from [https://harvard-atg.github.io/wordmapper](https://harvard-atg.github.io/wordmapper)
2. Navigate to [Ars Medica ch. 10](http://www.graeco-arabic-studies.org/compare-texts/work/ars-medica-2/left/1/right/2/section/10/active/2%2C1.html) to compare the greek and arabic side by side. This is just an example, feel free to navigate to other works.
3. Click on the bookmark to activate it.

**  For more on installing and using bookmarklets, see [Mozilla's documentation](https://support.mozilla.org/en-US/kb/bookmarklets-perform-common-web-page-tasks).

### Limitations

Bookmarklets have some limitations. Websites can instruct browsers to forbid cross-site scripts through a [Content Security Policy](https://en.wikipedia.org/wiki/Content_Security_Policy), which would not allow the bookmarklet to run on the website. Fortunately, [graeco-arabic-studies.org](http://www.graeco-arabic-studies.org/) does not prevent that (yet). If that happens, you may see an error message like this in your browser's developer console:

_Refused to load the script '...' because it violates the following Content Security Policy directive: "script-src 'unsafe-eval' 'unsafe-inline' about: https: 'self'"._

The alternative solution would be to create a browser extension or create a web proxy service that can inject the script functionality into the proxied content.

### Development Quickstart

Setup your environment (requires [Node](https://nodejs.org/en/) v12+):

```sh
$ npm install    # install node dependencies
$ npm test       # test with karma
$ gulp build     # build the bookmarklet
```

Run the webpack development server to test the bookmarklet locally:

```sh
$ npm run webpack-dev-server
```

Install bookmarklet in your browser by creating a new bookmark and copying this code into the URL field:

```javascript
javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://localhost:8000/bookmarklet.js';})();
```

### Testing the Bookmarklet 

1. Ars Medica:
    - [Ars Medica 10 arabic/greek](http://www.graeco-arabic-studies.org/compare-texts/work/ars-medica-2/left/1/right/2/section/10/active/2%2C1.html). 
    - [Ars Medica 10 greek/arabic](http://www.graeco-arabic-studies.org/compare-texts/work/ars-medica-2/left/2/right/1/section/10/active/1%2C2.html).
    - Test that swapping the greek and arabic translations from right to left and vice versa maintain word alignments.
2. Ars Poetica
    - [Ars Poetica 1](http://www.graeco-arabic-studies.org/compare-texts/work/ars-poetica-3/left/11/right/12%2C51%2C52%2C53%2C54/active/11%2C12.html). 
    - Test that word alignments can be created across 3 or more source texts (not just 2!).

### Reference Implementation

See the project github page [http://harvard-atg.github.io/wordmapper/](http://harvard-atg.github.io/wordmapper/) for a link to the reference implementation by Mark Schiefsky.


