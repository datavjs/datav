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

function SimpleLine(config) {
  this.config = config;
  if (typeof config.container === 'string') {
    config.container = $(config.container)[0];
  }
  if (config.className) {
    $(config.container).addClass(config.className);
  }
  this.tip = config.tip;
  this.legend = config.legend;
}

Event.extend(SimpleLine, {
  bindEvent: function () {
    var container = this.config.container;
    var xRange = this.xRange;
    var xRangeBand = this.xRangeBand;
    var self = this;
    $(container).on('mousemove', function (evt) {
      var index, i, l, x, y;
      var offset = $(this).offset();
      if (!(evt.pageX && evt.pageY)) { return; }
      x = evt.pageX - offset.left,
      y = evt.pageY - offset.top;

      for (i = 0, l = xRange.length; i < l; i++) {
        if (Math.abs(xRange[i] - x) <= xRangeBand / 2 / 0.5) {
          index = i;
          break;
        }
      }
      if (typeof index === 'undefined') {
        self._hide(index);
        self.oldMouseXIndex = null;
      } else {
        self._show(index);
        self.oldMouseXIndex = index;
      }
    });
  },
  empty: function (msg) {
    msg = msg || '暂无数据';
    this.config.container.html('<div class="chart-empty">' + msg + '</div>');
  },
  /**
   * render data
   * @public
   * @param  {[type]} data    [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  render: function (data, options) {
    var cfg;
    if (!data || !data.length) {
      return this.empty(this.config.emptyMessage);
    }
    if (options) {
      cfg = util.merge({}, this.config, options);
    } else {
      cfg = this.config;
    }
    var color = cfg.color;
    var type = cfg.type;
    var width = cfg.width;
    var height = cfg.height;
    var margin = cfg.margin;
    var xTicks = cfg.xAxisPoints;
    var container = this.config.container;

    // xAxisPoints
    if (!xTicks) {
      xTicks = data[0].data.map(function (d, i) {
        return '';
      });
    }

    var getColor = color ? d3.scale.ordinal().range(color) : d3.scale.category10();

    var w = width - margin.left - margin.right,
      h = height - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .domain(xTicks.map(function(d, i) { return i; }))
        .rangeRoundBands([0, w], 0.5);

    var y = d3.scale.linear()
        .domain(this._getDataRange(data)).nice()
        .range([h, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat(function (d, i) { return xTicks[i]; });

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickSize(-w)
        .ticks(5)
        .tickFormat(function (d, i) {
          if (type === 'value') {
            var negative = d < 0;
            var abs = Math.abs(d);
            var word = '';
            if (abs >= 10000 * 10000) {
              word = d3.format('.2')(abs / 10000 / 10000) + '亿';
            } else if (abs >= 10000) {
              word = d3.format('.2')(abs / 10000) + '万';
            } else {
              word = d3.format(',')(abs);
            }
            return negative ? '-' + word : word;
          } else {
            return d3.format('%')(d);
          }
        });

    // TODO  common function
    function linePath (d) {
      var p = '';
      d.data.forEach(function (d, i) {
        p += i === 0 ? 'M' : 'L';
        p += (x(i) + x.rangeBand() / 2) + ' ' + y(d);
      });
      return p;
    }
    var xRangeBand = x.rangeBand();
    this.xRangeBand = xRangeBand;
    this.xRange = x.range().map(function (d) { return d + xRangeBand / 2; });

    var svg = d3.select(container).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.svg = this.svg;

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + h + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);

    this.lines = svg.selectAll('.line')
        .data(data)
      .enter().append('path')
        .attr('class', function (d) { return 'line l' + d.index; })
        .attr('d', linePath)
        .attr('stroke', function (d) { return getColor(d.name); });

    this.vLine = svg.append('path')
        .attr('class', 'mouse-line')
        .attr('d', 'M0,0V' + h);

    this.drawPoints(svg, function (d) {
      return x(d.index) + xRangeBand / 2;
    },
    function (d) {
      return y(d.value);
    });
    this.points = svg.selectAll('.circle')
        .data(this._getPoints())
      .enter().append('circle')
        .attr('class', function (d, i) { return 'circle ' + d.lineIndex + ' ' + 'circle-column-' + (i % data[0].data.length); })
        .attr('cx', function (d) { return x(d.index) + xRangeBand / 2; })
        .attr('cy', function (d) { return y(d.value); })
        .attr('r', 4)
        .attr('fill', function (d) { return getColor(d.name); });

  },
  drawPoints: function (svg, getX, getY) {
    var self = this;
    this.points = svg.selectAll('.circle')
      .data(this._getPoints())
      .enter().append('circle')
        .attr('class', function (d, i) {
          return 'circle ' + d.lineIndex + ' ' + 'circle-column-' + d.index;
        })
        .attr('cx', function (d) { return getX(d); })
        .attr('cy', function (d) { return getY(d); })
        .attr('r', 2)
        .attr('fill', function (d) { return self.config.getColor(d.name); });
  },
  setOption: function (name, value) {
    this.config[name] = value;
    return this;
  },
  _getPoints: function (data) {
    var points = [];
    data.forEach(function (d, i) {
      d.index = i;
      d.data.forEach(function (c, j) {
        points.push({
          name: d.name,
          value: c,
          index: j,
          lineIndex: i
        });
      });
    });
    return points;
  },
  _getDataRange: function (data) {
    var min = d3.min(data, function(d) {
      return d3.min(d.data);
    });
    var max = d3.max(data, function(d) {
      return d3.max(d.data);
    });
    if (min > 0) {
      min = 0;
    }
    if (max < 0) {
      max = 0;
    }
    return [min, max];
  },
  mouseOver: function (index) {
    this.vLine.style('display', 'inline')
      .attr('transform', 'translate(' + this.xRange[index] + ',0)');

    this.svg.selectAll('.circle-column-' + index)
              .attr('opacity', 0.8)
              .attr('r',8);

    var dd;
    this.data.forEach(function (d, i) {
      dd.push(d.data[index]);
    });
    this.tip.show(dd);
  },
  mouseOut: function () {
    this.vLine.style('display', 'none');
    this.svg.selectAll('.circle-column-' + this.oldMouseXIndex)
                .attr('opacity', 1)
                .attr('r',4);
    this.tip.hide();
  }
});