DataV.js

## Architecture

```
/bin
/src  |
      | - core
      | - util
      | - ......

/demo |
/test |
```



从数据到图的几个步骤，待补充大图。。。

## Getting Start

```sh
npm install -g node-cube
cd datav
make install
cube start demo // then visit the webpage list in the cmdline
```

cube从demo目录启动，对应每个chart自己的demo，在demo目录下建立case
引用方法参考 demos/main.js

test/unit 存放chart的测试case

## Coding Style

* node风格，require机制
* sublime配置jshint, 设置保存时校验
* 2空格缩进
* 文件描述， git hook 自动添加头信息： license, file description, author, create date
* 文档注释

其他细节

* css 请不要使用超长前缀namespace，这个事情交给less等工具来完成

### release module

```sh
npm install datav
```

## Test

基于node的完成测试，mocha + expect.js + jQuery + jsdom + jscoverage
同时也支持浏览器端跑test case

图表测试包含

## License

comming soon
