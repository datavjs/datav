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