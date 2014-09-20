var Line = require('datav/charts/line/line_basic');
var $ = require('jquery');
var d3 = require('d3');

var data = [
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
];

var valueExtent = d3.extent(data, function(d) { return d.value; });

var click = function (e, data) {
  console.log(data);
};

var mouseover = function (e, data) {
  console.log(data);
};

var line = new Line(('#preview_chart')[0], {
  'min': valueExtent[0],
  'max': valueExtent[1],
  'gridNum': 3
});
line.render(data);

module.exports = line;