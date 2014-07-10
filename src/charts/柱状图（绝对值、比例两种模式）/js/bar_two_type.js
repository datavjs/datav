//柱状图 绝对值 比例两种状态
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
})('BarTwoType', function () {
  return function (config) {
    this.config = config;
    //  4 params must need
    var container = typeof config.container === 'string' ? document.getElementById(config.container) //id
        : config.container; // dom node
    var data = config.data || [
      {"id": 1, "name":"尼尔森", "value":0.08167, "color": 'red'},
      {"id": 2, "name":"阿里巴巴", "value":0.01492, "color": 'green'},
      {"id": 3, "name":"C", "value":0.02782, "color": 'blue'},
      {"id": 4, "name":"D", "value":0.04253, "color": 'yellow'}
    ];
    var type = config.type || 'value'; // 'value' or 'ratio'
    var w = config.w || $(container).width() || 960;
    var h = config.h || $(container).height() || 500;
    var margin = config.margin || {top: 20, right: 20, bottom: 30, left: 100};

    this.setSource = function (sourceData) {
      data = sourceData;
    };

    this.setOptions = function (config) {
      type = config.type || type;
      w = config.w || w;
      h = config.h || h;
      margin = config.margin || margin;
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
      var width = w - margin.left - margin.right,
          height = h - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .domain(data.map(function(d) { return d.id; }))
          .rangeRoundBands([0, width], .5);

      var y = d3.scale.linear()
          .domain([0, d3.max(data, function(d) { return d.value; })]).nice()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat(function (d, i) { return data[i].name; });

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(-width)
          .ticks(5, type === 'value' ? '' : "%");
          //.ticks(10, "%");

      var svg = d3.select(container).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      var bar = svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("fill", function (d) { return d.color || 'steelblue'; })
          .attr("x", function(d) { return x(d.id); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });

      bar.on('mouseover', function () {
        var data = this.__data__;
        floatTag.html(type === 'value' ? d3.format(',')(data.value) : d3.format('.2%')(data.value));
        floatTag.css({"visibility" : "visible"});
      });
      bar.on('mouseout', function () {
        floatTag.css({"visibility" : "hidden"});
      });
    };
    render();
  };
});
