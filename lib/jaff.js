/*!
 * JAFF JavaScript Library v0.3.1
 * http://www.github.com/brettwp/JAFF
 * Copyright (c) 2013 Brett Pontarelli
 *
 * Licensed under The MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
window.Jaff={},Jaff.VERSION="0.3.1",function(){Jaff.Cookie=function(){function e(){}return e.prototype.setCookie=function(e,t,i){var n,s;return s=this.buildExpireDate(i),n=e+"="+escape(t)+";expires="+s+(i.path?";path="+i.path:void 0)+(i.domain?";domain="+i.domain:void 0)+(i.secure?";secure":void 0),this.setDocumentCookie(n),this},e.prototype.buildExpireDate=function(e){var t,i,n,s,r;return n=0,r=null,"object"==typeof e?e.utc?r=e.utc:n=this.getMsTillExpire(e):(i=864e5,n=e*i),t=new Date,s=r||t.getTime()+n,t.setTime(s),t.toUTCString()},e.prototype.getMsTillExpire=function(e){var t,i,n,s;return s=e.seconds||0,n=e.minutes||0,i=e.hours||0,t=e.days||0,1e3*(60*(60*(24*t+i)+n)+s)},e.prototype.getCookie=function(e){var t,i,n,s;return s=this.getDocumentCookie(),n="",s.length>0&&(t=s.indexOf(e+"="),-1!==t&&(t=t+e.length+1,i=s.indexOf(";",t),-1===i&&(i=s.length),n=unescape(s.substring(t,i)))),n},e.prototype.isCookieSet=function(e){var t;return t=this.getCookie(e),null!==t&&""!==t},e.prototype.clearCookie=function(e){return this.setCookie(e,null,-1),this},e.prototype.setDocumentCookie=function(e){return document.cookie=e,this},e.prototype.getDocumentCookie=function(){return document.cookie},e}()}.call(this),function(){Jaff.Fabrication=function(){function e(){this.fabricators={}}return e.prototype.fabricator=function(e,t){return this.fabricators[e]=t},e.prototype.fabricate=function(){var e,t,i,n;return n=this.extract.apply(this,arguments),e=n[0],i=n[1],t=n[2],e.unshift(null,t),new(i.bind.apply(i,e))},e.prototype.attributes_for=function(){var e,t,i,n;return n=this.extract.apply(this,arguments),e=n[0],i=n[1],t=n[2],t},e.prototype.canFabricate=function(e){return"function"==typeof this.fabricators[e]},e.prototype.extract=function(){var e,t,i,n,s,r,a;e=Array.prototype.slice.call(arguments),n=e.shift(),r=e.shift(),i=this.fabricators[n],t=i(e);for(s in r)a=r[s],t[s]=a;return[e,n,t]},e}()}.call(this),function(){var e;e=function(){},Jaff.Module=function(){function t(){this.modules=[]}return t.prototype.require=function(e){return"function"==typeof e?this.requireFunction(e):this.requireName(e)},t.prototype.requireName=function(t){var i,n,s,r,a,o;for(r=window,s=t.split("."),i=a=0,o=s.length;o>a&&(n=s[i],r.hasOwnProperty(n));i=++a)r=r[n];if(i!==s.length)throw new e;return r},t.prototype.requireFunction=function(t){if(t()!==!0)throw new e},t.prototype.define=function(e){return"function"==typeof e&&this.modules.push(e),this.callFulfilledModules(),this},t.prototype.callFulfilledModules=function(){var e,t;for(t=!1;!t;)e=this.modules.length,this.modules=this.modules.filter(this.callFunction),t=e===this.modules.length||0===this.modules.length;return 0===this.modules.length},t.prototype.callFunction=function(t){var i,n;i=!1;try{t()}catch(s){if(n=s,!(n instanceof e))throw n;i=!0}return i},t}()}.call(this);