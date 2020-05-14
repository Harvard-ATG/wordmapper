const testsContext = require.context('./src/', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
 
const sourcesContext = require.context('../src/js/', true, /\.js$/);
sourcesContext.keys().forEach(sourcesContext);
