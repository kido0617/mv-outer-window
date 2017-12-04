(function(){
  //タイトル画面ぶっ飛ばして、デベロッパーツールをデフォで出すやつ

  var start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    start.call(this);
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Map);
        
    if(Utils.isNwjs()){
      var nwGui = require('nw.gui');
      const nwWindow = nwGui.Window.get();
      var os = require('os');
      if(os.type() == 'Darwin'){
        var nativeMenuBar = new nwGui.Menu({ type: "menubar" });
        nativeMenuBar.createMacBuiltin("My App");
        nwWindow.menu = nativeMenuBar;
      }
      const devTool = nwWindow.showDevTools();
      devTool.moveTo(20, 20);
      devTool.resizeTo(550, 400);
      nwWindow.focus();
    }
  };

})();

