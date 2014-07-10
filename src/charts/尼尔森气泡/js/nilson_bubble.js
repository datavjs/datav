//气泡
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
})('NilsonBubble', function () {
  return function (config) {
    this.config = config;
    //  4 params must need
    var container = typeof config.container === 'string' ? document.getElementById(config.container) //id
      : config.container; // dom node
    var data = config.data || [
      { name: 'group1',
        children: [
          {"name":"尼尔森零研", "x":0.2, "y": 0.3},
          {"name":"尼尔森电商", "x":0.1, "y": 0.2},
          {"name":"淘宝天猫", "x":0.3, "y": 0.1}
        ]
      },
      { name: 'group2',
        children: [
          {"name":"尼尔森零研", "x":0.2, "y": 0.3},
          {"name":"尼尔森电商", "x":0.1, "y": 0.2},
          {"name":"淘宝天猫", "x":0.3, "y": -0.1}
        ]
      }
    ];
    var color = config.color;
    var width = config.width || $(container).width() || 960;
    var height = config.height || $(container).height() || 500;
    var margin = config.margin || {top: 30, right: 30, bottom: 40, left: 100};

    var originData;

    var getColor = color ? d3.scale.ordinal().range(color) : d3.scale.category10();

    this.setSource = function (sourceData) {
      data = sourceData;
    };

    this.setOptions = function (config) {
      width = config.width || width;
      height = config.height || height;
      margin = config.margin || margin;
      color = config.color;
      getColor = color ? d3.scale.ordinal().range(color) : d3.scale.category10();
    };

    var processData = this.processData = function (data) {
      var circle = [];
      data.forEach(function (d, i) {
        d.children.forEach(function (c, i) {
          c.group = d.name;
          c.color = getColor(c.name);
          circle.push(c);
        });
      });
      circle.sort(function (a, b) {
        //实心在前
        if (a.group === data[0].name && b.group === data[1].name) {
          return -1;
        } else if (a.group === data[1].name && b.group === data[0].name) {
          return 1;
        } else {
          //小的在前
          return b.x - a.x;
        }
      });
      originData = data;
      return circle;
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
              x = x - floatTagWidth - mouseToFloatTag.x;
          }
          if (y >= floatTagHeight + mouseToFloatTag.y) {
              y = y - mouseToFloatTag.y - floatTagHeight;
          } else {
              y += mouseToFloatTag.y;
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
              "border-color": $.browser.msie ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.8)",
              "background-color": $.browser.msie ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.75)",
              "color": "white",
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
      $(container).append(floatTag);
      data = processData(data);
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
          .ticks(4, "%");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(-w)
          .ticks(5, "%");
          //.ticks(10, "%");

      var svg = d3.select(container).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      var bar = svg.selectAll(".bar-group")
          .data(data)
        .enter().append("circle")
          .attr("class", "bar")
          .attr("stroke", function (d) {
            return d.color || getColor(d.name); })
          .attr("fill", function (d) {
            return d.group === originData[0].name ? d.color : 'rgba(255, 255, 255, 0.01)'; })
          .attr("cx", function(d) {
           return x(d.x); })
          .attr("cy", function(d) {
           return y(d.y); })
          .attr("r", function(d) {
            return d.x * w * 0.1;
          });


      bar.on('mouseover', function () {
        var data = this.__data__;
        var prefix;
        var html = '';
        html += data.name + '<br>';
        html += d3.format('.2%')(data.x) + '<br>';
        html += d3.format('.2%')(data.y);
        floatTag.html(html);
        floatTag.css({"visibility" : "visible"});
      });
      bar.on('mouseout', function () {
        floatTag.css({"visibility" : "hidden"});
      });
    };
    render();
  };
});

