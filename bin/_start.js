var path = require('path');
var cube = require('node-cube');
var express = require('express');
var base = path.dirname(__dirname);
var fs = require('fs');

var cubeProcessor = cube.init({
  root: path.join(base, 'demos'),
  router: '/',
  middleware: true,
  buildInModule: {'d3': true}
});

var app = express();
/**
 * 获取图标列表， 生成左侧导航菜单用
 */
app.get('/api/charts_list', function (req, res, next) {
  var dir = path.join(base, 'demos/charts');
  fs.readdir(dir, function (err, groups) {
    if (err) {
      return res.json({error: err.message});
    }
    var total = groups.length;
    var count = 0;
    var lists = {};

    function end(err, group, data) {
      if (err) {
        return res.json({error: err.message});
      }
      lists[group] = data;
      count ++;
      if (count >= total) {
        return res.json({data: lists});
      }
      each();
    }

    function each() {
      var g = groups[count];
      var p = path.join(dir, g);
      var charts = [];
      fs.readdir(p, function (err, list) {
        if (err) {
          return end(err);
        }
        list.forEach(function (v) {
          var stat = fs.statSync(p + '/' + v);
          if (stat.isDirectory()) {
            charts.push({
              name: v,
              path: '/charts/' + g + '/' + v,
              preview: 'charts/' + g + '/' + v + '/preview.png'
            });
          } else {
            var vs = v.replace(/\.\w+$/, '');
            charts.push({
              name: vs,
              path: '/charts/' + g + '/' + v,
              preview: 'charts/' + g + '/' + vs + '.png'
            });
          }
        });
        end(null, g, charts);
      });
    }
    each();
  });
});
app.use(cubeProcessor);

app.listen(1111);

console.log('');
console.log('========= datav dev server started ========');
console.log('visit: http://localhost:1111');
console.log('============================================');