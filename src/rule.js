//The input of isTrack function is document.location
//Use any methods you want to decide if this page needed to be track.
//If this page should be tracked, then return true;
var isTrack = function(location) {
  console.log("this is add-on js:" + location.pathname);
  //return location.pathname == '/';
  return true;
}

var setupTrackVariables = function(){

}
