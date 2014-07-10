//气泡图 绝对值 比例两种状态， 以及图例组件
(function (name, definition) {
  // this is considered "safe":
  var hasDefine = typeof define === 'function';
  var hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition();
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }
})('NielsenBubble', function () {
  var NielsenBubble =  function (config) {
    this.config = config;
    //  4 params must need
    var container = typeof config.container === 'string' ? document.getElementById(config.container) //id
      : config.container; // dom node
    var data = config.data || [
      {"name":"海飞丝", "x":0.25, "y": 0.35, "value": 30},
      {"name":"沙宣", "x":0.15, "y": 0.25, "value": 40},
      {"name":"爱茉莉", "x":0.35, "y": 0.15, "value": 50},
      {"name":"清扬", "x":0.1, "y": 0.05, "value": 60},
      {"name":"施华蔻", "x":0.05, "y": 0.20, "value": 70},
      {"name":"潘婷", "x":0.12, "y": -1.05, "value": 80}
    ];
    var width = config.width || $(container).width() || 960;
    var height = config.height || $(container).height() || 500;
    var margin = config.margin || {top: 30, right: 30, bottom: 40, left: 100};
    var xTitle = config.xTitle || '';
    var yTitle = config.yTitle || '';
    var xType = config.xType || 'ratio'; // 'ratio' or 'value'

    var getColor = config.getColor || d3.scale.category10();

    this.setSource = function (sourceData) {
      data = sourceData;
    };

    this.setOptions = function (config) {
      width = config.width || width;
      height = config.height || height;
      margin = config.margin || margin;
      xTitle = config.xTitle || xTitle;
      yTitle = config.yTitle || yTitle;
      xType = config.xType || xType;
      getColor = config.getColor || getColor;
    };

    var processData = this.processData = function (data) {
      var max = d3.max(data, function (d) { return d.value; }) || 0.000001;
      data.forEach(function (d, i) {
        d.color = d.color || getColor(d.name);
        d.ratio = d.value / max;
      });
      data.sort(function (a, b) {
        return b.value - a.value;
      });
    };

    var getYRange = function (data) {
      var min = d3.min(data, function(d) { return d.y; });
      var max = d3.max(data, function(d) { return d.y; });
      var d = max - min;
      min -= d * 0.2;
      max += d * 0.2;
      if (min > 0) {
        min = 0;
      }
      if (max < 0) {
        max = 0;
      }
      return [min, max];
    };

    var floatTag = this.floatTag = (function () {
      var mouseToFloatTag = {x: 20, y: 20};
      var setContent = function () {};
      var node;
      var container;
      //set floatTag location, warning: the html content must be set before call this func,
      // because jqNode's width and height depend on it's content;
      var _changeLoc = function (m) {
          //m is mouse location, example: {x: 10, y: 20}
          var x = m.x;
          var y = m.y;
          var floatTagWidth = node.outerWidth ? node.outerWidth() : node.width();
          var floatTagHeight = node.outerHeight ? node.outerHeight() : node.height();

          if (floatTagWidth + x + 2 * mouseToFloatTag.x <=  $(container).width()) {
              x += mouseToFloatTag.x;
          } else {
              x = Math.max(1, x - floatTagWidth - mouseToFloatTag.x);
          }
          if (y >= floatTagHeight + mouseToFloatTag.y) {
              y = y - mouseToFloatTag.y - floatTagHeight;
          } else {
              y += Math.min(mouseToFloatTag.y, $(container).height() - floatTagHeight);
          }
          node.css("left",  x);
          node.css("top",  y);
      };
      var _mousemove = function (e) {
          var offset = $(container).offset();
          if (!(e.pageX && e.pageY)) {return false;}
          var x = e.pageX - offset.left,
              y = e.pageY - offset.top;

          setContent.call(this);
          _changeLoc({'x': x, 'y': y});
      };

      var floatTag = function (cont) {
          container = $(cont);
          container.css('position', 'relative');
          node = $("<div/>").css({
              "border": "1px solid",
              "border-color": $.browser.msie ? "rgb(32, 32, 32)" : "rgba(32, 32, 32, 0.9)",
              "background-color": $.browser.msie ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.8)",
              "color": "#000",
              "border-radius": "2px",
              "padding": "12px 8px",
              "font-size": "12px",
              "box-shadow": "3px 3px 6px 0px rgba(0,0,0,0.58)",
              "font-familiy": "宋体",
              "z-index": 1000,
              "text-align": "center",
              "visibility": "hidden",
              "position": "absolute"
          });
          container.append(node);
          container.on('mousemove', _mousemove);
          container.on('tap', _mousemove);
          node.creator = floatTag;
          return node;
      };

      floatTag.setContent = function (sc) {
          if (arguments.length === 0) {
              return setContent;
          }
          setContent = sc;
          return floatTag;
      };

      floatTag.mouseToFloatTag = function (m) {
          if (arguments.length === 0) {
              return mouseToFloatTag;
          }
          mouseToFloatTag = m;
          return floatTag;
      };

      floatTag.changeLoc = _changeLoc;

      return floatTag;
    }())(container);

    var render = this.render = function () {
      $(container).empty();
      $(container).addClass('nielsen-bubble');
      $(container).append(floatTag);
      processData(data);
      var w = width - margin.left - margin.right,
          h = height - margin.top - margin.bottom;

      var x = d3.scale.linear()
          .domain([
            0,
            d3.max(data, function(d) { return d.x; }) * 1.2
          ]).nice()
          .range([0, w]);

      var y = d3.scale.linear()
          .domain(getYRange(data)).nice()
          .range([h, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(2, xType === 'ratio' ? "%" : '');

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(-w)
          .ticks(4, "%");
          //.ticks(10, "%");

      var svg = d3.select(container).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + y(0) + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      // y axis line
      svg.append('path')
          .attr('class', 'y-axis')
          .attr('d', 'M0,0V' + h);
      // x axis line
      svg.append('path')
          .attr('class', 'x-axis')
          .attr('d', 'M0,' + y(0) + 'H' + w);

      var bar = svg.selectAll(".bar-group")
          .data(data)
        .enter().append("circle")
          .attr("class", "bar")
          .attr("fill", function (d) {
            return d.color; })
          .attr("cx", function(d) {
           return x(d.x); })
          .attr("cy", function(d) {
           return y(d.y); })
          .attr("r", function(d) {
            return d.ratio * w * 0.1 + 2;
          });

      bar.on('mouseover', function () {
        var data = this.__data__;
        var prefix;
        var html = '';
        html += data.name + '<br>';
        [
          [xTitle, d3.format(xType === 'value' ? ',' : '.2%')(data.x)],
          [yTitle, d3.format('.2%')(data.y)],
          ['成交人数', d3.format(',')(data.value)]
        ].forEach(function (d) {
          html += '<div style="position: relative;">' +
                    '<span class="float-tag-name">' + d[0] + '</span>' +
                    '<span class="float-tag-value">' + d[1] + '</span>' +
                  '</div>' +
                  '<div style="clear:both;"></div>';
        });
        floatTag.html(html);
        floatTag.css({"visibility" : "visible"});
      });
      bar.on('mouseout', function () {
        floatTag.css({"visibility" : "hidden"});
      });

      var xAxisTitle = svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', w / 2)
        .attr('y', h + margin.bottom / 2)
        .attr('text-anchor', 'middle')
        .text(xTitle);

      var yAxisTitleCenter = {x: -60, y: h / 2};
      var yAxisTitle = svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', yAxisTitleCenter.x)
        .attr('y', yAxisTitleCenter.y)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90 ' + yAxisTitleCenter.x + ' ' + yAxisTitleCenter.y + ")")
        .text(yTitle);

    };
  };

  var NielsenBubbleLegend = NielsenBubble.legend = function (config) {
    this.config = config;
    //  4 params must need
    var container = typeof config.container === 'string' ? document.getElementById(config.container) //id
      : config.container; // dom node
    var data = config.data || [
      {"name":"海飞丝"},
      {"name":"沙宣"},
      {"name":"爱茉莉"},
      {"name":"清扬"},
      {"name":"施华蔻"},
      {"name":"潘婷"}
    ];
    var getColor = config.getColor || d3.scale.category10();

    this.setSource = function (sourceData) {
      data = sourceData;
    };

    this.setOptions = function (config) {
      getColor = config.getColor || getColor;
    };

    var processData = this.processData = function (data) {
      data.forEach(function (d, i) {
        d.color = getColor(d.name);
      });
    };

    var render = this.render = function () {
      $(container).empty();
      $(container).addClass('nielsen-bubble');
      processData(data);
      //legend
      var legend = $('<div class="legend"></div>');
      data.forEach(function (d) {
        $('<span/>').css('border-color', d.color).html(d.name).appendTo(legend);
      });
      $(container).append(legend);
    };
  };

  return NielsenBubble;
});
