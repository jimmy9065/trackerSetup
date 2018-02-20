var addGlobalListener = function(variableName, eventType, tagId) {
  if(document.xsyGlobal[variableName] == undefined){
    let handler = {};
    if(eventType == 'btn')
      handler.set = function(obj, prop, value){
        console.log('emit btn signal for ' + )
      };
    else if(eventType == 'video'){
      handler.set = function(obj, prop, value){

      };
    }
    else if(eventType == 'form'){
      handler.set = function(obj, prop, value){

      };
    }
    else if(eventType == 'unknown'){
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
