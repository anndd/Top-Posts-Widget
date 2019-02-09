(function() {

  /* configure tracking */
  
  // Define the DD.js script's SRC
  var scriptSrc = '<YOUR UNIQUE TRACKING CODE URL>';
  
  // Define selectors for extracting blog page title and thumbnail
  var titleSelector = '<YOUR POST TITLE SELECTOR>';
  var imageSelector = '<YOUR POST IMAGE SELECTOR>';
  
  /* no need to make any changes below */
  
  // Check if the page is a blog post:
  var titleEl = document.querySelector(titleSelector);
  var thumbnailImg = imageSelector === '' ? '' :  document.querySelector(imageSelector);
  if (!titleEl || !thumbnailImg) {
    console.log('Not a blog post');
    return; // stop, it's not a post!
  }
  
  // dynamically create the script tag so it can be injected using a   plugin or a tag manager
  var ur = document.createElement("script");
  ur.type = "text/javascript";
  ur.src = scriptSrc;
  ur.onload = function(){
    // script loaded, prepare blog post's details
    var blogpost = {
      "title": titleEl.innerText,
      "url": window.location.origin+window.location.pathname
    }
    if (thumbnailImg) {
      if (thumbnailImg.tagName==='IMG'){
        blogpost.thumbnail = thumbnailImg.src;
      }else if (thumbnailImg.style.backgroundImage!==''){
        blogpost.thumbnail = thumbnailImg.style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/)[1];
      }
    }
    // send data to DataDrivenJS that a user viewed this post
    DD.tracker.trackMetaEvent("blogpost", JSON.stringify(blogpost));
  }
  document.getElementsByTagName("head")[0].appendChild(ur);
})();
