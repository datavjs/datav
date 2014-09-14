DataV.js

## Get Start

get code and install

```sh
git clone git@github.com:datavjs/datav.git
cd datav
make install
```

start server
```sh
bin/start
```

访问命令行提供的网址，开始开发浏览吧

生成文档:

```
make doc
```

运行测试
```
make test
```


## Architecture

datav 总体分为两层

  - demos  展示层，负责demo用户
  - src    源码层，各种类型的报表在这里产出

```
src下，又分为两层:
  - /charts
    图标层，各种多样性的图表，实现在这里面.
    这层是图表的组装层, 各种形状的图表，源码都在这里
  - /...
    基础层，各种组件、小物件、底层库 等等
    这层用来构建charts层， 抽象更小的部分，让charts层的编写更方便
```

```
/src
  - /core     核心小模块
  - /format   各种格式化工具
  - /layout   各种布局工具
  - /legend   各种图例的实现
  - /tip      各种tip的实现
```

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
