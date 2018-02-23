function setupTracker(window,document,spURL,LeadURI,reportSubmitServer,appID) {
  var trackerCookieName  = "xsyTcookie";//Tracker's cookie name
  var xsyCookieName = "xsy_mc_tl";//XSY's cookie that is uesd to store the leadID
  var isNew = false;
  var requstCount = 0;
  
  document.xsyGlobal = {};
  setupTrackVariables();

  //*********************************************************
  //
  // Extrack the cookie content. If an appID is provided, it
  // will extract the leadID from the cookie.
  //
  //*********************************************************
  function getSpCookie(cookieName, appID) {
    var matcher;
    console.log(appID);
    if(appID == undefined){
      matcher = new RegExp(cookieName + 'id\\.[0-9a-z]+=([0-9a-z\-]+).*?');
    }
    else{
      matcher = new RegExp(cookieName + '=([^;]+);?');
    }
    var match = document.cookie.match(matcher);
    console.log(document.cookie);
    console.log(match);
    if (match && match[1])
      return match[1].split()[0];
    else
      return null;
  }

  //*********************************************************
  //
  // Extrack all the cookie that start with xsy_
  //
  //*********************************************************
  function getXsyCookie(){
    let matcher = RegExp(/(xsy_[a-z]+_[a-z]+=[^;]+;)/, 'g');
    let aCookies = [], sCookies = document.cookie, cookie;
    console.log('find all the cookies');
    while((cookie = matcher.exec(sCookies)) != null){
      console.log(cookie[1]);
      aCookies.push(cookie[1]);
    }

    console.log(aCookies.join(''));
    return aCookies.join('');
  }

  //*********************************************************
  //
  // Send GET request to retrieve the leadID
  // For the sever side, because this is an ajax request
  // CORS must be allowed
  //
  //*********************************************************
  function getLead(isNew, cookie, appId){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      console.log('state changed');
      console.log(xmlHttp.readyState);
      console.log(xmlHttp.status);
      if(xmlHttp.readyState == 4){
        if(xmlHttp.status == 200){
          var leadID = xmlHttp.responseText;
          window.snowplow('setUserId', leadID);
          document.cookie = xsyCookieName + "=" + leadID + ";max-age=63072000";
          console.log("get leadID=" + leadID);
        }
        else{
          console.log("somthing wrong");
          console.log("leadid=" + xmlHttp.responseText);
          if(requstCount < 3){
            console.log('count=' + requstCount);
            requstCount += 1;
            setTimeout(function(){
              xmlHttp.open('GET', LeadURI + 'isnew=' + isNew + '&ck=' + cookie + '&tid=' + appId, true);
              xmlHttp.send(null);
            }, 2000);
          }
        }
      }
    }

    xmlHttp.open('GET', LeadURI + 'isnew=' + isNew + '&ck=' + cookie + '&tid=' + appId, true);
    xmlHttp.send(null);
  }

  //*********************************************************
  //
  // callback function after sp.js is loaded.
  // If there is no XSY cookie exists, it will use getLead
  // to request a LeadID
  //
  //*********************************************************
  function setUserID(){
    if(isNew){
      spCookie = getSpCookie(trackerCookieName);
      getLead(isNew, spCookie, appID);
    }
  }

    //*********************************************************
  //
  // Parse the UTM parameters
  // return a json object.
  // IF the url doesn't has any utm parameters,
  // isExist will be false, and no other parameters
  // will be attached.
  //
  //*********************************************************
  function UTMParser() {
    var params = [
      'utm_source',
      'utm_medium',
      'utm_tern',
      'utm_content',
      'utm_campaign',
    ];
    var res = {'type':'UTM'};

    for(idx in params){
      var matcher = new RegExp(params[idx] + '=([^&]*)');
      var temp = matcher.exec(document.URL);

      console.log(params[idx]);
      if(temp && temp[1]){
        res[params[idx]] = temp[1];
        console.log(temp[1]);
      }
    }

    console.log(res);
    return res;
  }

  //*********************************************************
  //
  // Return Page Hight and ViewPort Hight dynamicaly,
  // in case the webpage is dynamicaly.
  //
  //*********************************************************
  function pageHeight(){
    return Math.max(document.body.scrollHeight,
                     document.documentElement.scrollHeight,
                     document.body.offsetHeight,
                     document.documentElement.offsetHeight,
                     document.documentElement.clientHeight);
  }

  function windowHeight(){
    return Math.max(document.documentElement.clientHeight,
                    window.innerHeight);
  }

  //----------------------------------------------------------------
  
  //Loading snowplow tracker js file
  (function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async = 1;n.src=w;n.onload=setUserID;g.parentNode.insertBefore(n,g)}}(window,document,"script", spURL,"snowplow"));

  //Setup a new tracker named my myTracker111, using cookie to cache the report
  //Using GET request to send report
  window.snowplow('newTracker', 'myTracker111', reportSubmitServer, { // Initialise a tracker
    encodeBase64: false, // Default is true
    appId: appID, // Site ID can be anything you want. Set it if you're tracking more than one site in this account
    cookieName: trackerCookieName, // This is the cookie file name
    stateStorageStrategy: "cookie",
    userFingerprint: false,
    //post: true, //set it true to use post to send report
  });

  window.snowplow('setReferrerUrl', document.referred || 'n/a');

  // Check if this user already has leadID stored in the cookie
  var xsyCookie = getSpCookie(xsyCookieName, appID);

  // If the user has a LeadID, just set userId = LeadID
  // If the user is new(anonymouse), set isNew to true, and the callback
  // function that loads sp.js will send a request to get the LeadID
  // We assume loading sp.js happens far later than this part.
  if(xsyCookie == null){
    console.log("no cookie");
    isNew = true;
    xsyCookie = "noCookie";
    window.snowplow('setUserId', '');
  }
  else{
    isNew = false;
    //add all cookie here
    window.snowplow('setUserId', getXsyCookie());
  }

  //Enable pageping event tracking
  window.snowplow('enableActivityTracking', 30, 30);
  //Enable pageview event tracking.
  //And send the realtime page height and viewport height with the report
  //Note the pageview event must be set after the paging ping event.
  
  if(isTrack(document.location)){
    window.snowplow('trackPageView',null,'',
      function() {
        return {
            pageHeight: (pageHeight()),
            viewHeight: (windowHeight())
        };
      }
    );
  }

  window.snowplow('trackSelfDescribingEvent', UTMParser());

  //Configure the tracking of 'trackEnter', 'trackClick' and 'trackVideo' event.
  //Notice the eventlistener only set after the page is loaded(window load event).
  //So if the class name is added after the load event, including create a new
  //element with that class name, it won't be tracked.
  addListener = function(){
    console.log("set up listener");

    document.body.addEventListener('click', function(event) {
      let tId = event.target.id;
      console.log(tId);
      if(isTracking(tId)) {
        let setting = getSetting(tId);
        let type = setting.type;

        if(type == 'link') {
          //if the link is stacked together, the id might be incorrect.
          var target = event.currentTarget;
          var matcher = new RegExp('\.([a-zA-Z0-9]+)$');
          var matchs = target.href.match(matcher);
          var type = 'n/a'
          if(matchs && matchs[1]){
            type = matchs[1];
            console.log('finded');
            console.log(matchs);
          }
          console.log(type);
          window.snowplow('trackStructEvent', 'link', 'download', target.id, target.href, type);
          console.log(event.currentTarget);
          
        } if(type == 'btn') {
        let el = document.getElementById(setting.id);

        } if(type == 'form') {
        let el = document.getElementById(setting.id);

        } else {
          //unknown type , just ignore it
        }
      }
    })

    //If the element has a class name 'trackEnter', the mouseenter and mouseleave
    //event will be listened and a report will be sent if it is triggered.
    var elementsOver = document.getElementsByClassName('trackEnter');

    for(i=0; i < elementsOver.length; i++){
      elementsOver[i].addEventListener('mouseenter', function(event){
        console.log(event.target);
        window.snowplow('trackStructEvent', 'button', 'enter', event.target.id, '', '');
      });

      elementsOver[i].addEventListener('mouseleave', function(event){
        window.snowplow('trackStructEvent', 'button', 'leave', event.target.id, '', '');
      });
    }

    // If the element has a class name 'trackClick', the click event will be
    // listened and a report will be sent if it is triggered.
    var elementsClick = document.getElementsByClassName('trackClick');
    for(i=0; i < elementsClick.length; i++){
      elementsClick[i].addEventListener('click', function(event){
        window.snowplow('trackStructEvent', 'button', 'click', event.target.id, '', '');
      });
    }

    // If a Video element or a Audio event has a name 'trackVideo', the play and pause
    // event will be sent to listened. 
    var elementsVideo = document.getElementsByClassName('trackVideo');
    for(i=0; i < elementsVideo.length; i++){
      elementsVideo[i].addEventListener('play', function(event){
        window.snowplow('trackStructEvent', 'video', 'play', event.target.id, event.target.src, '');
      });

      elementsVideo[i].addEventListener('pause', function(event){
        window.snowplow('trackStructEvent', 'video', 'pause', event.target.id, event.target.src, '');
      });
    }

    var elementsLink = document.getElementsByClassName('trackLink');
    for(i=0; i < elementsLink.length; i++){
      elementsLink[i].addEventListener('click', function(event){
        var target = event.currentTarget;
        var matcher = new RegExp('\.([a-zA-Z0-9]+)$');
        var matchs = target.href.match(matcher);
        var type = 'n/a'
        if(matchs && matchs[1]){
          type = matchs[1];
          console.log('finded');
          console.log(matchs);
        }
        console.log(type);
        window.snowplow('trackStructEvent', 'link', 'download', target.id, target.href, type);
        console.log(event.currentTarget);
      }, false);
    }

    // To add more event tracking function
  };

  window.addEventListener("load", function(event) {
    console.log("start the count");
    setTimeout(addListener, 1500);
  });
    
};
