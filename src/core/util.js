/**
 * merge options
 * @param  {Object} target
 * @param  {Object} src
 * @return {Object}
 */
exports.merge = function (target, src) {
  var len = arguments.length;
  var tmp;
  for (var i = 1; i < len; i++) {
    tmp = arguments[i];
    for (var j in tmp) {
      if (tmp.hasOwnProperty(j)) {
        target[j] = tmp[j];
      }
    }
  }
  return target;
};

exports.defaultConfig = function (config) {
  if (config.className) {
    $(config.container).addClass(config.className);
  }
  if (!config.margin) {
    config.margin = {left: 10, top: 10, right: 10, bottom: 10};
  } else if (typeof config.margin === 'number') {
    config.margin = {left: config.margin, top: config.margin, right: config.margin, bottom: config.margin};
  }
  if (!config.width) {
    config.width = 400;
  }
  if (!config.height) {
    config.height = 260;
  }
}