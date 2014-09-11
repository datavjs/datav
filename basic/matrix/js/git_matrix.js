;(function (exports) {
  var GitMatrix = exports.GitMatrix = function (container, options) {
    this.container = container;

    var defaults = {};
    defaults.renderMode = options.renderMode || "divMode";
    defaults.gridSize = options.gridSize || 20;
    defaults.textList = options.textList || ["0", "1", "2", "3"];
    defaults.xTextList = options.xTextList || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    defaults.startDate = options.startDate || new Date("2014-08-01");
    defaults.endDate = options.endDate || new Date();
    defaults.click = options.click || function (e, data) {;};
    defaults.mouseover = options.mouseover || function (e, data) {;};
    defaults.mouseout = options.mouseout || function (e, data) {;};
    defaults.touchstart = options.touchstart || function (e, data) {;};
    defaults.touchend = options.touchend || function (e, data) {;};
    this.defaults = defaults;

    Date.prototype.getWeek = function() {
      return Math.ceil((((this - startDate) / 86400000) + startDate.getDay() + 1) / 7);
    };
  };

  GitMatrix.prototype.loadData = function (data) {
    if (!data || data.length === 0) {
      return false;
    }

    var container = this.container;
    var conf = this.defaults;
    var startDate = conf.startDate;
    var endDate = conf.endDate;
    var gridSize = conf.gridSize;

    var dDays = parseInt((endDate - startDate) / 1000 / 60 / 60 /24) + 1;
    var source = [];
    var startWeek = startDate.getWeek();
    var date = new Date(startDate.valueOf());
    for (var i = 0; i < dDays; i++) {
      var day = date.getDay() + 1;
      var week = date.getWeek() - startWeek + 1;
      source.push({"week": week, "day": day, "value": 0, "id": i});
      date.setDate(date.getDate() + 1);
    }
    
    function setData (item) {
      var date = new Date(item[0].toString());
      var dDay = parseInt((date - startDate) / 1000 / 60 / 60 /24);
      if (dDay < source.length) {
        source[dDay].value = item[1];
      }
    }

    for (var i = 0; i < data.length; i++) {
      setData(data[i]);
    }

    var width = (endDate.getWeek() - startDate.getWeek() + 1) * gridSize;
    var height = 7 * gridSize;
    var areaColors = ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'];

    var dom = $("#" + container);
    var xTextNode = $('<div>').css({
      "width": gridSize + width,
      "height": gridSize
    });
    var yTextNode = $('<div></div>').css({
      "position": "relative",
      "float": "left",
      "width": gridSize,
      "height": height,
      "margin-left": "5px",
      "margin-right": "0px"
    });

    var week = ["M", "W", "F"];
    for (var i = 0; i < week.length; i++) {
      var list = $('<p></p>').css({
        "width": gridSize,
        "height": gridSize,
        "margin-top": gridSize + 1,
        "margin-bottom": gridSize + 1,
        "color": "#eee",
        "font-size": "8px"
      });
      list.html(week[i]);
      yTextNode.append(list);
    }

    var containerName = container + "_git_matrix";
    var chart = $('<div id="' + containerName + '"></div>').css({
      "position": "relative",
      "float": "left"
    });
    dom.append(xTextNode);
    dom.append(yTextNode);
    dom.append(chart);

    var renderMode = conf.renderMode;
    var matrix;
    var matrixOptions = {
      "width": width,
      "height": height,
      "gridSize": gridSize,
      "areaColors": areaColors,
      "getX": function (d) { return (d.week - 1) * gridSize; },
      "getY": function (d) { return (d.day - 1) * gridSize; },
      "getColor": function (d) { return areaColors[d.value % areaColors.length]; }
    };
    if (renderMode === "svgMode") {
      matrix = new Chart.MatrixSvg(containerName, matrixOptions);
    } else {
      matrix = new Chart.MatrixDiv(containerName, matrixOptions);
    }
    matrix.loadData(source);

    this.matrix = matrix;
    this.xTextNode = xTextNode;
  };

  GitMatrix.prototype.render = function (callback) {
    this.matrix.render(callback);

    var conf = this.defaults;
    var startDate = conf.startDate;
    var endDate = conf.endDate;
    var textList = conf.textList;
    var gridSize = conf.gridSize;
    var xTextList = conf.xTextList;
    var rectNode = $(".rect");
    var container = this.container;
    var dom = $("#" + container);
    var xTextNode = this.xTextNode;

    function addMonthText (month, left) {
      var list = $('<p></p>').css({
        "position": "absolute",
        "width": gridSize,
        "height": gridSize,
        "margin": 0,
        "left": left + gridSize,
        "text-align": "center",
        "color": "#aaa",
        "font-size": "8px"
      });
      list.html(xTextList[month]);
      xTextNode.append(list);
    }

    function addTitle (rectNode, context) {
      rectNode.attr("title", context);
    }

    var month = startDate.getMonth();
    addMonthText(month, 5);

    rectNode.each(function (d) {
      var node = $(this);
      var info = node.data("info");
      var days = info.id;
      var value = info.value;
      var date = new Date(startDate.valueOf());
      date.setDate(date.getDate() + days);
      var thisMonth = date.getMonth();
      if (thisMonth !== month) {
        month = thisMonth;
        var left = node.parent().position().left || node.position().left;
        addMonthText(month, left + 5);
      }

      var context = date.toDateString() + "\n" + (textList[value] || "");
      addTitle(node, context);
    });

    var click = conf.click;
    var mouseover = conf.mouseover;
    var mouseout = conf.mouseout;

    dom.on('click', function (e) {
      var target = $(e.target);
      var info = target.data('info');
      click(e, info);
    });
    dom.on('mouseover', function (e) {
      var target = $(e.target);
      var info = target.data('info');
      mouseover(e, info);
    });
    dom.on('mouseout', function (e) {
      var target = $(e.target);
      var info = target.data('info');
      mouseout(e, info);
    });
  };
})(window.Chart = window.Chart || {});
