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
})('StackTwoType', function () {
  return function (config) {
    this.config = config;
    //  4 params must need
    var container = typeof config.container === 'string' ? document.getElementById(config.container) //id
      : config.container; // dom node
    var data = config.data || [
        { name: '海飞丝',
          children: [
            {"name":"尼尔森零研", "value":8167},
            {"name":"尼尔森电商", "value":1492},
            {"name":"淘宝天猫", "value":2782}
          ]
        },
        { name: '沙宣',
          children: [
            {"name":"尼尔森零研", "value":167},
            {"name":"尼尔森电商", "value":492},
            {"name":"淘宝天猫", "value":782}
          ]
        },
        { name: '爱茉莉',
          children: [
            {"name":"尼尔森零研", "value":7167, "color": 'blue'},
            {"name":"尼尔森电商", "value":1492, "color": 'gray'},
            {"name":"淘宝天猫", "value":2782, "color": 'red'}
          ]
        }
      ];
    var color = config.color;
    var type = config.type || 'value'; // 'value' or 'ratio'
    var width = config.width || $(container).width() || 960;
    var height = config.height || $(container).height() || 500;
    var margin = config.margin || {top: 20, right: 20, bottom: 50, left: 100};

    var getColor = color ? d3.scale.ordinal().range(color) : d3.scale.category10();

    this.setSource = function (sourceData) {
      data = sourceData;
    };

    this.setOptions = function (config) {
      type = config.type || type;
      width = config.width || width;
      height = config.height || height;
      margin = config.margin || margin;
      color = config.color || color;
      getColor = color ? d3.scale.ordinal().range(color) : getColor;
    };

    var processData = this.processData = function (data) {
      data.forEach(function (d, i) {
        d.total = d3.sum(d.children, function (d) { return d.value; });
        if (d.total < 0.000001) {
          d.total = 0.000001;
        }
        d.index = i;
        //d.v = type === 'value' ? d.total : 1;
      });
      if (type === 'value') {
        data.forEach(function (d) {
          var sum = 0;
          d.children.forEach(function (c) {
            c.h = sum;
            sum += c.value;
            c.v = c.value;
            c.group = d;
            c.color = c.color || getColor(c.name);
          });
        });
      } else {
        data.forEach(function (d) {
          var sum = 0;
          d.children.forEach(function (c) {
            c.h = sum;
            sum += c.value / d.total;
            c.v = c.value / d.total;
            c.group = d;
            c.color = c.color || getColor(c.name);
          });
        });
      }
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
      $(container).addClass('stack-two-type');
      $(container).css('position', 'relative').append(floatTag);
      processData(data);
      var w = width - margin.left - margin.right,
          h = height - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .domain(data.map(function(d) { return d.index; }))
          .rangeRoundBands([0, w], .5);

      var y = d3.scale.linear()
          .domain([0, type === 'value' ? d3.max(data, function(d) { return d.total; }) : 1]).nice()
          .range([h, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat(function (d, i) { return data[i].name; });

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
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
        .enter().append('g').selectAll(".bar")
          .data(function (d) { return d.children;})
        .enter().append("rect")
          .attr("class", "bar")
          .attr("fill", function (d) {
            return d.color; })
          .attr("x", function(d) { return x(d.group.index); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {
            console.log(d.h, d.h + d.v); return y(d.h + d.v); })
          .attr("height", function(d) {
           console.log(d.v); return y(d.h) - y(d.h + d.v); });

      bar.on('mouseover', function () {
        var data = this.__data__;
        var prefix;
        var html = '';
        html += data.group.name + '<br>';
        data.group.children.slice().reverse().forEach(function (d) {
          html += '<div style="position: relative;color:' + (data.name === d.name ? '#000' : 'gray') + '">' +
                    '<span class="float-tag-point" style="background-color:' + d.color + ';"></span>' +
                    '<span class="float-tag-name">' + d.name + '</span>' +
                    '<span class="float-tag-value">' + d3.format(type === 'value' ? ',' : '.2%')(d.v) + '</span>' +
                  '</div>' +
                  '<div style="clear:both;"></div>';
        });
        floatTag.html(html);
        floatTag.css({"visibility" : "visible"});
      });
      bar.on('mouseout', function () {
        floatTag.css({"visibility" : "hidden"});
      });

      //legend
      var legend = $('<div class="legend"></div>');
      data[0].children.forEach(function (d) {
        $('<span/>').css('border-color', d.color).html(d.name).appendTo(legend);
      });
      $(container).append(legend);

    };
  };
});

