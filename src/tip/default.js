/**
 * Tips when mouseover
 */
var $ = require('jquery');

function Tip(config) {
  this.init(config);
}

Tip.prototype.init = function (config) {
  if (!this.node) {
    var node = $('body').append('<div class=\'tip\'></div>');
    node.css({
      'border': '1px solid',
      'border-color': $.browser.msie ? 'rgb(32, 32, 32)' : 'rgba(32, 32, 32, 0.9)',
      'background-color': $.browser.msie ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.8)',
      'color': '#000',
      'border-radius': '2px',
      'padding': '12px 8px',
      'font-size': '12px',
      'box-shadow': '3px 3px 6px 0px rgba(0,0,0,0.58)',
      'font-familiy': '宋体',
      'z-index': 9999,
      'text-align': 'center',
      'visibility': 'hidden',
      'position': 'absolute'
    });
    this.node = node;
  }
};

Tip.prototype.show = function () {

};

Tip.prototype.hide = function () {

};

Tip.prototype.withMouse = function () {
  // move with mouse
};

Tip.prototype.setContent = function () {

};