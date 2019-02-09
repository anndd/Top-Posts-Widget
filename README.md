# Top-Posts-Widget
A simple widget to share your top blog posts. It works with any blogging platform. It requires [DataDrivenJS](https://datadrivenjs.com) to track and read blog stats.

## Demo

The "blog" 
https://anndd.github.io/Top-Posts-Widget/demo/blog.html

The widget with blog posts:
https://anndd.github.io/Top-Posts-Widget/demo/widget.html

## Scripts

There are two scripts in the 'src' folder: 

**tracking.js** should be added to a blog post page; it tracks blog post details (title, URL and thumbnail) every time a user views a blog post. You need to replace placeholders:
* `<YOUR UNIQUE TRACKING CODE URL>'` - sign up for DataDrivenJS, create a project and you will get a unique tracking code. Copy the URL and paste instead of the the placeholder.
* `<YOUR POST TITLE SELECTOR>` - you should probably set it to `h1` 
* `<YOUR POST IMAGE SELECTOR>` - the selector should point to an image (or an element with background image) that you want to use as a thumbnail

**widget.js** should be added to pages where you want to display the widget; There are several placeholders that you need to update:
* `<YOUR CONTAINER SELECTOR>` - the selector should point to an element where you want to inject the widget
* `<YOUR DATA FEED PUBLIC KEY>` - **optional**, but preferable; if you set public data feed keys the widget will not need to load DD.js library making the widget work faster
* `<YOUR UNIQUE TRACKING CODE URL>` - **optional**, if you haven't provided the data feed keys, add the URL of your tracking code
* to make the widget open links in the same tab (instead of a new one) set `openLinksInNewTab` to `false`
* to change the look of the widget, update the `styleDef` or update CSS styles on the page where you will add the widget




