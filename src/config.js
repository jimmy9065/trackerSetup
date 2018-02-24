//The input of isTrack function is document.location
//Use any methods you want to decide if this page needed to be track.
//If this page should be tracked, then return true;
var isTrack = (location) => {
  //custom content area begin
  console.log("this is add-on js:" + location.pathname);
  //return location.pathname == '/';
  return true;
  //custom content area end
}

//This is codeless tracker setup function
var setupGlobalTracker = () => {
  var globalTrackpairs = [
    //custom content area begin
    //Example
    //{id:'triggerId', setting:{type:'eventType',targetId:'targetElementId'}}
    {id:'testLink',setting:{type:'link', targetId:'testLink'}},
    {id:'testLinki',setting:{type:'link', targetId:'testLink'}},
    {id:'register2',setting:{type:'link', targetId:'register2'}},
    {id:'btn1',setting:{type:'btn', targetId:'btn1'}},
    {id:'player2',setting:{type:'video', targetId:'player2'}},
    //custom content area end
  ];

  var map = new Map();

  for(idx in globalTrackpairs){
    map.set(globalTrackpairs[idx].id, globalTrackpairs[idx].setting);
  }
  return map;
}
