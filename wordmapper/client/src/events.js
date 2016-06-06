var Events = function(options) {
  options = options || {};
  this.debug = options.debug || false;
};
Events.prototype.on = function(event, fn) {
  var _this = this;
  _this._events = _this._events || {};
  _this._events[event] = this._events[event] || [];
  _this._events[event].push(fn);
};
Events.prototype.off = function(event, fn) {
  var _this = this;
  _this._events = _this._events || {};
  if (event in _this._events === false) {
    return;
  }
  _this._events[event].splice(_this._events[event].indexOf(fn), 1);
};
Events.prototype.trigger = function(event) {
  var _this = this;
  _this._events = _this._events || {};
  if (event in _this._events === false) {
    return;
  }
  if (_this.debug) {
    console.log("trigger: ", event);
  }
  for(var i = 0; i < _this._events[event].length; i++) {
    _this._events[event][i].apply(_this, Array.prototype.slice.call(arguments, 1));
  }
};
Events.prototype.mixin = function(dest) {
  ['on','off','trigger'].forEach(function(method) {
    if (typeof dest === 'function') {
      dest.prototype[method] = Events.prototype[method]; 
    } else {
      dest[method] = Events.prototype[method];
    }
  });
};

module.exports = {
  Events: Events,
  hub: new Events({debug: true})
};
