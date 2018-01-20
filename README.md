# snowplow-js-tracker deploy code  

This Javascript code is aim to help user to deploy the snowplow-js-tracker on a website. 

## Setup
1. Uglify the js code(option)
```
uglify sp_setup.js > bundle.js
```
2. Add this js snipt to the header of the web pages.
```
<script type="text/javascript">
(!function(t,r,e,c,i,p,s){var setupScript=r.createElement("script");firstScript=r.getElementsByTagName("script")[0];var scriptParent=firstScript.parentNode;scriptParent.insertBefore(setupScript,firstScript);setupScript.async=1;setupScript.onload=function(){setupTracker(t,r,c,i,p,s)},setupScript.src=e}(window, document, 'path/to/bundle.js/or/sp_setup.js', 'path/to/sp.js', 'path/to/uid/server', 'path/to/collector/server', 'appID'));
</script> 
```
The following information need to be provided:
  * Path to bundle.js: The url that holds this js file.
  * Path to sp.js: The url that holds the snowplow-js-tracker file(sp.js).
  * Path to the uid server: the GET request for an unique uid using the sp's cookie and appID.
      The request will be like this:
      ```
      GET UID/Server/lead?isnew=true&cookie=mycookie&tid=111
      ```
      You need to provide something like this(Note the '/lead?' part is also included):
      ```
      'http://myuidserver/lead?'
      ```
  * Path to the collector server: The server that receives the tracking report.
  * AppID: An unique ID that is asigned to the client who owns this website.
3. After inserted the code, the website now could track the pageview event and generate the pageping event every 30s. In the pageping event, there is also the scroll depth information in pageping event report.  
4. For custom event. You need to add certain class names and IDs(if they don't have one) to those element that you want to track.  
The class name is for the tracker to know what kind of the event the track need to listen for that element. The id is used to tell which element triggered this event.  
Now we only support following class name:
  * trackEnter: Track if the user's mouse is hover on that element or leave it.
  * trackClick: Track if the user click on that element.
  * trackVideo: Track if the user play or pause the video.
5. Send the report at any place you want without setting the class name.
This is the original way for snowplow user to send the tracking report. You can lear more information from this [link](https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker).

Other information like the protocal for those report can be found on [snowplow's wiki page](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol).

