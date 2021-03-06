/*
 Sticky Elements Shortcut for jQuery Waypoints - v2.0.2
 Copyright (c) 2011-2013 Caleb Troughton
 Dual licensed under the MIT license and GPL license.
 https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
 */


(function(){(function(e,t){if(typeof define==="function"&&define.amd){return define(["jquery","waypoints"],t)}else{return t(e.jQuery)}})(this,function(e){var t,n;t={wrapper:'<div class="sticky-wrapper" />',stuckClass:"stuck"};n=function(t,n){t.wrap(n.wrapper);t.each(function(){var t;t=e(this);t.parent().height(t.outerHeight());return true});return t.parent()};return e.waypoints("extendFn","sticky",function(r){var i,s;r=e.extend({},e.fn.waypoint.defaults,t,r);i=n(this,r);s=r.handler;r.handler=function(t){var n,i;n=e(this).children(":first");i=t==="down"||t==="right";n.toggleClass(r.stuckClass,i);if(s!=null){return s.call(this,t)}};i.waypoint(r);return this})})}).call(this)