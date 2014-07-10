//绝对值 比例两种状态
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
})('LineWithSingleLegend', function () {
  var LineWithSingleLegend = function (config) {
    this.config = config;
    //  4 params must need
    var container = typeof config.container === 'string' ? document.getElementById(config.container) //id
      : config.container; // dom node
    var data = config.data || [
      { name: '尼尔森零研',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      { name: '尼尔森电商',
        data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      },
      { name: '淘宝天猫',
        data: [20, 18, 2, 3, 7, 19, 29, 30, 10, 8]
      }
    ];
    var color = config.color;
    var type = config.type || 'value'; // 'value' or 'ratio'
    var width = config.width || $(container).width() || 960;
    var height = config.height || $(container).height() || 500;
    var margin = config.margin || {top: 20, right: 20, bottom: 50, left: 100};
    var xTickTitles = config.xTickTitles;
    if (!xTickTitles) {
      xTickTitles = data[0].data.map(function (d, i) {
        return '';
      });
    }
    var points;
    var nameIndexHash = {};
    var legendHideIndex = {};

    var prefix = 'line-with-single-legend-' + (new Date().getTime()) + '-';

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
      xTickTitles = config.xTickTitles || xTickTitles;
      getColor = color ? d3.scale.ordinal().range(color) : getColor;
    };

    var processData = this.processData = function (data) {
      points = [];
      nameIndexHash = {};
      data.forEach(function (d, i) {
        d.index = i;
        nameIndexHash[d.name] = i;
        d.data.forEach(function (c, j) {
          points.push({
            name: d.name,
            value: c,
            index: j,
            lineIndex: i
          });
        });
      });
    };

    var getYRange = function (data) {
      var min = d3.min(data, function(d) {
        return d3.min(d.data);
      });
      var max = d3.max(data, function(d) {
        return d3.max(d.data);
      });
      var d = max - min;
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
      $(container).addClass('line-with-single-legend');
      $(container).css('position', 'relative').append(floatTag);
      processData(data);
      var w = width - margin.left - margin.right,
          h = height - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .domain(xTickTitles.map(function(d, i) { return i; }))
          .rangeRoundBands([0, w], .5);

      var y = d3.scale.linear()
          .domain(getYRange(data)).nice()
          .range([h, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat(function (d, i) { return xTickTitles[i]; });

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
      var linePath = function (d) {
        var p = '';
        d.data.forEach(function (d, i) {
          p += i === 0 ? 'M' : 'L';
          p += (x(i) + x.rangeBand() / 2) + ' ' + y(d);
        });
        return p;
      };

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
          .attr("transform", "translate(0,0)")
          .call(yAxis);

      var line = svg.selectAll(".line")
          .data(data)
        .enter().append("path")
          .attr("class", function (d) { return 'line ' + prefix + d.index; })
          .attr("d", linePath)
          .attr("stroke", function (d) { return getColor(d.name); });

      var mouseLine = svg.append("path")
          .attr('class', 'mouse-line')
          .attr('d', 'M0,0V' + h);

      var p = svg.selectAll(".circle")
          .data(points)
        .enter().append("circle")
          .attr("class", function (d, i) { return 'circle ' + prefix + d.lineIndex + ' ' + 'circle-column-' + (i % data[0].data.length); })
          .attr("cx", function (d) { return x(d.index) + x.rangeBand() / 2; })
          .attr("cy", function (d) { return y(d.value); })
          .attr("r", 4)
          .attr("fill", function (d) { return getColor(d.name); });

      $(container).on('mousemove', (function () {
        var xRangeBand = x.rangeBand();
        var xRange = x.range().map(function (d) { return d + xRangeBand / 2; });
        var oldIndex = null;
        return function (e) {
          var offset = $(container).offset();
          if (!(e.pageX && e.pageY)) { return; }
          var x = e.pageX - offset.left,
              y = e.pageY - offset.top;
          var i, l;

          var hide = function () {
            if (oldIndex === null) {
              return;
            } else {
              // hide line
              // recover point
              // hide floatTag
              mouseLine.style('display', 'none');
              svg.selectAll('.circle-column-' + oldIndex)
                .attr('opacity', 1)
                .attr('r',4);
              floatTag.css({"visibility" : "hidden"});
            }
          };
          var show = function (index) {
            hide();
            //show line
            //highlight point
            //show floatTag
            mouseLine.style('display', 'inline')
              .attr('transform', 'translate(' + xRange[index] + ',0)');
            svg.selectAll('.circle-column-' + index)
              .attr('opacity', 0.8)
              .attr('r',8);

            var html = '';
            html += xTickTitles[index] + '<br>';
            data.forEach(function (d, i) {
              var c = d.data[index];
              html += '<div style="position: relative;">' +
                        '<span class="float-tag-point" style="background-color:' + getColor(d.name) + ';"></span>' +
                        '<span class="float-tag-name">' + d.name + '</span>' +
                        '<span class="float-tag-value">' + d3.format(type === 'value' ? ',' : '.2%')(c) + '</span>' +
                      '</div>' +
                      '<div style="clear:both;"></div>';
            });
            floatTag.html(html);

            floatTag.css({"visibility" : "visible"});
          };

          if (y < margin.top || y > h + margin.top) {
            hide();
            return;
          }
          x = x - margin.left;
          var index;
          for (i = 0, l = xRange.length; i < l; i++) {
            if (Math.abs(xRange[i] - x) <= xRangeBand / 2 / 0.5) {
              index = i;
              break;
            }
          }
          if (typeof index === 'undefined') {
            hide();
            oldIndex = null;
          } else {
            show(index);
            oldIndex = index;
          }
        };

      }()));

      this.troggleSingleLine = function (name) {
        var index = nameIndexHash[name];
        if (legendHideIndex[index] === true) {
          $('.' + prefix + index).show();
          legendHideIndex[index] = false;
        } else {
          $('.' + prefix + index).hide();
          legendHideIndex[index] = true;
        }
        var animate = function () {
          var filteredData = data.filter(function (d, i) {
            return !legendHideIndex[i];
          });
          y.domain(filteredData.length === 0 ? [0, 1] : getYRange(filteredData)).nice();
          var t = svg.transition().duration(750);
          t.select(".y.axis").call(yAxis);
          t.selectAll(".line").attr("d", linePath);
          t.selectAll(".circle").attr("cy", function (d) { return y(d.value); });
        };
        animate();
      };
    };
  };

  var NielsenLineLegend = LineWithSingleLegend.legend = function (config) {
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

    var Lines = []; // linewithsinglelegend component

    this.setSource = function (sourceData) {
      data = sourceData;
    };

    this.setOptions = function (config) {
      getColor = config.getColor || getColor;
    };

    this.addLine = function (line) {
      Lines.push(line);
    };

    var processData = this.processData = function (data) {
      data.forEach(function (d, i) {
        d.color = getColor(d.name);
      });
    };

    var render = this.render = function () {
      $(container).empty();
      $(container).addClass('line-with-single-legend');
      processData(data);
      //legend
      var legend = $('<div class="legend"></div>');
      data.forEach(function (d) {
        $('<span/>').css('border-color', d.color)
          .html(d.name)
          .data('name', d.name)
          .appendTo(legend);
      });
      $(container).append(legend);
      legend.on('click', 'span', function () {
        var name = $(this).data('name');
        console.log(name);
        Lines.forEach(function (d) {
          d.troggleSingleLine(name);
        });
      });
    };
  };

  return LineWithSingleLegend;
});
