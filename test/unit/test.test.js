var testMod = require('../../src/test.js');
var expect = require('expect.js');

describe('src/test.js', function () {

  describe('test.createIframe()', function () {
    it('shoud detect iframe element in body', function () {
      testMod.createIframe();
      var node = $('iframe');
      expect(node.length).to.be(1);
    });
  });

  describe('test cookie ', function () {
    it('should ok when setCookie', function () {
      testMod.setCookie('a=1');
      testMod.setCookie('b=2');
    });
    it('should ok when get Cookie', function () {
      var cookie = testMod.getCookie();
      expect(cookie).to.be('a=1; b=2');
    });
  });

});