exports.run = function () {
  console.log('this is test.js');
};

exports.createIframe = function () {
  document.body.innerHTML = '<iframe id="test" src="http://www.taobao.com"></iframe>';
};

exports.setCookie = function (cookie) {
  document.cookie = cookie;
};

exports.getCookie = function () {
  return document.cookie;
};