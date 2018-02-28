//The input of isTrack function is document.location
//Use any methods you want to decide if this page needed to be track.
//If this page should be tracked, then return true;
var isTrack = (location) => {
  console.log("this is pageview rules param:" + location.pathname);
  rules = [
  //custom content area begin
  //custom content area end
  ]
  for(idx in rules) {
    if(rules[idx].test(location.pathname)){
      console.log('pageview rules found match')
      return true;
    }
  }
  return false;
}

//This is codeless tracker setup function
var setupGlobalTracker = () => {
  var globalTrackpairs = [
    //Example
    //{id:'triggerId', setting:{type:'eventType',targetId:'targetElementId'}}
    //custom content area begin
    //custom content area end
  ];

  var map = new Map();

  for(idx in globalTrackpairs){
    map.set(globalTrackpairs[idx].id, globalTrackpairs[idx].setting);
  }
  return map;
}
