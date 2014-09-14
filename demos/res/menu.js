var $ = require('jquery');
var Event = require('core/event');
/** create left menu */
function Menu(cfg) {
  this.config = cfg;
  this.container = cfg.container;
  this.init();
}

Event.extend(Menu, {
  init: function () {
    var self = this;
    this.createView();
    this.container.on('click', 'a', function (evt) {
      var isGroup = $(this).attr('type') === 'group';
      var path = $(this).attr('data');
      self.emit('item_click', {
        isGroup: isGroup,
        path: path,
        name: $(this).text()
      })
      evt.preventDefault();
      evt.stopPropagation();
    });
  },
  clickItem: function (chart) {
    if (!chart) return;
    this.container.find('a[data]').each(function () {
      if ($(this).attr('data') === chart) {
        $(this).trigger('click');
      }
    });
  },
  createView: function () {
    var data = this.config.menus;
    var group;
    var html = ['<h3><a href="javascript:;" data="all" type="group">Preview</a></h3>'];
    for (var i in data) {
      group = data[i];
      html.push('<h3><a href="javascript:;" data="' + i + '" type="group">', i, '</a></h3>');
      html.push('<ul class="group">')
      group.forEach(function (n) {
        html.push('<li title="' +  n.description + '"><a href="javascript:;" data="' + n.path + '">', n.name, '</a></li>');
      });
      html.push('</ul>');
    }
    this.container.html(html.join(''));
  }
});

module.exports = Menu;
