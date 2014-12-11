var SimpleLine = require('datav/charts/line/simple_line');
var $ = require('jquery');

var line = new SimpleLine({
  container: $('#preview_chart')[0]
});

var data = [
  { name: 'Taobao',
   data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  { name: 'Tmall',
   data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  },
  { name: 'Alipay',
   data: [20, 18, 2, 3, 7, 19, 29, 30, 10, 8]
  }
];

var xTicks = [
  '2014-01', '2014-02', '2014-03',
  '2014-04', '2014-05', '2014-06',
  '2014-07', '2014-08', '2014-09', '2014-10'
];

line.render(data, {xTicks: xTicks});


module.exports = line;