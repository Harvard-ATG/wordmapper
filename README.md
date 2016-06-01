# Word Mapper

### Quickstart

```sh
$ vagrant up
$ vagrant ssh
$ cd /vagrant
$ npm install
```

### Overview 
The goall of this project is to create a web accessible tool that enables students, faculty and other collaborators to build discontinuous word alignments between two or more texts on [graeco-arabic-studies.org](http://graeco-arabic-studies.org/), so that they can build and share glossaries to aid learning and research.

The core functionality should include the ability to:
1. Select a set of words in one text and align those with another set of words in another text or texts. Unlike other annotation tools such as [hypothes.is](https://hypothes.is/), the words need not be contiguous.
2. Build, store, display, and export a glossary of the word alignments.
3. Collaborate with other users to share and build glossaries.

The project has two parts: a client-side bookmarklet that can run as an overlay and then a server-side component that can persist word alignments.

### Reference Implementation

See the project github page [http://harvard-atg.github.io/wordmapper/](http://harvard-atg.github.io/wordmapper/) for a link to the reference implementation by Mark Schiefsky.
