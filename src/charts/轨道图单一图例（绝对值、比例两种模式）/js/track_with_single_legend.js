//多层圆环
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
})('TrackWithSingleLegend', function () {
  var TrackWithSingleLegend = function (config) {
    this.config = config;

    var container = typeof config.container === 'string' ? document.getElementById(config.container) //id
      : config.container; // dom node
    var data = config.data || [
      { name: '尼尔森零研',
        children: [
          {"name":"男", "value":8167},
          {"name":"女", "value":1492}
        ]
      },
      { name: '尼尔森电商',
        children: [
          {"name":"男", "value":167},
          {"name":"女", "value":492}
        ]
      },
      { name: '淘宝天猫',
        children: [
          {"name":"男", "value":867},
          {"name":"女", "value":192}
        ]
      }
    ];
    var width = config.width || $(container).width() || 960;
    var height = config.height || $(container).height() || 500;
    var margin = config.margin || {top: 5, right: 5, bottom: 5, left: 5};
    var getColor = config.getColor || d3.scale.category10();
    var outerRadius = config.outerRadius ||
          Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;
    var innerRadius = config.innerRadius || 20; // only used when there is too many tracks
    var trackWidth = config.trackWidth || 20;
    var centerWord = config.centerWord || '';

    var resetTrackWidth = function () {
      if (outerRadius - innerRadius < trackWidth * data.length && data.length > 0) {
        trackWidth = (outerRadius - innerRadius) / data.length;
      }
    };

    this.setSource = function (sourceData) {
      data = sourceData;
    };

    this.setOptions = function (config) {
      width = config.width || width;
      height = config.height || height;
      margin = config.margin || margin;
      getColor = config.getColor || getColor;
      outerRadius = config.outerRadius || outerRadius;
      innerRadius = config.innerRadius || innerRadius;
      trackWidth = config.trackWidth || trackWidth;
      centerWord = config.centerWord || centerWord;
    };

    var processData = this.processData = function (data) {
      data.forEach(function (d, i) {
        d.total = d3.sum(d.children, function (d) { return d.value; });
        if (d.total < 0.000001) {
          d.total = 0.000001;
        }
        d.index = i;
      });
      data.forEach(function (d, i) {
        var sum = 0;
        d.channel = i;
        d.children.forEach(function (c) {
          c.start = sum;
          sum += c.value / d.total;
          c.end = c.start + c.value / d.total;
          c.group = d;
          c.channel = i;
          c.color = c.color || getColor(c.name);
        });
      });
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

          // if (floatTagWidth + x + 2 * mouseToFloatTag.x <=  $(container).width()) {
          //     x += mouseToFloatTag.x;
          // } else {
          //     x = Math.max(1, x - floatTagWidth - mouseToFloatTag.x);
          // }
              x = Math.max(1, x - floatTagWidth - mouseToFloatTag.x * 2);
          //if (y >= floatTagHeight + mouseToFloatTag.y) {
              y = y - mouseToFloatTag.y - floatTagHeight;
          // } else {
          //     y += Math.min(mouseToFloatTag.y, $(container).height() - floatTagHeight);
          // }
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
      $(container).addClass('track-with-single-legend');
      $(container).css('position', 'relative').append(floatTag);
      processData(data);
      resetTrackWidth();
      var w = width - margin.left - margin.right,
          h = height - margin.top - margin.bottom;

      var trackLayout = d3.svg.arc()
        .innerRadius ( function (d) {
          return outerRadius - d.channel * trackWidth;
        })
        .outerRadius ( function (d) {
          return outerRadius - (d.channel+1) * trackWidth;
        })
        .startAngle ( function (d) {
          return d.start*2*Math.PI;
        })
        .endAngle ( function (d) {
          return d.end*2*Math.PI;
        });

      var svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var channel = svg.selectAll(".channel")
        .data(data)
      .enter().append("g")
        .attr("class", function (d) {
          return "channel c" + d.channel;
        });

      var backgroundTrack = channel.selectAll(".default-track")
        .data(function (d, i) {return [{"type": "default", "name": d.name, "start": 0, "end": 1, "channel": i }];})
      .enter().append("path")
        .attr("class", "default-track")
        .attr("d", trackLayout);

      var track = channel.selectAll("track")
        .data(function (d) {return d.children;})
      .enter().append("path")
        .attr("class", "track")
        .attr("d", trackLayout)
        .style("fill", function(d) { return getColor(d.name); });

      //centerword
      svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .text(centerWord);

      track.on('mouseover', function () {
        var data = this.__data__;
        var html = '';
        html += data.group.name + '<br>';
        data.group.children.forEach(function (d) {
            html += '<div style="position: relative;color:' + (d.name === data.name ? 'red' : 'gray') + '">' +
                  '<span class="float-tag-point" style="background-color:' + d.color + ';"></span>' +
                  '<span class="float-tag-name">' + d.name + '</span>' +
                  '<span class="float-tag-value">' + d3.format('.2%')(d.end - d.start) + '</span>' +
                  '<span class="float-tag-value">' + d3.format(',')(d.value) + '</span>' +
                '</div>' +
                '<div style="clear:both;"></div>';
        });
        floatTag.html(html);
        floatTag.css({"visibility" : "visible"});
      });
      track.on('mouseout', function () {
        floatTag.css({"visibility" : "hidden"});
      });

      backgroundTrack.on('mouseover', function () {
        var data = this.__data__;
        var html = '';
        html += data.name + '<br>';
        html += '暂无数据';
        floatTag.html(html);
        floatTag.css({"visibility" : "visible"});
      });
      backgroundTrack.on('mouseout', function () {
        floatTag.css({"visibility" : "hidden"});
      });

    };
  };

  TrackWithSingleLegend.Legend = function (config) {
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
      $(container).addClass('track-with-single-legend');
      processData(data);
      //legend
      var legend = $('<div class="legend"></div>');
      data.forEach(function (d) {
        $('<span/>').css('border-color', d.color).html(d.name).appendTo(legend);
      });
      $(container).append(legend);
    };
  };

  return TrackWithSingleLegend;
});


