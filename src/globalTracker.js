var addGlobalListener = function(variableName, eventType, tagId) {
  if(document.xsyGlobal[variableName] == undefined){
    let handler = {};
    let e = document.getElementById(tagId);
    if(eventType == 'link')
      handler.set = function(obj, prop, value){
        let href = value;
        if(href == undefined)
          href = e.href;
        let matcher = new RegExp('\.([a-zA-Z0-9]+)$');
        let matchs = href.match(matcher);
        let type = 'n/a'
        if(matchs && matchs[1]){
          type = matchs[1];
          console.log('finded');
          console.log(matchs);
        }
        window.snowplow('trackStructEvent', 'link', 'download', tagId, e.href, type);
        console.log('emit click signal for ' + tagId + " link:" + e.href + " type:" + type);
      };
    else if(eventType == 'click'){
      handler.set = function(obj, prop, value){
        
      };
    }
    else if(eventType == 'form'){
      handler.set = function(obj, prop, value){

      };
    }
    else{
      handler.set = function(obj, prop, value){

      };
    }

    document.xsyGlobal[variableName] = new Proxy({}, handler);
    console.log('added Listener');
    return true;
  }
  else{
    console.log('adding Listener');
    return false;
  }
}

var removeGlobalListener = function(variableName) {
  delete document.xsyGlobal[variableName];
}

var editGlobalListener = function(variableName, eventType, tagId) {
  if(document.xsyGlobal[variableName] != undefined){
    console.log('adding Listener')
    return true;
  }
  else{
    console.log('Listener does not exists')
    return false;
  }
}
