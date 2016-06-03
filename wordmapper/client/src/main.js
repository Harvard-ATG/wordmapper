var output = "Hello, World! xxxxx.";
var overlayDiv = document.createElement("div");
overlayDiv.id = "wordmapper-overlay";
overlayDiv.innerHTML = "Bookmarklet Activated";
document.body.appendChild(overlayDiv);
module.exports = output;
