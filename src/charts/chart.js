var Class = require('../core/class');

function Chart() {}

Chart.prototype.empty = function (msg) {
  msg = msg || '暂无数据';
  this.config.container.html('<div class="chart-empty">' + msg + '</div>');
};