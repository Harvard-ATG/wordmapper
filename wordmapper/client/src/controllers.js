events = require('./events.js');

var Application = function() {
};
Application.prototype.run = function() {
    events.hub.on('loaded', function() {
        console.log("application controller running");
    });
};

module.exports = {
    Application: Application
};