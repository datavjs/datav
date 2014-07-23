document.getElementById("msg").innerHTML = "hello, Cube";
document.getElementById("show").value = document.getElementById("initscript").innerHTML;
exports.run = function () {console.log("app started!")};

var test = require('datav/test');
test.run();