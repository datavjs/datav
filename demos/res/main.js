var $ = require('jquery');
var Menu = require('./menu');
var Router = require('core/router');
var Preview = require('./preview');

var menu;

function initMenu(path) {
  $.ajax({
    url: '/api/charts_list',
    type: 'GET',
    dataType: 'json',
    success: function (res) {
      if (res.error) {
        return alert('get charts list error');
      }
      menu = new Menu({
        container: $('.menu'),
        menus: res.data
      });

      menu.on('item_click', function (evt) {
        var isGroup = evt.isGroup;
        if (isGroup) {

        } else {
          loadChart(evt);
        }
      });
      path && menu.clickItem(path);
    }
  })
}

var currentChart = null;
function loadChart(obj) {
  $('.main .detail').show();
  $('.main .group').hide();
  $('#preview_title').text(obj.name);
  async(obj.path, function (chart) {
    currentChart = chart;
  });
  updateHash(obj);
}
function previewGroup(obj) {
  $('.main .detail').hide();
  $('.main .group').show();
  updateHash(obj);
}

function updateHash(obj) {
  Router.update({path: obj.path});
}

$(function () {
  Router.init({
    type: 'hash',
    accessKeys: {
      path: /^(\/\w+)+(\.js)?$/
    }
  });
  var r = Router.get();
  initMenu(r.path);
})
