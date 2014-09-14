/**
 * Class legend, chart legend
 */
//legend
var legend = $('<div class="legend"></div>');
var legendHideIndex = {};
var filterLine = function () {
  var $this = $(this);
  var index = $this.data('index');
  if ($this.hasClass('hide')) {
    $this.removeClass('hide');
    $('.' + prefix + index).show();
    legendHideIndex[index] = false;
  } else {
    $this.addClass('hide');
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
data.forEach(function (d) {
  var span = $('<span/>')
    .css('border-color', getColor(d.name))
    .html(d.name)
    .data('index', d.index);
  span.on('click', filterLine);
  span.appendTo(legend);
});
$(container).append(legend);