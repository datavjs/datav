/*
初始化地图图层 形成高德地图和svg边界混合的地图组件
*/
!(function (root) {

  function Tile (container) {
    this.container = $(container);
    this.tileIndex = 0;
    this.curTileStyle = '';
    
    this.initTileStyles();
    this.tile();
  };

////////////////////////////////////////////////地图底图部分///////////////////////////////////////////////
  
  function tilelayer(url){
    return function(){
      return new AMap.TileLayer({tileSize:256,tileUrl: url}); 
    }
  }

  Tile.prototype.initTileStyles = function () {
    var tileStyles = this.tileStyles = {};
    //白色底图
    tileStyles.white = tilelayer("http://t.mapabc.com/maptile?t=2&x=[x]&y=[y]&z=[z]");
    //黑色底图  
    tileStyles.black = tilelayer("http://t.mapabc.com/maptile?t=3&x=[x]&y=[y]&z=[z]");
    //卫星底图
    tileStyles.satellite = tilelayer("http://webst01.is.autonavi.com/appmaptile?style=6&x=[x]&y=[y]&z=[z]");
    //路网图层
    tileStyles.road = function(){return new AMap.TileLayer.RoadNet({zIndex:10});}
    //mapbox灰色卫星地图
    tileStyles.white2 = tilelayer("http://c.tiles.mapbox.com/v3/stamen.trees-cabs-crime/[z]/[x]/[y].png");
    //
    tileStyles.satelliteBlack = tilelayer("https://b.tiles.mapbox.com/v3/mapbox.blue-marble-topo-bathy-jul-bw/[z]/[x]/[y].png");
    //mapbox灰色地图
    tileStyles.cartoon = tilelayer("http://a.tile.stamen.com/watercolor/[z]/[x]/[y].jpg");
    //stamen的卡通风格地图 Creative Commons Attribution (CC BY 3.0) license.
    tileStyles.blackWhite = tilelayer("http://d.tile.stamen.com/toner/[z]/[x]/[y].png");
    //stamen的黑白风格地图 Creative Commons Attribution (CC BY 3.0) license.
    
    
    this.curTileStyle = tileStyles.satelliteBlack(); //默认图层
    this.tileStylesList = ['satelliteBlack','blackWhite','cartoon','white','black','road','satellite'];
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
    this.map.setZoom(5);
  };

  Tile.prototype.tileStyle = function (n) {
    this.tileName = tileName = (isNaN(n))?n:this.tileStylesList[n];
    var curTileStyle = this.curTileStyle = this.tileStyles[tileName]();
    this.map.setDefaultLayer(curTileStyle);
  };

  Tile.prototype.nextTileStyle = function () { //切换
    var tileIndex = this.tileIndex = (this.tileIndex + 1) % (this.tileStylesList.length);
    var tileName = this.tileStylesList[tileIndex];
    this.tileStyle(tileName);
  };

  Tile.prototype.addTile = function (tileIndex) {
    this.tileName = tileName = (isNaN(n))?n:this.tileStylesList[n];
    var curTileStyle = this.curTileStyle = this.tileStyles[tileName]();
    curTileStyle.setMap(this.map);
  };

  root.Tile = Tile;
})(window);