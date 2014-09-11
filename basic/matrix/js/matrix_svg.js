;(function (exports) {
  var MatrixSvg = exports.MatrixSvg = function (container, options) {
    this.container = container;

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
  };

  MatrixSvg.prototype.loadData = function (data) {
    if (!data) {
      return false;
    }
    this.data = data;
  };

  MatrixSvg.prototype._getSVG = function () {
    var conf = this.defaults;
    var container = this.container;

    var svg = d3.select("#" + container).append("svg")
      .attr({
        "width": conf.width,
        "height": conf.height,
      })
      .style({"position": "absolute"})
      .append("g");

    return svg;
  }

  MatrixSvg.prototype.render = function (callback) {
    var svg = this._getSVG();
    var conf = this.defaults;
    var gridSize = conf.gridSize;
    var getColor = conf.getColor;
    var getX = conf.getX;
    var getY = conf.getY;

    var data = this.data;

    var matrix = svg.selectAll(".rect")
      .data(data)
      .enter().append("rect")
      .attr({
        "class": "rect",
        "x": function(d) { return getX(d); },
        "y": function(d) { return getY(d); },
        "width": gridSize,
        "height": gridSize
      })
      .style({
        "fill": function(d) { return getColor(d); },
        "stroke": "#fff",
        "stroke-width": 2
      });

    matrix.each(function (d) {
      var dom = $(this);
      var info = d;
      (function addInfo (dom, info) {
        dom.data("info", info);
      })(dom, info);
    });

    callback = callback || function () {;};
    callback();
  };

})(window.Chart = window.Chart || {});

