var Line = require('datav/charts/line/line_basic');
var $ = require('jquery');

var dataList = [
  {
    name: 'group1',
    data: [
      {date: "2014-08-08", value: 1},
      {date: "2014-08-09", value: 2},
      {date: "2014-08-10", value: 3},
      {date: "2014-08-11", value: 4},
      {date: "2014-08-12", value: 5},
      {date: "2014-08-13", value: 3},
      {date: "2014-08-14", value: 2},
      {date: "2014-08-15", value: 5},
      {date: "2014-08-16", value: 1},
      {date: "2014-08-17", value: 1}
    ],
  },
  {
    name: 'group2',
    data: [
      {date: "2014-08-08", value: 4},
      {date: "2014-08-09", value: 5},
      {date: "2014-08-10", value: 7},
      {date: "2014-08-11", value: 8},
      {date: "2014-08-12", value: 3},
      {date: "2014-08-13", value: 6},
      {date: "2014-08-14", value: 7},
      {date: "2014-08-15", value: 3},
      {date: "2014-08-16", value: 5},
      {date: "2014-08-17", value: 2},
      {date: "2014-08-18", value: 7}
    ]
  }
];

$('#preview_chart').empty();
var line = new Line($('#preview_chart'), {
  'width': 800,
  'height': 200,
  'yTickNum': 9,
  'min': 0
});
line.render(dataList);

module.exports = line;
