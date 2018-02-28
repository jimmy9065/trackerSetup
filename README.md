# snowplow-js-tracker wrapper  

This repo is a wrapper for snowplow-js-tracker.

## Setup
#### 1. Create a bundle for the wrapper file and the config file  
Run the following commend(requires node.js environment) to build the wrapper.
```
npm install -g grunt
npm install
grunt
```
The bundled javascript will be output in the dist folder. You can use either 'dist/bundle.js'(debug) or 'dist/bundle.min.js'(release). Also, since I used let and some other ES6 features, you might need to use node>=6.
### 2. Add this js snipt to the header of every web page that you want to track.
```
<script type="text/javascript">
(!function(t,r,e,c,i,p,s){var setupScript=r.createElement("script");firstScript=r.getElementsByTagName("script")[0];var scriptParent=firstScript.parentNode;scriptParent.insertBefore(setupScript,firstScript);setupScript.async=1;setupScript.onload=function(){setupTracker(t,r,c,i,p,s)},setupScript.src=e}(window, document, 'path/to/bundle.js/or/sp_setup.js', 'path/to/sp.js', 'path/to/uid/server', 'path/to/collector/server', 'appID'));
</script> 
```
The following information need to be provided:
  * Path to bundle.js: The url that holds this js file.
  * Path to sp.js: The url that holds the snowplow-js-tracker file(sp.js).
  * Path to the uid server: the GET request for an unique uid using the sp's cookie and appID.
      The request will be like this (Note the '/lead?' part is also included):
      ```
      GET UID/Server/lead?isnew=true&cookie=mycookie&tid=111
      ```
      For example, if you provide something like this:
      ```
      'http://myuidserver/lead?'
      ```
      Then the request will be look like this:
      ```
      'http://myuidserver/lead?isnew=true&cookie=mycookie&tid=111'
      ```
  * Path to the collector server: The server that receives the tracking report.
  * AppID: An unique ID that is asigned to the client who owns this website.
      
   After inserted the code, the website now could track the pageview event and generate the pageping event every 30s. In the pageping event, there is also the scroll depth information in pageping event report.  
### 4. To track certain event, you need to add the class names and IDs(if they don't have one) to those element that you want to track.  
   The class name is for the tracker to know what kind of the event the track need to listen for that element. The id is used to tell which element triggered this event.  
   Now we only support following class name:  
   * trackEnter: Track if the user's mouse is hover on that element or leave it.
   * trackClick: Track if the user click on that element.
   * trackVideo: Track if the user play or pause the video.  
   * trackLink : Track if the user click on a link.(This is different from trackClick, because it also carries the link's url and the file type)

### 5. Use global click tracker.  
   For active webpage, the elements sometimes could be created or removed by ajax. The above methods, however, are designed for static webpage, which created all its elements before the load event is triggered. So in order to track those elements which created afterwards, and also provide some api for the later tagmanager development, one can use the global click tracker. It can track the click event for all those elements that registered under the config.js file.
   The setup details is in the config file, function 'setupGlobalTracker'. You only need to add content in the 'custom content area'. Also there is a config.example.js file which contains some more specific examples.
   Current, the global tracker can track three types of event:
   * link : For link type, the target id usually should be pointed to a link elment, because the report will contain the href attribute of the target element.
   * btn : For btn type, the report will only contain the target id.
   * video : For video type, the report will contain the pause attribute of the target element to the report.

### 6. Setup whitelist/blacklist for pageview trackers.  
For some cases, you might not need to track all the pages on the websites. In those cases, you can use isTrack() to decide if the page should be tracked.  
In default, the function return true for all locations, which means it doesn't has any rules on pageview tracking, and it will track all the pages on the website.
You can use either hash map or Regex to create a whitelist or blacklist to setup such rules. If the function return true, such page will trigger pageview report, and it will be muted if the function return false.  
**Note that the parameter for isTrack() is a location not an url.**
    
### 7. Send the report at any place you want without setting the class name.(Not Recommend)  
This is the original way for snowplow user to send the tracking report. You can lear more information from this [link](https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker).
    
### 8. Form submit event report  
Since the form element has various way to be created and submitted, implement a universal event listener to track the submit event is neither efficient nor reasonable. Thus, you need to insert a function(sendFormReport(obj)) at where the report is submitted such a report to collector server.

Other information like the protocal for those report can be found on [snowplow's wiki page](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol).

