;(function (exports) {
	var Pie = exports.Pie = function (container, options) {
		this.container = container;
    var dom = $("#" + container);

    var defaults = {};
    defaults.width = options.width || dom.width() || 400;
    defaults.height = options.height || dom.height() || 400;
    defaults.margin = options.margin || {top: 20, right: 20, bottom: 20, left: 20};
    var margin = defaults.margin;
    var w = defaults.width - margin.left - margin.right;
    var h = defaults.height - margin.top - margin.bottom;
    defaults.paperWidth = w;
    defaults.paperHeight = h;
    defaults.outerRadius = options.outerRadius || Math.min(w, h) / 2;
    defaults.innerRadius = options.innerRadius || 0;
    defaults.valueFormat = options.yValueFormat || 'f';
    defaults.pieStyle = options.lineStyle || {'stroke': 'none'};
    defaults.colorList = options.colorList || ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];
    defaults.getColor = options.getColor || function (d, num) {
      return defaults.colorList[num % defaults.colorList.length];
    };

    this.defaults = defaults;
	};

	Pie.prototype.loadData = function (data) {
		if (!data || data.length === 0) {
			return false;
		}
		this.data = data;
	};

	Pie.prototype._getSVG = function () {
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

	function getLabelPositions (d, r, cx, cy) {
    var startAngle = d.startAngle;
    var endAngle = d.endAngle;
    var sin = Math.sin;
    var cos = Math.cos;

    var a = (startAngle + endAngle) / 2 * Math.PI / 180;
    var x = r * sin(a) + cx;
    var y = cy + r * cos(a);
    return [x, y];
	};

	Pie.prototype.render = function (callback) {
		var svg = this._getSVG();
    var conf = this.defaults;
    var margin = conf.margin;
    var pw = conf.paperWidth;
    var ph = conf.paperHeight;
    var or = conf.outerRadius;
    var ir = conf.innerRadius;
    var getColor = conf.getColor;

    var arc = d3.svg.arc()
	    .outerRadius(or)
	    .innerRadius(ir);

	  var pie = d3.layout.pie()
	    .sort(null)
	    .value(function (d) { return d.value; });

	  var paper = svg.append('g')
      .attr('transform', 'translate(' + (conf.width / 2) + ',' + (conf.height / 2)+ ')');

    var arcNodes = paper.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

    var arcs = arcNodes.append("path")
      .attr("d", arc)
      .style({
      	'fill': function (d, num) { return getColor(d, num); },
      	'shape-rendering': 'geometricPrecision'
      });

    var pi = Math.PI;
    var format = d3.format('.2f');
    var innerLabels = arcNodes.append("text")
      .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", 0)
      .style("text-anchor", "middle")
      .text(function (d) { return format((d.endAngle - d.startAngle) / (2 * pi)); });

    var cx = conf.width / 2;
    var cy = conf.height / 2;
    var outerLabels = arcNodes.append("text")
      .attr("transform", function (d) { return "translate(" + getLabelPositions(d, 20, arc.centroid(d)[0], arc.centroid(d)[1]) + ")"; })
      .style("text-anchor", "left")
      .text(function (d) { return d.data.date; });

    callback = callback || function () {};
    callback();
	};
})(window.Chart = window.Chart || {});
