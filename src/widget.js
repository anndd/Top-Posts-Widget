(function() {
  /* 
   * configure widget 
   */
  
  // selector of the element where you want to display your list
  var containerSelector = '<YOUR CONTAINER SELECTOR>';
  
  // if you want to share posts outside of your website, 
  // update data feed keys - you can find them in DD Console
  var dataFeeds = [
    {
      "label":"This Week", // text displayed on a link
      "timeframe":"This Week", // used in feed definition
      "dataFeedKey":"<YOUR DATA FEED PUBLIC KEY>" // required to load feed without DD.js
    },
    {
      "label":"This Month",
      "timeframe":"This Month",
      "dataFeedKey":"<YOUR DATA FEED PUBLIC KEY>"
    },
    {
      "label":"All Time",
      "timeframe":"",
      "dataFeedKey":"<YOUR DATA FEED PUBLIC KEY>"
    }
  ];
  
  // ONLY, if you haven't provided the dataFeedKeys above
  // Define the DD.js script's SRC
  
  var scriptSrc = '<YOUR UNIQUE TRACKING CODE URL>';
  
  // if you want to open links in the same tab, change to false
  
  var openLinksInNewTab = true;
  
  // set styles for the list
  var styleDef = 
   '.ddjs-post-image   { max-width: 100%;}\
    .ddjs-post-list    { list-style-type: none;  margin: 0;  padding: 0;}\
    .ddjs-post-item    { max-width:320px; margin:5px 0 15px 0; border-radius:8px; overflow:hidden; background: white; border-bottom:1px solid rgba(0,0,0,0.4); padding-bottom:10px;}\
    .ddjs-post-item a  { text-decoration:none;}\
    .ddjs-post-content { margin: 0 15px;}\
    .ddjs-post-title   { font-size:x-large; font-weight: 400; margin:10px 8px 0 8px;}\
    .ddjs-post-stat    { font-size: small; margin:0 8px; opacity:0.6;}\
    .ddjs-feeds a      { padding:4px 8px; display:inline-block; text-decoration:none;}\
    .ddjs-active-feed  { border:1px solid; border-radius:8px;}';
  
  /* 
   * no need to change anything below 
   */
  
  // check if the container exists
  var widgetContainer = document.querySelector(containerSelector);
  if (!widgetContainer) {
    console.error('Can\'t add the widget. No element found matching the container selector: "' + containerSelector + '"');
  }
  
  // inject the styles
  
  function addCSS(){
    var head = document.getElementsByTagName('head')[0];
    var css = document.createElement('style');
    css.setAttribute('type', 'text/css');
    if (css.styleSheet) { // IE
      css.styleSheet.cssText = styleDef;
    } else { // the world
      css.appendChild(document.createTextNode(styleDef));
    }
    head.appendChild(css);
  }
  
  //
  function loadFeed(e){    
    var key = e.target.dataset.dataFeedKey,
      timeframe = e.target.dataset.timeframe;
    if (key != "<YOUR DATA FEED PUBLIC KEY>"){
      // if key is provided - read data
      readFeedWithoutDD(key, addPosts);
    }else if (typeof DD !== 'undefined'){
      // if key is missing - read or create the feed using DD.js API
      readFeed(timeframe, addPosts);
    }else if (scriptSrc) {
      // this shouldn't happen, but if both, key and DD, are missing
      // then load DD.js, enable Dev Mode and create the feed
      var ur = document.createElement("script");
      ur.type = "text/javascript";
      ur.src = scriptSrc;
      ur.onload = function(){
        DD.enableDevMode();
        readFeed(timeframe, addPosts);
      }
      document.getElementsByTagName("head")[0].appendChild(ur);
    }else {
      console.error('Either provide a Data Feed Key or add DD.js library');
    }
    
    // mark active tab
    var activeTab = e.target.parentElement.querySelector('ddjs-active');
    if (activeTab) activeTab.classList.remove('ddjs-active-feed');
    e.target.classList.add('ddjs-active-feed');
    
    e.preventDefault();
  }
  
  function addWidget(){
    addCSS();
    
    // check if widget exisits
    var widget = widgetContainer.querySelector('.ddjs-widget');
    if (!widget) {
      // create widget element
      widget = document.createElement("div");
      widget.className='ddjs-widget';
    }else{
      // erase existing widget
      while (widget.childElementCount>0){
        widget.removeChild(widget.firstElementChild);
      }
    }
    
    var feedButtons = document.createElement("div"); 
    feedButtons.className='ddjs-feeds';
    
    for (var i = 0; i<dataFeeds.length; i++){
      var tab = document.createElement("a");
      tab.innerText = dataFeeds[i].label;
      tab.href="#";
      tab.dataset.dataFeedKey = dataFeeds[i].dataFeedKey;
      if (dataFeeds[i].timeframe) tab.dataset.timeframe = dataFeeds[i].timeframe;
      tab.addEventListener('click',loadFeed);
      feedButtons.appendChild(tab);
      
      // autoload the first feed
      if (i === 0) tab.click();
    }
    
    widget.appendChild(feedButtons);
    widgetContainer.appendChild(widget);
  }
  
  function addPosts(topPosts){
    var postList = widgetContainer.querySelector(".ddjs-post-list");
    if (postList) {
      // erase the list
      postList.parentElement.removeChild(postList);
    }
    postList = document.createElement("ul");
    postList.className = "ddjs-post-list";

    for (var i = 0; i < topPosts.length; i++) {
      var postCount = topPosts[i].views;
      var postData = JSON.parse(topPosts[i].blogpost);
      var postListItemContent = '';
      var linkTarget = '';
      if (openLinksInNewTab) {
        linkTarget=' target="_blank" ';
      }
      var imgTag = '';      
      if (postData.thumbnail){
         imgTag = '<div><img class="ddjs-post-image" src="' + postData.thumbnail + '" alt="'+postData.title+'"></div>';
      }
      postListItemContent = '<a href="' + postData.url + '" '+linkTarget+'>'+imgTag+'<div><div class="ddjs-post-title">' + postData.title + '</div><div class="ddjs-post-stat">' + postCount + ' views</div></div></a>';
      var postListItem = document.createElement("li");
      postListItem.className = "ddjs-post-item";
      postListItem.innerHTML = postListItemContent;
      postList.appendChild(postListItem);
    }
    widgetContainer.appendChild(postList);
  }
  
  // read or create data feed
  function readFeed (timeframe, callback){
   
    // define what data should be in the feed
    var feed = DD.data.feed('Top Five Posts');
    feed.select(
      DD.data.datapoints.metaevent('blogpost'),
      DD.data.datapoints.metaevent('blogpost').count().as('views')
    ).orderBy('`views` DESC')
    .limit(5);
    
    if (timeframe && timeframe!==''){
      feed = feed.from(  
        DD.data.segment('Visits '+timeframe).startedAfter(timeframe)
      )
    }
    
    // read the feed, the feed will be created if it doesn't exist
    DD.reader.read(feed, {}, function(response){
      callback(response.results);
    });
  }
  function readFeedWithoutDD ( dataFeedKey, callback ){
    var url = "https://public-api.datadrivenjs.com/read/";
    var data = { "cache": dataFeedKey };
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.dataType = "json";
    request.onreadystatechange = function() {
      if (request.readyState == XMLHttpRequest.DONE) {
        var response = JSON.parse(request.response);
        if (!response.results) {
          console.error('DataDrivenJS returned no results');
          return;
        }
        callback(response.results)
      }
    };
    request.send(JSON.stringify(data));
  }
  addWidget();
})();
