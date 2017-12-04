/*---------------------------------------------------------------------------*
 * 2017/12/07 kido0617
 * http://kido0617.github.io/
 * Ver.1.0
 * License MIT
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc aa
 * @author kido061
 *
 * @param windowPath
 * @desc 
 * @default 
 *
 * @help
 *  see
 */


(function(){

  //フルスクリーン防止
  Graphics._switchFullScreen = function() {
  };

  var parameters = PluginManager.parameters('OuterWindow');
  var windowPath = String(parameters['windowPath'] || null);
  
  if(Utils.isNwjs()){
    //win,mac

    var gui = window.require('nw.gui');
    var win = gui.Window.get();
    win.on('closed', function() {
      for(var key in OuterWindow.windows){
        if(OuterWindow.windows[key]) OuterWindow.windows[key].close();
      }
    });

    window.OuterWindow = {
      windows: {}
    };
    
    OuterWindow.show = function(param){
      if(OuterWindow.windows[param.id]){
        console.error("already exist");
        return;
      }
      var newWin = gui.Window.open(windowPath + "/" + param.html + ".html", {
        resizable: false,
        toolbar: false,
        frame: false, 
        show_in_taskbar: false,
        transparent: param.transparent !== false,
      });
      newWin.on('loaded', function() {
        newWin.window.initNw(win, param.x, param.y, param.width, param.height);
        win.focus();
      });
      
      OuterWindow.windows[param.id] = newWin;
    };
    OuterWindow.remove = function(id){
      if(OuterWindow.windows[id]){
        OuterWindow.windows[id].close();
        OuterWindow.windows[id] = null;
      }
    };

    OuterWindow.getWindowLeft = function(){
      return win.x;
    };
    OuterWindow.getWindowTop = function(){
      return win.y;
    };

  }else{
    //ブラウザ版
    window.OuterWindow = {windows: {}};
    var body = document.querySelector("body");
    OuterWindow.show = function(param){
      if(OuterWindow.windows[param.id]){
        console.error("already exist");
        return;
      }
      var iframe = document.createElement('iframe');
      iframe.setAttribute("src", windowPath + "/" + param.html + ".html");
      iframe.outerWindowParam = param;
      iframe.style.width = param.width + "px";
      iframe.style.height = param.height + "px";
      iframe.style.position = "absolute";
      iframe.setAttribute("frameborder", "0");
      setIframePosition(iframe);
      body.appendChild(iframe);
      OuterWindow.windows[param.id] = iframe;
    };
    var setIframePosition = function(iframe){
      if(!iframe) return;
      var canvas = Graphics._upperCanvas;
      iframe.style.left = canvas.offsetLeft + iframe.outerWindowParam.x + "px";
      iframe.style.top = canvas.offsetTop + iframe.outerWindowParam.y + "px";
    };
    OuterWindow.remove = function(id){
      if(OuterWindow.windows[id]){
        OuterWindow.windows[id].parentNode.removeChild(OuterWindow.windows[id]);
      }
      OuterWindow.windows[id] = null;
    };
    window.onresize = function () {
      for(var key in OuterWindow.windows){
        setIframePosition(OuterWindow.windows[key]);
      }
    };

    OuterWindow.getWindowLeft = function(){
      return Graphics._upperCanvas.offsetLeft
    };
    OuterWindow.getWindowTop = function(){
      return Graphics._upperCanvas.offsetTop;
    };

  }

  



})();