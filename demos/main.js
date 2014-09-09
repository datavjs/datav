var charts = {
  'Area': [
    {
      'name': 'areaChart',
      'description': 'Area Chart',
      'path': 'area/areaChart/index.html',
      'image': 'area/areaChart/thumbnail.png'
    }, {
      'name': 'bivariateAreaChart',
      'description': 'Bivariate Area Chart',
      'path': 'area/bivariateAreaChart/index.html',
      'image': 'area/bivariateAreaChart/thumbnail.png'
    }, {
      'name': 'stackedAreaChart',
      'description': 'Stacked Area Chart',
      'path': 'area/stackedAreaChart/index.html',
      'image': 'area/stackedAreaChart/thumbnail.png'
    }
  ],
  'Line': [
    {
      'name': 'lineChart',
      'description': 'Line Chart',
      'path': 'line/lineChart/index.html',
      'image': 'line/lineChart/thumbnail.png'
    }, {
      'name': 'nielsenLineChart',
      'description': 'Nielsen Line Chart',
      'path': '线图（绝对值、比例两种模式）/index.html',
      'image': '线图（绝对值、比例两种模式）/thumbnail.png'
    }, {
      'name': '线图单一图例（绝对值、比例两种模式）',
      'description': '线图单一图例（绝对值、比例两种模式）',
      'path': '线图单一图例（绝对值、比例两种模式）/index.html',
      'image': '线图单一图例（绝对值、比例两种模式）/thumbnail.png'
    }, {
      'name': 'multiLineChart',
      'description': 'Multi Line Chart',
      'path': 'line/multiLineChart/index.html',
      'image': 'line/multiLineChart/thumbnail.png'
    }
  ],
  'Bar': [
    {
      'name': 'barChart',
      'description': 'Bar Chart',
      'path': 'bar/barChart/index.html',
      'image': 'bar/barChart/thumbnail.png'
    }, {
      'name': 'stackedBarChart',
      'description': 'Stacked Bar Chart',
      'path': 'bar/stackedBarChart/index.html',
      'image': 'bar/stackedBarChart/thumbnail.png'
    }, {
      'name': 'normalizedStackedBarChart',
      'description': 'Normalized Stacked Bar Chart',
      'path': 'bar/normalizedStackedBarChart/index.html',
      'image': 'bar/normalizedStackedBarChart/thumbnail.png'
    }, {
      'name': 'groupedBarChart',
      'description': 'Grouped Bar Chart',
      'path': 'bar/groupedBarChart/index.html',
      'image': 'bar/groupedBarChart/thumbnail.png'
    }, {
      'name': 'negativeValueBarChart',
      'description': 'Bar Chart with Negative Values',
      'path': 'bar/negativeValueBarChart/index.html',
      'image': 'bar/negativeValueBarChart/thumbnail.png'
    }, {
      'name': '堆积图（绝对值、比例两种模式）',
      'description': '堆积图（绝对值、比例两种模式）',
      'path': '堆积图（绝对值、比例两种模式）/index.html',
      'image': '堆积图（绝对值、比例两种模式）/thumbnail.png'
    }, {
      'name': '堆积图 (渠道的品牌分布)',
      'description': '堆积图 (渠道的品牌分布)',
      'path': '堆积图 (渠道的品牌分布)/index.html',
      'image': '堆积图 (渠道的品牌分布)/thumbnail.png'
    }
  ],
  'Scatter': [
    {
      'name': 'scatterplot',
      'description': 'Scatter plot',
      'path': 'scatter/scatterplot/index.html',
      'image': 'scatter/scatterplot/thumbnail.png'
    }, {
      'name': '尼尔森气泡',
      'description': '尼尔森气泡',
      'path': '尼尔森气泡/index.html',
      'image': '尼尔森气泡/thumbnail.png'
    }, {
      'name': '尼尔森气泡（x轴绝对值、比例双模式）',
      'description': '尼尔森气泡（x轴绝对值、比例双模式）',
      'path': '尼尔森气泡（x轴绝对值、比例双模式）/index.html',
      'image': '尼尔森气泡（x轴绝对值、比例双模式）/thumbnail.png'
    }
  ],
  'Pie': [
    {
      'name': 'pieChart',
      'description': 'Pie Chart',
      'path': 'pie/pieChart/index.html',
      'image': 'pie/pieChart/thumbnail.png'
    }, {
      'name': 'donutChart',
      'description': 'Donut Chart',
      'path': 'pie/donutChart/index.html',
      'image': 'pie/donutChart/thumbnail.png'
    }, {
      'name': 'animatedDonutChartWithLabels',
      'description': 'Animated Donut Chart with Labels',
      'path': 'pie/animatedDonutChartWithLabels/index.html',
      'image': 'pie/animatedDonutChartWithLabels/thumbnail.png'
    }, {
      'name': 'track',
      'description': 'track',
      'path': '轨道图单一图例（绝对值、比例两种模式）/index.html',
      'image': '轨道图单一图例（绝对值、比例两种模式）/thumbnail.png'
    }
  ],
  'Map': [
    {
      'name': 'worldMap',
      'description': 'worldMap(Stretched Projection)',
      'path': 'map/worldMap/index.html',
      'image': 'map/worldMap/thumbnail.png'
    }
  ]
};

/** create left menu */
function Menu(cfg) {
  this.config = cfg;
  this.container = cfg.container;
  this.init();
}

Menu.prototype.init = function () {
  this.createView();
};

Menu.prototype.createView = function () {
  var data = this.config.menus;
  var group;
  var html = ['<h3><a href="javascript:;">Preview</a></h3>'];
  for (var i in data) {
    group = data[i];
    html.push('<h3><a href="javascript:;">', i, '</a></h3>');
    html.push('<ul class="group">')
    group.forEach(function (n) {
      html.push('<li title="' +  n.description + '"><a href="javascript:;">', n.name, '</a></li>');
    });
    html.push('</ul>');
  }
  this.container.html(html.join(''));
};

function PreView(cfg) {
  this.config = cfg;
  this.container;
}
PreView.prototype.init = function () {

};
PreView.prototype.createView = function () {

};


var menu = new Menu({
  container: $('.menu'),
  menus: charts
})