/*
初始化地图图层 形成高德地图和svg边界混合的地图组件
*/
!(function (root) {

  function Tile (container) {
    this.container = $(container);
    this.tileIndex = 0;
    this.curTileStyle = '';
    this.tileStyles = [];
    
    this.initTileStyles();
    this.tile();
  };

////////////////////////////////////////////////地图底图部分///////////////////////////////////////////////

  Tile.prototype.initTileStyles = function () {
    var tileStyles = this.tileStyles = [];
    //白色底图
    var whiteTile = tileStyles[0] = new AMap.TileLayer({
      tileUrl: "http://t.mapabc.com/maptile?t=2&x=[x]&y=[y]&z=[z]"
    }); 
    //黑色底图  
    var darkTile = tileStyles[1] = new AMap.TileLayer({
      tileUrl: "http://t.mapabc.com/maptile?t=3&x=[x]&y=[y]&z=[z]"
    });
    //卫星底图
    var satelliteTile = tileStyles[2] = new AMap.TileLayer.Satellite();
    //路网图层
    var roadTile = tileStyles[3] = new AMap.TileLayer.RoadNet();
    this.curTileStyle = whiteTile; //默认图层
  };

  Tile.prototype.tile = function () {
    //渲染地图 设置为 平滑移动 可滚轮放大 禁止双击放大
    var mapID = this.container.attr('id');
    window.mapObj =
    this.map = new AMap.Map(mapID, {
      zoomEnable: true,
      keyboardEnable: false,
      doubleClickZoom: false,
      scrollWheel: true,
      dragEnable: true,
      jogEnable: true,
      animateEnable: true,
      continuousZoomEnable: true,
      scrollWheel: true,
      defaultLayer: this.curTileStyle,
      center: new AMap.LngLat(103, 36)
    });
    this.map.setZoom(4);
  };

  Tile.prototype.tileStyle = function (tileIndex) {
    this.tileIndex = tileIndex;
    var curTileStyle = this.curTileStyle = this.tileStyles[tileIndex];
    console.log(this,this.map)
    this.map.setDefaultLayer(curTileStyle);
  };

  Tile.prototype.nextTileStyle = function () { //切换
    this.tileIndex = (this.tileIndex + 1) % (this.tileStyles.length);
    console.log(this.tileIndex)
    this.tileStyle(this.tileIndex);
  };

  root.Tile = Tile;
})(window);