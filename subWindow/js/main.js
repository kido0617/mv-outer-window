(function(){
    
  var isNwjs = function() {
    return typeof require === 'function' && typeof process === 'object';
  };
  if(isNwjs()){
    //Windows mac版のみ必要

    var nwGui = require('nw.gui');
    const win = nwGui.Window.get();

    //サブウィンドウのデバッグ情報はサブウィンドウ側でdev tool出さないと見えません。
    /*
    const devTool = win.showDevTools();
    devTool.moveTo(1000, 20);
    devTool.resizeTo(550, 400);
    */

    var defaultX, defaultY;

    window.initNw = function(parent, x, y, width, height){
      window.parentWindow = parent;
      defaultX = x;
      defaultY = y;
      win.x = parent.x + x;
      win.y = parent.y + y;
      win.width = width;
      win.height = height;
      parent.on("move", moveFunction);
    };

    var moveFunction = function(x, y){
      win.x = x + defaultX;
      win.y = y + defaultY;
    }

    //閉じたときにウィンドウ追従のイベントリスナーから除外
    win.on('closed', function() {
      parentWindow.removeListener("move", moveFunction)
    });

    //フォーカスされる必要ないのでフォーカスされたら強制的に親ウィンドウに戻す
    win.on('focus', function(){
      parentWindow.focus();
    });
  }
  
})();