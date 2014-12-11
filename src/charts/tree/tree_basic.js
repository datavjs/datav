/**
 *  Tree Basic chart
 */
var $ = require('jquery');
var d3 = require('d3');
var Event = require('../../core/event');
var util = require('../../core/util');
/**
 *
 * Class Tree Basic
 * @param {Object} config
 * {
 *   container:   {String|DomNode}
 *   color:       {Color Object}
 *   className:   {String}  css class name
 *   width:       {Number}
 *   height:      {Number}
 *   margin:      {Object}  {left, right, top, bottom}
 *   xTicks:      {Array}
 *   emptyMessage: {String}
 * }
 *
 */
function Tree (container, config) {
  if (typeof container === 'string') {
    container = $(container);
  }
  this.container = container;

  var defaults = {};
  defaults.width = config.width || container.width() || 400;
  defaults.height = config.height || container.height() || 200;
  defaults.margin = config.margin || {top: 20, right: 20, bottom: 30, left: 50};
  defaults.max = config.max;
  defaults.min = config.min;
  defaults.yTickNum = config.yTickNum || 4;
  defaults.xTickValues = config.xTickValues || [];
  defaults.yTickValues = config.yTickValues || [];
  defaults.yValueFormat = config.yValueFormat || 'f';
  defaults.xAxisStyle = config.xAxisStyle || {'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'};
  defaults.yAxisStyle = config.yAxisStyle || {'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'};
  defaults.lineStyle = config.lineStyle || {'fill': 'none', 'stroke-width': '1.5px'};
  defaults.colorList = config.colorList || ['#ededed', '#d6e685', '#8cc665', '#44a340', '#1e6823'];
  defaults.getColor = config.getColor || function (num) {
    return defaults.colorList[num % defaults.colorList.length];
  };

  this.defaults = defaults;
}

Event.extend(Tree, {
  bindEvent: function () {
  	;
  },
  empty: function (msg) {
    msg = msg || '暂无数据';
    this.container.html('<div class="chart-empty">' + msg + '</div>');
  },
  _getSVG: function () {
    var conf = this.defaults;
    var container = this.container;

    var svg = d3.select(container[0]).append("svg")
      .attr({
        'width': conf.width,
        'height': conf.height,
      });

    return svg;
  },
  _createTree: function () {
    var tree = d3.layout.tree().size([height, width]);
  }
  // should add it to datavjs
  _unionArray: function (arrays) {
    if (arrays === []) {
      return [];
    }

    var array = d3.merge(arrays);
    var unionArray = [];
    $.each(array, function (i, el) {
      if ($.inArray(el, unionArray) === -1) {
        unionArray.push(el);
      }
    });

    return unionArray;
  },
  /**
   * render data
   * @public
   * @param  {[type]} data    [description]
   * @param  {[type]} callback [description]
   * @return {[type]}         [description]
   */
  render: function (source, callback) {
    if (!source || !source.length) {
      return this.empty(this.config.emptyMessage);
    }
    var dataList = source.map(function (item) {
      return item.data;
    });
    
    var svg = this._getSVG();
    var conf = this.defaults;
    var margin = conf.margin;
    var width = conf.width - margin.left - margin.right;
    var height = conf.height - margin.top - margin.bottom;

    var tree = d3.layout.tree().size([height, width]);


    callback = callback || function () {};
    callback();
  }
});

module.exports = Line;
