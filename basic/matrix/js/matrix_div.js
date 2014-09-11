;(function (exports) {
  var MatrixDiv = exports.MatrixDiv = function (container, options) {
    var dom = $("#" + container);

    var defaults = {};
    defaults.width = options.width || dom.width() || 400;
    defaults.height = options.height || dom.height() || 200;
    var gridSize = options.gridSize || 20;
    defaults.gridSize = gridSize;
    defaults.getX = options.getX || function (d) { return (d.week - 1) * gridSize; };
    defaults.getY = options.getY || function (d) { return (d.day - 1) * gridSize; };
    defaults.areaColors = options.areaColors || ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];
    defaults.getColor = options.getColor || function (d) {
      return defaults.areaColors[d.value % defaults.areaColors.length];
    };

    this.defaults = defaults;
    this.dom = dom;
  };

  MatrixDiv.prototype.loadData = function (data) {
    if (!data) {
      return false;
    }
    this.data = data;
  };

  MatrixDiv.prototype.render = function (callback) {
    var dom = this.dom;
    var conf = this.defaults;
    var gridSize = conf.gridSize;
    var getColor = conf.getColor;
    var getX = conf.getX;
    var getY = conf.getY;
    var rectTouch = conf.rectTouch;

    var paper = $('<div>').addClass('paper').css({
      "width": conf.width,
      "height": conf.height,
      "position": "absolute"
    });

    var data = this.data;
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var x = getX(item);
      var y = getY(item);
      var object = $('<div>');
      var color = getColor(item);
      object.css({
        "width": gridSize,
        "height": gridSize,
        "left": x,
        "top": y,
        "position": "absolute"
      });
      var rect = $('<div>').addClass('rect').data("info", item).css({
        "background": color,
        "width": gridSize - 2,
        "height": gridSize - 2,
        "margin": 1
      });
      object.append(rect);
      paper.append(object);
    }

    dom.append(paper);

    callback = callback || function () {;};
    callback();
  };

})(window.Chart = window.Chart || {});
