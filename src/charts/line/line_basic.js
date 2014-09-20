/**
 * Simple line chart
 *
 * @example
 *
 * line.render([
 *   { name: 'Taobao',
 *     data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
 *   },
 *   { name: 'Tmall',
 *     data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
 *   },
 *   { name: 'Alipay',
 *     data: [20, 18, 2, 3, 7, 19, 29, 30, 10, 8]
 *  }
 * ]);
 */
var $ = require('jquery');
var d3 = require('d3');
var Event = require('../../core/event');
var util = require('../../core/util');
/**
 *
 * Class SimpleLine
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
function Line (container, config) {
  if (typeof container === 'string') {
    container = $(container)[0];
  }
  this.container = container;

  var defaults = {};
  defaults.width = config.width || dom.width() || 400;
  defaults.height = config.height || dom.height() || 200;
  defaults.margin = config.margin || {top: 20, right: 20, bottom: 30, left: 50};
  defaults.max = config.max || 100;
  defaults.min = config.min || 0;
  var max = defaults.max;
  var max = defaults.max;
  var valueStep = (defaults.max - defaults.min) / 3;
  defaults.yTickValues = config.yTickValues || [min, min + valueStep, max - valueStep, max];
  defaults.yValueFormat = config.yValueFormat || 'f';
  defaults.xAxisStyle = config.xAxisStyle || {'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'};
  defaults.yAxisStyle = config.yAxisStyle || {'fill': 'none', 'stroke': '#000', 'stroke-width': '1px'};
  defaults.lineStyle = config.lineStyle || {'fill': 'none', 'stroke-width': '1.5px'};
  defaults.colorList = config.colorList || ['#ededed', '#d6e685', '#8cc665', '#44a340', '#1e6823'];
  defaults.getColor = config.getColor || function (num) {
    return defaults.colorList[num % defaults.colorList.length];
  };

  this.defaults = defaults;
}

Event.extend(Line, {
  bindEvent: function () {
  	;
  },
  empty: function (msg) {
    msg = msg || '暂无数据';
    this.container.html('<div class="chart-empty">' + msg + '</div>');
  },
  _getSVG = function () {
    var conf = this.defaults;
    var container = this.container;

    var svg = d3.select(container).append("svg")
      .attr({
        'width': conf.width,
        'height': conf.height,
      });

    return svg;
  },
  /**
   * render data
   * @public
   * @param  {[type]} data    [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  render: function (data, callback) {
    if (!data || !data.length) {
      return this.empty(this.config.emptyMessage);
    }
    this.data = data;
    
    var svg = this._getSVG();
    var conf = this.defaults;
    var margin = conf.margin;
    var width = conf.width - margin.left - margin.right;
    var height = conf.height - margin.top - margin.bottom;
    var min = conf.min;
    var max = conf.max;
    var gridNum = conf.gridNum;
    var getColor = conf.getColor;

    var data = this.data;

    var paper = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scale.ordinal()
        .rangeBands([0, width], 0.5, 0.2);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([min, max]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yTicks = [];
    var yStep = (max - min) / (gridNum - 1);
    for (var i = 0; i < gridNum; i++) {
      yTicks.push(min + yStep * i);
    }

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues(conf.yTickValues)
        .tickFormat(d3.format(conf.yValueFormat))
        .orient('left');

    var xAxisNode = paper.append('g')
        .attr({
          'class': 'x axis',
          'transform': 'translate(0,' + height + ')'
        })
        .call(xAxis);

    xAxisNode.selectAll('.axis path, .axis line').style(conf.xAxisStyle);

    var yAxisNode = paper.append('g')
        .attr({ 'class': 'y axis' })
        .call(yAxis);

    yAxisNode.selectAll('.axis path, .axis line').style(conf.yAxisStyle);

    var line = d3.svg.line()
        .x(function(d) { return x(d.date) + x.rangeBand() / 2; })
        .y(function(d) { return y(d.value); });

    paper.append('path')
      .datum(data)
      .attr({
        'class': 'line',
        'd': line,
        'stroke': getColor(0),
      })
      .style(conf.lineStyle);

    this.svg = svg;
    this.paper = paper;
    this.x = x;
    this.y = y;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.xAxisNode = xAxisNode;
    this.yAxisNode = yAxisNode;
    this.line = line;

    callback = callback || function () {};
    callback();
  }
});

module.exports = Line;
