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
window.Jaff={},Jaff.VERSION="0.3.1",function(){Jaff.Cookie=function(){function e(){}return e.prototype.setCookie=function(e,t,n){var i,s;return s=this.buildExpireDate(n),i=e+"="+escape(t)+";expires="+s+(n.path?";path="+n.path:void 0)+(n.domain?";domain="+n.domain:void 0)+(n.secure?";secure":void 0),this.setDocumentCookie(i),this},e.prototype.buildExpireDate=function(e){var t,n,i,s,r;return i=0,r=null,"object"==typeof e?e.utc?r=e.utc:i=this.getMsTillExpire(e):(n=864e5,i=e*n),t=new Date,s=r||t.getTime()+i,t.setTime(s),t.toUTCString()},e.prototype.getMsTillExpire=function(e){var t,n,i,s;return s=e.seconds||0,i=e.minutes||0,n=e.hours||0,t=e.days||0,1e3*(60*(60*(24*t+n)+i)+s)},e.prototype.getCookie=function(e){var t,n,i,s;return s=this.getDocumentCookie(),i="",s.length>0&&(t=s.indexOf(e+"="),-1!==t&&(t=t+e.length+1,n=s.indexOf(";",t),-1===n&&(n=s.length),i=unescape(s.substring(t,n)))),i},e.prototype.isCookieSet=function(e){var t;return t=this.getCookie(e),null!==t&&""!==t},e.prototype.clearCookie=function(e){return this.setCookie(e,null,-1),this},e.prototype.setDocumentCookie=function(e){return document.cookie=e,this},e.prototype.getDocumentCookie=function(){return document.cookie},e}()}.call(this),function(){Jaff.Fabrication=function(){function e(){this.fabricators={}}return e.prototype.fabricator=function(e,t){return this.fabricators[e]=t},e.prototype.fabricate=function(){var e,t,n,i;return i=this.extract.apply(this,arguments),e=i[0],n=i[1],t=i[2],e.unshift(null,t),new(n.bind.apply(n,e))},e.prototype.attributes_for=function(){var e,t,n,i;return i=this.extract.apply(this,arguments),e=i[0],n=i[1],t=i[2],t},e.prototype.canFabricate=function(e){return"function"==typeof this.fabricators[e]},e.prototype.extract=function(){var e,t,n,i,s,r,o;e=Array.prototype.slice.call(arguments),i=e.shift(),r=e.shift(),n=this.fabricators[i],t=n(e);for(s in r)o=r[s],t[s]=o;return[e,i,t]},e}()}.call(this),function(){var e;e=function(){},Jaff.Module=function(){function t(){this.modules=[]}return t.prototype.require=function(e){return"function"==typeof e?this.requireFunction(e):this.requireName(e)},t.prototype.requireName=function(t){var n,i,s,r,o,a;for(r=window,s=t.split("."),n=o=0,a=s.length;a>o&&(i=s[n],r.hasOwnProperty(i));n=++o)r=r[i];if(n!==s.length)throw new e;return r},t.prototype.requireFunction=function(t){if(t()!==!0)throw new e},t.prototype.define=function(e){return"function"==typeof e&&this.modules.push(e),this.callFulfilledModules(),this},t.prototype.callFulfilledModules=function(){var e,t;for(t=!1;!t;)e=this.modules.length,this.modules=this.modules.filter(this.callFunction),t=e===this.modules.length||0===this.modules.length;return 0===this.modules.length},t.prototype.callFunction=function(t){var n,i;n=!1;try{t()}catch(s){if(i=s,!(i instanceof e))throw i;n=!0}return n},t}()}.call(this);