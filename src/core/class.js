function Class() {}
/**
 * Create a new Class that inherits from this class
 * @param  {Function} fn    [description]
 * @param  {[type]}   proto [description]
 * @return {[type]}         [description]
 */
Class.extend = function (newClass, proto) {
  if (typeof newClass !== 'function' && !proto) {
    proto = newClass;
    newClass = function () {};
  } else if (!newClass) {
    newClass = function () {};
  }
  /*
  var newClassName = constructor.name;
  var code = 'return function ' + newClassName + '(){';
  code += 'var args = Array.prototype.slice.apply(arguments);';
  code += 'sfn.apply(this, args);';
  code += 'fn.apply(this, args);';
  code += '};';
  var newClass = new Function('fn', 'sfn', code)(constructor, this);
  */
  // Instantiate a base class (but only create the instance,
  // don't run the init constructor)
  var superClass = this;
  var prototype;
  var i;

  if (Object.create) {
    prototype = Object.create(superClass.prototype, {
      constructor: {
        value: superClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  } else {
    prototype = new superClass;
    prototype.constructor = newClass;
  }
  // Populate our constructed prototype object

  if (proto) {
    for(i in proto) {
      if (proto.hasOwnProperty(i)) {
        prototype[i] = proto[i];
      }
    }
  }
  // setup super functions
  prototype._super = superClass;
  newClass.prototype = prototype;
  // And make this class extendable
  newClass.extend = arguments.callee;
  newClass.create = function () {
    var len = arguments.length;
    var args = ['a'];
    var params = [];
    for (var i = 0; i < len; i++) {
      params.push('a[' + i + ']');
    }
    args.push('return new newClass(', params.join(','), ');');
    var fn = Function.apply(this, args)(arguments);
    // 父级构造
    // superClass.apply(fn,arguments);
    // 当前构造
    fn.__constructor && fn.__constructor.apply(fn, arguments);
    return fn;
  };

  return newClass;
};

module.exports = Class;