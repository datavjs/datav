;(function (exports) {
  var Bar = exports.Bar = function (container, options) {
  	this.container = container;
    var dom = $("#" + container);

    var defaults = {};
    defaults.width = options.width || dom.width() || 400;
    defaults.height = options.height || dom.height() || 200;
    defaults.margin = options.margin || {top: 20, right: 20, bottom: 30, left: 50};
    defaults.max = options.max || 100;
    defaults.min = options.min || 0;
    defaults.gridNum = options.gridNum || 3;
    var valueStep = (defaults.max - defaults.min) / defaults.gridNum;
    var min = defaults.min;
    var max = defaults.max;
    defaults.yTickValues = options.yTickValues || [min, min + valueStep, max - valueStep, max];
    defaults.yValueFormat = options.yValueFormat || 'f';
    defaults.xAxisStyle = options.xAxisStyle || {'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'};
    defaults.yAxisStyle = options.yAxisStyle || {'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'};
    defaults.barStyle = options.lineStyle || {'stroke': 'none'};
    defaults.colorList = options.colorList || ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];
    defaults.getColor = options.getColor || function (d, num) {
      return defaults.colorList[num % defaults.colorList.length];
    };

    this.defaults = defaults;
  };

  Bar.prototype.loadData = function (data) {
    if (!data) {
      return false;
    }
    this.data = data;
  };

  Bar.prototype._getSVG = function () {
    var conf = this.defaults;
    var container = this.container;
    $(container).empty();

    var svg = d3.select("#" + container).append("svg")
      .attr({
        'width': conf.width,
        'height': conf.height,
      });

    return svg;
  };

  Bar.prototype.render = function (callback) {
    var svg = this._getSVG();
    var conf = this.defaults;
    var margin = conf.margin;
    var width = conf.width - margin.left - margin.right;
    var height = conf.height - margin.top - margin.bottom;
    var min = conf.min;
    var max = conf.max;
    var gridNum = conf.gridNum;
    var getColor = conf.getColor;

    var paper = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scale.ordinal()
      .rangeBands([0, width], 0.5, 0.1);

    var y = d3.scale.linear()
      .range([height, 0]);

    x.domain(data.map(function (d) { return d.name; }));
    y.domain([min, max]);
    console.log(data.map(function (d) { return d.name; }));

    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

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

    var bars = paper.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr({
        "class": "bar",
        "x": function (d) { return x(d.name); },
        "y": function (d) { return y(d.value); },
        "width": function (d) { return x.rangeBand(); },
        "height": function (d) { return y(min) - y(d.value); },
        "fill": function (d, num) { return getColor(d, num); }
      });

    callback = callback || function () {};
    callback();
  };
})(window.Chart = window.Chart || {});
