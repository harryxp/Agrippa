(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
// Generated by purs bundle 0.12.5
var PS = {};
(function(exports) {
  /* global exports */
  /* global XMLHttpRequest */
  /* global module */
  /* global process */
  "use strict";

  exports._ajax = function () {
    var platformSpecific = { };
    if (typeof module !== "undefined" && module.require && !(typeof process !== "undefined" && process.versions["electron"])) {
      // We are on node.js
      platformSpecific.newXHR = function () {
        var XHR = module.require("xhr2");
        return new XHR();
      };

      platformSpecific.fixupUrl = function (url) {
        var urllib = module.require("url");
        var u = urllib.parse(url);
        u.protocol = u.protocol || "http:";
        u.hostname = u.hostname || "localhost";
        return urllib.format(u);
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    } else {
      // We are in the browser
      platformSpecific.newXHR = function () {
        return new XMLHttpRequest();
      };

      platformSpecific.fixupUrl = function (url) {
        return url || "/";
      };

      platformSpecific.getResponse = function (xhr) {
        return xhr.response;
      };
    }

    return function (mkHeader, options) {
      return function (errback, callback) {
        var xhr = platformSpecific.newXHR();
        var fixedUrl = platformSpecific.fixupUrl(options.url);
        xhr.open(options.method || "GET", fixedUrl, true, options.username, options.password);
        if (options.headers) {
          try {
            for (var i = 0, header; (header = options.headers[i]) != null; i++) {
              xhr.setRequestHeader(header.field, header.value);
            }
          } catch (e) {
            errback(e);
          }
        }
        var onerror = function (msg) {
          return function () {
            errback(new Error(msg + ": " + options.method + " " + options.url));
          };
        };
        xhr.onerror = onerror("AJAX request failed");
        xhr.ontimeout = onerror("AJAX request timed out");
        xhr.onload = function () {
          callback({
            status: xhr.status,
            statusText: xhr.statusText,
            headers: xhr.getAllResponseHeaders().split("\r\n")
              .filter(function (header) {
                return header.length > 0;
              })
              .map(function (header) {
                var i = header.indexOf(":");
                return mkHeader(header.substring(0, i))(header.substring(i + 2));
              }),
            body: platformSpecific.getResponse(xhr)
          });
        };
        xhr.responseType = options.responseType;
        xhr.withCredentials = options.withCredentials;
        xhr.send(options.content);

        return function (error, cancelErrback, cancelCallback) {
          try {
            xhr.abort();
          } catch (e) {
            return cancelErrback(e);
          }
          return cancelCallback();
        };
      };
    };
  }();
})(PS["Affjax"] = PS["Affjax"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Semigroupoid"] = $PS["Control.Semigroupoid"] || {};
  var exports = $PS["Control.Semigroupoid"];
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });
  var compose = function (dict) {
      return dict.compose;
  };
  exports["compose"] = compose;
  exports["Semigroupoid"] = Semigroupoid;
  exports["semigroupoidFn"] = semigroupoidFn;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Category"] = $PS["Control.Category"] || {};
  var exports = $PS["Control.Category"];
  var Control_Semigroupoid = $PS["Control.Semigroupoid"];                
  var Category = function (Semigroupoid0, identity) {
      this.Semigroupoid0 = Semigroupoid0;
      this.identity = identity;
  };
  var identity = function (dict) {
      return dict.identity;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["Category"] = Category;
  exports["identity"] = identity;
  exports["categoryFn"] = categoryFn;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Function"] = $PS["Data.Function"] || {};
  var exports = $PS["Data.Function"];                    
  var on = function (f) {
      return function (g) {
          return function (x) {
              return function (y) {
                  return f(g(x))(g(y));
              };
          };
      };
  };
  var flip = function (f) {
      return function (b) {
          return function (a) {
              return f(a)(b);
          };
      };
  };
  var $$const = function (a) {
      return function (v) {
          return a;
      };
  };
  var applyFlipped = function (x) {
      return function (f) {
          return f(x);
      };
  };
  exports["flip"] = flip;
  exports["const"] = $$const;
  exports["applyFlipped"] = applyFlipped;
  exports["on"] = on;
})(PS);
(function(exports) {
  "use strict";

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Unit"] = $PS["Data.Unit"] || {};
  var exports = $PS["Data.Unit"];
  var $foreign = $PS["Data.Unit"];
  exports["unit"] = $foreign.unit;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Functor"] = $PS["Data.Functor"] || {};
  var exports = $PS["Data.Functor"];
  var $foreign = $PS["Data.Functor"];
  var Control_Semigroupoid = $PS["Control.Semigroupoid"];
  var Data_Function = $PS["Data.Function"];
  var Data_Unit = $PS["Data.Unit"];                
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };
  var $$void = function (dictFunctor) {
      return map(dictFunctor)(Data_Function["const"](Data_Unit.unit));
  };
  var voidLeft = function (dictFunctor) {
      return function (f) {
          return function (x) {
              return map(dictFunctor)(Data_Function["const"](x))(f);
          };
      };
  };
  var functorFn = new Functor(Control_Semigroupoid.compose(Control_Semigroupoid.semigroupoidFn));
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["void"] = $$void;
  exports["voidLeft"] = voidLeft;
  exports["functorFn"] = functorFn;
  exports["functorArray"] = functorArray;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Apply"] = $PS["Control.Apply"] || {};
  var exports = $PS["Control.Apply"];
  var Control_Category = $PS["Control.Category"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];                
  var Apply = function (Functor0, apply) {
      this.Functor0 = Functor0;
      this.apply = apply;
  };                      
  var apply = function (dict) {
      return dict.apply;
  };
  var applyFirst = function (dictApply) {
      return function (a) {
          return function (b) {
              return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"])(a))(b);
          };
      };
  };
  var applySecond = function (dictApply) {
      return function (a) {
          return function (b) {
              return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"](Control_Category.identity(Control_Category.categoryFn)))(a))(b);
          };
      };
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
  exports["applyFirst"] = applyFirst;
  exports["applySecond"] = applySecond;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Applicative"] = $PS["Control.Applicative"] || {};
  var exports = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];        
  var Applicative = function (Apply0, pure) {
      this.Apply0 = Apply0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);
          };
      };
  };
  exports["Applicative"] = Applicative;
  exports["pure"] = pure;
  exports["liftA1"] = liftA1;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Bind"] = $PS["Control.Bind"] || {};
  var exports = $PS["Control.Bind"];
  var Data_Function = $PS["Data.Function"];
  var Bind = function (Apply0, bind) {
      this.Apply0 = Apply0;
      this.bind = bind;
  };                     
  var bind = function (dict) {
      return dict.bind;
  };
  var bindFlipped = function (dictBind) {
      return Data_Function.flip(bind(dictBind));
  };
  var composeKleisliFlipped = function (dictBind) {
      return function (f) {
          return function (g) {
              return function (a) {
                  return bindFlipped(dictBind)(f)(g(a));
              };
          };
      };
  };
  exports["Bind"] = Bind;
  exports["bind"] = bind;
  exports["bindFlipped"] = bindFlipped;
  exports["composeKleisliFlipped"] = composeKleisliFlipped;
})(PS);
(function(exports) {
  "use strict";

  exports.refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Eq"] = $PS["Data.Eq"] || {};
  var exports = $PS["Data.Eq"];
  var $foreign = $PS["Data.Eq"];
  var Eq = function (eq) {
      this.eq = eq;
  }; 
  var eqString = new Eq($foreign.refEq);
  var eqInt = new Eq($foreign.refEq);
  var eqChar = new Eq($foreign.refEq);
  var eq = function (dict) {
      return dict.eq;
  };
  exports["Eq"] = Eq;
  exports["eq"] = eq;
  exports["eqInt"] = eqInt;
  exports["eqChar"] = eqChar;
  exports["eqString"] = eqString;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Maybe"] = $PS["Data.Maybe"] || {};
  var exports = $PS["Data.Maybe"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Category = $PS["Control.Category"];
  var Data_Eq = $PS["Data.Eq"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Unit = $PS["Data.Unit"];                
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var maybe$prime = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v(Data_Unit.unit);
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe (line 230, column 1 - line 230, column 62): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var maybe = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v;
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe (line 217, column 1 - line 217, column 51): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var isNothing = maybe(true)(Data_Function["const"](false));
  var functorMaybe = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Just) {
              return new Just(v(v1.value0));
          };
          return Nothing.value;
      };
  });
  var fromMaybe = function (a) {
      return maybe(a)(Control_Category.identity(Control_Category.categoryFn));
  };
  var fromJust = function (dictPartial) {
      return function (v) {
          if (v instanceof Just) {
              return v.value0;
          };
          throw new Error("Failed pattern match at Data.Maybe (line 268, column 1 - line 268, column 46): " + [ v.constructor.name ]);
      };
  }; 
  var eqMaybe = function (dictEq) {
      return new Data_Eq.Eq(function (x) {
          return function (y) {
              if (x instanceof Nothing && y instanceof Nothing) {
                  return true;
              };
              if (x instanceof Just && y instanceof Just) {
                  return Data_Eq.eq(dictEq)(x.value0)(y.value0);
              };
              return false;
          };
      });
  };
  var applyMaybe = new Control_Apply.Apply(function () {
      return functorMaybe;
  }, function (v) {
      return function (v1) {
          if (v instanceof Just) {
              return Data_Functor.map(functorMaybe)(v.value0)(v1);
          };
          if (v instanceof Nothing) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 67, column 35): " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var bindMaybe = new Control_Bind.Bind(function () {
      return applyMaybe;
  }, function (v) {
      return function (v1) {
          if (v instanceof Just) {
              return v1(v.value0);
          };
          if (v instanceof Nothing) {
              return Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 125, column 33): " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applicativeMaybe = new Control_Applicative.Applicative(function () {
      return applyMaybe;
  }, Just.create);
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["maybe"] = maybe;
  exports["maybe'"] = maybe$prime;
  exports["fromMaybe"] = fromMaybe;
  exports["isNothing"] = isNothing;
  exports["fromJust"] = fromJust;
  exports["functorMaybe"] = functorMaybe;
  exports["applyMaybe"] = applyMaybe;
  exports["applicativeMaybe"] = applicativeMaybe;
  exports["bindMaybe"] = bindMaybe;
  exports["eqMaybe"] = eqMaybe;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.MediaType.Common"] = $PS["Data.MediaType.Common"] || {};
  var exports = $PS["Data.MediaType.Common"];          
  var applicationJSON = "application/json";
  var applicationFormURLEncoded = "application/x-www-form-urlencoded";
  exports["applicationFormURLEncoded"] = applicationFormURLEncoded;
  exports["applicationJSON"] = applicationJSON;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Affjax.RequestBody"] = $PS["Affjax.RequestBody"] || {};
  var exports = $PS["Affjax.RequestBody"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_MediaType_Common = $PS["Data.MediaType.Common"];                
  var ArrayView = (function () {
      function ArrayView(value0) {
          this.value0 = value0;
      };
      ArrayView.create = function (value0) {
          return new ArrayView(value0);
      };
      return ArrayView;
  })();
  var Blob = (function () {
      function Blob(value0) {
          this.value0 = value0;
      };
      Blob.create = function (value0) {
          return new Blob(value0);
      };
      return Blob;
  })();
  var Document = (function () {
      function Document(value0) {
          this.value0 = value0;
      };
      Document.create = function (value0) {
          return new Document(value0);
      };
      return Document;
  })();
  var $$String = (function () {
      function $$String(value0) {
          this.value0 = value0;
      };
      $$String.create = function (value0) {
          return new $$String(value0);
      };
      return $$String;
  })();
  var FormData = (function () {
      function FormData(value0) {
          this.value0 = value0;
      };
      FormData.create = function (value0) {
          return new FormData(value0);
      };
      return FormData;
  })();
  var FormURLEncoded = (function () {
      function FormURLEncoded(value0) {
          this.value0 = value0;
      };
      FormURLEncoded.create = function (value0) {
          return new FormURLEncoded(value0);
      };
      return FormURLEncoded;
  })();
  var Json = (function () {
      function Json(value0) {
          this.value0 = value0;
      };
      Json.create = function (value0) {
          return new Json(value0);
      };
      return Json;
  })();
  var toMediaType = function (v) {
      if (v instanceof FormURLEncoded) {
          return new Data_Maybe.Just(Data_MediaType_Common.applicationFormURLEncoded);
      };
      if (v instanceof Json) {
          return new Data_Maybe.Just(Data_MediaType_Common.applicationJSON);
      };
      return Data_Maybe.Nothing.value;
  };
  exports["ArrayView"] = ArrayView;
  exports["Blob"] = Blob;
  exports["Document"] = Document;
  exports["String"] = $$String;
  exports["FormData"] = FormData;
  exports["FormURLEncoded"] = FormURLEncoded;
  exports["Json"] = Json;
  exports["toMediaType"] = toMediaType;
})(PS);
(function(exports) {
  "use strict";

  exports.boolConj = function (b1) {
    return function (b2) {
      return b1 && b2;
    };
  };

  exports.boolDisj = function (b1) {
    return function (b2) {
      return b1 || b2;
    };
  };

  exports.boolNot = function (b) {
    return !b;
  };
})(PS["Data.HeytingAlgebra"] = PS["Data.HeytingAlgebra"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.HeytingAlgebra"] = $PS["Data.HeytingAlgebra"] || {};
  var exports = $PS["Data.HeytingAlgebra"];
  var $foreign = $PS["Data.HeytingAlgebra"];
  var HeytingAlgebra = function (conj, disj, ff, implies, not, tt) {
      this.conj = conj;
      this.disj = disj;
      this.ff = ff;
      this.implies = implies;
      this.not = not;
      this.tt = tt;
  };
  var tt = function (dict) {
      return dict.tt;
  };
  var not = function (dict) {
      return dict.not;
  };
  var implies = function (dict) {
      return dict.implies;
  };
  var ff = function (dict) {
      return dict.ff;
  };
  var disj = function (dict) {
      return dict.disj;
  };
  var heytingAlgebraBoolean = new HeytingAlgebra($foreign.boolConj, $foreign.boolDisj, false, function (a) {
      return function (b) {
          return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
      };
  }, $foreign.boolNot, true);
  var conj = function (dict) {
      return dict.conj;
  };
  exports["HeytingAlgebra"] = HeytingAlgebra;
  exports["tt"] = tt;
  exports["ff"] = ff;
  exports["implies"] = implies;
  exports["conj"] = conj;
  exports["disj"] = disj;
  exports["not"] = not;
  exports["heytingAlgebraBoolean"] = heytingAlgebraBoolean;
})(PS);
(function(exports) {
  "use strict";

  exports.concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Semigroup"] = $PS["Data.Semigroup"] || {};
  var exports = $PS["Data.Semigroup"];
  var $foreign = $PS["Data.Semigroup"];
  var Semigroup = function (append) {
      this.append = append;
  }; 
  var semigroupString = new Semigroup($foreign.concatString);
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
  exports["semigroupString"] = semigroupString;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Monoid"] = $PS["Data.Monoid"] || {};
  var exports = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];
  var Monoid = function (Semigroup0, mempty) {
      this.Semigroup0 = Semigroup0;
      this.mempty = mempty;
  };                 
  var monoidString = new Monoid(function () {
      return Data_Semigroup.semigroupString;
  }, "");
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["Monoid"] = Monoid;
  exports["mempty"] = mempty;
  exports["monoidString"] = monoidString;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Monoid.Disj"] = $PS["Data.Monoid.Disj"] || {};
  var exports = $PS["Data.Monoid.Disj"];
  var Data_HeytingAlgebra = $PS["Data.HeytingAlgebra"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Semigroup = $PS["Data.Semigroup"];      
  var Disj = function (x) {
      return x;
  };
  var semigroupDisj = function (dictHeytingAlgebra) {
      return new Data_Semigroup.Semigroup(function (v) {
          return function (v1) {
              return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
          };
      });
  };
  var monoidDisj = function (dictHeytingAlgebra) {
      return new Data_Monoid.Monoid(function () {
          return semigroupDisj(dictHeytingAlgebra);
      }, Data_HeytingAlgebra.ff(dictHeytingAlgebra));
  };
  exports["Disj"] = Disj;
  exports["semigroupDisj"] = semigroupDisj;
  exports["monoidDisj"] = monoidDisj;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Newtype"] = $PS["Data.Newtype"] || {};
  var exports = $PS["Data.Newtype"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid_Disj = $PS["Data.Monoid.Disj"];                      
  var Newtype = function (unwrap, wrap) {
      this.unwrap = unwrap;
      this.wrap = wrap;
  };
  var wrap = function (dict) {
      return dict.wrap;
  };
  var unwrap = function (dict) {
      return dict.unwrap;
  };                        
  var newtypeDisj = new Newtype(function (v) {
      return v;
  }, Data_Monoid_Disj.Disj);
  var alaF = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictNewtype) {
              return function (dictNewtype1) {
                  return function (v) {
                      return function (f) {
                          return function ($80) {
                              return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($80)));
                          };
                      };
                  };
              };
          };
      };
  };
  exports["unwrap"] = unwrap;
  exports["wrap"] = wrap;
  exports["Newtype"] = Newtype;
  exports["alaF"] = alaF;
  exports["newtypeDisj"] = newtypeDisj;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.MediaType"] = $PS["Data.MediaType"] || {};
  var exports = $PS["Data.MediaType"];
  var Data_Newtype = $PS["Data.Newtype"];          
  var MediaType = function (x) {
      return x;
  }; 
  var newtypeMediaType = new Data_Newtype.Newtype(function (n) {
      return n;
  }, MediaType);
  exports["MediaType"] = MediaType;
  exports["newtypeMediaType"] = newtypeMediaType;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Affjax.RequestHeader"] = $PS["Affjax.RequestHeader"] || {};
  var exports = $PS["Affjax.RequestHeader"];
  var Data_MediaType = $PS["Data.MediaType"];
  var Data_Newtype = $PS["Data.Newtype"];          
  var Accept = (function () {
      function Accept(value0) {
          this.value0 = value0;
      };
      Accept.create = function (value0) {
          return new Accept(value0);
      };
      return Accept;
  })();
  var ContentType = (function () {
      function ContentType(value0) {
          this.value0 = value0;
      };
      ContentType.create = function (value0) {
          return new ContentType(value0);
      };
      return ContentType;
  })();
  var RequestHeader = (function () {
      function RequestHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      RequestHeader.create = function (value0) {
          return function (value1) {
              return new RequestHeader(value0, value1);
          };
      };
      return RequestHeader;
  })();
  var requestHeaderValue = function (v) {
      if (v instanceof Accept) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof ContentType) {
          return Data_Newtype.unwrap(Data_MediaType.newtypeMediaType)(v.value0);
      };
      if (v instanceof RequestHeader) {
          return v.value1;
      };
      throw new Error("Failed pattern match at Affjax.RequestHeader (line 29, column 1 - line 29, column 46): " + [ v.constructor.name ]);
  };
  var requestHeaderName = function (v) {
      if (v instanceof Accept) {
          return "Accept";
      };
      if (v instanceof ContentType) {
          return "Content-Type";
      };
      if (v instanceof RequestHeader) {
          return v.value0;
      };
      throw new Error("Failed pattern match at Affjax.RequestHeader (line 24, column 1 - line 24, column 45): " + [ v.constructor.name ]);
  };
  exports["Accept"] = Accept;
  exports["ContentType"] = ContentType;
  exports["RequestHeader"] = RequestHeader;
  exports["requestHeaderName"] = requestHeaderName;
  exports["requestHeaderValue"] = requestHeaderValue;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Affjax.ResponseFormat"] = $PS["Affjax.ResponseFormat"] || {};
  var exports = $PS["Affjax.ResponseFormat"];
  var Control_Category = $PS["Control.Category"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_MediaType_Common = $PS["Data.MediaType.Common"];
  var ResponseFormatError = (function () {
      function ResponseFormatError(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ResponseFormatError.create = function (value0) {
          return function (value1) {
              return new ResponseFormatError(value0, value1);
          };
      };
      return ResponseFormatError;
  })();
  var $$ArrayBuffer = (function () {
      function $$ArrayBuffer(value0) {
          this.value0 = value0;
      };
      $$ArrayBuffer.create = function (value0) {
          return new $$ArrayBuffer(value0);
      };
      return $$ArrayBuffer;
  })();
  var Blob = (function () {
      function Blob(value0) {
          this.value0 = value0;
      };
      Blob.create = function (value0) {
          return new Blob(value0);
      };
      return Blob;
  })();
  var Document = (function () {
      function Document(value0) {
          this.value0 = value0;
      };
      Document.create = function (value0) {
          return new Document(value0);
      };
      return Document;
  })();
  var Json = (function () {
      function Json(value0) {
          this.value0 = value0;
      };
      Json.create = function (value0) {
          return new Json(value0);
      };
      return Json;
  })();
  var $$String = (function () {
      function $$String(value0) {
          this.value0 = value0;
      };
      $$String.create = function (value0) {
          return new $$String(value0);
      };
      return $$String;
  })();
  var Ignore = (function () {
      function Ignore(value0) {
          this.value0 = value0;
      };
      Ignore.create = function (value0) {
          return new Ignore(value0);
      };
      return Ignore;
  })();
  var toResponseType = function (v) {
      if (v instanceof $$ArrayBuffer) {
          return "arraybuffer";
      };
      if (v instanceof Blob) {
          return "blob";
      };
      if (v instanceof Document) {
          return "document";
      };
      if (v instanceof Json) {
          return "text";
      };
      if (v instanceof $$String) {
          return "text";
      };
      if (v instanceof Ignore) {
          return "";
      };
      throw new Error("Failed pattern match at Affjax.ResponseFormat (line 46, column 3 - line 54, column 1): " + [ v.constructor.name ]);
  };
  var toMediaType = function (v) {
      if (v instanceof Json) {
          return new Data_Maybe.Just(Data_MediaType_Common.applicationJSON);
      };
      return Data_Maybe.Nothing.value;
  };
  var json = new Json(Control_Category.identity(Control_Category.categoryFn));
  var ignore = new Ignore(Control_Category.identity(Control_Category.categoryFn));
  exports["ArrayBuffer"] = $$ArrayBuffer;
  exports["Blob"] = Blob;
  exports["Document"] = Document;
  exports["Json"] = Json;
  exports["String"] = $$String;
  exports["Ignore"] = Ignore;
  exports["json"] = json;
  exports["ignore"] = ignore;
  exports["toResponseType"] = toResponseType;
  exports["toMediaType"] = toMediaType;
  exports["ResponseFormatError"] = ResponseFormatError;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Affjax.ResponseHeader"] = $PS["Affjax.ResponseHeader"] || {};
  var exports = $PS["Affjax.ResponseHeader"];      
  var ResponseHeader = (function () {
      function ResponseHeader(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ResponseHeader.create = function (value0) {
          return function (value1) {
              return new ResponseHeader(value0, value1);
          };
      };
      return ResponseHeader;
  })();
  var responseHeader = function (field) {
      return function (value) {
          return new ResponseHeader(field, value);
      };
  };
  exports["responseHeader"] = responseHeader;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Monad"] = $PS["Control.Monad"] || {};
  var exports = $PS["Control.Monad"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];                
  var Monad = function (Applicative0, Bind1) {
      this.Applicative0 = Applicative0;
      this.Bind1 = Bind1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad.Bind1())(f)(function (v) {
                  return Control_Bind.bind(dictMonad.Bind1())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Bifunctor"] = $PS["Data.Bifunctor"] || {};
  var exports = $PS["Data.Bifunctor"];
  var Control_Category = $PS["Control.Category"];                
  var Bifunctor = function (bimap) {
      this.bimap = bimap;
  };
  var bimap = function (dict) {
      return dict.bimap;
  };
  var lmap = function (dictBifunctor) {
      return function (f) {
          return bimap(dictBifunctor)(f)(Control_Category.identity(Control_Category.categoryFn));
      };
  };
  exports["bimap"] = bimap;
  exports["Bifunctor"] = Bifunctor;
  exports["lmap"] = lmap;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Either"] = $PS["Data.Either"] || {};
  var exports = $PS["Data.Either"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Data_Bifunctor = $PS["Data.Bifunctor"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];              
  var Left = (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var functorEither = new Data_Functor.Functor(function (f) {
      return function (m) {
          if (m instanceof Left) {
              return new Left(m.value0);
          };
          if (m instanceof Right) {
              return new Right(f(m.value0));
          };
          throw new Error("Failed pattern match at Data.Either (line 38, column 8 - line 38, column 52): " + [ m.constructor.name ]);
      };
  });
  var either = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Either (line 238, column 1 - line 238, column 64): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var hush = either(Data_Function["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create);
  var bifunctorEither = new Data_Bifunctor.Bifunctor(function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return new Left(v(v2.value0));
              };
              if (v2 instanceof Right) {
                  return new Right(v1(v2.value0));
              };
              throw new Error("Failed pattern match at Data.Either (line 46, column 1 - line 46, column 45): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  });
  var applyEither = new Control_Apply.Apply(function () {
      return functorEither;
  }, function (v) {
      return function (v1) {
          if (v instanceof Left) {
              return new Left(v.value0);
          };
          if (v instanceof Right) {
              return Data_Functor.map(functorEither)(v.value0)(v1);
          };
          throw new Error("Failed pattern match at Data.Either (line 82, column 1 - line 82, column 41): " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var bindEither = new Control_Bind.Bind(function () {
      return applyEither;
  }, either(function (e) {
      return function (v) {
          return new Left(e);
      };
  })(function (a) {
      return function (f) {
          return f(a);
      };
  }));
  var applicativeEither = new Control_Applicative.Applicative(function () {
      return applyEither;
  }, Right.create);
  var monadEither = new Control_Monad.Monad(function () {
      return applicativeEither;
  }, function () {
      return bindEither;
  });
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["hush"] = hush;
  exports["functorEither"] = functorEither;
  exports["bifunctorEither"] = bifunctorEither;
  exports["applyEither"] = applyEither;
  exports["applicativeEither"] = applicativeEither;
  exports["bindEither"] = bindEither;
  exports["monadEither"] = monadEither;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Monad.Error.Class"] = $PS["Control.Monad.Error.Class"] || {};
  var exports = $PS["Control.Monad.Error.Class"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Data_Either = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];                        
  var MonadThrow = function (Monad0, throwError) {
      this.Monad0 = Monad0;
      this.throwError = throwError;
  };
  var MonadError = function (MonadThrow0, catchError) {
      this.MonadThrow0 = MonadThrow0;
      this.catchError = catchError;
  };
  var throwError = function (dict) {
      return dict.throwError;
  };                                                      
  var catchError = function (dict) {
      return dict.catchError;
  };
  var $$try = function (dictMonadError) {
      return function (a) {
          return catchError(dictMonadError)(Data_Functor.map(((((dictMonadError.MonadThrow0()).Monad0()).Bind1()).Apply0()).Functor0())(Data_Either.Right.create)(a))(function ($21) {
              return Control_Applicative.pure(((dictMonadError.MonadThrow0()).Monad0()).Applicative0())(Data_Either.Left.create($21));
          });
      };
  };
  exports["catchError"] = catchError;
  exports["throwError"] = throwError;
  exports["MonadThrow"] = MonadThrow;
  exports["MonadError"] = MonadError;
  exports["try"] = $$try;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Monad.Except.Trans"] = $PS["Control.Monad.Except.Trans"] || {};
  var exports = $PS["Control.Monad.Except.Trans"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Control_Monad_Error_Class = $PS["Control.Monad.Error.Class"];
  var Data_Either = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];                
  var ExceptT = function (x) {
      return x;
  };
  var runExceptT = function (v) {
      return v;
  }; 
  var mapExceptT = function (f) {
      return function (v) {
          return f(v);
      };
  };
  var functorExceptT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return mapExceptT(Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Either.functorEither)(f)));
      });
  };
  var monadExceptT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeExceptT(dictMonad);
      }, function () {
          return bindExceptT(dictMonad);
      });
  };
  var bindExceptT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyExceptT(dictMonad);
      }, function (v) {
          return function (k) {
              return Control_Bind.bind(dictMonad.Bind1())(v)(Data_Either.either(function ($97) {
                  return Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Left.create($97));
              })(function (a) {
                  var v1 = k(a);
                  return v1;
              }));
          };
      });
  };
  var applyExceptT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorExceptT(((dictMonad.Bind1()).Apply0()).Functor0());
      }, Control_Monad.ap(monadExceptT(dictMonad)));
  };
  var applicativeExceptT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyExceptT(dictMonad);
      }, function ($98) {
          return ExceptT(Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Right.create($98)));
      });
  };
  var monadThrowExceptT = function (dictMonad) {
      return new Control_Monad_Error_Class.MonadThrow(function () {
          return monadExceptT(dictMonad);
      }, function ($102) {
          return ExceptT(Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Left.create($102)));
      });
  };
  exports["ExceptT"] = ExceptT;
  exports["runExceptT"] = runExceptT;
  exports["mapExceptT"] = mapExceptT;
  exports["functorExceptT"] = functorExceptT;
  exports["applyExceptT"] = applyExceptT;
  exports["applicativeExceptT"] = applicativeExceptT;
  exports["bindExceptT"] = bindExceptT;
  exports["monadExceptT"] = monadExceptT;
  exports["monadThrowExceptT"] = monadThrowExceptT;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Identity"] = $PS["Data.Identity"] || {};
  var exports = $PS["Data.Identity"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Newtype = $PS["Data.Newtype"];          
  var Identity = function (x) {
      return x;
  };
  var newtypeIdentity = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Identity);
  var functorIdentity = new Data_Functor.Functor(function (f) {
      return function (m) {
          return f(m);
      };
  });
  var applyIdentity = new Control_Apply.Apply(function () {
      return functorIdentity;
  }, function (v) {
      return function (v1) {
          return v(v1);
      };
  });
  var bindIdentity = new Control_Bind.Bind(function () {
      return applyIdentity;
  }, function (v) {
      return function (f) {
          return f(v);
      };
  });
  var applicativeIdentity = new Control_Applicative.Applicative(function () {
      return applyIdentity;
  }, Identity);
  var monadIdentity = new Control_Monad.Monad(function () {
      return applicativeIdentity;
  }, function () {
      return bindIdentity;
  });
  exports["Identity"] = Identity;
  exports["newtypeIdentity"] = newtypeIdentity;
  exports["functorIdentity"] = functorIdentity;
  exports["applyIdentity"] = applyIdentity;
  exports["applicativeIdentity"] = applicativeIdentity;
  exports["bindIdentity"] = bindIdentity;
  exports["monadIdentity"] = monadIdentity;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Monad.Except"] = $PS["Control.Monad.Except"] || {};
  var exports = $PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = $PS["Control.Monad.Except.Trans"];
  var Data_Identity = $PS["Data.Identity"];
  var Data_Newtype = $PS["Data.Newtype"];                                                
  var runExcept = function ($0) {
      return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(Control_Monad_Except_Trans.runExceptT($0));
  };
  exports["runExcept"] = runExcept;
})(PS);
(function(exports) {
  "use strict";

  function id(x) {
    return x;
  }                       
  exports.fromString = id;
  exports.fromObject = id;

  exports.stringify = function (j) {
    return JSON.stringify(j);
  };

  var objToString = Object.prototype.toString;

  function isArray(a) {
    return objToString.call(a) === "[object Array]";
  }

  exports._caseJson = function (isNull, isBool, isNum, isStr, isArr, isObj, j) {
    if (j == null) return isNull();
    else if (typeof j === "boolean") return isBool(j);
    else if (typeof j === "number") return isNum(j);
    else if (typeof j === "string") return isStr(j);
    else if (objToString.call(j) === "[object Array]")
      return isArr(j);
    else return isObj(j);
  };
})(PS["Data.Argonaut.Core"] = PS["Data.Argonaut.Core"] || {});
(function(exports) {
  "use strict";

  exports._copyST = function (m) {
    return function () {
      var r = {};
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r[k] = m[k];
        }
      }
      return r;
    };
  };

  exports.empty = {};

  exports.runST = function (f) {
    return f();
  };

  exports._fmapObject = function (m0, f) {
    var m = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m[k] = f(m0[k]);
      }
    }
    return m;
  };

  exports._mapWithKey = function (m0, f) {
    var m = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m[k] = f(k)(m0[k]);
      }
    }
    return m;
  };

  exports._foldM = function (bind) {
    return function (f) {
      return function (mz) {
        return function (m) {
          var acc = mz;
          function g(k) {
            return function (z) {
              return f(z)(k)(m[k]);
            };
          }
          for (var k in m) {
            if (hasOwnProperty.call(m, k)) {
              acc = bind(acc)(g(k));
            }
          }
          return acc;
        };
      };
    };
  };

  exports._lookup = function (no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  };

  function toArrayWithKey(f) {
    return function (m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }

  exports.toArrayWithKey = toArrayWithKey;
})(PS["Foreign.Object"] = PS["Foreign.Object"] || {});
(function(exports) {
  "use strict";

  exports.map_ = function (f) {
    return function (a) {
      return function () {
        return f(a());
      };
    };
  };

  exports.pure_ = function (a) {
    return function () {
      return a;
    };
  };

  exports.bind_ = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Control.Monad.ST.Internal"] = PS["Control.Monad.ST.Internal"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Monad.ST.Internal"] = $PS["Control.Monad.ST.Internal"] || {};
  var exports = $PS["Control.Monad.ST.Internal"];
  var $foreign = $PS["Control.Monad.ST.Internal"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Data_Functor = $PS["Data.Functor"];
  var functorST = new Data_Functor.Functor($foreign.map_);
  var monadST = new Control_Monad.Monad(function () {
      return applicativeST;
  }, function () {
      return bindST;
  });
  var bindST = new Control_Bind.Bind(function () {
      return applyST;
  }, $foreign.bind_);
  var applyST = new Control_Apply.Apply(function () {
      return functorST;
  }, Control_Monad.ap(monadST));
  var applicativeST = new Control_Applicative.Applicative(function () {
      return applyST;
  }, $foreign.pure_);
  exports["functorST"] = functorST;
  exports["applyST"] = applyST;
  exports["applicativeST"] = applicativeST;
  exports["bindST"] = bindST;
  exports["monadST"] = monadST;
})(PS);
(function(exports) {
  "use strict";

  //------------------------------------------------------------------------------
  // Array creation --------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.range = function (start) {
    return function (end) {
      var step = start > end ? -1 : 1;
      var result = new Array(step * (end - start) + 1);
      var i = start, n = 0;
      while (i !== end) {
        result[n++] = i;
        i += step;
      }
      result[n] = i;
      return result;
    };
  };   

  //------------------------------------------------------------------------------
  // Array size ------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.length = function (xs) {
    return xs.length;
  };

  //------------------------------------------------------------------------------
  // Extending arrays ------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.cons = function (e) {
    return function (l) {
      return [e].concat(l);
    };
  };

  exports.snoc = function (l) {
    return function (e) {
      var l1 = l.slice();
      l1.push(e);
      return l1;
    };
  };

  //------------------------------------------------------------------------------
  // Non-indexed reads -----------------------------------------------------------
  //------------------------------------------------------------------------------

  exports["uncons'"] = function (empty) {
    return function (next) {
      return function (xs) {
        return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
      };
    };
  };

  //------------------------------------------------------------------------------
  // Transformations -------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.reverse = function (l) {
    return l.slice().reverse();
  };

  exports.concat = function (xss) {
    if (xss.length <= 10000) {
      // This method is faster, but it crashes on big arrays.
      // So we use it when can and fallback to simple variant otherwise.
      return Array.prototype.concat.apply([], xss);
    }

    var result = [];
    for (var i = 0, l = xss.length; i < l; i++) {
      var xs = xss[i];
      for (var j = 0, m = xs.length; j < m; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };

  //------------------------------------------------------------------------------
  // Sorting ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.sortImpl = function (f) {
    return function (l) {
      return l.slice().sort(function (x, y) {
        return f(x)(y);
      });
    };
  };

  //------------------------------------------------------------------------------
  // Subarrays -------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.slice = function (s) {
    return function (e) {
      return function (l) {
        return l.slice(s, e);
      };
    };
  };

  //------------------------------------------------------------------------------
  // Zipping ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.zipWith = function (f) {
    return function (xs) {
      return function (ys) {
        var l = xs.length < ys.length ? xs.length : ys.length;
        var result = new Array(l);
        for (var i = 0; i < l; i++) {
          result[i] = f(xs[i])(ys[i]);
        }
        return result;
      };
    };
  };

  //------------------------------------------------------------------------------
  // Partial ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.unsafeIndexImpl = function (xs) {
    return function (n) {
      return xs[n];
    };
  };
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Boolean"] = $PS["Data.Boolean"] || {};
  var exports = $PS["Data.Boolean"];
  var otherwise = true;
  exports["otherwise"] = otherwise;
})(PS);
(function(exports) {
  "use strict";

  exports.unsafeCompareImpl = function (lt) {
    return function (eq) {
      return function (gt) {
        return function (x) {
          return function (y) {
            return x < y ? lt : x === y ? eq : gt;
          };
        };
      };
    };
  };
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Ordering"] = $PS["Data.Ordering"] || {};
  var exports = $PS["Data.Ordering"];              
  var LT = (function () {
      function LT() {

      };
      LT.value = new LT();
      return LT;
  })();
  var GT = (function () {
      function GT() {

      };
      GT.value = new GT();
      return GT;
  })();
  var EQ = (function () {
      function EQ() {

      };
      EQ.value = new EQ();
      return EQ;
  })();
  exports["LT"] = LT;
  exports["GT"] = GT;
  exports["EQ"] = EQ;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Ord.Unsafe"] = $PS["Data.Ord.Unsafe"] || {};
  var exports = $PS["Data.Ord.Unsafe"];
  var $foreign = $PS["Data.Ord.Unsafe"];
  var Data_Ordering = $PS["Data.Ordering"];                
  var unsafeCompare = $foreign.unsafeCompareImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
  exports["unsafeCompare"] = unsafeCompare;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Ord"] = $PS["Data.Ord"] || {};
  var exports = $PS["Data.Ord"];
  var Data_Eq = $PS["Data.Eq"];
  var Data_Ord_Unsafe = $PS["Data.Ord.Unsafe"];
  var Data_Ordering = $PS["Data.Ordering"];
  var Ord = function (Eq0, compare) {
      this.Eq0 = Eq0;
      this.compare = compare;
  }; 
  var ordString = new Ord(function () {
      return Data_Eq.eqString;
  }, Data_Ord_Unsafe.unsafeCompare);
  var ordInt = new Ord(function () {
      return Data_Eq.eqInt;
  }, Data_Ord_Unsafe.unsafeCompare);
  var ordChar = new Ord(function () {
      return Data_Eq.eqChar;
  }, Data_Ord_Unsafe.unsafeCompare);
  var compare = function (dict) {
      return dict.compare;
  };
  var comparing = function (dictOrd) {
      return function (f) {
          return function (x) {
              return function (y) {
                  return compare(dictOrd)(f(x))(f(y));
              };
          };
      };
  };
  var max = function (dictOrd) {
      return function (x) {
          return function (y) {
              var v = compare(dictOrd)(x)(y);
              if (v instanceof Data_Ordering.LT) {
                  return y;
              };
              if (v instanceof Data_Ordering.EQ) {
                  return x;
              };
              if (v instanceof Data_Ordering.GT) {
                  return x;
              };
              throw new Error("Failed pattern match at Data.Ord (line 128, column 3 - line 131, column 12): " + [ v.constructor.name ]);
          };
      };
  };
  var min = function (dictOrd) {
      return function (x) {
          return function (y) {
              var v = compare(dictOrd)(x)(y);
              if (v instanceof Data_Ordering.LT) {
                  return x;
              };
              if (v instanceof Data_Ordering.EQ) {
                  return x;
              };
              if (v instanceof Data_Ordering.GT) {
                  return y;
              };
              throw new Error("Failed pattern match at Data.Ord (line 119, column 3 - line 122, column 12): " + [ v.constructor.name ]);
          };
      };
  };
  var clamp = function (dictOrd) {
      return function (low) {
          return function (hi) {
              return function (x) {
                  return min(dictOrd)(hi)(max(dictOrd)(low)(x));
              };
          };
      };
  };
  exports["Ord"] = Ord;
  exports["compare"] = compare;
  exports["comparing"] = comparing;
  exports["min"] = min;
  exports["max"] = max;
  exports["clamp"] = clamp;
  exports["ordInt"] = ordInt;
  exports["ordString"] = ordString;
  exports["ordChar"] = ordChar;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Tuple"] = $PS["Data.Tuple"] || {};
  var exports = $PS["Data.Tuple"];                         
  var Tuple = (function () {
      function Tuple(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Tuple.create = function (value0) {
          return function (value1) {
              return new Tuple(value0, value1);
          };
      };
      return Tuple;
  })();
  var uncurry = function (f) {
      return function (v) {
          return f(v.value0)(v.value1);
      };
  };
  var snd = function (v) {
      return v.value1;
  };                                                                                                    
  var fst = function (v) {
      return v.value0;
  };
  exports["Tuple"] = Tuple;
  exports["fst"] = fst;
  exports["snd"] = snd;
  exports["uncurry"] = uncurry;
})(PS);
(function(exports) {
  "use strict";

  exports.unfoldrArrayImpl = function (isNothing) {
    return function (fromJust) {
      return function (fst) {
        return function (snd) {
          return function (f) {
            return function (b) {
              var result = [];
              var value = b;
              while (true) { // eslint-disable-line no-constant-condition
                var maybe = f(value);
                if (isNothing(maybe)) return result;
                var tuple = fromJust(maybe);
                result.push(fst(tuple));
                value = snd(tuple);
              }
            };
          };
        };
      };
    };
  };
})(PS["Data.Unfoldable"] = PS["Data.Unfoldable"] || {});
(function(exports) {
  "use strict";

  exports.unfoldr1ArrayImpl = function (isNothing) {
    return function (fromJust) {
      return function (fst) {
        return function (snd) {
          return function (f) {
            return function (b) {
              var result = [];
              var value = b;
              while (true) { // eslint-disable-line no-constant-condition
                var tuple = f(value);
                result.push(fst(tuple));
                var maybe = snd(tuple);
                if (isNothing(maybe)) return result;
                value = fromJust(maybe);
              }
            };
          };
        };
      };
    };
  };
})(PS["Data.Unfoldable1"] = PS["Data.Unfoldable1"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Unfoldable1"] = $PS["Data.Unfoldable1"] || {};
  var exports = $PS["Data.Unfoldable1"];
  var $foreign = $PS["Data.Unfoldable1"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Tuple = $PS["Data.Tuple"];                
  var Unfoldable1 = function (unfoldr1) {
      this.unfoldr1 = unfoldr1;
  };
  var unfoldr1 = function (dict) {
      return dict.unfoldr1;
  };
  var unfoldable1Array = new Unfoldable1($foreign.unfoldr1ArrayImpl(Data_Maybe.isNothing)(Data_Maybe.fromJust())(Data_Tuple.fst)(Data_Tuple.snd));
  exports["Unfoldable1"] = Unfoldable1;
  exports["unfoldr1"] = unfoldr1;
  exports["unfoldable1Array"] = unfoldable1Array;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Unfoldable"] = $PS["Data.Unfoldable"] || {};
  var exports = $PS["Data.Unfoldable"];
  var $foreign = $PS["Data.Unfoldable"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Tuple = $PS["Data.Tuple"];
  var Data_Unfoldable1 = $PS["Data.Unfoldable1"];  
  var Unfoldable = function (Unfoldable10, unfoldr) {
      this.Unfoldable10 = Unfoldable10;
      this.unfoldr = unfoldr;
  };
  var unfoldr = function (dict) {
      return dict.unfoldr;
  };
  var unfoldableArray = new Unfoldable(function () {
      return Data_Unfoldable1.unfoldable1Array;
  }, $foreign.unfoldrArrayImpl(Data_Maybe.isNothing)(Data_Maybe.fromJust())(Data_Tuple.fst)(Data_Tuple.snd));
  exports["Unfoldable"] = Unfoldable;
  exports["unfoldr"] = unfoldr;
  exports["unfoldableArray"] = unfoldableArray;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Array"] = $PS["Data.Array"] || {};
  var exports = $PS["Data.Array"];
  var $foreign = $PS["Data.Array"];
  var Data_Boolean = $PS["Data.Boolean"];
  var Data_Function = $PS["Data.Function"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Ord = $PS["Data.Ord"];
  var Data_Ordering = $PS["Data.Ordering"];
  var Data_Tuple = $PS["Data.Tuple"];
  var Data_Unfoldable = $PS["Data.Unfoldable"];                                          
  var unsafeIndex = function (dictPartial) {
      return $foreign.unsafeIndexImpl;
  };
  var uncons = $foreign["uncons'"](Data_Function["const"](Data_Maybe.Nothing.value))(function (x) {
      return function (xs) {
          return new Data_Maybe.Just({
              head: x,
              tail: xs
          });
      };
  });
  var toUnfoldable = function (dictUnfoldable) {
      return function (xs) {
          var len = $foreign.length(xs);
          var f = function (i) {
              if (i < len) {
                  return new Data_Maybe.Just(new Data_Tuple.Tuple(unsafeIndex()(xs)(i), i + 1 | 0));
              };
              if (Data_Boolean.otherwise) {
                  return Data_Maybe.Nothing.value;
              };
              throw new Error("Failed pattern match at Data.Array (line 143, column 3 - line 145, column 26): " + [ i.constructor.name ]);
          };
          return Data_Unfoldable.unfoldr(dictUnfoldable)(f)(0);
      };
  }; 
  var sortBy = function (comp) {
      return function (xs) {
          var comp$prime = function (x) {
              return function (y) {
                  var v = comp(x)(y);
                  if (v instanceof Data_Ordering.GT) {
                      return 1;
                  };
                  if (v instanceof Data_Ordering.EQ) {
                      return 0;
                  };
                  if (v instanceof Data_Ordering.LT) {
                      return -1 | 0;
                  };
                  throw new Error("Failed pattern match at Data.Array (line 702, column 15 - line 707, column 1): " + [ v.constructor.name ]);
              };
          };
          return $foreign.sortImpl(comp$prime)(xs);
      };
  };
  var sortWith = function (dictOrd) {
      return function (f) {
          return sortBy(Data_Ord.comparing(dictOrd)(f));
      };
  };
  exports["toUnfoldable"] = toUnfoldable;
  exports["uncons"] = uncons;
  exports["sortBy"] = sortBy;
  exports["sortWith"] = sortWith;
  exports["unsafeIndex"] = unsafeIndex;
  exports["range"] = $foreign.range;
  exports["length"] = $foreign.length;
  exports["cons"] = $foreign.cons;
  exports["snoc"] = $foreign.snoc;
  exports["reverse"] = $foreign.reverse;
  exports["zipWith"] = $foreign.zipWith;
})(PS);
(function(exports) {
  "use strict";

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Foldable"] = $PS["Data.Foldable"] || {};
  var exports = $PS["Data.Foldable"];
  var $foreign = $PS["Data.Foldable"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Category = $PS["Control.Category"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Monoid_Disj = $PS["Data.Monoid.Disj"];
  var Data_Newtype = $PS["Data.Newtype"];
  var Data_Semigroup = $PS["Data.Semigroup"];
  var Data_Unit = $PS["Data.Unit"];                
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var traverse_ = function (dictApplicative) {
      return function (dictFoldable) {
          return function (f) {
              return foldr(dictFoldable)(function ($195) {
                  return Control_Apply.applySecond(dictApplicative.Apply0())(f($195));
              })(Control_Applicative.pure(dictApplicative)(Data_Unit.unit));
          };
      };
  };
  var sequence_ = function (dictApplicative) {
      return function (dictFoldable) {
          return traverse_(dictApplicative)(dictFoldable)(Control_Category.identity(Control_Category.categoryFn));
      };
  };
  var foldl = function (dict) {
      return dict.foldl;
  };
  var intercalate = function (dictFoldable) {
      return function (dictMonoid) {
          return function (sep) {
              return function (xs) {
                  var go = function (v) {
                      return function (x) {
                          if (v.init) {
                              return {
                                  init: false,
                                  acc: x
                              };
                          };
                          return {
                              init: false,
                              acc: Data_Semigroup.append(dictMonoid.Semigroup0())(v.acc)(Data_Semigroup.append(dictMonoid.Semigroup0())(sep)(x))
                          };
                      };
                  };
                  return (foldl(dictFoldable)(go)({
                      init: true,
                      acc: Data_Monoid.mempty(dictMonoid)
                  })(xs)).acc;
              };
          };
      };
  }; 
  var foldMapDefaultR = function (dictFoldable) {
      return function (dictMonoid) {
          return function (f) {
              return foldr(dictFoldable)(function (x) {
                  return function (acc) {
                      return Data_Semigroup.append(dictMonoid.Semigroup0())(f(x))(acc);
                  };
              })(Data_Monoid.mempty(dictMonoid));
          };
      };
  };
  var foldableArray = new Foldable(function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  var any = function (dictFoldable) {
      return function (dictHeytingAlgebra) {
          return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Newtype.newtypeDisj)(Data_Newtype.newtypeDisj)(Data_Monoid_Disj.Disj)(foldMap(dictFoldable)(Data_Monoid_Disj.monoidDisj(dictHeytingAlgebra)));
      };
  };
  exports["Foldable"] = Foldable;
  exports["foldr"] = foldr;
  exports["foldl"] = foldl;
  exports["foldMap"] = foldMap;
  exports["foldMapDefaultR"] = foldMapDefaultR;
  exports["traverse_"] = traverse_;
  exports["sequence_"] = sequence_;
  exports["intercalate"] = intercalate;
  exports["any"] = any;
  exports["foldableArray"] = foldableArray;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.FoldableWithIndex"] = $PS["Data.FoldableWithIndex"] || {};
  var exports = $PS["Data.FoldableWithIndex"];
  var FoldableWithIndex = function (Foldable0, foldMapWithIndex, foldlWithIndex, foldrWithIndex) {
      this.Foldable0 = Foldable0;
      this.foldMapWithIndex = foldMapWithIndex;
      this.foldlWithIndex = foldlWithIndex;
      this.foldrWithIndex = foldrWithIndex;
  };
  var foldrWithIndex = function (dict) {
      return dict.foldrWithIndex;
  };
  var foldlWithIndex = function (dict) {
      return dict.foldlWithIndex;
  };
  var foldMapWithIndex = function (dict) {
      return dict.foldMapWithIndex;
  };
  exports["FoldableWithIndex"] = FoldableWithIndex;
  exports["foldrWithIndex"] = foldrWithIndex;
  exports["foldlWithIndex"] = foldlWithIndex;
  exports["foldMapWithIndex"] = foldMapWithIndex;
})(PS);
(function(exports) {
  "use strict";

  exports.runFn4 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return function (d) {
            return fn(a, b, c, d);
          };
        };
      };
    };
  };
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Function.Uncurried"] = $PS["Data.Function.Uncurried"] || {};
  var exports = $PS["Data.Function.Uncurried"];
  var $foreign = $PS["Data.Function.Uncurried"];
  exports["runFn4"] = $foreign.runFn4;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.FunctorWithIndex"] = $PS["Data.FunctorWithIndex"] || {};
  var exports = $PS["Data.FunctorWithIndex"];      
  var FunctorWithIndex = function (Functor0, mapWithIndex) {
      this.Functor0 = Functor0;
      this.mapWithIndex = mapWithIndex;
  };
  var mapWithIndex = function (dict) {
      return dict.mapWithIndex;
  };
  exports["FunctorWithIndex"] = FunctorWithIndex;
  exports["mapWithIndex"] = mapWithIndex;
})(PS);
(function(exports) {
  "use strict";

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function array1(a) {
      return [a];
    }

    function array2(a) {
      return function (b) {
        return [a, b];
      };
    }

    function array3(a) {
      return function (b) {
        return function (c) {
          return [a, b, c];
        };
      };
    }

    function concat2(xs) {
      return function (ys) {
        return xs.concat(ys);
      };
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            return function (array) {
              function go(bot, top) {
                switch (top - bot) {
                case 0: return pure([]);
                case 1: return map(array1)(f(array[bot]));
                case 2: return apply(map(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3: return apply(apply(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  // This slightly tricky pivot selection aims to produce two
                  // even-length partitions where possible.
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply(map(concat2)(go(bot, pivot)))(go(pivot, top));
                }
              }
              return go(0, array.length);
            };
          };
        };
      };
    };
  }();
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Traversable"] = $PS["Data.Traversable"] || {};
  var exports = $PS["Data.Traversable"];
  var $foreign = $PS["Data.Traversable"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Category = $PS["Control.Category"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];                                                      
  var Traversable = function (Foldable1, Functor0, sequence, traverse) {
      this.Foldable1 = Foldable1;
      this.Functor0 = Functor0;
      this.sequence = sequence;
      this.traverse = traverse;
  };
  var traverse = function (dict) {
      return dict.traverse;
  }; 
  var sequenceDefault = function (dictTraversable) {
      return function (dictApplicative) {
          return traverse(dictTraversable)(dictApplicative)(Control_Category.identity(Control_Category.categoryFn));
      };
  };
  var traversableArray = new Traversable(function () {
      return Data_Foldable.foldableArray;
  }, function () {
      return Data_Functor.functorArray;
  }, function (dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
  }, function (dictApplicative) {
      return $foreign.traverseArrayImpl(Control_Apply.apply(dictApplicative.Apply0()))(Data_Functor.map((dictApplicative.Apply0()).Functor0()))(Control_Applicative.pure(dictApplicative));
  });
  var sequence = function (dict) {
      return dict.sequence;
  };
  exports["Traversable"] = Traversable;
  exports["traverse"] = traverse;
  exports["sequence"] = sequence;
  exports["sequenceDefault"] = sequenceDefault;
  exports["traversableArray"] = traversableArray;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.TraversableWithIndex"] = $PS["Data.TraversableWithIndex"] || {};
  var exports = $PS["Data.TraversableWithIndex"];  
  var TraversableWithIndex = function (FoldableWithIndex1, FunctorWithIndex0, Traversable2, traverseWithIndex) {
      this.FoldableWithIndex1 = FoldableWithIndex1;
      this.FunctorWithIndex0 = FunctorWithIndex0;
      this.Traversable2 = Traversable2;
      this.traverseWithIndex = traverseWithIndex;
  };
  var traverseWithIndex = function (dict) {
      return dict.traverseWithIndex;
  };
  exports["TraversableWithIndex"] = TraversableWithIndex;
  exports["traverseWithIndex"] = traverseWithIndex;
})(PS);
(function(exports) {
  "use strict";

  exports["new"] = function () {
    return {};
  };

  exports.poke = function (k) {
    return function (v) {
      return function (m) {
        return function () {
          m[k] = v;
          return m;
        };
      };
    };
  };
})(PS["Foreign.Object.ST"] = PS["Foreign.Object.ST"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Foreign.Object.ST"] = $PS["Foreign.Object.ST"] || {};
  var exports = $PS["Foreign.Object.ST"];
  var $foreign = $PS["Foreign.Object.ST"];
  exports["new"] = $foreign["new"];
  exports["poke"] = $foreign.poke;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Foreign.Object"] = $PS["Foreign.Object"] || {};
  var exports = $PS["Foreign.Object"];
  var $foreign = $PS["Foreign.Object"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Category = $PS["Control.Category"];
  var Control_Monad_ST_Internal = $PS["Control.Monad.ST.Internal"];
  var Data_Array = $PS["Data.Array"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_FoldableWithIndex = $PS["Data.FoldableWithIndex"];
  var Data_Function = $PS["Data.Function"];
  var Data_Function_Uncurried = $PS["Data.Function.Uncurried"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_FunctorWithIndex = $PS["Data.FunctorWithIndex"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_Ord = $PS["Data.Ord"];
  var Data_Semigroup = $PS["Data.Semigroup"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Data_TraversableWithIndex = $PS["Data.TraversableWithIndex"];
  var Data_Tuple = $PS["Data.Tuple"];
  var Foreign_Object_ST = $PS["Foreign.Object.ST"];        
  var values = $foreign.toArrayWithKey(function (v) {
      return function (v1) {
          return v1;
      };
  });
  var toUnfoldable = function (dictUnfoldable) {
      return function ($45) {
          return Data_Array.toUnfoldable(dictUnfoldable)($foreign.toArrayWithKey(Data_Tuple.Tuple.create)($45));
      };
  };
  var toAscUnfoldable = function (dictUnfoldable) {
      return function ($46) {
          return Data_Array.toUnfoldable(dictUnfoldable)(Data_Array.sortWith(Data_Ord.ordString)(Data_Tuple.fst)($foreign.toArrayWithKey(Data_Tuple.Tuple.create)($46)));
      };
  };                                                             
  var thawST = $foreign["_copyST"];
  var mutate = function (f) {
      return function (m) {
          return $foreign.runST(function __do() {
              var v = thawST(m)();
              var v1 = f(v)();
              return v;
          });
      };
  };                                                                                                    
  var mapWithKey = function (f) {
      return function (m) {
          return $foreign["_mapWithKey"](m, f);
      };
  };
  var lookup = Data_Function_Uncurried.runFn4($foreign["_lookup"])(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
  var insert = function (k) {
      return function (v) {
          return mutate(Foreign_Object_ST.poke(k)(v));
      };
  };
  var functorObject = new Data_Functor.Functor(function (f) {
      return function (m) {
          return $foreign["_fmapObject"](m, f);
      };
  });
  var functorWithIndexObject = new Data_FunctorWithIndex.FunctorWithIndex(function () {
      return functorObject;
  }, mapWithKey);
  var foldM = function (dictMonad) {
      return function (f) {
          return function (z) {
              return $foreign["_foldM"](Control_Bind.bind(dictMonad.Bind1()))(f)(Control_Applicative.pure(dictMonad.Applicative0())(z));
          };
      };
  };
  var fold = $foreign["_foldM"](Data_Function.applyFlipped);
  var foldMap = function (dictMonoid) {
      return function (f) {
          return fold(function (acc) {
              return function (k) {
                  return function (v) {
                      return Data_Semigroup.append(dictMonoid.Semigroup0())(acc)(f(k)(v));
                  };
              };
          })(Data_Monoid.mempty(dictMonoid));
      };
  };
  var foldableObject = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return foldMap(dictMonoid)(Data_Function["const"](f));
      };
  }, function (f) {
      return fold(function (z) {
          return function (v) {
              return f(z);
          };
      });
  }, function (f) {
      return function (z) {
          return function (m) {
              return Data_Foldable.foldr(Data_Foldable.foldableArray)(f)(z)(values(m));
          };
      };
  });
  var foldableWithIndexObject = new Data_FoldableWithIndex.FoldableWithIndex(function () {
      return foldableObject;
  }, function (dictMonoid) {
      return foldMap(dictMonoid);
  }, function (f) {
      return fold(Data_Function.flip(f));
  }, function (f) {
      return function (z) {
          return function (m) {
              return Data_Foldable.foldr(Data_Foldable.foldableArray)(Data_Tuple.uncurry(f))(z)($foreign.toArrayWithKey(Data_Tuple.Tuple.create)(m));
          };
      };
  });
  var traversableWithIndexObject = new Data_TraversableWithIndex.TraversableWithIndex(function () {
      return foldableWithIndexObject;
  }, function () {
      return functorWithIndexObject;
  }, function () {
      return traversableObject;
  }, function (dictApplicative) {
      return function (f) {
          return function (ms) {
              return fold(function (acc) {
                  return function (k) {
                      return function (v) {
                          return Control_Apply.apply(dictApplicative.Apply0())(Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Function.flip(insert(k)))(acc))(f(k)(v));
                      };
                  };
              })(Control_Applicative.pure(dictApplicative)($foreign.empty))(ms);
          };
      };
  });
  var traversableObject = new Data_Traversable.Traversable(function () {
      return foldableObject;
  }, function () {
      return functorObject;
  }, function (dictApplicative) {
      return Data_Traversable.traverse(traversableObject)(dictApplicative)(Control_Category.identity(Control_Category.categoryFn));
  }, function (dictApplicative) {
      return function ($47) {
          return Data_TraversableWithIndex.traverseWithIndex(traversableWithIndexObject)(dictApplicative)(Data_Function["const"]($47));
      };
  });
  var filterWithKey = function (predicate) {
      return function (m) {
          var go = (function () {
              var step = function (acc) {
                  return function (k) {
                      return function (v) {
                          var $41 = predicate(k)(v);
                          if ($41) {
                              return Foreign_Object_ST.poke(k)(v)(acc);
                          };
                          return Control_Applicative.pure(Control_Monad_ST_Internal.applicativeST)(acc);
                      };
                  };
              };
              return function __do() {
                  var v = Foreign_Object_ST["new"]();
                  return foldM(Control_Monad_ST_Internal.monadST)(step)(v)(m)();
              };
          })();
          return $foreign.runST(go);
      };
  };
  var filterKeys = function (predicate) {
      return filterWithKey(function ($48) {
          return Data_Function["const"](predicate($48));
      });
  };
  var filter = function (predicate) {
      return filterWithKey(Data_Function["const"](predicate));
  };
  exports["insert"] = insert;
  exports["lookup"] = lookup;
  exports["toUnfoldable"] = toUnfoldable;
  exports["toAscUnfoldable"] = toAscUnfoldable;
  exports["mapWithKey"] = mapWithKey;
  exports["filterWithKey"] = filterWithKey;
  exports["filterKeys"] = filterKeys;
  exports["filter"] = filter;
  exports["values"] = values;
  exports["fold"] = fold;
  exports["foldMap"] = foldMap;
  exports["foldM"] = foldM;
  exports["thawST"] = thawST;
  exports["functorObject"] = functorObject;
  exports["functorWithIndexObject"] = functorWithIndexObject;
  exports["foldableObject"] = foldableObject;
  exports["foldableWithIndexObject"] = foldableWithIndexObject;
  exports["traversableObject"] = traversableObject;
  exports["traversableWithIndexObject"] = traversableWithIndexObject;
  exports["empty"] = $foreign.empty;
  exports["toArrayWithKey"] = $foreign.toArrayWithKey;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Argonaut.Core"] = $PS["Data.Argonaut.Core"] || {};
  var exports = $PS["Data.Argonaut.Core"];
  var $foreign = $PS["Data.Argonaut.Core"];
  var Data_Function = $PS["Data.Function"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Foreign_Object = $PS["Foreign.Object"];                
  var verbJsonType = function (def) {
      return function (f) {
          return function (g) {
              return g(def)(f);
          };
      };
  };
  var toJsonType = verbJsonType(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
  var jsonEmptyObject = $foreign.fromObject(Foreign_Object.empty);
  var caseJsonString = function (d) {
      return function (f) {
          return function (j) {
              return $foreign["_caseJson"](Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), f, Data_Function["const"](d), Data_Function["const"](d), j);
          };
      };
  };                                        
  var toString = toJsonType(caseJsonString);
  var caseJsonObject = function (d) {
      return function (f) {
          return function (j) {
              return $foreign["_caseJson"](Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), f, j);
          };
      };
  };                                        
  var toObject = toJsonType(caseJsonObject);
  var caseJsonNumber = function (d) {
      return function (f) {
          return function (j) {
              return $foreign["_caseJson"](Data_Function["const"](d), Data_Function["const"](d), f, Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), j);
          };
      };
  };                                        
  var toNumber = toJsonType(caseJsonNumber);  
  var caseJsonArray = function (d) {
      return function (f) {
          return function (j) {
              return $foreign["_caseJson"](Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), f, Data_Function["const"](d), j);
          };
      };
  };                                      
  var toArray = toJsonType(caseJsonArray);
  exports["caseJsonNumber"] = caseJsonNumber;
  exports["caseJsonString"] = caseJsonString;
  exports["caseJsonArray"] = caseJsonArray;
  exports["caseJsonObject"] = caseJsonObject;
  exports["toNumber"] = toNumber;
  exports["toString"] = toString;
  exports["toArray"] = toArray;
  exports["toObject"] = toObject;
  exports["jsonEmptyObject"] = jsonEmptyObject;
  exports["fromString"] = $foreign.fromString;
  exports["fromObject"] = $foreign.fromObject;
  exports["stringify"] = $foreign.stringify;
})(PS);
(function(exports) {
  "use strict";

  exports._jsonParser = function (fail, succ, s) {
    try {
      return succ(JSON.parse(s));
    }
    catch (e) {
      return fail(e.message);
    }
  };
})(PS["Data.Argonaut.Parser"] = PS["Data.Argonaut.Parser"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Argonaut.Parser"] = $PS["Data.Argonaut.Parser"] || {};
  var exports = $PS["Data.Argonaut.Parser"];
  var $foreign = $PS["Data.Argonaut.Parser"];
  var Data_Either = $PS["Data.Either"];                
  var jsonParser = function (j) {
      return $foreign["_jsonParser"](Data_Either.Left.create, Data_Either.Right.create, j);
  };
  exports["jsonParser"] = jsonParser;
})(PS);
(function(exports) {
  "use strict";

  exports.replace = function (s1) {
    return function (s2) {
      return function (s3) {
        return s3.replace(s1, s2);
      };
    };
  };

  exports.replaceAll = function (s1) {
    return function (s2) {
      return function (s3) {
        return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2); // eslint-disable-line no-useless-escape
      };
    };
  };

  exports.toLower = function (s) {
    return s.toLowerCase();
  };

  exports.trim = function (s) {
    return s.trim();
  };

  exports.joinWith = function (s) {
    return function (xs) {
      return xs.join(s);
    };
  };
})(PS["Data.String.Common"] = PS["Data.String.Common"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.String.Common"] = $PS["Data.String.Common"] || {};
  var exports = $PS["Data.String.Common"];
  var $foreign = $PS["Data.String.Common"];
  exports["replace"] = $foreign.replace;
  exports["replaceAll"] = $foreign.replaceAll;
  exports["toLower"] = $foreign.toLower;
  exports["trim"] = $foreign.trim;
  exports["joinWith"] = $foreign.joinWith;
})(PS);
(function(exports) {
  /* globals exports, JSON */
  "use strict";                                         
  exports.unsafeEncodeURIComponent = encodeURIComponent;
})(PS["Global.Unsafe"] = PS["Global.Unsafe"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Global.Unsafe"] = $PS["Global.Unsafe"] || {};
  var exports = $PS["Global.Unsafe"];
  var $foreign = $PS["Global.Unsafe"];
  exports["unsafeEncodeURIComponent"] = $foreign.unsafeEncodeURIComponent;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.FormURLEncoded"] = $PS["Data.FormURLEncoded"] || {};
  var exports = $PS["Data.FormURLEncoded"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Global_Unsafe = $PS["Global.Unsafe"];
  var toArray = function (v) {
      return v;
  };                                                                                                                 
  var encode = (function () {
      var encodePart = function (v) {
          if (v.value1 instanceof Data_Maybe.Nothing) {
              return Global_Unsafe.unsafeEncodeURIComponent(v.value0);
          };
          if (v.value1 instanceof Data_Maybe.Just) {
              return Global_Unsafe.unsafeEncodeURIComponent(v.value0) + ("=" + Global_Unsafe.unsafeEncodeURIComponent(v.value1.value0));
          };
          throw new Error("Failed pattern match at Data.FormURLEncoded (line 35, column 18 - line 37, column 89): " + [ v.constructor.name ]);
      };
      return function ($14) {
          return Data_String_Common.joinWith("&")(Data_Functor.map(Data_Functor.functorArray)(encodePart)(toArray($14)));
      };
  })();
  exports["toArray"] = toArray;
  exports["encode"] = encode;
})(PS);
(function(exports) {
  "use strict";

  exports.showIntImpl = function (n) {
    return n.toString();
  };

  exports.showNumberImpl = function (n) {
    var str = n.toString();
    return isNaN(str + ".0") ? str : str + ".0";
  };

  exports.showCharImpl = function (c) {
    var code = c.charCodeAt(0);
    if (code < 0x20 || code === 0x7F) {
      switch (c) {
        case "\x07": return "'\\a'";
        case "\b": return "'\\b'";
        case "\f": return "'\\f'";
        case "\n": return "'\\n'";
        case "\r": return "'\\r'";
        case "\t": return "'\\t'";
        case "\v": return "'\\v'";
      }
      return "'\\" + code.toString(10) + "'";
    }
    return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
  };

  exports.showStringImpl = function (s) {
    var l = s.length;
    return "\"" + s.replace(
      /[\0-\x1F\x7F"\\]/g, // eslint-disable-line no-control-regex
      function (c, i) {
        switch (c) {
          case "\"":
          case "\\":
            return "\\" + c;
          case "\x07": return "\\a";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\t": return "\\t";
          case "\v": return "\\v";
        }
        var k = i + 1;
        var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty;
      }
    ) + "\"";
  };
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Show"] = $PS["Data.Show"] || {};
  var exports = $PS["Data.Show"];
  var $foreign = $PS["Data.Show"];
  var Show = function (show) {
      this.show = show;
  };
  var showString = new Show($foreign.showStringImpl);
  var showNumber = new Show($foreign.showNumberImpl);
  var showInt = new Show($foreign.showIntImpl);
  var showChar = new Show($foreign.showCharImpl);
  var show = function (dict) {
      return dict.show;
  };
  exports["Show"] = Show;
  exports["show"] = show;
  exports["showInt"] = showInt;
  exports["showNumber"] = showNumber;
  exports["showChar"] = showChar;
  exports["showString"] = showString;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.HTTP.Method"] = $PS["Data.HTTP.Method"] || {};
  var exports = $PS["Data.HTTP.Method"];
  var Data_Either = $PS["Data.Either"];
  var Data_Show = $PS["Data.Show"];                                  
  var OPTIONS = (function () {
      function OPTIONS() {

      };
      OPTIONS.value = new OPTIONS();
      return OPTIONS;
  })();
  var GET = (function () {
      function GET() {

      };
      GET.value = new GET();
      return GET;
  })();
  var HEAD = (function () {
      function HEAD() {

      };
      HEAD.value = new HEAD();
      return HEAD;
  })();
  var POST = (function () {
      function POST() {

      };
      POST.value = new POST();
      return POST;
  })();
  var PUT = (function () {
      function PUT() {

      };
      PUT.value = new PUT();
      return PUT;
  })();
  var DELETE = (function () {
      function DELETE() {

      };
      DELETE.value = new DELETE();
      return DELETE;
  })();
  var TRACE = (function () {
      function TRACE() {

      };
      TRACE.value = new TRACE();
      return TRACE;
  })();
  var CONNECT = (function () {
      function CONNECT() {

      };
      CONNECT.value = new CONNECT();
      return CONNECT;
  })();
  var PROPFIND = (function () {
      function PROPFIND() {

      };
      PROPFIND.value = new PROPFIND();
      return PROPFIND;
  })();
  var PROPPATCH = (function () {
      function PROPPATCH() {

      };
      PROPPATCH.value = new PROPPATCH();
      return PROPPATCH;
  })();
  var MKCOL = (function () {
      function MKCOL() {

      };
      MKCOL.value = new MKCOL();
      return MKCOL;
  })();
  var COPY = (function () {
      function COPY() {

      };
      COPY.value = new COPY();
      return COPY;
  })();
  var MOVE = (function () {
      function MOVE() {

      };
      MOVE.value = new MOVE();
      return MOVE;
  })();
  var LOCK = (function () {
      function LOCK() {

      };
      LOCK.value = new LOCK();
      return LOCK;
  })();
  var UNLOCK = (function () {
      function UNLOCK() {

      };
      UNLOCK.value = new UNLOCK();
      return UNLOCK;
  })();
  var PATCH = (function () {
      function PATCH() {

      };
      PATCH.value = new PATCH();
      return PATCH;
  })();
  var unCustomMethod = function (v) {
      return v;
  };
  var showMethod = new Data_Show.Show(function (v) {
      if (v instanceof OPTIONS) {
          return "OPTIONS";
      };
      if (v instanceof GET) {
          return "GET";
      };
      if (v instanceof HEAD) {
          return "HEAD";
      };
      if (v instanceof POST) {
          return "POST";
      };
      if (v instanceof PUT) {
          return "PUT";
      };
      if (v instanceof DELETE) {
          return "DELETE";
      };
      if (v instanceof TRACE) {
          return "TRACE";
      };
      if (v instanceof CONNECT) {
          return "CONNECT";
      };
      if (v instanceof PROPFIND) {
          return "PROPFIND";
      };
      if (v instanceof PROPPATCH) {
          return "PROPPATCH";
      };
      if (v instanceof MKCOL) {
          return "MKCOL";
      };
      if (v instanceof COPY) {
          return "COPY";
      };
      if (v instanceof MOVE) {
          return "MOVE";
      };
      if (v instanceof LOCK) {
          return "LOCK";
      };
      if (v instanceof UNLOCK) {
          return "UNLOCK";
      };
      if (v instanceof PATCH) {
          return "PATCH";
      };
      throw new Error("Failed pattern match at Data.HTTP.Method (line 40, column 1 - line 40, column 35): " + [ v.constructor.name ]);
  });
  var print = Data_Either.either(Data_Show.show(showMethod))(unCustomMethod);
  exports["OPTIONS"] = OPTIONS;
  exports["GET"] = GET;
  exports["HEAD"] = HEAD;
  exports["POST"] = POST;
  exports["PUT"] = PUT;
  exports["DELETE"] = DELETE;
  exports["TRACE"] = TRACE;
  exports["CONNECT"] = CONNECT;
  exports["PROPFIND"] = PROPFIND;
  exports["PROPPATCH"] = PROPPATCH;
  exports["MKCOL"] = MKCOL;
  exports["COPY"] = COPY;
  exports["MOVE"] = MOVE;
  exports["LOCK"] = LOCK;
  exports["UNLOCK"] = UNLOCK;
  exports["PATCH"] = PATCH;
  exports["unCustomMethod"] = unCustomMethod;
  exports["print"] = print;
  exports["showMethod"] = showMethod;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Alt"] = $PS["Control.Alt"] || {};
  var exports = $PS["Control.Alt"];                          
  var Alt = function (Functor0, alt) {
      this.Functor0 = Functor0;
      this.alt = alt;
  };                                                       
  var alt = function (dict) {
      return dict.alt;
  };
  exports["Alt"] = Alt;
  exports["alt"] = alt;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Monad.Rec.Class"] = $PS["Control.Monad.Rec.Class"] || {};
  var exports = $PS["Control.Monad.Rec.Class"];
  var Data_Bifunctor = $PS["Data.Bifunctor"];
  var Data_Either = $PS["Data.Either"];              
  var Loop = (function () {
      function Loop(value0) {
          this.value0 = value0;
      };
      Loop.create = function (value0) {
          return new Loop(value0);
      };
      return Loop;
  })();
  var Done = (function () {
      function Done(value0) {
          this.value0 = value0;
      };
      Done.create = function (value0) {
          return new Done(value0);
      };
      return Done;
  })();
  var MonadRec = function (Monad0, tailRecM) {
      this.Monad0 = Monad0;
      this.tailRecM = tailRecM;
  };
  var tailRecM = function (dict) {
      return dict.tailRecM;
  };
  var tailRec = function (f) {
      var go = function ($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v) {
              if (v instanceof Loop) {
                  $copy_v = f(v.value0);
                  return;
              };
              if (v instanceof Done) {
                  $tco_done = true;
                  return v.value0;
              };
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 91, column 3 - line 91, column 25): " + [ v.constructor.name ]);
          };
          while (!$tco_done) {
              $tco_result = $tco_loop($copy_v);
          };
          return $tco_result;
      };
      return function ($53) {
          return go(f($53));
      };
  }; 
  var monadRecEither = new MonadRec(function () {
      return Data_Either.monadEither;
  }, function (f) {
      return function (a0) {
          var g = function (v) {
              if (v instanceof Data_Either.Left) {
                  return new Done(new Data_Either.Left(v.value0));
              };
              if (v instanceof Data_Either.Right && v.value0 instanceof Loop) {
                  return new Loop(f(v.value0.value0));
              };
              if (v instanceof Data_Either.Right && v.value0 instanceof Done) {
                  return new Done(new Data_Either.Right(v.value0.value0));
              };
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 119, column 7 - line 119, column 33): " + [ v.constructor.name ]);
          };
          return tailRec(g)(f(a0));
      };
  });
  var bifunctorStep = new Data_Bifunctor.Bifunctor(function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Loop) {
                  return new Loop(v(v2.value0));
              };
              if (v2 instanceof Done) {
                  return new Done(v1(v2.value0));
              };
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 27, column 1 - line 27, column 41): " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  });
  exports["Loop"] = Loop;
  exports["Done"] = Done;
  exports["MonadRec"] = MonadRec;
  exports["tailRec"] = tailRec;
  exports["tailRecM"] = tailRecM;
  exports["bifunctorStep"] = bifunctorStep;
  exports["monadRecEither"] = monadRecEither;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Plus"] = $PS["Control.Plus"] || {};
  var exports = $PS["Control.Plus"];                   
  var Plus = function (Alt0, empty) {
      this.Alt0 = Alt0;
      this.empty = empty;
  };       
  var empty = function (dict) {
      return dict.empty;
  };
  exports["Plus"] = Plus;
  exports["empty"] = empty;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.NonEmpty"] = $PS["Data.NonEmpty"] || {};
  var exports = $PS["Data.NonEmpty"];
  var Control_Plus = $PS["Control.Plus"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Show = $PS["Data.Show"];                              
  var NonEmpty = (function () {
      function NonEmpty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      NonEmpty.create = function (value0) {
          return function (value1) {
              return new NonEmpty(value0, value1);
          };
      };
      return NonEmpty;
  })();
  var singleton = function (dictPlus) {
      return function (a) {
          return new NonEmpty(a, Control_Plus.empty(dictPlus));
      };
  };
  var showNonEmpty = function (dictShow) {
      return function (dictShow1) {
          return new Data_Show.Show(function (v) {
              return "(NonEmpty " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
          });
      };
  };
  var functorNonEmpty = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (m) {
              return new NonEmpty(f(m.value0), Data_Functor.map(dictFunctor)(f)(m.value1));
          };
      });
  };
  exports["NonEmpty"] = NonEmpty;
  exports["singleton"] = singleton;
  exports["showNonEmpty"] = showNonEmpty;
  exports["functorNonEmpty"] = functorNonEmpty;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.List.Types"] = $PS["Data.List.Types"] || {};
  var exports = $PS["Data.List.Types"];
  var Control_Alt = $PS["Control.Alt"];
  var Control_Plus = $PS["Control.Plus"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Monoid = $PS["Data.Monoid"];
  var Data_NonEmpty = $PS["Data.NonEmpty"];
  var Data_Semigroup = $PS["Data.Semigroup"];
  var Data_Show = $PS["Data.Show"];                              
  var Nil = (function () {
      function Nil() {

      };
      Nil.value = new Nil();
      return Nil;
  })();
  var Cons = (function () {
      function Cons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Cons.create = function (value0) {
          return function (value1) {
              return new Cons(value0, value1);
          };
      };
      return Cons;
  })();
  var NonEmptyList = function (x) {
      return x;
  };
  var listMap = function (f) {
      var chunkedRevMap = function ($copy_chunksAcc) {
          return function ($copy_v) {
              var $tco_var_chunksAcc = $copy_chunksAcc;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(chunksAcc, v) {
                  if (v instanceof Cons && (v.value1 instanceof Cons && v.value1.value1 instanceof Cons)) {
                      $tco_var_chunksAcc = new Cons(v, chunksAcc);
                      $copy_v = v.value1.value1.value1;
                      return;
                  };
                  var unrolledMap = function (v1) {
                      if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Nil)) {
                          return new Cons(f(v1.value0), new Cons(f(v1.value1.value0), Nil.value));
                      };
                      if (v1 instanceof Cons && v1.value1 instanceof Nil) {
                          return new Cons(f(v1.value0), Nil.value);
                      };
                      return Nil.value;
                  };
                  var reverseUnrolledMap = function ($copy_v1) {
                      return function ($copy_acc) {
                          var $tco_var_v1 = $copy_v1;
                          var $tco_done = false;
                          var $tco_result;
                          function $tco_loop(v1, acc) {
                              if (v1 instanceof Cons && (v1.value0 instanceof Cons && (v1.value0.value1 instanceof Cons && v1.value0.value1.value1 instanceof Cons))) {
                                  $tco_var_v1 = v1.value1;
                                  $copy_acc = new Cons(f(v1.value0.value0), new Cons(f(v1.value0.value1.value0), new Cons(f(v1.value0.value1.value1.value0), acc)));
                                  return;
                              };
                              $tco_done = true;
                              return acc;
                          };
                          while (!$tco_done) {
                              $tco_result = $tco_loop($tco_var_v1, $copy_acc);
                          };
                          return $tco_result;
                      };
                  };
                  $tco_done = true;
                  return reverseUnrolledMap(chunksAcc)(unrolledMap(v));
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_chunksAcc, $copy_v);
              };
              return $tco_result;
          };
      };
      return chunkedRevMap(Nil.value);
  };
  var functorList = new Data_Functor.Functor(listMap);
  var functorNonEmptyList = Data_NonEmpty.functorNonEmpty(functorList);
  var foldableList = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return Data_Foldable.foldl(foldableList)(function (acc) {
              return function ($202) {
                  return Data_Semigroup.append(dictMonoid.Semigroup0())(acc)(f($202));
              };
          })(Data_Monoid.mempty(dictMonoid));
      };
  }, function (f) {
      var go = function ($copy_b) {
          return function ($copy_v) {
              var $tco_var_b = $copy_b;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(b, v) {
                  if (v instanceof Nil) {
                      $tco_done = true;
                      return b;
                  };
                  if (v instanceof Cons) {
                      $tco_var_b = f(b)(v.value0);
                      $copy_v = v.value1;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.List.Types (line 109, column 12 - line 111, column 30): " + [ v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_b, $copy_v);
              };
              return $tco_result;
          };
      };
      return go;
  }, function (f) {
      return function (b) {
          var rev = Data_Foldable.foldl(foldableList)(Data_Function.flip(Cons.create))(Nil.value);
          return function ($203) {
              return Data_Foldable.foldl(foldableList)(Data_Function.flip(f))(b)(rev($203));
          };
      };
  });
  var semigroupList = new Data_Semigroup.Semigroup(function (xs) {
      return function (ys) {
          return Data_Foldable.foldr(foldableList)(Cons.create)(ys)(xs);
      };
  });
  var showList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          if (v instanceof Nil) {
              return "Nil";
          };
          return "(" + (Data_Foldable.intercalate(foldableList)(Data_Monoid.monoidString)(" : ")(Data_Functor.map(functorList)(Data_Show.show(dictShow))(v)) + " : Nil)");
      });
  };
  var showNonEmptyList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          return "(NonEmptyList " + (Data_Show.show(Data_NonEmpty.showNonEmpty(dictShow)(showList(dictShow)))(v) + ")");
      });
  };                                               
  var altList = new Control_Alt.Alt(function () {
      return functorList;
  }, Data_Semigroup.append(semigroupList));
  var plusList = new Control_Plus.Plus(function () {
      return altList;
  }, Nil.value);
  exports["Nil"] = Nil;
  exports["Cons"] = Cons;
  exports["NonEmptyList"] = NonEmptyList;
  exports["showList"] = showList;
  exports["semigroupList"] = semigroupList;
  exports["functorList"] = functorList;
  exports["foldableList"] = foldableList;
  exports["altList"] = altList;
  exports["plusList"] = plusList;
  exports["showNonEmptyList"] = showNonEmptyList;
  exports["functorNonEmptyList"] = functorNonEmptyList;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.List"] = $PS["Data.List"] || {};
  var exports = $PS["Data.List"];
  var Control_Alt = $PS["Control.Alt"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad_Rec_Class = $PS["Control.Monad.Rec.Class"];
  var Data_Bifunctor = $PS["Data.Bifunctor"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Unit = $PS["Data.Unit"];                                              
  var uncons = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just({
              head: v.value0,
              tail: v.value1
          });
      };
      throw new Error("Failed pattern match at Data.List (line 259, column 1 - line 259, column 66): " + [ v.constructor.name ]);
  };
  var reverse = (function () {
      var go = function ($copy_acc) {
          return function ($copy_v) {
              var $tco_var_acc = $copy_acc;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(acc, v) {
                  if (v instanceof Data_List_Types.Nil) {
                      $tco_done = true;
                      return acc;
                  };
                  if (v instanceof Data_List_Types.Cons) {
                      $tco_var_acc = new Data_List_Types.Cons(v.value0, acc);
                      $copy_v = v.value1;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.List (line 368, column 3 - line 368, column 19): " + [ acc.constructor.name, v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_acc, $copy_v);
              };
              return $tco_result;
          };
      };
      return go(Data_List_Types.Nil.value);
  })();
  var manyRec = function (dictMonadRec) {
      return function (dictAlternative) {
          return function (p) {
              var go = function (acc) {
                  return Control_Bind.bind((dictMonadRec.Monad0()).Bind1())(Control_Alt.alt((dictAlternative.Plus1()).Alt0())(Data_Functor.map(((dictAlternative.Plus1()).Alt0()).Functor0())(Control_Monad_Rec_Class.Loop.create)(p))(Control_Applicative.pure(dictAlternative.Applicative0())(new Control_Monad_Rec_Class.Done(Data_Unit.unit))))(function (v) {
                      return Control_Applicative.pure(dictAlternative.Applicative0())(Data_Bifunctor.bimap(Control_Monad_Rec_Class.bifunctorStep)(function (v1) {
                          return new Data_List_Types.Cons(v1, acc);
                      })(function (v1) {
                          return reverse(acc);
                      })(v));
                  });
              };
              return Control_Monad_Rec_Class.tailRecM(dictMonadRec)(go)(Data_List_Types.Nil.value);
          };
      };
  };
  exports["manyRec"] = manyRec;
  exports["uncons"] = uncons;
  exports["reverse"] = reverse;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.List.NonEmpty"] = $PS["Data.List.NonEmpty"] || {};
  var exports = $PS["Data.List.NonEmpty"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_List = $PS["Data.List"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_NonEmpty = $PS["Data.NonEmpty"];
  var Data_Tuple = $PS["Data.Tuple"];
  var Data_Unfoldable = $PS["Data.Unfoldable"];
  var uncons = function (v) {
      return {
          head: v.value0,
          tail: v.value1
      };
  };
  var toList = function (v) {
      return new Data_List_Types.Cons(v.value0, v.value1);
  };
  var toUnfoldable = function (dictUnfoldable) {
      return function ($163) {
          return Data_Unfoldable.unfoldr(dictUnfoldable)(function (xs) {
              return Data_Functor.map(Data_Maybe.functorMaybe)(function (rec) {
                  return new Data_Tuple.Tuple(rec.head, rec.tail);
              })(Data_List.uncons(xs));
          })(toList($163));
      };
  };
  var tail = function (v) {
      return v.value1;
  };
  var singleton = function ($165) {
      return Data_List_Types.NonEmptyList(Data_NonEmpty.singleton(Data_List_Types.plusList)($165));
  };
  var head = function (v) {
      return v.value0;
  };
  exports["toUnfoldable"] = toUnfoldable;
  exports["toList"] = toList;
  exports["singleton"] = singleton;
  exports["head"] = head;
  exports["tail"] = tail;
  exports["uncons"] = uncons;
})(PS);
(function(exports) {
  "use strict";

  exports["null"] = null;

  exports.nullable = function (a, r, f) {
    return a == null ? r : f(a);
  };

  exports.notNull = function (x) {
    return x;
  };
})(PS["Data.Nullable"] = PS["Data.Nullable"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Nullable"] = $PS["Data.Nullable"] || {};
  var exports = $PS["Data.Nullable"];
  var $foreign = $PS["Data.Nullable"];
  var Data_Maybe = $PS["Data.Maybe"];              
  var toNullable = Data_Maybe.maybe($foreign["null"])($foreign.notNull);
  var toMaybe = function (n) {
      return $foreign.nullable(n, Data_Maybe.Nothing.value, Data_Maybe.Just.create);
  };
  exports["toMaybe"] = toMaybe;
  exports["toNullable"] = toNullable;
})(PS);
(function(exports) {
  /* globals setImmediate, clearImmediate, setTimeout, clearTimeout */
  /* jshint -W083, -W098, -W003 */
  "use strict";

  var Aff = function () {
    // A unique value for empty.
    var EMPTY = {};

    /*

  An awkward approximation. We elide evidence we would otherwise need in PS for
  efficiency sake.

  data Aff eff a
    = Pure a
    | Throw Error
    | Catch (Aff eff a) (Error -> Aff eff a)
    | Sync (Eff eff a)
    | Async ((Either Error a -> Eff eff Unit) -> Eff eff (Canceler eff))
    | forall b. Bind (Aff eff b) (b -> Aff eff a)
    | forall b. Bracket (Aff eff b) (BracketConditions eff b) (b -> Aff eff a)
    | forall b. Fork Boolean (Aff eff b) ?(Fiber eff b -> a)
    | Sequential (ParAff aff a)

  */  
    var PURE    = "Pure";
    var THROW   = "Throw";
    var CATCH   = "Catch";
    var SYNC    = "Sync";
    var ASYNC   = "Async";
    var BIND    = "Bind";
    var BRACKET = "Bracket";
    var FORK    = "Fork";
    var SEQ     = "Sequential";

    /*

  data ParAff eff a
    = forall b. Map (b -> a) (ParAff eff b)
    | forall b. Apply (ParAff eff (b -> a)) (ParAff eff b)
    | Alt (ParAff eff a) (ParAff eff a)
    | ?Par (Aff eff a)

  */  
    var MAP   = "Map";
    var APPLY = "Apply";
    var ALT   = "Alt";

    // Various constructors used in interpretation
    var CONS      = "Cons";      // Cons-list, for stacks
    var RESUME    = "Resume";    // Continue indiscriminately
    var RELEASE   = "Release";   // Continue with bracket finalizers
    var FINALIZER = "Finalizer"; // A non-interruptible effect
    var FINALIZED = "Finalized"; // Marker for finalization
    var FORKED    = "Forked";    // Reference to a forked fiber, with resumption stack
    var FIBER     = "Fiber";     // Actual fiber reference
    var THUNK     = "Thunk";     // Primed effect, ready to invoke

    function Aff(tag, _1, _2, _3) {
      this.tag = tag;
      this._1  = _1;
      this._2  = _2;
      this._3  = _3;
    }

    function AffCtr(tag) {
      var fn = function (_1, _2, _3) {
        return new Aff(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }

    function nonCanceler(error) {
      return new Aff(PURE, void 0);
    }

    function runEff(eff) {
      try {
        eff();
      } catch (error) {
        setTimeout(function () {
          throw error;
        }, 0);
      }
    }

    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error) {
        return left(error);
      }
    }

    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error) {
        k(left(error))();
        return nonCanceler;
      }
    }

    var Scheduler = function () {
      var limit    = 1024;
      var size     = 0;
      var ix       = 0;
      var queue    = new Array(limit);
      var draining = false;

      function drain() {
        var thunk;
        draining = true;
        while (size !== 0) {
          size--;
          thunk     = queue[ix];
          queue[ix] = void 0;
          ix        = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }

      return {
        isDraining: function () {
          return draining;
        },
        enqueue: function (cb) {
          var i, tmp;
          if (size === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }

          queue[(ix + size) % limit] = cb;
          size++;

          if (!draining) {
            drain();
          }
        }
      };
    }();

    function Supervisor(util) {
      var fibers  = {};
      var fiberId = 0;
      var count   = 0;

      return {
        register: function (fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function (result) {
              return function () {
                count--;
                delete fibers[fid];
              };
            }
          });
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function () {
          return count === 0;
        },
        killAll: function (killError, cb) {
          return function () {
            var killCount = 0;
            var kills     = {};

            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function (result) {
                return function () {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function () {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }

            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }

            fibers  = {};
            fiberId = 0;
            count   = 0;

            return function (error) {
              return new Aff(SYNC, function () {
                for (var k in kills) {
                  if (kills.hasOwnProperty(k)) {
                    kills[k]();
                  }
                }
              });
            };
          };
        }
      };
    }

    // Fiber state machine
    var SUSPENDED   = 0; // Suspended, pending a join.
    var CONTINUE    = 1; // Interpret the next instruction.
    var STEP_BIND   = 2; // Apply the next bind.
    var STEP_RESULT = 3; // Handle potential failure from a result.
    var PENDING     = 4; // An async effect is running.
    var RETURN      = 5; // The current stack has returned.
    var COMPLETED   = 6; // The entire fiber has completed.

    function Fiber(util, supervisor, aff) {
      // Monotonically increasing tick, increased on each asynchronous turn.
      var runTick = 0;

      // The current branch of the state machine.
      var status = SUSPENDED;

      // The current point of interest for the state machine branch.
      var step      = aff;  // Successful step
      var fail      = null; // Failure step
      var interrupt = null; // Asynchronous interrupt

      // Stack of continuations for the current fiber.
      var bhead = null;
      var btail = null;

      // Stack of attempts and finalizers for error recovery. Every `Cons` is also
      // tagged with current `interrupt` state. We use this to track which items
      // should be ignored or evaluated as a result of a kill.
      var attempts = null;

      // A special state is needed for Bracket, because it cannot be killed. When
      // we enter a bracket acquisition or finalizer, we increment the counter,
      // and then decrement once complete.
      var bracketCount = 0;

      // Each join gets a new id so they can be revoked.
      var joinId  = 0;
      var joins   = null;
      var rethrow = true;

      // Each invocation of `run` requires a tick. When an asynchronous effect is
      // resolved, we must check that the local tick coincides with the fiber
      // tick before resuming. This prevents multiple async continuations from
      // accidentally resuming the same fiber. A common example may be invoking
      // the provided callback in `makeAff` more than once, but it may also be an
      // async effect resuming after the fiber was already cancelled.
      function run(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp       = null;
          result    = null;
          attempt   = null;

          switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            step   = bhead(step);
            if (btail === null) {
              bhead = null;
            } else {
              bhead = btail._1;
              btail = btail._2;
            }
            break;

          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail   = step;
              step   = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step   = util.fromRight(step);
            }
            break;

          case CONTINUE:
            switch (step.tag) {
            case BIND:
              if (bhead) {
                btail = new Aff(CONS, bhead, btail);
              }
              bhead  = step._2;
              status = CONTINUE;
              step   = step._1;
              break;

            case PURE:
              if (bhead === null) {
                status = RETURN;
                step   = util.right(step._1);
              } else {
                status = STEP_BIND;
                step   = step._1;
              }
              break;

            case SYNC:
              status = STEP_RESULT;
              step   = runSync(util.left, util.right, step._1);
              break;

            case ASYNC:
              status = PENDING;
              step   = runAsync(util.left, step._1, function (result) {
                return function () {
                  if (runTick !== localRunTick) {
                    return;
                  }
                  runTick++;
                  Scheduler.enqueue(function () {
                    // It's possible to interrupt the fiber between enqueuing and
                    // resuming, so we need to check that the runTick is still
                    // valid.
                    if (runTick !== localRunTick + 1) {
                      return;
                    }
                    status = STEP_RESULT;
                    step   = result;
                    run(runTick);
                  });
                };
              });
              return;

            case THROW:
              status = RETURN;
              fail   = util.left(step._1);
              step   = null;
              break;

            // Enqueue the Catch so that we can call the error handler later on
            // in case of an exception.
            case CATCH:
              if (bhead === null) {
                attempts = new Aff(CONS, step, attempts, interrupt);
              } else {
                attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
              }
              bhead    = null;
              btail    = null;
              status   = CONTINUE;
              step     = step._1;
              break;

            // Enqueue the Bracket so that we can call the appropriate handlers
            // after resource acquisition.
            case BRACKET:
              bracketCount++;
              if (bhead === null) {
                attempts = new Aff(CONS, step, attempts, interrupt);
              } else {
                attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
              }
              bhead  = null;
              btail  = null;
              status = CONTINUE;
              step   = step._1;
              break;

            case FORK:
              status = STEP_RESULT;
              tmp    = Fiber(util, supervisor, step._2);
              if (supervisor) {
                supervisor.register(tmp);
              }
              if (step._1) {
                tmp.run();
              }
              step = util.right(tmp);
              break;

            case SEQ:
              status = CONTINUE;
              step   = sequential(util, supervisor, step._1);
              break;
            }
            break;

          case RETURN:
            bhead = null;
            btail = null;
            // If the current stack has returned, and we have no other stacks to
            // resume or finalizers to run, the fiber has halted and we can
            // invoke all join callbacks. Otherwise we need to resume.
            if (attempts === null) {
              status = COMPLETED;
              step   = interrupt || fail || step;
            } else {
              // The interrupt status for the enqueued item.
              tmp      = attempts._3;
              attempt  = attempts._1;
              attempts = attempts._2;

              switch (attempt.tag) {
              // We cannot recover from an interrupt. Otherwise we should
              // continue stepping, or run the exception handler if an exception
              // was raised.
              case CATCH:
                // We should compare the interrupt status as well because we
                // only want it to apply if there has been an interrupt since
                // enqueuing the catch.
                if (interrupt && interrupt !== tmp) {
                  status = RETURN;
                } else if (fail) {
                  status = CONTINUE;
                  step   = attempt._2(util.fromLeft(fail));
                  fail   = null;
                }
                break;

              // We cannot resume from an interrupt or exception.
              case RESUME:
                // As with Catch, we only want to ignore in the case of an
                // interrupt since enqueing the item.
                if (interrupt && interrupt !== tmp || fail) {
                  status = RETURN;
                } else {
                  bhead  = attempt._1;
                  btail  = attempt._2;
                  status = STEP_BIND;
                  step   = util.fromRight(step);
                }
                break;

              // If we have a bracket, we should enqueue the handlers,
              // and continue with the success branch only if the fiber has
              // not been interrupted. If the bracket acquisition failed, we
              // should not run either.
              case BRACKET:
                bracketCount--;
                if (fail === null) {
                  result   = util.fromRight(step);
                  // We need to enqueue the Release with the same interrupt
                  // status as the Bracket that is initiating it.
                  attempts = new Aff(CONS, new Aff(RELEASE, attempt._2, result), attempts, tmp);
                  // We should only coninue as long as the interrupt status has not changed or
                  // we are currently within a non-interruptable finalizer.
                  if (interrupt === tmp || bracketCount > 0) {
                    status = CONTINUE;
                    step   = attempt._3(result);
                  }
                }
                break;

              // Enqueue the appropriate handler. We increase the bracket count
              // because it should not be cancelled.
              case RELEASE:
                bracketCount++;
                attempts = new Aff(CONS, new Aff(FINALIZED, step, fail), attempts, interrupt);
                status   = CONTINUE;
                // It has only been killed if the interrupt status has changed
                // since we enqueued the item.
                if (interrupt && interrupt !== tmp) {
                  step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                } else if (fail) {
                  step = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                } else {
                  step = attempt._1.completed(util.fromRight(step))(attempt._2);
                }
                fail = null;
                break;

              case FINALIZER:
                bracketCount++;
                attempts = new Aff(CONS, new Aff(FINALIZED, step, fail), attempts, interrupt);
                status   = CONTINUE;
                step     = attempt._1;
                break;

              case FINALIZED:
                bracketCount--;
                status = RETURN;
                step   = attempt._1;
                fail   = attempt._2;
                break;
              }
            }
            break;

          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            // If we have an interrupt and a fail, then the thread threw while
            // running finalizers. This should always rethrow in a fresh stack.
            if (interrupt && fail) {
              setTimeout(function () {
                throw util.fromLeft(fail);
              }, 0);
            // If we have an unhandled exception, and no other fiber has joined
            // then we need to throw the exception in a fresh stack.
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function () {
                // Guard on reathrow because a completely synchronous fiber can
                // still have an observer which was added after-the-fact.
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING: return;
          }
        }
      }

      function onComplete(join) {
        return function () {
          if (status === COMPLETED) {
            rethrow = rethrow && join.rethrow;
            join.handler(step)();
            return function () {};
          }

          var jid    = joinId++;
          joins      = joins || {};
          joins[jid] = join;

          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }

      function kill(error, cb) {
        return function () {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function () {};
          }

          var canceler = onComplete({
            rethrow: false,
            handler: function (/* unused */) {
              return cb(util.right(void 0));
            }
          })();

          switch (status) {
          case SUSPENDED:
            interrupt = util.left(error);
            status    = COMPLETED;
            step      = interrupt;
            run(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff(CONS, new Aff(FINALIZER, step(error)), attempts, interrupt);
              }
              status   = RETURN;
              step     = null;
              fail     = null;
              run(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step   = null;
              fail   = null;
            }
          }

          return canceler;
        };
      }

      function join(cb) {
        return function () {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run(runTick);
          }
          return canceler;
        };
      }

      return {
        kill: kill,
        join: join,
        onComplete: onComplete,
        isSuspended: function () {
          return status === SUSPENDED;
        },
        run: function () {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function () {
                run(runTick);
              });
            } else {
              run(runTick);
            }
          }
        }
      };
    }

    function runPar(util, supervisor, par, cb) {
      // Table of all forked fibers.
      var fiberId   = 0;
      var fibers    = {};

      // Table of currently running cancelers, as a product of `Alt` behavior.
      var killId    = 0;
      var kills     = {};

      // Error used for early cancelation on Alt branches.
      var early     = new Error("[ParAff] Early exit");

      // Error used to kill the entire tree.
      var interrupt = null;

      // The root pointer of the tree.
      var root      = EMPTY;

      // Walks a tree, invoking all the cancelers. Returns the table of pending
      // cancellation fibers.
      function kill(error, par, cb) {
        var step  = par;
        var head  = null;
        var tail  = null;
        var count = 0;
        var kills = {};
        var tmp, kid;

        loop: while (true) {
          tmp = null;

          switch (step.tag) {
          case FORKED:
            if (step._3 === EMPTY) {
              tmp = fibers[step._1];
              kills[count++] = tmp.kill(error, function (result) {
                return function () {
                  count--;
                  if (count === 0) {
                    cb(result)();
                  }
                };
              });
            }
            // Terminal case.
            if (head === null) {
              break loop;
            }
            // Go down the right side of the tree.
            step = head._2;
            if (tail === null) {
              head = null;
            } else {
              head = tail._1;
              tail = tail._2;
            }
            break;
          case MAP:
            step = step._2;
            break;
          case APPLY:
          case ALT:
            if (head) {
              tail = new Aff(CONS, head, tail);
            }
            head = step;
            step = step._1;
            break;
          }
        }

        if (count === 0) {
          cb(util.right(void 0))();
        } else {
          // Run the cancelation effects. We alias `count` because it's mutable.
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills[kid] = kills[kid]();
          }
        }

        return kills;
      }

      // When a fiber resolves, we need to bubble back up the tree with the
      // result, computing the applicative nodes.
      function join(result, head, tail) {
        var fail, step, lhs, rhs, tmp, kid;

        if (util.isLeft(result)) {
          fail = result;
          step = null;
        } else {
          step = result;
          fail = null;
        }

        loop: while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;

          // We should never continue if the entire tree has been interrupted.
          if (interrupt !== null) {
            return;
          }

          // We've made it all the way to the root of the tree, which means
          // the tree has fully evaluated.
          if (head === null) {
            cb(fail || step)();
            return;
          }

          // The tree has already been computed, so we shouldn't try to do it
          // again. This should never happen.
          // TODO: Remove this?
          if (head._3 !== EMPTY) {
            return;
          }

          switch (head.tag) {
          case MAP:
            if (fail === null) {
              head._3 = util.right(head._1(util.fromRight(step)));
              step    = head._3;
            } else {
              head._3 = fail;
            }
            break;
          case APPLY:
            lhs = head._1._3;
            rhs = head._2._3;
            // If we have a failure we should kill the other side because we
            // can't possible yield a result anymore.
            if (fail) {
              head._3 = fail;
              tmp     = true;
              kid     = killId++;

              kills[kid] = kill(early, fail === lhs ? head._2 : head._1, function (/* unused */) {
                return function () {
                  delete kills[kid];
                  if (tmp) {
                    tmp = false;
                  } else if (tail === null) {
                    join(fail, null, null);
                  } else {
                    join(fail, tail._1, tail._2);
                  }
                };
              });

              if (tmp) {
                tmp = false;
                return;
              }
            } else if (lhs === EMPTY || rhs === EMPTY) {
              // We can only proceed if both sides have resolved.
              return;
            } else {
              step    = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
              head._3 = step;
            }
            break;
          case ALT:
            lhs = head._1._3;
            rhs = head._2._3;
            // We can only proceed if both have resolved or we have a success
            if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
              return;
            }
            // If both sides resolve with an error, we should continue with the
            // first error
            if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
              fail    = step === lhs ? rhs : lhs;
              step    = null;
              head._3 = fail;
            } else {
              head._3 = step;
              tmp     = true;
              kid     = killId++;
              // Once a side has resolved, we need to cancel the side that is still
              // pending before we can continue.
              kills[kid] = kill(early, step === lhs ? head._2 : head._1, function (/* unused */) {
                return function () {
                  delete kills[kid];
                  if (tmp) {
                    tmp = false;
                  } else if (tail === null) {
                    join(step, null, null);
                  } else {
                    join(step, tail._1, tail._2);
                  }
                };
              });

              if (tmp) {
                tmp = false;
                return;
              }
            }
            break;
          }

          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
      }

      function resolve(fiber) {
        return function (result) {
          return function () {
            delete fibers[fiber._1];
            fiber._3 = result;
            join(result, fiber._2._1, fiber._2._2);
          };
        };
      }

      // Walks the applicative tree, substituting non-applicative nodes with
      // `FORKED` nodes. In this tree, all applicative nodes use the `_3` slot
      // as a mutable slot for memoization. In an unresolved state, the `_3`
      // slot is `EMPTY`. In the cases of `ALT` and `APPLY`, we always walk
      // the left side first, because both operations are left-associative. As
      // we `RETURN` from those branches, we then walk the right side.
      function run() {
        var status = CONTINUE;
        var step   = par;
        var head   = null;
        var tail   = null;
        var tmp, fid;

        loop: while (true) {
          tmp = null;
          fid = null;

          switch (status) {
          case CONTINUE:
            switch (step.tag) {
            case MAP:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(MAP, step._1, EMPTY, EMPTY);
              step = step._2;
              break;
            case APPLY:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(APPLY, EMPTY, step._2, EMPTY);
              step = step._1;
              break;
            case ALT:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = new Aff(ALT, EMPTY, step._2, EMPTY);
              step = step._1;
              break;
            default:
              // When we hit a leaf value, we suspend the stack in the `FORKED`.
              // When the fiber resolves, it can bubble back up the tree.
              fid    = fiberId++;
              status = RETURN;
              tmp    = step;
              step   = new Aff(FORKED, fid, new Aff(CONS, head, tail), EMPTY);
              tmp    = Fiber(util, supervisor, tmp);
              tmp.onComplete({
                rethrow: false,
                handler: resolve(step)
              })();
              fibers[fid] = tmp;
              if (supervisor) {
                supervisor.register(tmp);
              }
            }
            break;
          case RETURN:
            // Terminal case, we are back at the root.
            if (head === null) {
              break loop;
            }
            // If we are done with the right side, we need to continue down the
            // left. Otherwise we should continue up the stack.
            if (head._1 === EMPTY) {
              head._1 = step;
              status  = CONTINUE;
              step    = head._2;
              head._2 = EMPTY;
            } else {
              head._2 = step;
              step    = head;
              if (tail === null) {
                head  = null;
              } else {
                head  = tail._1;
                tail  = tail._2;
              }
            }
          }
        }

        // Keep a reference to the tree root so it can be cancelled.
        root = step;

        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }

      // Cancels the entire tree. If there are already subtrees being canceled,
      // we need to first cancel those joins. We will then add fresh joins for
      // all pending branches including those that were in the process of being
      // canceled.
      function cancel(error, cb) {
        interrupt = util.left(error);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }

        kills = null;
        var newKills = kill(error, root, cb);

        return function (killError) {
          return new Aff(ASYNC, function (killCb) {
            return function () {
              for (var kid in newKills) {
                if (newKills.hasOwnProperty(kid)) {
                  newKills[kid]();
                }
              }
              return nonCanceler;
            };
          });
        };
      }

      run();

      return function (killError) {
        return new Aff(ASYNC, function (killCb) {
          return function () {
            return cancel(killError, killCb);
          };
        });
      };
    }

    function sequential(util, supervisor, par) {
      return new Aff(ASYNC, function (cb) {
        return function () {
          return runPar(util, supervisor, par, cb);
        };
      });
    }

    Aff.EMPTY       = EMPTY;
    Aff.Pure        = AffCtr(PURE);
    Aff.Throw       = AffCtr(THROW);
    Aff.Catch       = AffCtr(CATCH);
    Aff.Sync        = AffCtr(SYNC);
    Aff.Async       = AffCtr(ASYNC);
    Aff.Bind        = AffCtr(BIND);
    Aff.Bracket     = AffCtr(BRACKET);
    Aff.Fork        = AffCtr(FORK);
    Aff.Seq         = AffCtr(SEQ);
    Aff.ParMap      = AffCtr(MAP);
    Aff.ParApply    = AffCtr(APPLY);
    Aff.ParAlt      = AffCtr(ALT);
    Aff.Fiber       = Fiber;
    Aff.Supervisor  = Supervisor;
    Aff.Scheduler   = Scheduler;
    Aff.nonCanceler = nonCanceler;

    return Aff;
  }();

  exports._pure = Aff.Pure;

  exports._throwError = Aff.Throw;

  exports._catchError = function (aff) {
    return function (k) {
      return Aff.Catch(aff, k);
    };
  };

  exports._map = function (f) {
    return function (aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function (value) {
          return Aff.Pure(f(value));
        });
      }
    };
  };

  exports._bind = function (aff) {
    return function (k) {
      return Aff.Bind(aff, k);
    };
  };

  exports._liftEffect = Aff.Sync;

  exports.makeAff = Aff.Async;

  exports._makeFiber = function (util, aff) {
    return function () {
      return Aff.Fiber(util, null, aff);
    };
  };
})(PS["Effect.Aff"] = PS["Effect.Aff"] || {});
(function(exports) {
  "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Effect"] = PS["Effect"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect"] = $PS["Effect"] || {};
  var exports = $PS["Effect"];
  var $foreign = $PS["Effect"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Data_Functor = $PS["Data.Functor"];                    
  var monadEffect = new Control_Monad.Monad(function () {
      return applicativeEffect;
  }, function () {
      return bindEffect;
  });
  var bindEffect = new Control_Bind.Bind(function () {
      return applyEffect;
  }, $foreign.bindE);
  var applyEffect = new Control_Apply.Apply(function () {
      return functorEffect;
  }, Control_Monad.ap(monadEffect));
  var applicativeEffect = new Control_Applicative.Applicative(function () {
      return applyEffect;
  }, $foreign.pureE);
  var functorEffect = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEffect));
  exports["functorEffect"] = functorEffect;
  exports["applyEffect"] = applyEffect;
  exports["applicativeEffect"] = applicativeEffect;
  exports["bindEffect"] = bindEffect;
  exports["monadEffect"] = monadEffect;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect.Class"] = $PS["Effect.Class"] || {};
  var exports = $PS["Effect.Class"];         
  var MonadEffect = function (Monad0, liftEffect) {
      this.Monad0 = Monad0;
      this.liftEffect = liftEffect;
  };                                                         
  var liftEffect = function (dict) {
      return dict.liftEffect;
  };
  exports["liftEffect"] = liftEffect;
  exports["MonadEffect"] = MonadEffect;
})(PS);
(function(exports) {
  "use strict";

  // module Partial.Unsafe

  exports.unsafePartial = function (f) {
    return f();
  };
})(PS["Partial.Unsafe"] = PS["Partial.Unsafe"] || {});
(function(exports) {
  "use strict";

  // module Partial

  exports.crashWith = function () {
    return function (msg) {
      throw new Error(msg);
    };
  };
})(PS["Partial"] = PS["Partial"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Partial"] = $PS["Partial"] || {};
  var exports = $PS["Partial"];
  var $foreign = $PS["Partial"];
  exports["crashWith"] = $foreign.crashWith;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Partial.Unsafe"] = $PS["Partial.Unsafe"] || {};
  var exports = $PS["Partial.Unsafe"];
  var $foreign = $PS["Partial.Unsafe"];
  var Partial = $PS["Partial"];
  var unsafeCrashWith = function (msg) {
      return $foreign.unsafePartial(function (dictPartial) {
          return Partial.crashWith(dictPartial)(msg);
      });
  };
  exports["unsafeCrashWith"] = unsafeCrashWith;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect.Aff"] = $PS["Effect.Aff"] || {};
  var exports = $PS["Effect.Aff"];
  var $foreign = $PS["Effect.Aff"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad = $PS["Control.Monad"];
  var Control_Monad_Error_Class = $PS["Control.Monad.Error.Class"];
  var Data_Either = $PS["Data.Either"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Effect_Class = $PS["Effect.Class"];
  var Partial_Unsafe = $PS["Partial.Unsafe"];                          
  var functorAff = new Data_Functor.Functor($foreign["_map"]);
  var ffiUtil = (function () {
      var unsafeFromRight = function (v) {
          if (v instanceof Data_Either.Right) {
              return v.value0;
          };
          if (v instanceof Data_Either.Left) {
              return Partial_Unsafe.unsafeCrashWith("unsafeFromRight: Left");
          };
          throw new Error("Failed pattern match at Effect.Aff (line 400, column 21 - line 402, column 31): " + [ v.constructor.name ]);
      };
      var unsafeFromLeft = function (v) {
          if (v instanceof Data_Either.Left) {
              return v.value0;
          };
          if (v instanceof Data_Either.Right) {
              return Partial_Unsafe.unsafeCrashWith("unsafeFromLeft: Right");
          };
          throw new Error("Failed pattern match at Effect.Aff (line 395, column 20 - line 399, column 3): " + [ v.constructor.name ]);
      };
      var isLeft = function (v) {
          if (v instanceof Data_Either.Left) {
              return true;
          };
          if (v instanceof Data_Either.Right) {
              return false;
          };
          throw new Error("Failed pattern match at Effect.Aff (line 390, column 12 - line 392, column 20): " + [ v.constructor.name ]);
      };
      return {
          isLeft: isLeft,
          fromLeft: unsafeFromLeft,
          fromRight: unsafeFromRight,
          left: Data_Either.Left.create,
          right: Data_Either.Right.create
      };
  })();
  var makeFiber = function (aff) {
      return $foreign["_makeFiber"](ffiUtil, aff);
  };
  var launchAff = function (aff) {
      return function __do() {
          var v = makeFiber(aff)();
          v.run();
          return v;
      };
  };
  var monadAff = new Control_Monad.Monad(function () {
      return applicativeAff;
  }, function () {
      return bindAff;
  });
  var bindAff = new Control_Bind.Bind(function () {
      return applyAff;
  }, $foreign["_bind"]);
  var applyAff = new Control_Apply.Apply(function () {
      return functorAff;
  }, Control_Monad.ap(monadAff));
  var applicativeAff = new Control_Applicative.Applicative(function () {
      return applyAff;
  }, $foreign["_pure"]);
  var monadEffectAff = new Effect_Class.MonadEffect(function () {
      return monadAff;
  }, $foreign["_liftEffect"]);
  var monadThrowAff = new Control_Monad_Error_Class.MonadThrow(function () {
      return monadAff;
  }, $foreign["_throwError"]);
  var monadErrorAff = new Control_Monad_Error_Class.MonadError(function () {
      return monadThrowAff;
  }, $foreign["_catchError"]);                                  
  var runAff = function (k) {
      return function (aff) {
          return launchAff(Control_Bind.bindFlipped(bindAff)(function ($52) {
              return Effect_Class.liftEffect(monadEffectAff)(k($52));
          })(Control_Monad_Error_Class["try"](monadErrorAff)(aff)));
      };
  };
  var runAff_ = function (k) {
      return function (aff) {
          return Data_Functor["void"](Effect.functorEffect)(runAff(k)(aff));
      };
  };
  var nonCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(Data_Unit.unit));
  exports["launchAff"] = launchAff;
  exports["runAff"] = runAff;
  exports["runAff_"] = runAff_;
  exports["nonCanceler"] = nonCanceler;
  exports["functorAff"] = functorAff;
  exports["applyAff"] = applyAff;
  exports["applicativeAff"] = applicativeAff;
  exports["bindAff"] = bindAff;
  exports["monadAff"] = monadAff;
  exports["monadThrowAff"] = monadThrowAff;
  exports["monadErrorAff"] = monadErrorAff;
  exports["monadEffectAff"] = monadEffectAff;
  exports["makeAff"] = $foreign.makeAff;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect.Aff.Compat"] = $PS["Effect.Aff.Compat"] || {};
  var exports = $PS["Effect.Aff.Compat"];
  var Data_Either = $PS["Data.Either"];
  var Effect_Aff = $PS["Effect.Aff"];
  var fromEffectFnAff = function (v) {
      return Effect_Aff.makeAff(function (k) {
          return function __do() {
              var v1 = v(function ($4) {
                  return k(Data_Either.Left.create($4))();
              }, function ($5) {
                  return k(Data_Either.Right.create($5))();
              });
              return function (e) {
                  return Effect_Aff.makeAff(function (k2) {
                      return function __do() {
                          v1(e, function ($6) {
                              return k2(Data_Either.Left.create($6))();
                          }, function ($7) {
                              return k2(Data_Either.Right.create($7))();
                          });
                          return Effect_Aff.nonCanceler;
                      };
                  });
              };
          };
      });
  };
  exports["fromEffectFnAff"] = fromEffectFnAff;
})(PS);
(function(exports) {
  "use strict";

  exports.unsafeToForeign = function (value) {
    return value;
  };

  exports.unsafeFromForeign = function (value) {
    return value;
  };

  exports.tagOf = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };
})(PS["Foreign"] = PS["Foreign"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Foreign"] = $PS["Foreign"] || {};
  var exports = $PS["Foreign"];
  var $foreign = $PS["Foreign"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Monad_Error_Class = $PS["Control.Monad.Error.Class"];
  var Control_Monad_Except_Trans = $PS["Control.Monad.Except.Trans"];
  var Data_Boolean = $PS["Data.Boolean"];
  var Data_Identity = $PS["Data.Identity"];
  var Data_List_NonEmpty = $PS["Data.List.NonEmpty"];
  var Data_Show = $PS["Data.Show"];                                        
  var ForeignError = (function () {
      function ForeignError(value0) {
          this.value0 = value0;
      };
      ForeignError.create = function (value0) {
          return new ForeignError(value0);
      };
      return ForeignError;
  })();
  var TypeMismatch = (function () {
      function TypeMismatch(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TypeMismatch.create = function (value0) {
          return function (value1) {
              return new TypeMismatch(value0, value1);
          };
      };
      return TypeMismatch;
  })();
  var ErrorAtIndex = (function () {
      function ErrorAtIndex(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtIndex.create = function (value0) {
          return function (value1) {
              return new ErrorAtIndex(value0, value1);
          };
      };
      return ErrorAtIndex;
  })();
  var ErrorAtProperty = (function () {
      function ErrorAtProperty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtProperty.create = function (value0) {
          return function (value1) {
              return new ErrorAtProperty(value0, value1);
          };
      };
      return ErrorAtProperty;
  })();
  var showForeignError = new Data_Show.Show(function (v) {
      if (v instanceof ForeignError) {
          return "(ForeignError " + (Data_Show.show(Data_Show.showString)(v.value0) + ")");
      };
      if (v instanceof ErrorAtIndex) {
          return "(ErrorAtIndex " + (Data_Show.show(Data_Show.showInt)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof ErrorAtProperty) {
          return "(ErrorAtProperty " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof TypeMismatch) {
          return "(TypeMismatch " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(Data_Show.showString)(v.value1) + ")")));
      };
      throw new Error("Failed pattern match at Foreign (line 63, column 1 - line 63, column 47): " + [ v.constructor.name ]);
  });
  var fail = function ($107) {
      return Control_Monad_Error_Class.throwError(Control_Monad_Except_Trans.monadThrowExceptT(Data_Identity.monadIdentity))(Data_List_NonEmpty.singleton($107));
  };
  var unsafeReadTagged = function (tag) {
      return function (value) {
          if ($foreign.tagOf(value) === tag) {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
          };
          if (Data_Boolean.otherwise) {
              return fail(new TypeMismatch(tag, $foreign.tagOf(value)));
          };
          throw new Error("Failed pattern match at Foreign (line 106, column 1 - line 106, column 55): " + [ tag.constructor.name, value.constructor.name ]);
      };
  };
  var readString = unsafeReadTagged("String");
  exports["ForeignError"] = ForeignError;
  exports["TypeMismatch"] = TypeMismatch;
  exports["ErrorAtIndex"] = ErrorAtIndex;
  exports["ErrorAtProperty"] = ErrorAtProperty;
  exports["unsafeReadTagged"] = unsafeReadTagged;
  exports["readString"] = readString;
  exports["fail"] = fail;
  exports["showForeignError"] = showForeignError;
  exports["unsafeToForeign"] = $foreign.unsafeToForeign;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Affjax"] = $PS["Affjax"] || {};
  var exports = $PS["Affjax"];
  var $foreign = $PS["Affjax"];
  var Affjax_RequestBody = $PS["Affjax.RequestBody"];
  var Affjax_RequestHeader = $PS["Affjax.RequestHeader"];
  var Affjax_ResponseFormat = $PS["Affjax.ResponseFormat"];
  var Affjax_ResponseHeader = $PS["Affjax.ResponseHeader"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad_Except = $PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = $PS["Control.Monad.Except.Trans"];
  var Data_Argonaut_Core = $PS["Data.Argonaut.Core"];
  var Data_Argonaut_Parser = $PS["Data.Argonaut.Parser"];
  var Data_Array = $PS["Data.Array"];
  var Data_Either = $PS["Data.Either"];
  var Data_Eq = $PS["Data.Eq"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_FormURLEncoded = $PS["Data.FormURLEncoded"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_HTTP_Method = $PS["Data.HTTP.Method"];
  var Data_HeytingAlgebra = $PS["Data.HeytingAlgebra"];
  var Data_Identity = $PS["Data.Identity"];
  var Data_List_NonEmpty = $PS["Data.List.NonEmpty"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Nullable = $PS["Data.Nullable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect_Aff = $PS["Effect.Aff"];
  var Effect_Aff_Compat = $PS["Effect.Aff.Compat"];
  var Foreign = $PS["Foreign"];
  var request = function (req) {
      var parseJSON = function (v) {
          if (v === "") {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Argonaut_Core.jsonEmptyObject);
          };
          return Data_Either.either(function ($66) {
              return Foreign.fail(Foreign.ForeignError.create($66));
          })(Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity)))(Data_Argonaut_Parser.jsonParser(v));
      };
      var fromResponse$prime = (function () {
          if (req.responseFormat instanceof Affjax_ResponseFormat["ArrayBuffer"]) {
              return Foreign.unsafeReadTagged("ArrayBuffer");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Blob) {
              return Foreign.unsafeReadTagged("Blob");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Document) {
              return Foreign.unsafeReadTagged("Document");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Json) {
              return Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(function ($67) {
                  return req.responseFormat.value0(parseJSON($67));
              })(Foreign.unsafeReadTagged("String"));
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat["String"]) {
              return Foreign.unsafeReadTagged("String");
          };
          if (req.responseFormat instanceof Affjax_ResponseFormat.Ignore) {
              return Data_Function["const"](req.responseFormat.value0(Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Unit.unit)));
          };
          throw new Error("Failed pattern match at Affjax (line 293, column 19 - line 299, column 57): " + [ req.responseFormat.constructor.name ]);
      })();
      var extractContent = function (v) {
          if (v instanceof Affjax_RequestBody.ArrayView) {
              return v.value0(Foreign.unsafeToForeign);
          };
          if (v instanceof Affjax_RequestBody.Blob) {
              return Foreign.unsafeToForeign(v.value0);
          };
          if (v instanceof Affjax_RequestBody.Document) {
              return Foreign.unsafeToForeign(v.value0);
          };
          if (v instanceof Affjax_RequestBody["String"]) {
              return Foreign.unsafeToForeign(v.value0);
          };
          if (v instanceof Affjax_RequestBody.FormData) {
              return Foreign.unsafeToForeign(v.value0);
          };
          if (v instanceof Affjax_RequestBody.FormURLEncoded) {
              return Foreign.unsafeToForeign(Data_FormURLEncoded.encode(v.value0));
          };
          if (v instanceof Affjax_RequestBody.Json) {
              return Foreign.unsafeToForeign(Data_Argonaut_Core.stringify(v.value0));
          };
          throw new Error("Failed pattern match at Affjax (line 267, column 20 - line 274, column 57): " + [ v.constructor.name ]);
      };
      var addHeader = function (mh) {
          return function (hs) {
              if (mh instanceof Data_Maybe.Just && !Data_Foldable.any(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Function.on(Data_Eq.eq(Data_Eq.eqString))(Affjax_RequestHeader.requestHeaderName)(mh.value0))(hs)) {
                  return Data_Array.snoc(hs)(mh.value0);
              };
              return hs;
          };
      };
      var headers = function (reqContent) {
          return addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Affjax_RequestHeader.ContentType.create)(Control_Bind.bindFlipped(Data_Maybe.bindMaybe)(Affjax_RequestBody.toMediaType)(reqContent)))(addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Affjax_RequestHeader.Accept.create)(Affjax_ResponseFormat.toMediaType(req.responseFormat)))(req.headers));
      };
      var req$prime = {
          method: Data_HTTP_Method.print(req.method),
          url: req.url,
          headers: Data_Functor.map(Data_Functor.functorArray)(function (h) {
              return {
                  field: Affjax_RequestHeader.requestHeaderName(h),
                  value: Affjax_RequestHeader.requestHeaderValue(h)
              };
          })(headers(req.content)),
          content: Data_Nullable.toNullable(Data_Functor.map(Data_Maybe.functorMaybe)(extractContent)(req.content)),
          responseType: Affjax_ResponseFormat.toResponseType(req.responseFormat),
          username: Data_Nullable.toNullable(req.username),
          password: Data_Nullable.toNullable(req.password),
          withCredentials: req.withCredentials
      };
      return Control_Bind.bind(Effect_Aff.bindAff)(Effect_Aff_Compat.fromEffectFnAff($foreign["_ajax"](Affjax_ResponseHeader.responseHeader, req$prime)))(function (v) {
          var v1 = Control_Monad_Except.runExcept(fromResponse$prime(v.body));
          if (v1 instanceof Data_Either.Left) {
              return Control_Applicative.pure(Effect_Aff.applicativeAff)({
                  body: new Data_Either.Left(new Affjax_ResponseFormat.ResponseFormatError(Data_List_NonEmpty.head(v1.value0), v.body)),
                  headers: v.headers,
                  status: v.status,
                  statusText: v.statusText
              });
          };
          if (v1 instanceof Data_Either.Right) {
              return Control_Applicative.pure(Effect_Aff.applicativeAff)({
                  body: new Data_Either.Right(v1.value0),
                  headers: v.headers,
                  status: v.status,
                  statusText: v.statusText
              });
          };
          throw new Error("Failed pattern match at Affjax (line 247, column 3 - line 251, column 39): " + [ v1.constructor.name ]);
      });
  };
  var defaultRequest = {
      method: new Data_Either.Left(Data_HTTP_Method.GET.value),
      url: "/",
      headers: [  ],
      content: Data_Maybe.Nothing.value,
      username: Data_Maybe.Nothing.value,
      password: Data_Maybe.Nothing.value,
      withCredentials: false,
      responseFormat: Affjax_ResponseFormat.ignore
  };
  var get = function (rf) {
      return function (u) {
          return request({
              method: defaultRequest.method,
              url: u,
              headers: defaultRequest.headers,
              content: defaultRequest.content,
              username: defaultRequest.username,
              password: defaultRequest.password,
              withCredentials: defaultRequest.withCredentials,
              responseFormat: rf
          });
      };
  };
  var post = function (rf) {
      return function (u) {
          return function (c) {
              return request({
                  method: new Data_Either.Left(Data_HTTP_Method.POST.value),
                  url: u,
                  headers: defaultRequest.headers,
                  content: new Data_Maybe.Just(c),
                  username: defaultRequest.username,
                  password: defaultRequest.password,
                  withCredentials: defaultRequest.withCredentials,
                  responseFormat: rf
              });
          };
      };
  };
  exports["defaultRequest"] = defaultRequest;
  exports["request"] = request;
  exports["get"] = get;
  exports["post"] = post;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Config"] = $PS["Agrippa.Config"] || {};
  var exports = $PS["Agrippa.Config"];
  var Control_Bind = $PS["Control.Bind"];
  var Data_Argonaut_Core = $PS["Data.Argonaut.Core"];
  var Data_Either = $PS["Data.Either"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Foreign_Object = $PS["Foreign.Object"];                
  var mToE = function (err) {
      return function (mb) {
          return Data_Maybe.maybe(new Data_Either.Left(err))(Data_Either.Right.create)(mb);
      };
  };
  var lookupConfigVal = function (key) {
      return function (config) {
          return Control_Bind.bind(Data_Either.bindEither)(mToE("Config Error: expect JSON object.")(Data_Argonaut_Core.toObject(config)))(function (v) {
              return mToE("Config Error: expect JSON object with a(n) '" + (key + "' key."))(Foreign_Object.lookup(key)(v));
          });
      };
  };
  var getConvertedVal = function (key) {
      return function (config) {
          return function (convert) {
              return Control_Bind.bind(Data_Either.bindEither)(lookupConfigVal(key)(config))(function (v) {
                  return mToE("Config Error: expect value of '" + (key + "' to be a different type."))(convert(v));
              });
          };
      };
  };
  var getNumberVal = function (key) {
      return function (config) {
          return getConvertedVal(key)(config)(Data_Argonaut_Core.toNumber);
      };
  };
  var getObjectVal = function (key) {
      return function (config) {
          return getConvertedVal(key)(config)(Data_Argonaut_Core.toObject);
      };
  };
  var getStringVal = function (key) {
      return function (config) {
          return getConvertedVal(key)(config)(Data_Argonaut_Core.toString);
      };
  };
  exports["getNumberVal"] = getNumberVal;
  exports["getObjectVal"] = getObjectVal;
  exports["getStringVal"] = getStringVal;
  exports["lookupConfigVal"] = lookupConfigVal;
})(PS);
(function(exports) {
  "use strict";
  /* global Symbol */

  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator =
    typeof Symbol !== "undefined" &&
    Symbol != null &&
    typeof Symbol.iterator !== "undefined" &&
    typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";

  exports._unsafeCodePointAt0 = function (fallback) {
    return hasCodePointAt
      ? function (str) { return str.codePointAt(0); }
      : fallback;
  };

  exports._fromCodePointArray = function (singleton) {
    return hasFromCodePoint
      ? function (cps) {
        // Function.prototype.apply will fail for very large second parameters,
        // so we don't use it for arrays with 10,000 or more entries.
        if (cps.length < 10e3) {
          return String.fromCodePoint.apply(String, cps);
        }
        return cps.map(singleton).join("");
      }
      : function (cps) {
        return cps.map(singleton).join("");
      };
  };

  exports._singleton = function (fallback) {
    return hasFromCodePoint ? String.fromCodePoint : fallback;
  };

  exports._take = function (fallback) {
    return function (n) {
      if (hasStringIterator) {
        return function (str) {
          var accum = "";
          var iter = str[Symbol.iterator]();
          for (var i = 0; i < n; ++i) {
            var o = iter.next();
            if (o.done) return accum;
            accum += o.value;
          }
          return accum;
        };
      }
      return fallback(n);
    };
  };

  exports._toCodePointArray = function (fallback) {
    return function (unsafeCodePointAt0) {
      if (hasArrayFrom) {
        return function (str) {
          return Array.from(str, unsafeCodePointAt0);
        };
      }
      return fallback;
    };
  };
})(PS["Data.String.CodePoints"] = PS["Data.String.CodePoints"] || {});
(function(exports) {
  "use strict";

  exports.topInt = 2147483647;
  exports.bottomInt = -2147483648;

  exports.topChar = String.fromCharCode(65535);
  exports.bottomChar = String.fromCharCode(0);
})(PS["Data.Bounded"] = PS["Data.Bounded"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Bounded"] = $PS["Data.Bounded"] || {};
  var exports = $PS["Data.Bounded"];
  var $foreign = $PS["Data.Bounded"];
  var Data_Ord = $PS["Data.Ord"];                  
  var Bounded = function (Ord0, bottom, top) {
      this.Ord0 = Ord0;
      this.bottom = bottom;
      this.top = top;
  };
  var top = function (dict) {
      return dict.top;
  };                                            
  var boundedInt = new Bounded(function () {
      return Data_Ord.ordInt;
  }, $foreign.bottomInt, $foreign.topInt);
  var boundedChar = new Bounded(function () {
      return Data_Ord.ordChar;
  }, $foreign.bottomChar, $foreign.topChar);
  var bottom = function (dict) {
      return dict.bottom;
  };
  exports["Bounded"] = Bounded;
  exports["bottom"] = bottom;
  exports["top"] = top;
  exports["boundedInt"] = boundedInt;
  exports["boundedChar"] = boundedChar;
})(PS);
(function(exports) {
  "use strict";

  exports.toCharCode = function (c) {
    return c.charCodeAt(0);
  };

  exports.fromCharCode = function (c) {
    return String.fromCharCode(c);
  };
})(PS["Data.Enum"] = PS["Data.Enum"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Enum"] = $PS["Data.Enum"] || {};
  var exports = $PS["Data.Enum"];
  var $foreign = $PS["Data.Enum"];
  var Data_Bounded = $PS["Data.Bounded"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Ord = $PS["Data.Ord"];
  var Enum = function (Ord0, pred, succ) {
      this.Ord0 = Ord0;
      this.pred = pred;
      this.succ = succ;
  };
  var BoundedEnum = function (Bounded0, Enum1, cardinality, fromEnum, toEnum) {
      this.Bounded0 = Bounded0;
      this.Enum1 = Enum1;
      this.cardinality = cardinality;
      this.fromEnum = fromEnum;
      this.toEnum = toEnum;
  };
  var toEnum = function (dict) {
      return dict.toEnum;
  };
  var succ = function (dict) {
      return dict.succ;
  }; 
  var pred = function (dict) {
      return dict.pred;
  };              
  var fromEnum = function (dict) {
      return dict.fromEnum;
  };
  var toEnumWithDefaults = function (dictBoundedEnum) {
      return function (low) {
          return function (high) {
              return function (x) {
                  var v = toEnum(dictBoundedEnum)(x);
                  if (v instanceof Data_Maybe.Just) {
                      return v.value0;
                  };
                  if (v instanceof Data_Maybe.Nothing) {
                      var $54 = x < fromEnum(dictBoundedEnum)(Data_Bounded.bottom(dictBoundedEnum.Bounded0()));
                      if ($54) {
                          return low;
                      };
                      return high;
                  };
                  throw new Error("Failed pattern match at Data.Enum (line 158, column 33 - line 160, column 62): " + [ v.constructor.name ]);
              };
          };
      };
  };
  var defaultSucc = function (toEnum$prime) {
      return function (fromEnum$prime) {
          return function (a) {
              return toEnum$prime(fromEnum$prime(a) + 1 | 0);
          };
      };
  };
  var defaultPred = function (toEnum$prime) {
      return function (fromEnum$prime) {
          return function (a) {
              return toEnum$prime(fromEnum$prime(a) - 1 | 0);
          };
      };
  };
  var charToEnum = function (v) {
      if (v >= Data_Bounded.bottom(Data_Bounded.boundedInt) && v <= Data_Bounded.top(Data_Bounded.boundedInt)) {
          return new Data_Maybe.Just($foreign.fromCharCode(v));
      };
      return Data_Maybe.Nothing.value;
  };
  var enumChar = new Enum(function () {
      return Data_Ord.ordChar;
  }, defaultPred(charToEnum)($foreign.toCharCode), defaultSucc(charToEnum)($foreign.toCharCode));
  var cardinality = function (dict) {
      return dict.cardinality;
  }; 
  var boundedEnumChar = new BoundedEnum(function () {
      return Data_Bounded.boundedChar;
  }, function () {
      return enumChar;
  }, $foreign.toCharCode(Data_Bounded.top(Data_Bounded.boundedChar)) - $foreign.toCharCode(Data_Bounded.bottom(Data_Bounded.boundedChar)) | 0, $foreign.toCharCode, charToEnum);
  exports["Enum"] = Enum;
  exports["succ"] = succ;
  exports["pred"] = pred;
  exports["BoundedEnum"] = BoundedEnum;
  exports["cardinality"] = cardinality;
  exports["toEnum"] = toEnum;
  exports["fromEnum"] = fromEnum;
  exports["toEnumWithDefaults"] = toEnumWithDefaults;
  exports["defaultSucc"] = defaultSucc;
  exports["defaultPred"] = defaultPred;
  exports["enumChar"] = enumChar;
  exports["boundedEnumChar"] = boundedEnumChar;
})(PS);
(function(exports) {
  "use strict";

  exports.intDegree = function (x) {
    return Math.min(Math.abs(x), 2147483647);
  };

  // See the Euclidean definition in
  // https://en.m.wikipedia.org/wiki/Modulo_operation.
  exports.intDiv = function (x) {
    return function (y) {
      if (y === 0) return 0;
      return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
    };
  };

  exports.intMod = function (x) {
    return function (y) {
      if (y === 0) return 0;
      var yy = Math.abs(y);
      return ((x % yy) + yy) % yy;
    };
  };
})(PS["Data.EuclideanRing"] = PS["Data.EuclideanRing"] || {});
(function(exports) {
  "use strict";

  exports.intSub = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x - y | 0;
    };
  };
})(PS["Data.Ring"] = PS["Data.Ring"] || {});
(function(exports) {
  "use strict";

  exports.intAdd = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x + y | 0;
    };
  };

  exports.intMul = function (x) {
    return function (y) {
      /* jshint bitwise: false */
      return x * y | 0;
    };
  };
})(PS["Data.Semiring"] = PS["Data.Semiring"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Semiring"] = $PS["Data.Semiring"] || {};
  var exports = $PS["Data.Semiring"];
  var $foreign = $PS["Data.Semiring"];
  var Semiring = function (add, mul, one, zero) {
      this.add = add;
      this.mul = mul;
      this.one = one;
      this.zero = zero;
  };
  var zero = function (dict) {
      return dict.zero;
  };                                                                            
  var semiringInt = new Semiring($foreign.intAdd, $foreign.intMul, 1, 0);
  var one = function (dict) {
      return dict.one;
  };
  var mul = function (dict) {
      return dict.mul;
  };
  var add = function (dict) {
      return dict.add;
  };
  exports["Semiring"] = Semiring;
  exports["add"] = add;
  exports["zero"] = zero;
  exports["mul"] = mul;
  exports["one"] = one;
  exports["semiringInt"] = semiringInt;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Ring"] = $PS["Data.Ring"] || {};
  var exports = $PS["Data.Ring"];
  var $foreign = $PS["Data.Ring"];
  var Data_Semiring = $PS["Data.Semiring"];
  var Ring = function (Semiring0, sub) {
      this.Semiring0 = Semiring0;
      this.sub = sub;
  };
  var sub = function (dict) {
      return dict.sub;
  };                  
  var ringInt = new Ring(function () {
      return Data_Semiring.semiringInt;
  }, $foreign.intSub);
  exports["Ring"] = Ring;
  exports["sub"] = sub;
  exports["ringInt"] = ringInt;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.CommutativeRing"] = $PS["Data.CommutativeRing"] || {};
  var exports = $PS["Data.CommutativeRing"];
  var Data_Ring = $PS["Data.Ring"];
  var CommutativeRing = function (Ring0) {
      this.Ring0 = Ring0;
  }; 
  var commutativeRingInt = new CommutativeRing(function () {
      return Data_Ring.ringInt;
  });
  exports["CommutativeRing"] = CommutativeRing;
  exports["commutativeRingInt"] = commutativeRingInt;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.EuclideanRing"] = $PS["Data.EuclideanRing"] || {};
  var exports = $PS["Data.EuclideanRing"];
  var $foreign = $PS["Data.EuclideanRing"];
  var Data_CommutativeRing = $PS["Data.CommutativeRing"];  
  var EuclideanRing = function (CommutativeRing0, degree, div, mod) {
      this.CommutativeRing0 = CommutativeRing0;
      this.degree = degree;
      this.div = div;
      this.mod = mod;
  };
  var mod = function (dict) {
      return dict.mod;
  }; 
  var euclideanRingInt = new EuclideanRing(function () {
      return Data_CommutativeRing.commutativeRingInt;
  }, $foreign.intDegree, $foreign.intDiv, $foreign.intMod);
  var div = function (dict) {
      return dict.div;
  };
  var degree = function (dict) {
      return dict.degree;
  };
  exports["EuclideanRing"] = EuclideanRing;
  exports["degree"] = degree;
  exports["div"] = div;
  exports["mod"] = mod;
  exports["euclideanRingInt"] = euclideanRingInt;
})(PS);
(function(exports) {
  "use strict";

  exports.singleton = function (c) {
    return c;
  };

  exports._charAt = function (just) {
    return function (nothing) {
      return function (i) {
        return function (s) {
          return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
        };
      };
    };
  };

  exports.length = function (s) {
    return s.length;
  };

  exports._indexOf = function (just) {
    return function (nothing) {
      return function (x) {
        return function (s) {
          var i = s.indexOf(x);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };

  exports.take = function (n) {
    return function (s) {
      return s.substr(0, n);
    };
  };

  exports.drop = function (n) {
    return function (s) {
      return s.substring(n);
    };
  };
})(PS["Data.String.CodeUnits"] = PS["Data.String.CodeUnits"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.String.CodeUnits"] = $PS["Data.String.CodeUnits"] || {};
  var exports = $PS["Data.String.CodeUnits"];
  var $foreign = $PS["Data.String.CodeUnits"];
  var Data_Maybe = $PS["Data.Maybe"];                                                         
  var indexOf = $foreign["_indexOf"](Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var charAt = $foreign["_charAt"](Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  exports["charAt"] = charAt;
  exports["indexOf"] = indexOf;
  exports["singleton"] = $foreign.singleton;
  exports["length"] = $foreign.length;
  exports["take"] = $foreign.take;
  exports["drop"] = $foreign.drop;
})(PS);
(function(exports) {
  "use strict";

  exports.charAt = function (i) {
    return function (s) {
      if (i >= 0 && i < s.length) return s.charAt(i);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };
})(PS["Data.String.Unsafe"] = PS["Data.String.Unsafe"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.String.Unsafe"] = $PS["Data.String.Unsafe"] || {};
  var exports = $PS["Data.String.Unsafe"];
  var $foreign = $PS["Data.String.Unsafe"];
  exports["charAt"] = $foreign.charAt;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.String.CodePoints"] = $PS["Data.String.CodePoints"] || {};
  var exports = $PS["Data.String.CodePoints"];
  var $foreign = $PS["Data.String.CodePoints"];
  var Data_Array = $PS["Data.Array"];
  var Data_Bounded = $PS["Data.Bounded"];
  var Data_Enum = $PS["Data.Enum"];
  var Data_EuclideanRing = $PS["Data.EuclideanRing"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_String_CodeUnits = $PS["Data.String.CodeUnits"];
  var Data_String_Unsafe = $PS["Data.String.Unsafe"];
  var Data_Tuple = $PS["Data.Tuple"];
  var Data_Unfoldable = $PS["Data.Unfoldable"];                
  var CodePoint = function (x) {
      return x;
  };
  var unsurrogate = function (lead) {
      return function (trail) {
          return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
      };
  }; 
  var isTrail = function (cu) {
      return 56320 <= cu && cu <= 57343;
  };
  var isLead = function (cu) {
      return 55296 <= cu && cu <= 56319;
  };
  var uncons = function (s) {
      var v = Data_String_CodeUnits.length(s);
      if (v === 0) {
          return Data_Maybe.Nothing.value;
      };
      if (v === 1) {
          return new Data_Maybe.Just({
              head: Data_Enum.fromEnum(Data_Enum.boundedEnumChar)(Data_String_Unsafe.charAt(0)(s)),
              tail: ""
          });
      };
      var cu1 = Data_Enum.fromEnum(Data_Enum.boundedEnumChar)(Data_String_Unsafe.charAt(1)(s));
      var cu0 = Data_Enum.fromEnum(Data_Enum.boundedEnumChar)(Data_String_Unsafe.charAt(0)(s));
      var $21 = isLead(cu0) && isTrail(cu1);
      if ($21) {
          return new Data_Maybe.Just({
              head: unsurrogate(cu0)(cu1),
              tail: Data_String_CodeUnits.drop(2)(s)
          });
      };
      return new Data_Maybe.Just({
          head: cu0,
          tail: Data_String_CodeUnits.drop(1)(s)
      });
  };
  var unconsButWithTuple = function (s) {
      return Data_Functor.map(Data_Maybe.functorMaybe)(function (v) {
          return new Data_Tuple.Tuple(v.head, v.tail);
      })(uncons(s));
  };
  var toCodePointArrayFallback = function (s) {
      return Data_Unfoldable.unfoldr(Data_Unfoldable.unfoldableArray)(unconsButWithTuple)(s);
  };
  var unsafeCodePointAt0Fallback = function (s) {
      var cu0 = Data_Enum.fromEnum(Data_Enum.boundedEnumChar)(Data_String_Unsafe.charAt(0)(s));
      var $25 = isLead(cu0) && Data_String_CodeUnits.length(s) > 1;
      if ($25) {
          var cu1 = Data_Enum.fromEnum(Data_Enum.boundedEnumChar)(Data_String_Unsafe.charAt(1)(s));
          var $26 = isTrail(cu1);
          if ($26) {
              return unsurrogate(cu0)(cu1);
          };
          return cu0;
      };
      return cu0;
  };
  var unsafeCodePointAt0 = $foreign["_unsafeCodePointAt0"](unsafeCodePointAt0Fallback);
  var toCodePointArray = $foreign["_toCodePointArray"](toCodePointArrayFallback)(unsafeCodePointAt0);
  var length = function ($52) {
      return Data_Array.length(toCodePointArray($52));
  };
  var indexOf = function (p) {
      return function (s) {
          return Data_Functor.map(Data_Maybe.functorMaybe)(function (i) {
              return length(Data_String_CodeUnits.take(i)(s));
          })(Data_String_CodeUnits.indexOf(p)(s));
      };
  };
  var fromCharCode = function ($53) {
      return Data_String_CodeUnits.singleton(Data_Enum.toEnumWithDefaults(Data_Enum.boundedEnumChar)(Data_Bounded.bottom(Data_Bounded.boundedChar))(Data_Bounded.top(Data_Bounded.boundedChar))($53));
  };
  var singletonFallback = function (v) {
      if (v <= 65535) {
          return fromCharCode(v);
      };
      var lead = Data_EuclideanRing.div(Data_EuclideanRing.euclideanRingInt)(v - 65536 | 0)(1024) + 55296 | 0;
      var trail = Data_EuclideanRing.mod(Data_EuclideanRing.euclideanRingInt)(v - 65536 | 0)(1024) + 56320 | 0;
      return fromCharCode(lead) + fromCharCode(trail);
  };
  var fromCodePointArray = $foreign["_fromCodePointArray"](singletonFallback);
  var singleton = $foreign["_singleton"](singletonFallback);
  var takeFallback = function (n) {
      return function (v) {
          if (n < 1) {
              return "";
          };
          var v1 = uncons(v);
          if (v1 instanceof Data_Maybe.Just) {
              return singleton(v1.value0.head) + takeFallback(n - 1 | 0)(v1.value0.tail);
          };
          return v;
      };
  };
  var take = $foreign["_take"](takeFallback);
  var splitAt = function (i) {
      return function (s) {
          var before = take(i)(s);
          return {
              before: before,
              after: Data_String_CodeUnits.drop(Data_String_CodeUnits.length(before))(s)
          };
      };
  }; 
  var drop = function (n) {
      return function (s) {
          return Data_String_CodeUnits.drop(Data_String_CodeUnits.length(take(n)(s)))(s);
      };
  };
  var indexOf$prime = function (p) {
      return function (i) {
          return function (s) {
              var s$prime = drop(i)(s);
              return Data_Functor.map(Data_Maybe.functorMaybe)(function (k) {
                  return i + length(Data_String_CodeUnits.take(k)(s$prime)) | 0;
              })(Data_String_CodeUnits.indexOf(p)(s$prime));
          };
      };
  };
  var codePointFromChar = function ($54) {
      return CodePoint(Data_Enum.fromEnum(Data_Enum.boundedEnumChar)($54));
  };
  exports["codePointFromChar"] = codePointFromChar;
  exports["singleton"] = singleton;
  exports["fromCodePointArray"] = fromCodePointArray;
  exports["toCodePointArray"] = toCodePointArray;
  exports["uncons"] = uncons;
  exports["length"] = length;
  exports["indexOf"] = indexOf;
  exports["indexOf'"] = indexOf$prime;
  exports["take"] = take;
  exports["drop"] = drop;
  exports["splitAt"] = splitAt;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Tuple.Nested"] = $PS["Data.Tuple.Nested"] || {};
  var exports = $PS["Data.Tuple.Nested"];
  var Data_Tuple = $PS["Data.Tuple"];
  var Data_Unit = $PS["Data.Unit"];
  var tuple3 = function (a) {
      return function (b) {
          return function (c) {
              return new Data_Tuple.Tuple(a, new Data_Tuple.Tuple(b, new Data_Tuple.Tuple(c, Data_Unit.unit)));
          };
      };
  };
  var get3 = function (v) {
      return v.value1.value1.value0;
  };
  var get2 = function (v) {
      return v.value1.value0;
  };
  var get1 = function (v) {
      return v.value0;
  };
  exports["tuple3"] = tuple3;
  exports["get1"] = get1;
  exports["get2"] = get2;
  exports["get3"] = get3;
})(PS);
(function(exports) {
  /* global exports */
  "use strict";

  exports.ready = function(func) {
      return function() {
          jQuery(document).ready(func);
      };
  };

  exports.select = function(selector) {
      return function() {
          return jQuery(selector);
      };
  };

  exports.create = function(html) {
      return function() {
          return jQuery(html);
      };
  };

  exports.toggleClass = function(cls) {
      return function(ob) {
          return function() {
              ob.toggleClass(cls);
          };
      };
  };

  exports.setClass = function(cls) {
      return function(flag) {
          return function(ob) {
              return function() {
                  ob.toggleClass(cls, flag);
              };
          };
      };
  };

  exports.setProp = function(p) {
      return function(val) {
          return function(ob) {
              return function() {
                  ob.prop(p, val);
              };
          };
      };
  };

  exports.getProp = function(p) {
      return function(ob) {
          return function() {
              return ob.prop(p);
          };
      };
  };

  exports.append = function(ob1) {
      return function(ob) {
          return function() {
              ob.append(ob1);
          };
      };
  };

  exports.appendText = function(s) {
      return function(ob) {
          return function() {
              ob.append(document.createTextNode(s));
          };
      };
  };

  exports.body = function() {
      return jQuery(document.body);
  };

  exports.clear = function(ob) {
      return function() {
          ob.empty();
      };
  };

  exports.getText = function(ob) {
      return function() {
          return ob.text();
      };
  };

  exports.setText = function(text) {
      return function(ob) {
          return function() {
              ob.text(text);
          };
      };
  };

  exports.getValue = function(ob) {
      return function() {
          return ob.val();
      };
  };

  exports.setValue = function(val) {
      return function(ob) {
          return function() {
              ob.val(val);
          };
      };
  };

  exports.toggle = function(ob) {
      return function() {
          ob.toggle();
      };
  };

  exports.toArray = function(ob) {
      return function() {
          var els = ob.toArray();
          var copy = [];
          for (var i = 0; i < els.length; i++) {
              copy.push(jQuery(els[i]));
          }
          return copy;
      };
  };

  exports.on = function(evt) {
      return function(act) {
          return function(ob) {
              return function() {
                  ob.on(evt, function(e) {
                      act(e)(jQuery(this))();
                  });
              };
          };
      };
  };


  exports.off = function(evt) {
      return function(ob) {
          return function() {
              return ob.off(evt);
          };
      };
  };

  exports.getWhich = function(e) {
      return function() {
          return e.which;
      };
  };
})(PS["JQuery"] = PS["JQuery"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["JQuery"] = $PS["JQuery"] || {};
  var exports = $PS["JQuery"];
  var $foreign = $PS["JQuery"];           
  var addClass = function (cls) {
      return $foreign.setClass(cls)(true);
  };
  exports["addClass"] = addClass;
  exports["ready"] = $foreign.ready;
  exports["select"] = $foreign.select;
  exports["create"] = $foreign.create;
  exports["setClass"] = $foreign.setClass;
  exports["setProp"] = $foreign.setProp;
  exports["getProp"] = $foreign.getProp;
  exports["append"] = $foreign.append;
  exports["clear"] = $foreign.clear;
  exports["appendText"] = $foreign.appendText;
  exports["body"] = $foreign.body;
  exports["getText"] = $foreign.getText;
  exports["setText"] = $foreign.setText;
  exports["getValue"] = $foreign.getValue;
  exports["setValue"] = $foreign.setValue;
  exports["toggle"] = $foreign.toggle;
  exports["on"] = $foreign.on;
  exports["off"] = $foreign.off;
  exports["toArray"] = $foreign.toArray;
  exports["getWhich"] = $foreign.getWhich;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Utils"] = $PS["Agrippa.Utils"] || {};
  var exports = $PS["Agrippa.Utils"];
  var Agrippa_Config = $PS["Agrippa.Config"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Data_Array = $PS["Data.Array"];
  var Data_Either = $PS["Data.Either"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Show = $PS["Data.Show"];
  var Data_String_CodePoints = $PS["Data.String.CodePoints"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Data_Tuple = $PS["Data.Tuple"];
  var Data_Tuple_Nested = $PS["Data.Tuple.Nested"];
  var Data_Unfoldable = $PS["Data.Unfoldable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Foreign_Object = $PS["Foreign.Object"];
  var JQuery = $PS["JQuery"];                
  var numOfShortcuts = 9;
  var displayOutput = function (node) {
      return function __do() {
          var v = JQuery.select("#agrippa-output")();
          JQuery.clear(v)();
          return JQuery.append(node)(v)();
      };
  };
  var createTuple3Plain = function (s) {
      return Data_Tuple_Nested.tuple3("")("")(s);
  };
  var createTuple3Highlighted = function (shortStr) {
      return function (longStr) {
          var trimmedShortStr = Data_String_Common.trim(shortStr);
          var idxMb = Data_String_CodePoints.indexOf(Data_String_Common.toLower(trimmedShortStr))(Data_String_Common.toLower(longStr));
          if (idxMb instanceof Data_Maybe.Nothing) {
              return createTuple3Plain(longStr);
          };
          if (idxMb instanceof Data_Maybe.Just) {
              var middle = Data_String_CodePoints.take(Data_String_CodePoints.length(trimmedShortStr))(Data_String_CodePoints.drop(idxMb.value0)(longStr));
              var before = Data_String_CodePoints.take(idxMb.value0)(longStr);
              var after = Data_String_CodePoints.drop(idxMb.value0 + Data_String_CodePoints.length(trimmedShortStr) | 0)(longStr);
              return Data_Tuple_Nested.tuple3(before)(middle)(after);
          };
          throw new Error("Failed pattern match at Agrippa.Utils (line 105, column 6 - line 110, column 43): " + [ idxMb.constructor.name ]);
      };
  };
  var createTextNode = function (t) {
      return function __do() {
          var v = JQuery.create("<div>")();
          JQuery.setText(t)(v)();
          return v;
      };
  };
  var displayOutputText = function (t) {
      return Control_Bind.bind(Effect.bindEffect)(createTextNode(t))(displayOutput);
  };
  var createTaskTableRow = function (cellType) {
      return function (cellData1) {
          return function (cellData2) {
              return function (splitter1) {
                  return function (splitter2) {
                      return function (tableElement) {
                          var createTaskTableCell = function (contents) {
                              return function (splitter) {
                                  return function (tr) {
                                      return function __do() {
                                          var v = JQuery.create(cellType)();
                                          var tp3 = splitter(contents);
                                          JQuery.appendText(Data_Tuple_Nested.get1(tp3))(v)();
                                          var v1 = JQuery.create("<span>")();
                                          JQuery.setText(Data_Tuple_Nested.get2(tp3))(v1)();
                                          JQuery.addClass("agrippa-highlighted-text")(v1)();
                                          JQuery.append(v1)(v)();
                                          JQuery.appendText(Data_Tuple_Nested.get3(tp3))(v)();
                                          return JQuery.append(v)(tr)();
                                      };
                                  };
                              };
                          };
                          return function __do() {
                              var v = JQuery.create("<tr>")();
                              createTaskTableCell(cellData1)(splitter1)(v)();
                              createTaskTableCell(cellData2)(splitter2)(v)();
                              return JQuery.append(v)(tableElement)();
                          };
                      };
                  };
              };
          };
      };
  };
  var createTaskTableRows = function (config) {
      return function (tableElement) {
          return function (keywordFilter) {
              return function (taskNameFilter) {
                  return function (keywordSplitter) {
                      return function (taskNameSplitter) {
                          var getKeywordsToTaskNames = Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.getObjectVal("tasks")(config))(function (v) {
                              return Control_Bind.bind(Data_Either.bindEither)(Data_Traversable.traverse(Foreign_Object.traversableObject)(Data_Either.applicativeEither)(Agrippa_Config.getStringVal("name"))(Foreign_Object.filterKeys(keywordFilter)(v)))(function (v1) {
                                  return new Data_Either.Right(Foreign_Object.filter(taskNameFilter)(v1));
                              });
                          });
                          if (getKeywordsToTaskNames instanceof Data_Either.Left) {
                              return displayOutputText(getKeywordsToTaskNames.value0);
                          };
                          if (getKeywordsToTaskNames instanceof Data_Either.Right) {
                              return Data_Foldable.traverse_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(function (tp) {
                                  return createTaskTableRow("<td>")(Data_Tuple.fst(tp))(Data_Tuple.snd(tp))(keywordSplitter)(taskNameSplitter)(tableElement);
                              })(Foreign_Object.toAscUnfoldable(Data_Unfoldable.unfoldableArray)(getKeywordsToTaskNames.value0));
                          };
                          throw new Error("Failed pattern match at Agrippa.Utils (line 63, column 3 - line 67, column 72): " + [ getKeywordsToTaskNames.constructor.name ]);
                      };
                  };
              };
          };
      };
  };
  var appendShortcutLabel = function (htmlTag) {
      return function (label) {
          return function (parent) {
              return function __do() {
                  var v = JQuery.create(htmlTag)();
                  JQuery.addClass("agrippa-shortcut-prompt")(v)();
                  JQuery.setText(label)(v)();
                  return JQuery.append(v)(parent)();
              };
          };
      };
  };
  var addShortcutLabels = function (htmlTag) {
      return function (nodes) {
          var v = Data_Array.uncons(nodes);
          if (v instanceof Data_Maybe.Just) {
              return function __do() {
                  appendShortcutLabel(htmlTag)("enter")(v.value0.head)();
                  return Data_Foldable.sequence_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(Data_Array.zipWith(appendShortcutLabel(htmlTag))(Data_Functor.map(Data_Functor.functorArray)(function (index) {
                      return "ctrl+shift+" + Data_Show.show(Data_Show.showInt)(index);
                  })(Data_Array.range(1)(numOfShortcuts)))(v.value0.tail))();
              };
          };
          if (v instanceof Data_Maybe.Nothing) {
              return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
          };
          throw new Error("Failed pattern match at Agrippa.Utils (line 39, column 3 - line 46, column 25): " + [ v.constructor.name ]);
      };
  };
  exports["addShortcutLabels"] = addShortcutLabels;
  exports["createTextNode"] = createTextNode;
  exports["createTaskTableRows"] = createTaskTableRows;
  exports["createTaskTableRow"] = createTaskTableRow;
  exports["createTuple3Highlighted"] = createTuple3Highlighted;
  exports["createTuple3Plain"] = createTuple3Plain;
  exports["displayOutput"] = displayOutput;
  exports["displayOutputText"] = displayOutputText;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Help"] = $PS["Agrippa.Help"] || {};
  var exports = $PS["Agrippa.Help"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Data_Function = $PS["Data.Function"];
  var JQuery = $PS["JQuery"];                
  var createHelp = function (config) {
      var toggleHelp = function (helpContent) {
          return function (v) {
              return function (v1) {
                  return function __do() {
                      JQuery.toggle(helpContent)();
                      var v2 = JQuery.select("#agrippa-help-button")();
                      var v3 = JQuery.getText(v2)();
                      var $10 = v3 === "What do I do?";
                      if ($10) {
                          return JQuery.setText("Got it!")(v2)();
                      };
                      return JQuery.setText("What do I do?")(v2)();
                  };
              };
          };
      };
      return function __do() {
          var v = JQuery.select("#agrippa-help-table")();
          Agrippa_Utils.createTaskTableRow("<th>")("Keyword")("Task")(Agrippa_Utils.createTuple3Plain)(Agrippa_Utils.createTuple3Plain)(v)();
          Agrippa_Utils.createTaskTableRows(config)(v)(Data_Function["const"](true))(Data_Function["const"](true))(Agrippa_Utils.createTuple3Plain)(Agrippa_Utils.createTuple3Plain)();
          var v1 = JQuery.select("#agrippa-help-content")();
          var v2 = JQuery.select("#agrippa-help-button")();
          JQuery.on("click")(toggleHelp(v1))(v2)();
          var v3 = JQuery.select("#agrippa-help-close")();
          return JQuery.on("click")(toggleHelp(v1))(v3)();
      };
  };
  exports["createHelp"] = createHelp;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Lazy"] = $PS["Control.Lazy"] || {};
  var exports = $PS["Control.Lazy"];               
  var Lazy = function (defer) {
      this.defer = defer;
  }; 
  var defer = function (dict) {
      return dict.defer;
  };
  var fix = function (dictLazy) {
      return function (f) {
          var go = defer(dictLazy)(function (v) {
              return f(go);
          });
          return go;
      };
  };
  exports["defer"] = defer;
  exports["Lazy"] = Lazy;
  exports["fix"] = fix;
})(PS);
(function(exports) {
  /* globals exports */
  "use strict";         

  exports.infinity = Infinity;

  exports.isFinite = isFinite;

  exports.readFloat = parseFloat;
})(PS["Global"] = PS["Global"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Global"] = $PS["Global"] || {};
  var exports = $PS["Global"];
  var $foreign = $PS["Global"];
  exports["infinity"] = $foreign.infinity;
  exports["isFinite"] = $foreign["isFinite"];
  exports["readFloat"] = $foreign.readFloat;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Number"] = $PS["Data.Number"] || {};
  var exports = $PS["Data.Number"];
  var Data_Boolean = $PS["Data.Boolean"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Global = $PS["Global"];   
  var $$isFinite = Global["isFinite"];
  var fromString = (function () {
      var check = function (num) {
          if ($$isFinite(num)) {
              return new Data_Maybe.Just(num);
          };
          if (Data_Boolean.otherwise) {
              return Data_Maybe.Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Number (line 45, column 5 - line 46, column 39): " + [ num.constructor.name ]);
      };
      return function ($1) {
          return check(Global.readFloat($1));
      };
  })();
  exports["fromString"] = fromString;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Control.Alternative"] = $PS["Control.Alternative"] || {};
  var exports = $PS["Control.Alternative"];              
  var Alternative = function (Applicative0, Plus1) {
      this.Applicative0 = Applicative0;
      this.Plus1 = Plus1;
  };
  exports["Alternative"] = Alternative;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Text.Parsing.StringParser"] = $PS["Text.Parsing.StringParser"] || {};
  var exports = $PS["Text.Parsing.StringParser"];
  var Control_Alt = $PS["Control.Alt"];
  var Control_Alternative = $PS["Control.Alternative"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Lazy = $PS["Control.Lazy"];
  var Control_Monad = $PS["Control.Monad"];
  var Control_Monad_Rec_Class = $PS["Control.Monad.Rec.Class"];
  var Control_Plus = $PS["Control.Plus"];
  var Data_Bifunctor = $PS["Data.Bifunctor"];
  var Data_Boolean = $PS["Data.Boolean"];
  var Data_Either = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Unit = $PS["Data.Unit"];                
  var ParseError = (function () {
      function ParseError(value0) {
          this.value0 = value0;
      };
      ParseError.create = function (value0) {
          return new ParseError(value0);
      };
      return ParseError;
  })();
  var Parser = function (x) {
      return x;
  };
  var unParser = function (v) {
      return v;
  };
  var $$try = function (v) {
      return function (v1) {
          return Data_Bifunctor.lmap(Data_Either.bifunctorEither)(function (v2) {
              return {
                  pos: v1.pos,
                  error: v2.error
              };
          })(v(v1));
      };
  }; 
  var runParser = function (v) {
      return function (s) {
          return Data_Bifunctor.bimap(Data_Either.bifunctorEither)(function (v1) {
              return v1.error;
          })(function (v1) {
              return v1.result;
          })(v({
              str: s,
              pos: 0
          }));
      };
  };
  var lazyParser = new Control_Lazy.Lazy(function (f) {
      return Parser(function (str) {
          return unParser(f(Data_Unit.unit))(str);
      });
  });
  var functorParser = new Data_Functor.Functor(function (f) {
      return function (v) {
          return function ($80) {
              return Data_Functor.map(Data_Either.functorEither)(function (v1) {
                  return {
                      result: f(v1.result),
                      suffix: v1.suffix
                  };
              })(v($80));
          };
      };
  });
  var fail = function (msg) {
      return function (v) {
          return new Data_Either.Left({
              pos: v.pos,
              error: new ParseError(msg)
          });
      };
  }; 
  var applyParser = new Control_Apply.Apply(function () {
      return functorParser;
  }, function (v) {
      return function (v1) {
          return function (s) {
              return Control_Bind.bind(Data_Either.bindEither)(v(s))(function (v2) {
                  return Control_Bind.bind(Data_Either.bindEither)(v1(v2.suffix))(function (v3) {
                      return Control_Applicative.pure(Data_Either.applicativeEither)({
                          result: v2.result(v3.result),
                          suffix: v3.suffix
                      });
                  });
              });
          };
      };
  });
  var bindParser = new Control_Bind.Bind(function () {
      return applyParser;
  }, function (v) {
      return function (f) {
          return function (s) {
              return Control_Bind.bind(Data_Either.bindEither)(v(s))(function (v1) {
                  return unParser(f(v1.result))(v1.suffix);
              });
          };
      };
  });
  var applicativeParser = new Control_Applicative.Applicative(function () {
      return applyParser;
  }, function (a) {
      return function (s) {
          return new Data_Either.Right({
              result: a,
              suffix: s
          });
      };
  });
  var monadParser = new Control_Monad.Monad(function () {
      return applicativeParser;
  }, function () {
      return bindParser;
  });
  var monadRecParser = new Control_Monad_Rec_Class.MonadRec(function () {
      return monadParser;
  }, function (f) {
      return function (a) {
          var split = function (v) {
              if (v.result instanceof Control_Monad_Rec_Class.Loop) {
                  return new Control_Monad_Rec_Class.Loop({
                      state: v.result.value0,
                      str: v.suffix
                  });
              };
              if (v.result instanceof Control_Monad_Rec_Class.Done) {
                  return new Control_Monad_Rec_Class.Done({
                      result: v.result.value0,
                      suffix: v.suffix
                  });
              };
              throw new Error("Failed pattern match at Text.Parsing.StringParser (line 88, column 7 - line 88, column 70): " + [ v.constructor.name ]);
          };
          return function (str) {
              return Control_Monad_Rec_Class.tailRecM(Control_Monad_Rec_Class.monadRecEither)(function (st) {
                  return Data_Functor.map(Data_Either.functorEither)(split)(unParser(f(st.state))(st.str));
              })({
                  state: a,
                  str: str
              });
          };
      };
  });
  var altParser = new Control_Alt.Alt(function () {
      return functorParser;
  }, function (v) {
      return function (v1) {
          return function (s) {
              var v2 = v(s);
              if (v2 instanceof Data_Either.Left) {
                  if (s.pos === v2.value0.pos) {
                      return v1(s);
                  };
                  if (Data_Boolean.otherwise) {
                      return new Data_Either.Left({
                          error: v2.value0.error,
                          pos: v2.value0.pos
                      });
                  };
              };
              return v2;
          };
      };
  });
  var plusParser = new Control_Plus.Plus(function () {
      return altParser;
  }, fail("No alternative"));
  var alternativeParser = new Control_Alternative.Alternative(function () {
      return applicativeParser;
  }, function () {
      return plusParser;
  });
  exports["ParseError"] = ParseError;
  exports["Parser"] = Parser;
  exports["unParser"] = unParser;
  exports["runParser"] = runParser;
  exports["fail"] = fail;
  exports["try"] = $$try;
  exports["functorParser"] = functorParser;
  exports["applyParser"] = applyParser;
  exports["applicativeParser"] = applicativeParser;
  exports["altParser"] = altParser;
  exports["plusParser"] = plusParser;
  exports["alternativeParser"] = alternativeParser;
  exports["bindParser"] = bindParser;
  exports["monadParser"] = monadParser;
  exports["monadRecParser"] = monadRecParser;
  exports["lazyParser"] = lazyParser;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Text.Parsing.StringParser.Combinators"] = $PS["Text.Parsing.StringParser.Combinators"] || {};
  var exports = $PS["Text.Parsing.StringParser.Combinators"];
  var Control_Alt = $PS["Control.Alt"];
  var Control_Apply = $PS["Control.Apply"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_List = $PS["Data.List"];
  var Data_NonEmpty = $PS["Data.NonEmpty"];
  var Text_Parsing_StringParser = $PS["Text.Parsing.StringParser"];                
  var withError = function (p) {
      return function (msg) {
          return Control_Alt.alt(Text_Parsing_StringParser.altParser)(p)(Text_Parsing_StringParser.fail(msg));
      };
  };
  var many = Data_List.manyRec(Text_Parsing_StringParser.monadRecParser)(Text_Parsing_StringParser.alternativeParser);
  var cons$prime = function (h) {
      return function (t) {
          return new Data_NonEmpty.NonEmpty(h, t);
      };
  };
  var many1 = function (p) {
      return Control_Apply.apply(Text_Parsing_StringParser.applyParser)(Data_Functor.map(Text_Parsing_StringParser.functorParser)(cons$prime)(p))(many(p));
  };
  var choice = function (dictFoldable) {
      return Data_Foldable.foldl(dictFoldable)(Control_Alt.alt(Text_Parsing_StringParser.altParser))(Text_Parsing_StringParser.fail("Nothing to parse"));
  };
  var between = function (open) {
      return function (close) {
          return function (p) {
              return Control_Apply.applyFirst(Text_Parsing_StringParser.applyParser)(Control_Apply.applySecond(Text_Parsing_StringParser.applyParser)(open)(p))(close);
          };
      };
  };
  exports["many"] = many;
  exports["many1"] = many1;
  exports["withError"] = withError;
  exports["between"] = between;
  exports["choice"] = choice;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Text.Parsing.StringParser.CodePoints"] = $PS["Text.Parsing.StringParser.CodePoints"] || {};
  var exports = $PS["Text.Parsing.StringParser.CodePoints"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Data_Either = $PS["Data.Either"];
  var Data_Eq = $PS["Data.Eq"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Show = $PS["Data.Show"];
  var Data_String_CodePoints = $PS["Data.String.CodePoints"];
  var Data_String_CodeUnits = $PS["Data.String.CodeUnits"];
  var Text_Parsing_StringParser = $PS["Text.Parsing.StringParser"];
  var Text_Parsing_StringParser_Combinators = $PS["Text.Parsing.StringParser.Combinators"];                
  var string = function (nt) {
      return function (s) {
          if (Data_Eq.eq(Data_Maybe.eqMaybe(Data_Eq.eqInt))(Data_String_CodePoints["indexOf'"](nt)(s.pos)(s.str))(new Data_Maybe.Just(s.pos))) {
              return new Data_Either.Right({
                  result: nt,
                  suffix: {
                      str: s.str,
                      pos: s.pos + Data_String_CodePoints.length(nt) | 0
                  }
              });
          };
          return new Data_Either.Left({
              pos: s.pos,
              error: new Text_Parsing_StringParser.ParseError("Expected '" + (nt + "'."))
          });
      };
  };
  var anyChar = function (v) {
      var v1 = Data_String_CodeUnits.charAt(v.pos)(v.str);
      if (v1 instanceof Data_Maybe.Just) {
          return new Data_Either.Right({
              result: v1.value0,
              suffix: {
                  str: v.str,
                  pos: v.pos + 1 | 0
              }
          });
      };
      if (v1 instanceof Data_Maybe.Nothing) {
          return new Data_Either.Left({
              pos: v.pos,
              error: new Text_Parsing_StringParser.ParseError("Unexpected EOF")
          });
      };
      throw new Error("Failed pattern match at Text.Parsing.StringParser.CodePoints (line 51, column 3 - line 53, column 64): " + [ v1.constructor.name ]);
  };
  var anyDigit = Text_Parsing_StringParser["try"](Control_Bind.bind(Text_Parsing_StringParser.bindParser)(anyChar)(function (v) {
      var $37 = v >= "0" && v <= "9";
      if ($37) {
          return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(v);
      };
      return Text_Parsing_StringParser.fail("Character " + (Data_Show.show(Data_Show.showChar)(v) + " is not a digit"));
  }));
  var satisfy = function (f) {
      return Text_Parsing_StringParser["try"](Control_Bind.bind(Text_Parsing_StringParser.bindParser)(anyChar)(function (v) {
          var $41 = f(v);
          if ($41) {
              return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(v);
          };
          return Text_Parsing_StringParser.fail("Character " + (Data_Show.show(Data_Show.showChar)(v) + " did not satisfy predicate"));
      }));
  };
  var $$char = function (c) {
      return Text_Parsing_StringParser_Combinators.withError(satisfy(function (v) {
          return v === c;
      }))("Could not match character " + Data_Show.show(Data_Show.showChar)(c));
  };
  exports["anyChar"] = anyChar;
  exports["anyDigit"] = anyDigit;
  exports["string"] = string;
  exports["satisfy"] = satisfy;
  exports["char"] = $$char;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Text.Parsing.StringParser.Expr"] = $PS["Text.Parsing.StringParser.Expr"] || {};
  var exports = $PS["Text.Parsing.StringParser.Expr"];
  var Control_Alt = $PS["Control.Alt"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Category = $PS["Control.Category"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Text_Parsing_StringParser = $PS["Text.Parsing.StringParser"];
  var Text_Parsing_StringParser_Combinators = $PS["Text.Parsing.StringParser.Combinators"];                
  var AssocNone = (function () {
      function AssocNone() {

      };
      AssocNone.value = new AssocNone();
      return AssocNone;
  })();
  var AssocLeft = (function () {
      function AssocLeft() {

      };
      AssocLeft.value = new AssocLeft();
      return AssocLeft;
  })();
  var AssocRight = (function () {
      function AssocRight() {

      };
      AssocRight.value = new AssocRight();
      return AssocRight;
  })();
  var Infix = (function () {
      function Infix(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Infix.create = function (value0) {
          return function (value1) {
              return new Infix(value0, value1);
          };
      };
      return Infix;
  })();
  var Prefix = (function () {
      function Prefix(value0) {
          this.value0 = value0;
      };
      Prefix.create = function (value0) {
          return new Prefix(value0);
      };
      return Prefix;
  })();
  var Postfix = (function () {
      function Postfix(value0) {
          this.value0 = value0;
      };
      Postfix.create = function (value0) {
          return new Postfix(value0);
      };
      return Postfix;
  })();
  var buildExprParser = function (operators) {
      return function (simpleExpr) {
          var termP = function (prefixP) {
              return function (term) {
                  return function (postfixP) {
                      return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(prefixP)(function (v) {
                          return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(term)(function (v1) {
                              return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(postfixP)(function (v2) {
                                  return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(v2(v(v1)));
                              });
                          });
                      });
                  };
              };
          };
          var splitOp = function (v) {
              return function (accum) {
                  if (v instanceof Infix && v.value1 instanceof AssocNone) {
                      return {
                          rassoc: accum.rassoc,
                          lassoc: accum.lassoc,
                          nassoc: new Data_List_Types.Cons(v.value0, accum.nassoc),
                          prefix: accum.prefix,
                          postfix: accum.postfix
                      };
                  };
                  if (v instanceof Infix && v.value1 instanceof AssocLeft) {
                      return {
                          rassoc: accum.rassoc,
                          lassoc: new Data_List_Types.Cons(v.value0, accum.lassoc),
                          nassoc: accum.nassoc,
                          prefix: accum.prefix,
                          postfix: accum.postfix
                      };
                  };
                  if (v instanceof Infix && v.value1 instanceof AssocRight) {
                      return {
                          rassoc: new Data_List_Types.Cons(v.value0, accum.rassoc),
                          lassoc: accum.lassoc,
                          nassoc: accum.nassoc,
                          prefix: accum.prefix,
                          postfix: accum.postfix
                      };
                  };
                  if (v instanceof Prefix) {
                      return {
                          rassoc: accum.rassoc,
                          lassoc: accum.lassoc,
                          nassoc: accum.nassoc,
                          prefix: new Data_List_Types.Cons(v.value0, accum.prefix),
                          postfix: accum.postfix
                      };
                  };
                  if (v instanceof Postfix) {
                      return {
                          rassoc: accum.rassoc,
                          lassoc: accum.lassoc,
                          nassoc: accum.nassoc,
                          prefix: accum.prefix,
                          postfix: new Data_List_Types.Cons(v.value0, accum.postfix)
                      };
                  };
                  throw new Error("Failed pattern match at Text.Parsing.StringParser.Expr (line 59, column 5 - line 59, column 68): " + [ v.constructor.name, accum.constructor.name ]);
              };
          };
          var rassocP1 = function (x) {
              return function (rassocOp) {
                  return function (prefixP) {
                      return function (term) {
                          return function (postfixP) {
                              return Control_Alt.alt(Text_Parsing_StringParser.altParser)(rassocP(x)(rassocOp)(prefixP)(term)(postfixP))(Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(x));
                          };
                      };
                  };
              };
          };
          var rassocP = function (x) {
              return function (rassocOp) {
                  return function (prefixP) {
                      return function (term) {
                          return function (postfixP) {
                              return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(rassocOp)(function (v) {
                                  return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(Control_Bind.bind(Text_Parsing_StringParser.bindParser)(termP(prefixP)(term)(postfixP))(function (v1) {
                                      return rassocP1(v1)(rassocOp)(prefixP)(term)(postfixP);
                                  }))(function (v1) {
                                      return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(v(x)(v1));
                                  });
                              });
                          };
                      };
                  };
              };
          };
          var nassocP = function (x) {
              return function (nassocOp) {
                  return function (prefixP) {
                      return function (term) {
                          return function (postfixP) {
                              return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(nassocOp)(function (v) {
                                  return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(termP(prefixP)(term)(postfixP))(function (v1) {
                                      return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(v(x)(v1));
                                  });
                              });
                          };
                      };
                  };
              };
          };
          var lassocP1 = function (x) {
              return function (lassocOp) {
                  return function (prefixP) {
                      return function (term) {
                          return function (postfixP) {
                              return Control_Alt.alt(Text_Parsing_StringParser.altParser)(lassocP(x)(lassocOp)(prefixP)(term)(postfixP))(Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(x));
                          };
                      };
                  };
              };
          };
          var lassocP = function (x) {
              return function (lassocOp) {
                  return function (prefixP) {
                      return function (term) {
                          return function (postfixP) {
                              return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(lassocOp)(function (v) {
                                  return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(termP(prefixP)(term)(postfixP))(function (v1) {
                                      return lassocP1(v(x)(v1))(lassocOp)(prefixP)(term)(postfixP);
                                  });
                              });
                          };
                      };
                  };
              };
          };
          var makeParser = function (term) {
              return function (ops) {
                  var accum = Data_Foldable.foldr(Data_Foldable.foldableArray)(splitOp)({
                      rassoc: Data_List_Types.Nil.value,
                      lassoc: Data_List_Types.Nil.value,
                      nassoc: Data_List_Types.Nil.value,
                      prefix: Data_List_Types.Nil.value,
                      postfix: Data_List_Types.Nil.value
                  })(ops);
                  var lassocOp = Text_Parsing_StringParser_Combinators.choice(Data_List_Types.foldableList)(accum.lassoc);
                  var nassocOp = Text_Parsing_StringParser_Combinators.choice(Data_List_Types.foldableList)(accum.nassoc);
                  var postfixOp = Text_Parsing_StringParser_Combinators.withError(Text_Parsing_StringParser_Combinators.choice(Data_List_Types.foldableList)(accum.postfix))("");
                  var postfixP = Control_Alt.alt(Text_Parsing_StringParser.altParser)(postfixOp)(Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(Control_Category.identity(Control_Category.categoryFn)));
                  var prefixOp = Text_Parsing_StringParser_Combinators.withError(Text_Parsing_StringParser_Combinators.choice(Data_List_Types.foldableList)(accum.prefix))("");
                  var prefixP = Control_Alt.alt(Text_Parsing_StringParser.altParser)(prefixOp)(Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(Control_Category.identity(Control_Category.categoryFn)));
                  var rassocOp = Text_Parsing_StringParser_Combinators.choice(Data_List_Types.foldableList)(accum.rassoc);
                  return Control_Bind.bind(Text_Parsing_StringParser.bindParser)(termP(prefixP)(term)(postfixP))(function (v) {
                      return Text_Parsing_StringParser_Combinators.withError(Control_Alt.alt(Text_Parsing_StringParser.altParser)(Control_Alt.alt(Text_Parsing_StringParser.altParser)(Control_Alt.alt(Text_Parsing_StringParser.altParser)(rassocP(v)(rassocOp)(prefixP)(term)(postfixP))(lassocP(v)(lassocOp)(prefixP)(term)(postfixP)))(nassocP(v)(nassocOp)(prefixP)(term)(postfixP)))(Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(v)))("operator");
                  });
              };
          };
          return Data_Foldable.foldl(Data_Foldable.foldableArray)(makeParser)(simpleExpr)(operators);
      };
  };
  exports["AssocNone"] = AssocNone;
  exports["AssocLeft"] = AssocLeft;
  exports["AssocRight"] = AssocRight;
  exports["Infix"] = Infix;
  exports["Prefix"] = Prefix;
  exports["Postfix"] = Postfix;
  exports["buildExprParser"] = buildExprParser;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.Calculator"] = $PS["Agrippa.Plugins.Calculator"] || {};
  var exports = $PS["Agrippa.Plugins.Calculator"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Alt = $PS["Control.Alt"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Category = $PS["Control.Category"];
  var Control_Lazy = $PS["Control.Lazy"];
  var Data_Either = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_List_NonEmpty = $PS["Data.List.NonEmpty"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Number = $PS["Data.Number"];
  var Data_Show = $PS["Data.Show"];
  var Data_String_CodePoints = $PS["Data.String.CodePoints"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_Unfoldable = $PS["Data.Unfoldable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Text_Parsing_StringParser = $PS["Text.Parsing.StringParser"];
  var Text_Parsing_StringParser_CodePoints = $PS["Text.Parsing.StringParser.CodePoints"];
  var Text_Parsing_StringParser_Combinators = $PS["Text.Parsing.StringParser.Combinators"];
  var Text_Parsing_StringParser_Expr = $PS["Text.Parsing.StringParser.Expr"];                
  var ExprAdd = (function () {
      function ExprAdd(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ExprAdd.create = function (value0) {
          return function (value1) {
              return new ExprAdd(value0, value1);
          };
      };
      return ExprAdd;
  })();
  var ExprSub = (function () {
      function ExprSub(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ExprSub.create = function (value0) {
          return function (value1) {
              return new ExprSub(value0, value1);
          };
      };
      return ExprSub;
  })();
  var ExprMul = (function () {
      function ExprMul(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ExprMul.create = function (value0) {
          return function (value1) {
              return new ExprMul(value0, value1);
          };
      };
      return ExprMul;
  })();
  var ExprDiv = (function () {
      function ExprDiv(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ExprDiv.create = function (value0) {
          return function (value1) {
              return new ExprDiv(value0, value1);
          };
      };
      return ExprDiv;
  })();
  var ExprNeg = (function () {
      function ExprNeg(value0) {
          this.value0 = value0;
      };
      ExprNeg.create = function (value0) {
          return new ExprNeg(value0);
      };
      return ExprNeg;
  })();
  var ExprParens = (function () {
      function ExprParens(value0) {
          this.value0 = value0;
      };
      ExprParens.create = function (value0) {
          return new ExprParens(value0);
      };
      return ExprParens;
  })();
  var ExprNum = (function () {
      function ExprNum(value0) {
          this.value0 = value0;
      };
      ExprNum.create = function (value0) {
          return new ExprNum(value0);
      };
      return ExprNum;
  })();
  var table = [ [ new Text_Parsing_StringParser_Expr.Prefix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_CodePoints.string("-"))(ExprNeg.create)), new Text_Parsing_StringParser_Expr.Prefix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_CodePoints.string("+"))(Control_Category.identity(Control_Category.categoryFn))) ], [ new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_CodePoints.string("*"))(ExprMul.create), Text_Parsing_StringParser_Expr.AssocLeft.value), new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_CodePoints.string("/"))(ExprDiv.create), Text_Parsing_StringParser_Expr.AssocLeft.value) ], [ new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_CodePoints.string("+"))(ExprAdd.create), Text_Parsing_StringParser_Expr.AssocLeft.value), new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_CodePoints.string("-"))(ExprSub.create), Text_Parsing_StringParser_Expr.AssocLeft.value) ] ];
  var exprParensParser = function (p) {
      return Text_Parsing_StringParser_Combinators.between(Text_Parsing_StringParser_CodePoints.string("("))(Text_Parsing_StringParser_CodePoints.string(")"))(p);
  };
  var exprNumParser = Control_Bind.bind(Text_Parsing_StringParser.bindParser)(Text_Parsing_StringParser_Combinators.many1(Control_Alt.alt(Text_Parsing_StringParser.altParser)(Text_Parsing_StringParser_CodePoints.anyDigit)(Text_Parsing_StringParser_CodePoints["char"]("."))))(function (v) {
      var strNum = Data_String_CodePoints.fromCodePointArray(Data_List_NonEmpty.toUnfoldable(Data_Unfoldable.unfoldableArray)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_String_CodePoints.codePointFromChar)(v)));
      var numMb = Data_Number.fromString(strNum);
      if (numMb instanceof Data_Maybe.Nothing) {
          return Text_Parsing_StringParser.fail("Can't parse " + (strNum + " to number."));
      };
      if (numMb instanceof Data_Maybe.Just) {
          return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(new ExprNum(numMb.value0));
      };
      throw new Error("Failed pattern match at Agrippa.Plugins.Calculator (line 62, column 3 - line 64, column 35): " + [ numMb.constructor.name ]);
  });
  var exprParser = Control_Lazy.fix(Text_Parsing_StringParser.lazyParser)(function (p) {
      return Text_Parsing_StringParser_Expr.buildExprParser(table)(Control_Alt.alt(Text_Parsing_StringParser.altParser)(exprParensParser(p))(exprNumParser));
  });
  var parseExpr = Text_Parsing_StringParser.runParser(exprParser);
  var evalExpr$prime = function (v) {
      if (v instanceof ExprAdd) {
          return evalExpr$prime(v.value0) + evalExpr$prime(v.value1);
      };
      if (v instanceof ExprSub) {
          return evalExpr$prime(v.value0) - evalExpr$prime(v.value1);
      };
      if (v instanceof ExprMul) {
          return evalExpr$prime(v.value0) * evalExpr$prime(v.value1);
      };
      if (v instanceof ExprDiv) {
          return evalExpr$prime(v.value0) / evalExpr$prime(v.value1);
      };
      if (v instanceof ExprNeg) {
          return -evalExpr$prime(v.value0);
      };
      if (v instanceof ExprParens) {
          return evalExpr$prime(v.value0);
      };
      if (v instanceof ExprNum) {
          return v.value0;
      };
      throw new Error("Failed pattern match at Agrippa.Plugins.Calculator (line 76, column 1 - line 76, column 28): " + [ v.constructor.name ]);
  };
  var evalExpr = function (v) {
      if (v instanceof Data_Either.Left) {
          return "Invalid expression.  Please correct the input.";
      };
      if (v instanceof Data_Either.Right) {
          return Data_Show.show(Data_Show.showNumber)(evalExpr$prime(v.value0));
      };
      throw new Error("Failed pattern match at Agrippa.Plugins.Calculator (line 72, column 1 - line 72, column 45): " + [ v.constructor.name ]);
  };
  var calculate = function (v) {
      return function (v1) {
          return function (input) {
              return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode(evalExpr(parseExpr(Data_String_Common.replaceAll(" ")("")(input)))));
          };
      };
  };
  var calculator = {
      name: "Calculator",
      prompt: calculate,
      promptAfterKeyTimeout: function (v) {
          return function (v1) {
              return function (v2) {
                  return function (v3) {
                      return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
                  };
              };
          };
      },
      activate: function (v) {
          return function (v1) {
              return function (v2) {
                  return Control_Applicative.pure(Effect.applicativeEffect)(Data_Maybe.Nothing.value);
              };
          };
      }
  };
  exports["calculator"] = calculator;
})(PS);
(function(exports) {
  /* global exports */
  "use strict";

  exports.now = function () {
    return new Date();
  };

  exports.dateMethod = function (method, date) {
    return date[method]();
  };
})(PS["Data.JSDate"] = PS["Data.JSDate"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.JSDate"] = $PS["Data.JSDate"] || {};
  var exports = $PS["Data.JSDate"];
  var $foreign = $PS["Data.JSDate"];
  var toString = function (dt) {
      return $foreign.dateMethod("toString", dt);
  };
  exports["toString"] = toString;
  exports["now"] = $foreign.now;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.Clock"] = $PS["Agrippa.Plugins.Clock"] || {};
  var exports = $PS["Agrippa.Plugins.Clock"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_JSDate = $PS["Data.JSDate"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];                
  var showTime = function (v) {
      return function (v1) {
          return function (v2) {
              return function __do() {
                  var $10 = Data_JSDate.now();
                  return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode(Data_JSDate.toString($10)))();
              };
          };
      };
  };
  var clock = {
      name: "Clock",
      prompt: showTime,
      promptAfterKeyTimeout: function (v) {
          return function (v1) {
              return function (v2) {
                  return function (v3) {
                      return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
                  };
              };
          };
      },
      activate: function (v) {
          return function (v1) {
              return function (v2) {
                  return Control_Applicative.pure(Effect.applicativeEffect)(Data_Maybe.Nothing.value);
              };
          };
      }
  };
  exports["clock"] = clock;
})(PS);
(function(exports) {
  "use strict";

  exports.shortcutListener = function (openUrl) {
      return function (evt) {
          return function (body) {
              return function () {
                  // ctrlKey and shiftKey are the reason why we have to use JavaScript
                  // PureScript jQuery library can't access them
                  if (evt.ctrlKey === true && evt.shiftKey === true) {
                      var baseKeyCode = 48;   // key code for 0
                      var n = evt.which - baseKeyCode + 1;
                      if (n >= 2 && n <= 10) {
                          var link = $("#agrippa-output > div > div:nth-child(" + n + ") > a")[0];
                          if (link) {
                              jQuery.get(openUrl, {item: link.text});
                          }
                      }
                  }
              };
          };
      };
  };
})(PS["Agrippa.Plugins.FileSystem.Commons"] = PS["Agrippa.Plugins.FileSystem.Commons"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.FileSystem.Commons"] = $PS["Agrippa.Plugins.FileSystem.Commons"] || {};
  var exports = $PS["Agrippa.Plugins.FileSystem.Commons"];
  var $foreign = $PS["Agrippa.Plugins.FileSystem.Commons"];
  var Affjax = $PS["Affjax"];
  var Affjax_RequestBody = $PS["Affjax.RequestBody"];
  var Affjax_ResponseFormat = $PS["Affjax.ResponseFormat"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad_Except = $PS["Control.Monad.Except"];
  var Data_Argonaut_Core = $PS["Data.Argonaut.Core"];
  var Data_Either = $PS["Data.Either"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Effect_Aff = $PS["Effect.Aff"];
  var Foreign = $PS["Foreign"];
  var Foreign_Object = $PS["Foreign.Object"];
  var Global_Unsafe = $PS["Global.Unsafe"];
  var JQuery = $PS["JQuery"];                
  var prompt = function (v) {
      return function (v1) {
          return function (v2) {
              return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Searching..."));
          };
      };
  };
  var open = function (openUrl) {
      return function (v) {
          return function (v1) {
              return function (v2) {
                  return function __do() {
                      var v3 = JQuery.select("#agrippa-output > div > div:first > a")();
                      var v4 = JQuery.getProp("href")(v3)();
                      var v5 = Control_Monad_Except.runExcept(Foreign.readString(v4));
                      if (v5 instanceof Data_Either.Left) {
                          return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Got nothing here."))();
                      };
                      if (v5 instanceof Data_Either.Right) {
                          return Data_Functor.voidLeft(Effect.functorEffect)(Effect_Aff.runAff_(Data_Function["const"](Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit)))(Affjax.get(Affjax_ResponseFormat.json)(v5.value0)))(Data_Maybe.Nothing.value)();
                      };
                      throw new Error("Failed pattern match at Agrippa.Plugins.FileSystem.Commons (line 65, column 3 - line 70, column 71): " + [ v5.constructor.name ]);
                  };
              };
          };
      };
  };
  var buildSuggestReq = function (taskName) {
      return function (term) {
          return Data_Argonaut_Core.fromObject(Foreign_Object.insert("taskName")(Data_Argonaut_Core.fromString(taskName))(Foreign_Object.insert("term")(Data_Argonaut_Core.fromString(term))(Foreign_Object.empty)));
      };
  };
  var buildNode = function (openUrl) {
      return function (item) {
          return function __do() {
              var v = JQuery.create("<a>")();
              JQuery.setText(item)(v)();
              JQuery.setProp("href")(openUrl + ("?item=" + Global_Unsafe.unsafeEncodeURIComponent(item)))(v)();
              var v1 = JQuery.create("<div>")();
              JQuery.append(v)(v1)();
              return v1;
          };
      };
  };
  var buildOutput = function (openUrl) {
      return function (contents) {
          return function __do() {
              var v = JQuery.create("<div>")();
              (function () {
                  var v1 = Control_Bind.composeKleisliFlipped(Data_Maybe.bindMaybe)(Data_Traversable.traverse(Data_Traversable.traversableArray)(Data_Maybe.applicativeMaybe)(Data_Argonaut_Core.toString))(Data_Argonaut_Core.toArray)(contents);
                  if (v1 instanceof Data_Maybe.Just) {
                      Control_Bind.bind(Effect.bindEffect)(JQuery.body)(JQuery.on("keyup")($foreign.shortcutListener(openUrl)))();
                      var v2 = Data_Traversable.traverse(Data_Traversable.traversableArray)(Effect.applicativeEffect)(buildNode(openUrl))(v1.value0)();
                      Data_Foldable.traverse_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(Data_Function.flip(JQuery.append)(v))(v2)();
                      return Agrippa_Utils.addShortcutLabels("<span>")(v2)();
                  };
                  if (v1 instanceof Data_Maybe.Nothing) {
                      return JQuery.setText("Error: expect a JSON array of strings from server.")(v)();
                  };
                  throw new Error("Failed pattern match at Agrippa.Plugins.FileSystem.Commons (line 40, column 3 - line 46, column 89): " + [ v1.constructor.name ]);
              })();
              return v;
          };
      };
  };
  var suggest = function (suggestUrl) {
      return function (openUrl) {
          return function (taskName) {
              return function (config) {
                  return function (input) {
                      return function (displayOutput) {
                          var affHandler = function (v) {
                              if (v instanceof Data_Either.Right && (v.value0.status === 200 && v.value0.body instanceof Data_Either.Right)) {
                                  return Control_Bind.bind(Effect.bindEffect)(buildOutput(openUrl)(v.value0.body.value0))(displayOutput);
                              };
                              return Agrippa_Utils.displayOutputText("Failed to retrieve data from server.");
                          };
                          return Effect_Aff.runAff_(affHandler)(Affjax.post(Affjax_ResponseFormat.json)(suggestUrl)(Affjax_RequestBody.Json.create(buildSuggestReq(taskName)(Data_String_Common.trim(input)))));
                      };
                  };
              };
          };
      };
  };
  exports["open"] = open;
  exports["prompt"] = prompt;
  exports["suggest"] = suggest;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.FileSystem.LinuxFileSearch"] = $PS["Agrippa.Plugins.FileSystem.LinuxFileSearch"] || {};
  var exports = $PS["Agrippa.Plugins.FileSystem.LinuxFileSearch"];
  var Agrippa_Plugins_FileSystem_Commons = $PS["Agrippa.Plugins.FileSystem.Commons"];                
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/linux-file/suggest")("/agrippa/linux-file/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/linux-file/open");
  var linuxFileSearch = {
      name: "LinuxFileSearch",
      prompt: Agrippa_Plugins_FileSystem_Commons.prompt,
      promptAfterKeyTimeout: suggest,
      activate: open
  };
  exports["linuxFileSearch"] = linuxFileSearch;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.FileSystem.MacAppSearch"] = $PS["Agrippa.Plugins.FileSystem.MacAppSearch"] || {};
  var exports = $PS["Agrippa.Plugins.FileSystem.MacAppSearch"];
  var Agrippa_Plugins_FileSystem_Commons = $PS["Agrippa.Plugins.FileSystem.Commons"];                
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/mac-app/suggest")("/agrippa/mac-app/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/mac-app/open");
  var macAppSearch = {
      name: "MacAppSearch",
      prompt: Agrippa_Plugins_FileSystem_Commons.prompt,
      promptAfterKeyTimeout: suggest,
      activate: open
  };
  exports["macAppSearch"] = macAppSearch;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.FileSystem.MacFileSearch"] = $PS["Agrippa.Plugins.FileSystem.MacFileSearch"] || {};
  var exports = $PS["Agrippa.Plugins.FileSystem.MacFileSearch"];
  var Agrippa_Plugins_FileSystem_Commons = $PS["Agrippa.Plugins.FileSystem.Commons"];                
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/mac-file/suggest")("/agrippa/mac-file/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/mac-file/open");
  var macFileSearch = {
      name: "MacFileSearch",
      prompt: Agrippa_Plugins_FileSystem_Commons.prompt,
      promptAfterKeyTimeout: suggest,
      activate: open
  };
  exports["macFileSearch"] = macFileSearch;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.FileSystem.UnixExecutableSearch"] = $PS["Agrippa.Plugins.FileSystem.UnixExecutableSearch"] || {};
  var exports = $PS["Agrippa.Plugins.FileSystem.UnixExecutableSearch"];
  var Agrippa_Plugins_FileSystem_Commons = $PS["Agrippa.Plugins.FileSystem.Commons"];                
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/unix-executable/suggest")("/agrippa/unix-executable/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/unix-executable/open");
  var unixExecutableSearch = {
      name: "UnixExecutableSearch",
      prompt: Agrippa_Plugins_FileSystem_Commons.prompt,
      promptAfterKeyTimeout: suggest,
      activate: open
  };
  exports["unixExecutableSearch"] = unixExecutableSearch;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.FileSystem.WinExecutableSearch"] = $PS["Agrippa.Plugins.FileSystem.WinExecutableSearch"] || {};
  var exports = $PS["Agrippa.Plugins.FileSystem.WinExecutableSearch"];
  var Agrippa_Plugins_FileSystem_Commons = $PS["Agrippa.Plugins.FileSystem.Commons"];                
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/win-executable/suggest")("/agrippa/win-executable/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/win-executable/open");
  var winExecutableSearch = {
      name: "WinExecutableSearch",
      prompt: Agrippa_Plugins_FileSystem_Commons.prompt,
      promptAfterKeyTimeout: suggest,
      activate: open
  };
  exports["winExecutableSearch"] = winExecutableSearch;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.FileSystem.WinFileSearch"] = $PS["Agrippa.Plugins.FileSystem.WinFileSearch"] || {};
  var exports = $PS["Agrippa.Plugins.FileSystem.WinFileSearch"];
  var Agrippa_Plugins_FileSystem_Commons = $PS["Agrippa.Plugins.FileSystem.Commons"];                
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/win-file/suggest")("/agrippa/win-file/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/win-file/open");
  var winFileSearch = {
      name: "WinFileSearch",
      prompt: Agrippa_Plugins_FileSystem_Commons.prompt,
      promptAfterKeyTimeout: suggest,
      activate: open
  };
  exports["winFileSearch"] = winFileSearch;
})(PS);
(function(exports) {
  "use strict";

  exports.copyButtonListener = function (evt) {
      return function (button) {
          return function () {
              // button is a JQuery object
              button.prev().select()
              document.execCommand("copy");
          };
      };
  };
})(PS["Agrippa.Plugins.KeePass1"] = PS["Agrippa.Plugins.KeePass1"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.KeePass1"] = $PS["Agrippa.Plugins.KeePass1"] || {};
  var exports = $PS["Agrippa.Plugins.KeePass1"];
  var $foreign = $PS["Agrippa.Plugins.KeePass1"];
  var Affjax = $PS["Affjax"];
  var Affjax_RequestBody = $PS["Affjax.RequestBody"];
  var Affjax_ResponseFormat = $PS["Affjax.ResponseFormat"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad_Except = $PS["Control.Monad.Except"];
  var Data_Argonaut_Core = $PS["Data.Argonaut.Core"];
  var Data_Either = $PS["Data.Either"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Show = $PS["Data.Show"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Effect_Aff = $PS["Effect.Aff"];
  var Foreign = $PS["Foreign"];
  var Foreign_Object = $PS["Foreign.Object"];
  var JQuery = $PS["JQuery"];                
  var buildUnlockReq = function (masterPassword) {
      return Data_Argonaut_Core.fromObject(Foreign_Object.insert("password")(Data_Argonaut_Core.fromString(masterPassword))(Foreign_Object.empty));
  };
  var unlock = function (v) {
      return function (v1) {
          return function __do() {
              var v2 = JQuery.select("#agrippa-keepass1-master-password")();
              var v3 = JQuery.getValue(v2)();
              var v4 = Control_Monad_Except.runExcept(Foreign.readString(v3));
              if (v4 instanceof Data_Either.Left) {
                  return Agrippa_Utils.displayOutputText(Data_Show.show(Data_List_Types.showNonEmptyList(Foreign.showForeignError))(v4.value0))();
              };
              if (v4 instanceof Data_Either.Right) {
                  return Effect_Aff.runAff_(Data_Function["const"](Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit)))(Affjax.post(Affjax_ResponseFormat.json)("/agrippa/keepass1/unlock")(Affjax_RequestBody.Json.create(buildUnlockReq(v4.value0))))();
              };
              throw new Error("Failed pattern match at Agrippa.Plugins.KeePass1 (line 66, column 3 - line 70, column 104): " + [ v4.constructor.name ]);
          };
      };
  };
  var buildUnlockUI = function (containerDiv) {
      return function __do() {
          var v = Agrippa_Utils.createTextNode("Please input master password to unlock database:")();
          JQuery.append(v)(containerDiv)();
          var v1 = JQuery.create("<input>")();
          JQuery.setProp("type")("password")(v1)();
          JQuery.setProp("id")("agrippa-keepass1-master-password")(v1)();
          JQuery.append(v1)(containerDiv)();
          var v2 = JQuery.create("<button>")();
          JQuery.setText("Unlock")(v2)();
          JQuery.on("click")(unlock)(v2)();
          return JQuery.append(v2)(containerDiv)();
      };
  };
  var buildSuggestReq = function (term) {
      return Data_Argonaut_Core.fromObject(Foreign_Object.insert("term")(Data_Argonaut_Core.fromString(term))(Foreign_Object.empty));
  };
  var buildEntryUI = function (entry) {
      var appendTextField = function (fieldName) {
          return function (entryDiv) {
              return function __do() {
                  var v = JQuery.create("<span>")();
                  JQuery.setText(fieldName)(v)();
                  JQuery.append(v)(entryDiv)();
                  var v1 = JQuery.create("<input>")();
                  JQuery.setProp("readonly")(true)(v1)();
                  JQuery.append(v1)(entryDiv)();
                  var v2 = JQuery.create("<button>")();
                  JQuery.setText("Copy")(v2)();
                  JQuery.on("click")($foreign.copyButtonListener)(v2)();
                  JQuery.append(v2)(entryDiv)();
                  (function () {
                      var v3 = Control_Bind.bind(Data_Maybe.bindMaybe)(Foreign_Object.lookup(fieldName)(entry))(Data_Argonaut_Core.toString);
                      if (v3 instanceof Data_Maybe.Just) {
                          return JQuery.setValue(v3.value0)(v1)();
                      };
                      if (v3 instanceof Data_Maybe.Nothing) {
                          return Data_Unit.unit;
                      };
                      throw new Error("Failed pattern match at Agrippa.Plugins.KeePass1 (line 118, column 7 - line 120, column 37): " + [ v3.constructor.name ]);
                  })();
                  return v1;
              };
          };
      };
      var appendPre = function (fieldName) {
          return function (entryDiv) {
              var v = Control_Bind.bind(Data_Maybe.bindMaybe)(Foreign_Object.lookup(fieldName)(entry))(Data_Argonaut_Core.toString);
              if (v instanceof Data_Maybe.Just) {
                  return function __do() {
                      var v1 = JQuery.create("<pre>")();
                      JQuery.setText(v.value0)(v1)();
                      return JQuery.append(v1)(entryDiv)();
                  };
              };
              if (v instanceof Data_Maybe.Nothing) {
                  return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
              };
              throw new Error("Failed pattern match at Agrippa.Plugins.KeePass1 (line 125, column 7 - line 130, column 37): " + [ v.constructor.name ]);
          };
      };
      var appendLink = function (fieldName) {
          return function (entryDiv) {
              var v = Control_Bind.bind(Data_Maybe.bindMaybe)(Foreign_Object.lookup(fieldName)(entry))(Data_Argonaut_Core.toString);
              if (v instanceof Data_Maybe.Just) {
                  return function __do() {
                      var v1 = JQuery.create("<a>")();
                      JQuery.setText(v.value0)(v1)();
                      JQuery.setProp("href")(v.value0)(v1)();
                      var v2 = JQuery.create("<div>")();
                      JQuery.append(v1)(v2)();
                      return JQuery.append(v2)(entryDiv)();
                  };
              };
              if (v instanceof Data_Maybe.Nothing) {
                  return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
              };
              throw new Error("Failed pattern match at Agrippa.Plugins.KeePass1 (line 94, column 7 - line 102, column 37): " + [ v.constructor.name ]);
          };
      };
      var appendDiv = function (fieldName) {
          return function (entryDiv) {
              var v = Control_Bind.bind(Data_Maybe.bindMaybe)(Foreign_Object.lookup(fieldName)(entry))(Data_Argonaut_Core.toString);
              if (v instanceof Data_Maybe.Just) {
                  return Control_Bind.bind(Effect.bindEffect)(Agrippa_Utils.createTextNode(v.value0))(Data_Function.flip(JQuery.append)(entryDiv));
              };
              if (v instanceof Data_Maybe.Nothing) {
                  return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
              };
              throw new Error("Failed pattern match at Agrippa.Plugins.KeePass1 (line 89, column 7 - line 91, column 37): " + [ v.constructor.name ]);
          };
      };
      return function __do() {
          var v = JQuery.create("<div>")();
          appendDiv("Title")(v)();
          appendLink("URL")(v)();
          var v1 = appendTextField("UserName")(v)();
          var v2 = appendTextField("Password")(v)();
          JQuery.setClass("agrippa-keepass1-password")(true)(v2)();
          appendPre("Comment")(v)();
          var v3 = JQuery.create("<hr>")();
          JQuery.append(v3)(v)();
          return v;
      };
  };
  var buildOutput = function (contents) {
      return function __do() {
          var v = JQuery.create("<div>")();
          (function () {
              var v1 = Control_Bind.composeKleisliFlipped(Data_Maybe.bindMaybe)(Data_Traversable.traverse(Data_Traversable.traversableArray)(Data_Maybe.applicativeMaybe)(Data_Argonaut_Core.toObject))(Data_Argonaut_Core.toArray)(contents);
              if (v1 instanceof Data_Maybe.Just) {
                  return Control_Bind.bind(Effect.bindEffect)(Data_Traversable.traverse(Data_Traversable.traversableArray)(Effect.applicativeEffect)(buildEntryUI)(v1.value0))(Data_Foldable.traverse_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(Data_Function.flip(JQuery.append)(v)))();
              };
              if (v1 instanceof Data_Maybe.Nothing) {
                  return buildUnlockUI(v)();
              };
              throw new Error("Failed pattern match at Agrippa.Plugins.KeePass1 (line 42, column 3 - line 44, column 47): " + [ v1.constructor.name ]);
          })();
          return v;
      };
  };
  var suggest = function (v) {
      return function (v1) {
          return function (input) {
              return function (displayOutput) {
                  var affHandler = function (v2) {
                      if (v2 instanceof Data_Either.Right && (v2.value0.status === 200 && v2.value0.body instanceof Data_Either.Right)) {
                          return Control_Bind.bind(Effect.bindEffect)(buildOutput(v2.value0.body.value0))(displayOutput);
                      };
                      return Agrippa_Utils.displayOutputText("Failed to retrieve data from server.");
                  };
                  return Effect_Aff.runAff_(affHandler)(Affjax.post(Affjax_ResponseFormat.json)("/agrippa/keepass1/suggest")(Affjax_RequestBody.Json.create(buildSuggestReq(Data_String_Common.trim(input)))));
              };
          };
      };
  };
  var keePass1 = {
      name: "KeePass1",
      prompt: function (v) {
          return function (v1) {
              return function (v2) {
                  return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Searching..."));
              };
          };
      },
      promptAfterKeyTimeout: suggest,
      activate: function (v) {
          return function (v1) {
              return function (v2) {
                  return Control_Applicative.pure(Effect.applicativeEffect)(Data_Maybe.Nothing.value);
              };
          };
      }
  };
  exports["keePass1"] = keePass1;
})(PS);
(function(exports) {
  function wrap(method) {
    return function(d) {
      return function(num) {
        return method.apply(num, [d]);
      };
    };
  }

  exports.toPrecisionNative   = wrap(Number.prototype.toPrecision);
  exports.toFixedNative       = wrap(Number.prototype.toFixed);
  exports.toExponentialNative = wrap(Number.prototype.toExponential);
})(PS["Data.Number.Format"] = PS["Data.Number.Format"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Number.Format"] = $PS["Data.Number.Format"] || {};
  var exports = $PS["Data.Number.Format"];
  var $foreign = $PS["Data.Number.Format"];
  var Data_Ord = $PS["Data.Ord"];                
  var Precision = (function () {
      function Precision(value0) {
          this.value0 = value0;
      };
      Precision.create = function (value0) {
          return new Precision(value0);
      };
      return Precision;
  })();
  var Fixed = (function () {
      function Fixed(value0) {
          this.value0 = value0;
      };
      Fixed.create = function (value0) {
          return new Fixed(value0);
      };
      return Fixed;
  })();
  var Exponential = (function () {
      function Exponential(value0) {
          this.value0 = value0;
      };
      Exponential.create = function (value0) {
          return new Exponential(value0);
      };
      return Exponential;
  })();
  var toStringWith = function (v) {
      if (v instanceof Precision) {
          return $foreign.toPrecisionNative(v.value0);
      };
      if (v instanceof Fixed) {
          return $foreign.toFixedNative(v.value0);
      };
      if (v instanceof Exponential) {
          return $foreign.toExponentialNative(v.value0);
      };
      throw new Error("Failed pattern match at Data.Number.Format (line 59, column 1 - line 59, column 40): " + [ v.constructor.name ]);
  };
  var fixed = function ($6) {
      return Fixed.create(Data_Ord.clamp(Data_Ord.ordInt)(0)(20)($6));
  };
  exports["fixed"] = fixed;
  exports["toStringWith"] = toStringWith;
})(PS);
(function(exports) {
  "use strict";

  function _codePointAt (just) {
    return function (nothing) {
      return function (i) {
        return function (s) {
          var codePointArray = Array.from(s);
          var isWithinRange  = i >= 0 && i < codePointArray.length;

          return isWithinRange ? just(codePointArray[i].codePointAt(0)) : nothing;
        };
      };
    };
  }

  function _codePointAtP (just) {
    return function (nothing) {
      return function (i) {
        return function (s) {
          return i >= 0 && i < s.length ? just(s.codePointAt(i)) : nothing;
        };
      };
    };
  }

  function endsWith (searchString) {
    return function (s) {
      return s.endsWith(searchString);
    };
  }

  function endsWithP (searchString) {
    return function (position) {
      return function (s) {
        return s.endsWith(searchString, position);
      };
    };
  }

  function escapeRegex (str) {
    return str.replace(/[.*+?^${}()|[\]\-\\]/g, "\\$&");
  }

  function fromCharArray (array) {
    return array.join("");
  }

  function includes (searchString) {
    return function (str) {
      return str.includes(searchString);
    };
  }

  function includesP (needle) {
    return function (position) {
      return function (haystack) {
        // For negative `position` values, we search from the beginning of the
        // string. This is in accordance with the native
        // `String.prototype.include` function.
        var pos = Math.max(0, position);

        // Converting to arrays takes care of any surrogate code points
        var needleA    = Array.from(needle);
        var haystackA  = Array.from(haystack).slice(pos);
        var needleALen = needleA.length;

        var maxIndex = haystackA.length + 1 - needleALen;
        var found    = false;
        var i;

        // Naive implementation, at some point we should check whether Boyer-Moore
        // or Knuth-Morris-Pratt are worthwhile
        for (i = 0; i < maxIndex; i++) {
          if (needleA.every(function (e, j) { return e === haystackA[i+j]; })) {
            found = true;
            break;
          }
        }

        return found;
      };
    };
  }

  function length (str) {
    return Array.from(str).length;
  }

  function lines (str) {
    // See http://www.unicode.org/reports/tr18/#RL1.6
    return str.split(/\r\n|[\n\v\f\r\u0085\u2028\u2029]/);
  }

  function normalize (str) {
    return str.normalize();
  }

  function _normalizeP (normalizationForm) {
    return function (str) {
      return str.normalize(normalizationForm);
    };
  }

  function _repeat (just) {
    return function (nothing) {
      return function (n) {
        return function (str) {
          var result;

          try {
            result = just(str.repeat(n));
          }
          catch (error) {
            result = nothing;
          }

          return result;
        };
      };
    };
  }

  function startsWith (searchString) {
    return function (s) {
      return s.startsWith(searchString);
    };
  }

  function startsWithP (searchString) {
    return function (position) {
      return function (s) {
        return s.startsWith(searchString, position);
      };
    };
  }

  function stripChars (chars) {
    return function (s) {
      return s.replace(RegExp("[" + escapeRegex(chars) + "]", "g"), "");
    };
  }

  function stripDiacritics (str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function toCharArray (str) {
    return Array.from(str);
  }

  function unsafeCodePointAt (i) {
    return function (s) {
      var codePointArray = Array.from(s);
      var isWithinRange = i >= 0 && i < codePointArray.length;

      if (isWithinRange) {
        return codePointArray[i].codePointAt(0);
      }
      else {
        throw new Error("Data.String.Utils.unsafeCodePointAt: Invalid index");
      }
    };
  }

  function unsafeCodePointAtP (i) {
    return function (s) {
      if (i >= 0 && i < s.length) {
        return s.codePointAt(i);
      }
      else {
        throw new Error("Data.String.Utils.unsafeCodePointAt': Invalid index");
      }
    };
  }

  function unsafeRepeat (n) {
    return function (str) {
      try {
        return str.repeat(n);
      }
      catch (error) {
        throw new Error("Data.String.Utils.unsafeRepeat: Invalid count");
      }
    };
  }

  function words (s) {
    return s.split(/\s+/);
  }                                          
  exports.includes           = includes;
  exports.startsWith         = startsWith;  
  exports.words              = words;
})(PS["Data.String.Utils"] = PS["Data.String.Utils"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.String.Utils"] = $PS["Data.String.Utils"] || {};
  var exports = $PS["Data.String.Utils"];
  var $foreign = $PS["Data.String.Utils"];
  exports["includes"] = $foreign.includes;
  exports["startsWith"] = $foreign.startsWith;
  exports["words"] = $foreign.words;
})(PS);
(function(exports) {
  "use strict";

  exports.ceil = Math.ceil;

  exports.pow = function (n) {
    return function (p) {
      return Math.pow(n, p);
    };
  };
})(PS["Math"] = PS["Math"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Math"] = $PS["Math"] || {};
  var exports = $PS["Math"];
  var $foreign = $PS["Math"];
  exports["ceil"] = $foreign.ceil;
  exports["pow"] = $foreign.pow;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.MortgageCalc"] = $PS["Agrippa.Plugins.MortgageCalc"] || {};
  var exports = $PS["Agrippa.Plugins.MortgageCalc"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Data_Array = $PS["Data.Array"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Number = $PS["Data.Number"];
  var Data_Number_Format = $PS["Data.Number.Format"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_String_Utils = $PS["Data.String.Utils"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var JQuery = $PS["JQuery"];
  var $$Math = $PS["Math"];                
  var truncate2 = function (n) {
      return Data_Number_Format.toStringWith(Data_Number_Format.fixed(2))(n);
  };
  var truncate0 = function (n) {
      return Data_Number_Format.toStringWith(Data_Number_Format.fixed(0))(n);
  };
  var showUsage = function (v) {
      return function (v1) {
          return function (v2) {
              return function __do() {
                  var v3 = Agrippa_Utils.createTextNode("<Loan Amount> <Interest Rate (%)> <Mortgage Period (years)>")();
                  var v4 = Agrippa_Utils.createTextNode("E.g.: 300000 4 30<Enter>")();
                  var v5 = JQuery.create("<div>")();
                  JQuery.append(v3)(v5)();
                  JQuery.append(v4)(v5)();
                  return new Data_Maybe.Just(v5);
              };
          };
      };
  };
  var parseInput = function (loanAmountStr) {
      return function (interestRateStr) {
          return function (periodInYearStr) {
              return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Number.fromString(loanAmountStr))(function (v) {
                  return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Number.fromString(interestRateStr))(function (v1) {
                      return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Number.fromString(periodInYearStr))(function (v2) {
                          return new Data_Maybe.Just({
                              loanAmount: v,
                              interestRate: v1,
                              periodInYear: v2
                          });
                      });
                  });
              });
          };
      };
  };
  var calculateAmortization = function (monthlyPayment) {
      return function (loanAmount) {
          return function (interestRate) {
              return function (periodInYear) {
                  var initialState = {
                      installmentNumber: 0.0,
                      principal: 0.0,
                      interest: 0.0,
                      balance: loanAmount
                  };
                  var calculateAmortization$prime = function ($copy_installmentNumber) {
                      return function ($copy_balance) {
                          return function ($copy_accum) {
                              var $tco_var_installmentNumber = $copy_installmentNumber;
                              var $tco_var_balance = $copy_balance;
                              var $tco_done = false;
                              var $tco_result;
                              function $tco_loop(installmentNumber, balance, accum) {
                                  var $41 = installmentNumber >= periodInYear * 12.0;
                                  if ($41) {
                                      $tco_done = true;
                                      return Data_Array.reverse(accum);
                                  };
                                  var newBalance = balance * (1.0 + interestRate / 12.0) - monthlyPayment;
                                  var interest = balance * (interestRate / 12.0);
                                  var principal = monthlyPayment - interest;
                                  $tco_var_installmentNumber = installmentNumber + 1.0;
                                  $tco_var_balance = newBalance;
                                  $copy_accum = Data_Array.cons({
                                      installmentNumber: installmentNumber + 1.0,
                                      principal: principal,
                                      interest: interest,
                                      balance: newBalance
                                  })(accum);
                                  return;
                              };
                              while (!$tco_done) {
                                  $tco_result = $tco_loop($tco_var_installmentNumber, $tco_var_balance, $copy_accum);
                              };
                              return $tco_result;
                          };
                      };
                  };
                  return calculateAmortization$prime(0.0)(loanAmount)([ initialState ]);
              };
          };
      };
  };
  var calcMonthlyPayment = function (loanAmount) {
      return function (interestRate) {
          return function (periodInYear) {
              var r = 1.0 / (1.0 + interestRate / 12.0);
              return ((r - 1.0) / ($$Math.pow(r)(12.0 * periodInYear + 1.0) - r)) * loanAmount;
          };
      };
  };
  var buildTableRow = function (v) {
      return function __do() {
          var v1 = JQuery.create("<td>")();
          JQuery.setText(truncate0(v.installmentNumber))(v1)();
          var v2 = JQuery.create("<td>")();
          JQuery.setText(truncate2(v.principal))(v2)();
          var v3 = JQuery.create("<td>")();
          JQuery.setText(truncate2(v.interest))(v3)();
          var v4 = JQuery.create("<td>")();
          JQuery.setText(truncate2(v.balance))(v4)();
          var v5 = JQuery.create("<tr>")();
          JQuery.append(v1)(v5)();
          JQuery.append(v2)(v5)();
          JQuery.append(v3)(v5)();
          JQuery.append(v4)(v5)();
          JQuery.addClass("agrippa-mortgage-calc-tr")(v5)();
          return v5;
      };
  };
  var buildTableHeader = function __do() {
      var v = JQuery.create("<th>")();
      JQuery.setText("Installment #")(v)();
      var v1 = JQuery.create("<th>")();
      JQuery.setText("Principal")(v1)();
      var v2 = JQuery.create("<th>")();
      JQuery.setText("Interest")(v2)();
      var v3 = JQuery.create("<th>")();
      JQuery.setText("Balance")(v3)();
      var v4 = JQuery.create("<tr>")();
      JQuery.append(v)(v4)();
      JQuery.append(v1)(v4)();
      JQuery.append(v2)(v4)();
      JQuery.append(v3)(v4)();
      return v4;
  };
  var buildTable = function (installments) {
      return function __do() {
          var v = JQuery.create("<table>")();
          var v1 = buildTableHeader();
          var v2 = Data_Traversable.traverse(Data_Traversable.traversableArray)(Effect.applicativeEffect)(buildTableRow)(installments)();
          JQuery.append(v1)(v)();
          Data_Foldable.traverse_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(Data_Function.flip(JQuery.append)(v))(v2)();
          return v;
      };
  };
  var calculateMortgage = function (v) {
      return function (v1) {
          return function (input) {
              var v2 = Data_String_Utils.words(Data_String_Common.trim(input));
              if (v2.length === 3) {
                  var v3 = parseInput(v2[0])(v2[1])(v2[2]);
                  if (v3 instanceof Data_Maybe.Just) {
                      var interestRatePercent = v3.value0.interestRate / 100.0;
                      var monthlyPayment = calcMonthlyPayment(v3.value0.loanAmount)(interestRatePercent)(v3.value0.periodInYear);
                      var amortization = calculateAmortization(monthlyPayment)(v3.value0.loanAmount)(interestRatePercent)(v3.value0.periodInYear);
                      return function __do() {
                          var v4 = JQuery.create("<div>")();
                          var v5 = JQuery.create("<div>")();
                          JQuery.setText("Monthly payment is: " + (truncate2(monthlyPayment) + "."))(v5)();
                          var v6 = JQuery.create("<div>")();
                          JQuery.setText("Amortizaton:")(v6)();
                          var v7 = buildTable(amortization)();
                          JQuery.append(v5)(v4)();
                          JQuery.append(v6)(v4)();
                          JQuery.append(v7)(v4)();
                          return new Data_Maybe.Just(v4);
                      };
                  };
                  if (v3 instanceof Data_Maybe.Nothing) {
                      return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Failed to parse input parameter(s)."));
                  };
                  throw new Error("Failed pattern match at Agrippa.Plugins.MortgageCalc (line 44, column 7 - line 61, column 5): " + [ v3.constructor.name ]);
              };
              return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Failed to parse input parameter(s)."));
          };
      };
  };
  var mortgageCalc = {
      name: "Mortgage Calculator",
      prompt: showUsage,
      promptAfterKeyTimeout: function (v) {
          return function (v1) {
              return function (v2) {
                  return function (v3) {
                      return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
                  };
              };
          };
      },
      activate: calculateMortgage
  };
  exports["mortgageCalc"] = mortgageCalc;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.String.Pattern"] = $PS["Data.String.Pattern"] || {};
  var exports = $PS["Data.String.Pattern"];        
  var Replacement = function (x) {
      return x;
  };
  exports["Replacement"] = Replacement;
})(PS);
(function(exports) {
  /* global window */
  "use strict";

  exports.window = function () {
    return window;
  };
})(PS["Web.HTML"] = PS["Web.HTML"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Web.HTML"] = $PS["Web.HTML"] || {};
  var exports = $PS["Web.HTML"];
  var $foreign = $PS["Web.HTML"];
  exports["window"] = $foreign.window;
})(PS);
(function(exports) {
  "use strict";

  exports._open = function (url) {
    return function (name) {
      return function (features) {
        return function (window) {
          return function () {
            return window.open(url, name, features);
          };
        };
      };
    };
  };
})(PS["Web.HTML.Window"] = PS["Web.HTML.Window"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Web.HTML.Window"] = $PS["Web.HTML.Window"] || {};
  var exports = $PS["Web.HTML.Window"];
  var $foreign = $PS["Web.HTML.Window"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Nullable = $PS["Data.Nullable"];
  var Effect = $PS["Effect"];
  var open = function (url$prime) {
      return function (name) {
          return function (features) {
              return function (window) {
                  return Data_Functor.map(Effect.functorEffect)(Data_Nullable.toMaybe)($foreign["_open"](url$prime)(name)(features)(window));
              };
          };
      };
  };
  exports["open"] = open;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.OnlineSearch"] = $PS["Agrippa.Plugins.OnlineSearch"] || {};
  var exports = $PS["Agrippa.Plugins.OnlineSearch"];
  var Agrippa_Config = $PS["Agrippa.Config"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Data_Either = $PS["Data.Either"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_String_Pattern = $PS["Data.String.Pattern"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Global_Unsafe = $PS["Global.Unsafe"];
  var Web_HTML = $PS["Web.HTML"];
  var Web_HTML_Window = $PS["Web.HTML.Window"];                
  var openUrl = function (url) {
      return function __do() {
          var v = Web_HTML.window();
          var v1 = Web_HTML_Window.open(url)("_self")("")(v)();
          if (v1 instanceof Data_Maybe.Nothing) {
              return "I can't get a window object.  Something went really wrong...";
          };
          if (v1 instanceof Data_Maybe.Just) {
              return "Opening...";
          };
          throw new Error("Failed pattern match at Agrippa.Plugins.OnlineSearch (line 40, column 8 - line 44, column 1): " + [ v1.constructor.name ]);
      };
  };
  var buildUrlWithInput = function (url) {
      return function (input) {
          return Data_String_Common.replace("${q}")(Data_String_Pattern.Replacement(Global_Unsafe.unsafeEncodeURIComponent(Data_String_Common.trim(input))))(url);
      };
  };
  var prompt = function (v) {
      return function (config) {
          return function (input) {
              return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode((function () {
                  var v1 = Agrippa_Config.getStringVal("url")(config);
                  if (v1 instanceof Data_Either.Left) {
                      return v1.value0;
                  };
                  if (v1 instanceof Data_Either.Right) {
                      return "Keep typing the query.  Press <Enter> to visit " + (buildUrlWithInput(v1.value0)(input) + ".");
                  };
                  throw new Error("Failed pattern match at Agrippa.Plugins.OnlineSearch (line 26, column 3 - line 28, column 109): " + [ v1.constructor.name ]);
              })()));
          };
      };
  };
  var search = function (v) {
      return function (config) {
          return function (input) {
              return Control_Bind.bindFlipped(Effect.bindEffect)(function ($20) {
                  return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode($20));
              })((function () {
                  var v1 = Agrippa_Config.getStringVal("url")(config);
                  if (v1 instanceof Data_Either.Left) {
                      return Control_Applicative.pure(Effect.applicativeEffect)(v1.value0);
                  };
                  if (v1 instanceof Data_Either.Right) {
                      return openUrl(buildUrlWithInput(v1.value0)(input));
                  };
                  throw new Error("Failed pattern match at Agrippa.Plugins.OnlineSearch (line 32, column 3 - line 34, column 55): " + [ v1.constructor.name ]);
              })());
          };
      };
  };
  var onlineSearch = {
      name: "OnlineSearch",
      prompt: prompt,
      promptAfterKeyTimeout: function (v) {
          return function (v1) {
              return function (v2) {
                  return function (v3) {
                      return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
                  };
              };
          };
      },
      activate: search
  };
  exports["onlineSearch"] = onlineSearch;
})(PS);
(function(exports) {
  "use strict";

  exports.shortcutListener = function (evt) {
      return function (body) {
          return function () {
              var baseKeyCode = 48;   // key code for 0
              var n = evt.which - baseKeyCode + 1;
              if (n >= 2 && n <= 10) {
                  var button = $("#agrippa-output > table > tr:nth-child(" + n + ") > td > button")[0];
                  if (button) {
                      button.click();
                  }
              }
          };
      };
  };

  exports.copyButtonListener = function (evt) {
      return function (button) {
          return function () {
              // button is a JQuery object
              // parent() returns DOM elements, hence td is a DOM element
              var td = button.parent()[0];
              var inputField = td.previousElementSibling.children[0];
              inputField.select();
              document.execCommand("copy");
          };
      };
  };

  exports.clickFirstCopyButton = function () {
      var button = $("#agrippa-output > table > tr:first > td > button")[0];
      if (button) {
          button.click();
      }
  }
})(PS["Agrippa.Plugins.Snippets"] = PS["Agrippa.Plugins.Snippets"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.Snippets"] = $PS["Agrippa.Plugins.Snippets"] || {};
  var exports = $PS["Agrippa.Plugins.Snippets"];
  var $foreign = $PS["Agrippa.Plugins.Snippets"];
  var Agrippa_Config = $PS["Agrippa.Config"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Apply = $PS["Control.Apply"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Category = $PS["Control.Category"];
  var Data_Argonaut_Core = $PS["Data.Argonaut.Core"];
  var Data_Either = $PS["Data.Either"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Function = $PS["Data.Function"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_String_Utils = $PS["Data.String.Utils"];
  var Data_Traversable = $PS["Data.Traversable"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Foreign_Object = $PS["Foreign.Object"];
  var JQuery = $PS["JQuery"];                
  var copy = function (v) {
      return function (v1) {
          return function (v2) {
              return Data_Functor.voidLeft(Effect.functorEffect)(Control_Apply.applySecond(Effect.applyEffect)(Control_Bind.bind(Effect.bindEffect)(JQuery.body)(JQuery.on("keyup")($foreign.shortcutListener)))($foreign.clickFirstCopyButton))(Data_Maybe.Nothing.value);
          };
      };
  };
  var buildTableRow = function (key) {
      return function (value) {
          var val = Data_Maybe.maybe("Error: snippets must be strings.")(Control_Category.identity(Control_Category.categoryFn))(Data_Argonaut_Core.toString(value));
          return function __do() {
              var v = JQuery.create("<td>")();
              JQuery.setText(key)(v)();
              var v1 = JQuery.create("<input>")();
              JQuery.setValue(val)(v1)();
              JQuery.addClass("agrippa-snippet")(v1)();
              JQuery.setProp("readonly")(true)(v1)();
              var v2 = JQuery.create("<td>")();
              JQuery.append(v1)(v2)();
              var v3 = JQuery.create("<button>")();
              JQuery.setText("Copy")(v3)();
              JQuery.on("click")($foreign.copyButtonListener)(v3)();
              var v4 = JQuery.create("<td>")();
              JQuery.append(v3)(v4)();
              var v5 = JQuery.create("<tr>")();
              JQuery.append(v)(v5)();
              JQuery.append(v2)(v5)();
              JQuery.append(v4)(v5)();
              return v5;
          };
      };
  };
  var buildTable = function (candidates) {
      return function __do() {
          Control_Bind.bind(Effect.bindEffect)(JQuery.body)(JQuery.on("keyup")($foreign.shortcutListener))();
          var v = Data_Traversable.sequence(Data_Traversable.traversableArray)(Effect.applicativeEffect)(Foreign_Object.toArrayWithKey(buildTableRow)(candidates))();
          var v1 = JQuery.create("<table>")();
          Data_Foldable.traverse_(Effect.applicativeEffect)(Data_Foldable.foldableArray)(Data_Function.flip(JQuery.append)(v1))(v)();
          Agrippa_Utils.addShortcutLabels("<td>")(v)();
          return v1;
      };
  };
  var suggest = function (v) {
      return function (config) {
          return function (input) {
              return Data_Functor.map(Effect.functorEffect)(Data_Maybe.Just.create)((function () {
                  var v1 = Agrippa_Config.getObjectVal("snippets")(config);
                  if (v1 instanceof Data_Either.Left) {
                      return Agrippa_Utils.createTextNode(v1.value0);
                  };
                  if (v1 instanceof Data_Either.Right) {
                      var candidates = Foreign_Object.filterKeys(function ($28) {
                          return Data_String_Utils.includes(Data_String_Common.toLower(Data_String_Common.trim(input)))(Data_String_Common.toLower($28));
                      })(v1.value0);
                      return buildTable(candidates);
                  };
                  throw new Error("Failed pattern match at Agrippa.Plugins.Snippets (line 27, column 3 - line 32, column 31): " + [ v1.constructor.name ]);
              })());
          };
      };
  };
  var snippets = {
      name: "Snippets",
      prompt: suggest,
      promptAfterKeyTimeout: function (v) {
          return function (v1) {
              return function (v2) {
                  return function (v3) {
                      return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
                  };
              };
          };
      },
      activate: copy
  };
  exports["snippets"] = snippets;
})(PS);
(function(exports) {
  "use strict";

  exports.triggerInputFieldKeyUp = function () {
      $("#agrippa-input").keyup();
  };
})(PS["Agrippa.Plugins.TaskSearch"] = PS["Agrippa.Plugins.TaskSearch"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.TaskSearch"] = $PS["Agrippa.Plugins.TaskSearch"] || {};
  var exports = $PS["Agrippa.Plugins.TaskSearch"];
  var $foreign = $PS["Agrippa.Plugins.TaskSearch"];
  var Affjax = $PS["Affjax"];
  var Affjax_ResponseFormat = $PS["Affjax.ResponseFormat"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Data_Array = $PS["Data.Array"];
  var Data_Either = $PS["Data.Either"];
  var Data_Function = $PS["Data.Function"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_String_Common = $PS["Data.String.Common"];
  var Data_String_Utils = $PS["Data.String.Utils"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Effect_Aff = $PS["Effect.Aff"];
  var JQuery = $PS["JQuery"];                
  var showTaskTable = function (v) {
      return function (v1) {
          return function (input) {
              var affHandler = function (v2) {
                  return function (v3) {
                      if (v3 instanceof Data_Either.Right && (v3.value0.status === 200 && v3.value0.body instanceof Data_Either.Right)) {
                          return Agrippa_Utils.createTaskTableRows(v3.value0.body.value0)(v2)(Data_Function["const"](true))(function (taskName) {
                              return Data_String_Utils.includes(Data_String_Common.toLower(Data_String_Common.trim(input)))(Data_String_Common.toLower(taskName));
                          })(Agrippa_Utils.createTuple3Plain)(Agrippa_Utils.createTuple3Highlighted(input));
                      };
                      return Agrippa_Utils.displayOutputText("Failed to retrieve config from server.");
                  };
              };
              return function __do() {
                  var v2 = JQuery.create("<table>")();
                  Agrippa_Utils.createTaskTableRow("<th>")("Keyword")("Task")(Agrippa_Utils.createTuple3Plain)(Agrippa_Utils.createTuple3Plain)(v2)();
                  Effect_Aff.runAff_(affHandler(v2))(Affjax.get(Affjax_ResponseFormat.json)("/agrippa/config/"))();
                  var v3 = Agrippa_Utils.createTextNode("Press <Enter> to select first task.")();
                  var v4 = JQuery.create("<div>")();
                  JQuery.append(v3)(v4)();
                  JQuery.append(v2)(v4)();
                  return new Data_Maybe.Just(v4);
              };
          };
      };
  };
  var chooseFirstTask = function (taskName) {
      return function (config) {
          return function (v) {
              return function __do() {
                  var v1 = JQuery.select("#agrippa-output > div > table > tr > td:first")();
                  var v2 = JQuery.toArray(v1)();
                  var $27 = Data_Array.length(v2) === 1;
                  if ($27) {
                      var v3 = JQuery.getText(v1)();
                      var v4 = JQuery.select("#agrippa-input")();
                      JQuery.setValue(v3 + " ")(v4)();
                      $foreign.triggerInputFieldKeyUp();
                      return Data_Maybe.Nothing.value;
                  };
                  return Data_Maybe.Nothing.value;
              };
          };
      };
  };
  var taskSearch = {
      name: "TaskSearch",
      prompt: showTaskTable,
      promptAfterKeyTimeout: function (v) {
          return function (v1) {
              return function (v2) {
                  return function (v3) {
                      return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
                  };
              };
          };
      },
      activate: chooseFirstTask
  };
  exports["taskSearch"] = taskSearch;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Map.Internal"] = $PS["Data.Map.Internal"] || {};
  var exports = $PS["Data.Map.Internal"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Ord = $PS["Data.Ord"];
  var Data_Ordering = $PS["Data.Ordering"];                    
  var Leaf = (function () {
      function Leaf() {

      };
      Leaf.value = new Leaf();
      return Leaf;
  })();
  var Two = (function () {
      function Two(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      Two.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new Two(value0, value1, value2, value3);
                  };
              };
          };
      };
      return Two;
  })();
  var Three = (function () {
      function Three(value0, value1, value2, value3, value4, value5, value6) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
          this.value6 = value6;
      };
      Three.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return function (value6) {
                                  return new Three(value0, value1, value2, value3, value4, value5, value6);
                              };
                          };
                      };
                  };
              };
          };
      };
      return Three;
  })();
  var TwoLeft = (function () {
      function TwoLeft(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      TwoLeft.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new TwoLeft(value0, value1, value2);
              };
          };
      };
      return TwoLeft;
  })();
  var TwoRight = (function () {
      function TwoRight(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      TwoRight.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new TwoRight(value0, value1, value2);
              };
          };
      };
      return TwoRight;
  })();
  var ThreeLeft = (function () {
      function ThreeLeft(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeLeft.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeLeft(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeLeft;
  })();
  var ThreeMiddle = (function () {
      function ThreeMiddle(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeMiddle.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeMiddle(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeMiddle;
  })();
  var ThreeRight = (function () {
      function ThreeRight(value0, value1, value2, value3, value4, value5) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
          this.value5 = value5;
      };
      ThreeRight.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return function (value4) {
                          return function (value5) {
                              return new ThreeRight(value0, value1, value2, value3, value4, value5);
                          };
                      };
                  };
              };
          };
      };
      return ThreeRight;
  })();
  var KickUp = (function () {
      function KickUp(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      KickUp.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new KickUp(value0, value1, value2, value3);
                  };
              };
          };
      };
      return KickUp;
  })();
  var lookup = function (dictOrd) {
      return function (k) {
          var comp = Data_Ord.compare(dictOrd);
          var go = function ($copy_v) {
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v) {
                  if (v instanceof Leaf) {
                      $tco_done = true;
                      return Data_Maybe.Nothing.value;
                  };
                  if (v instanceof Two) {
                      var v2 = comp(k)(v.value1);
                      if (v2 instanceof Data_Ordering.EQ) {
                          $tco_done = true;
                          return new Data_Maybe.Just(v.value2);
                      };
                      if (v2 instanceof Data_Ordering.LT) {
                          $copy_v = v.value0;
                          return;
                      };
                      $copy_v = v.value3;
                      return;
                  };
                  if (v instanceof Three) {
                      var v3 = comp(k)(v.value1);
                      if (v3 instanceof Data_Ordering.EQ) {
                          $tco_done = true;
                          return new Data_Maybe.Just(v.value2);
                      };
                      var v4 = comp(k)(v.value4);
                      if (v4 instanceof Data_Ordering.EQ) {
                          $tco_done = true;
                          return new Data_Maybe.Just(v.value5);
                      };
                      if (v3 instanceof Data_Ordering.LT) {
                          $copy_v = v.value0;
                          return;
                      };
                      if (v4 instanceof Data_Ordering.GT) {
                          $copy_v = v.value6;
                          return;
                      };
                      $copy_v = v.value3;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.Map.Internal (line 200, column 5 - line 200, column 22): " + [ v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($copy_v);
              };
              return $tco_result;
          };
          return go;
      };
  }; 
  var fromZipper = function ($copy_dictOrd) {
      return function ($copy_v) {
          return function ($copy_tree) {
              var $tco_var_dictOrd = $copy_dictOrd;
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(dictOrd, v, tree) {
                  if (v instanceof Data_List_Types.Nil) {
                      $tco_done = true;
                      return tree;
                  };
                  if (v instanceof Data_List_Types.Cons) {
                      if (v.value0 instanceof TwoLeft) {
                          $tco_var_dictOrd = dictOrd;
                          $tco_var_v = v.value1;
                          $copy_tree = new Two(tree, v.value0.value0, v.value0.value1, v.value0.value2);
                          return;
                      };
                      if (v.value0 instanceof TwoRight) {
                          $tco_var_dictOrd = dictOrd;
                          $tco_var_v = v.value1;
                          $copy_tree = new Two(v.value0.value0, v.value0.value1, v.value0.value2, tree);
                          return;
                      };
                      if (v.value0 instanceof ThreeLeft) {
                          $tco_var_dictOrd = dictOrd;
                          $tco_var_v = v.value1;
                          $copy_tree = new Three(tree, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
                          return;
                      };
                      if (v.value0 instanceof ThreeMiddle) {
                          $tco_var_dictOrd = dictOrd;
                          $tco_var_v = v.value1;
                          $copy_tree = new Three(v.value0.value0, v.value0.value1, v.value0.value2, tree, v.value0.value3, v.value0.value4, v.value0.value5);
                          return;
                      };
                      if (v.value0 instanceof ThreeRight) {
                          $tco_var_dictOrd = dictOrd;
                          $tco_var_v = v.value1;
                          $copy_tree = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, tree);
                          return;
                      };
                      throw new Error("Failed pattern match at Data.Map.Internal (line 418, column 3 - line 423, column 88): " + [ v.value0.constructor.name ]);
                  };
                  throw new Error("Failed pattern match at Data.Map.Internal (line 415, column 1 - line 415, column 80): " + [ v.constructor.name, tree.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_dictOrd, $tco_var_v, $copy_tree);
              };
              return $tco_result;
          };
      };
  };
  var insert = function (dictOrd) {
      return function (k) {
          return function (v) {
              var up = function ($copy_v1) {
                  return function ($copy_v2) {
                      var $tco_var_v1 = $copy_v1;
                      var $tco_done = false;
                      var $tco_result;
                      function $tco_loop(v1, v2) {
                          if (v1 instanceof Data_List_Types.Nil) {
                              $tco_done = true;
                              return new Two(v2.value0, v2.value1, v2.value2, v2.value3);
                          };
                          if (v1 instanceof Data_List_Types.Cons) {
                              if (v1.value0 instanceof TwoLeft) {
                                  $tco_done = true;
                                  return fromZipper(dictOrd)(v1.value1)(new Three(v2.value0, v2.value1, v2.value2, v2.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
                              };
                              if (v1.value0 instanceof TwoRight) {
                                  $tco_done = true;
                                  return fromZipper(dictOrd)(v1.value1)(new Three(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0, v2.value1, v2.value2, v2.value3));
                              };
                              if (v1.value0 instanceof ThreeLeft) {
                                  $tco_var_v1 = v1.value1;
                                  $copy_v2 = new KickUp(new Two(v2.value0, v2.value1, v2.value2, v2.value3), v1.value0.value0, v1.value0.value1, new Two(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                                  return;
                              };
                              if (v1.value0 instanceof ThreeMiddle) {
                                  $tco_var_v1 = v1.value1;
                                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0), v2.value1, v2.value2, new Two(v2.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                                  return;
                              };
                              if (v1.value0 instanceof ThreeRight) {
                                  $tco_var_v1 = v1.value1;
                                  $copy_v2 = new KickUp(new Two(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two(v2.value0, v2.value1, v2.value2, v2.value3));
                                  return;
                              };
                              throw new Error("Failed pattern match at Data.Map.Internal (line 454, column 5 - line 459, column 108): " + [ v1.value0.constructor.name, v2.constructor.name ]);
                          };
                          throw new Error("Failed pattern match at Data.Map.Internal (line 451, column 3 - line 451, column 56): " + [ v1.constructor.name, v2.constructor.name ]);
                      };
                      while (!$tco_done) {
                          $tco_result = $tco_loop($tco_var_v1, $copy_v2);
                      };
                      return $tco_result;
                  };
              };
              var comp = Data_Ord.compare(dictOrd);
              var down = function ($copy_ctx) {
                  return function ($copy_v1) {
                      var $tco_var_ctx = $copy_ctx;
                      var $tco_done = false;
                      var $tco_result;
                      function $tco_loop(ctx, v1) {
                          if (v1 instanceof Leaf) {
                              $tco_done = true;
                              return up(ctx)(new KickUp(Leaf.value, k, v, Leaf.value));
                          };
                          if (v1 instanceof Two) {
                              var v2 = comp(k)(v1.value1);
                              if (v2 instanceof Data_Ordering.EQ) {
                                  $tco_done = true;
                                  return fromZipper(dictOrd)(ctx)(new Two(v1.value0, k, v, v1.value3));
                              };
                              if (v2 instanceof Data_Ordering.LT) {
                                  $tco_var_ctx = new Data_List_Types.Cons(new TwoLeft(v1.value1, v1.value2, v1.value3), ctx);
                                  $copy_v1 = v1.value0;
                                  return;
                              };
                              $tco_var_ctx = new Data_List_Types.Cons(new TwoRight(v1.value0, v1.value1, v1.value2), ctx);
                              $copy_v1 = v1.value3;
                              return;
                          };
                          if (v1 instanceof Three) {
                              var v3 = comp(k)(v1.value1);
                              if (v3 instanceof Data_Ordering.EQ) {
                                  $tco_done = true;
                                  return fromZipper(dictOrd)(ctx)(new Three(v1.value0, k, v, v1.value3, v1.value4, v1.value5, v1.value6));
                              };
                              var v4 = comp(k)(v1.value4);
                              if (v4 instanceof Data_Ordering.EQ) {
                                  $tco_done = true;
                                  return fromZipper(dictOrd)(ctx)(new Three(v1.value0, v1.value1, v1.value2, v1.value3, k, v, v1.value6));
                              };
                              if (v3 instanceof Data_Ordering.LT) {
                                  $tco_var_ctx = new Data_List_Types.Cons(new ThreeLeft(v1.value1, v1.value2, v1.value3, v1.value4, v1.value5, v1.value6), ctx);
                                  $copy_v1 = v1.value0;
                                  return;
                              };
                              if (v3 instanceof Data_Ordering.GT && v4 instanceof Data_Ordering.LT) {
                                  $tco_var_ctx = new Data_List_Types.Cons(new ThreeMiddle(v1.value0, v1.value1, v1.value2, v1.value4, v1.value5, v1.value6), ctx);
                                  $copy_v1 = v1.value3;
                                  return;
                              };
                              $tco_var_ctx = new Data_List_Types.Cons(new ThreeRight(v1.value0, v1.value1, v1.value2, v1.value3, v1.value4, v1.value5), ctx);
                              $copy_v1 = v1.value6;
                              return;
                          };
                          throw new Error("Failed pattern match at Data.Map.Internal (line 434, column 3 - line 434, column 55): " + [ ctx.constructor.name, v1.constructor.name ]);
                      };
                      while (!$tco_done) {
                          $tco_result = $tco_loop($tco_var_ctx, $copy_v1);
                      };
                      return $tco_result;
                  };
              };
              return down(Data_List_Types.Nil.value);
          };
      };
  };
  var empty = Leaf.value;
  var fromFoldable = function (dictOrd) {
      return function (dictFoldable) {
          return Data_Foldable.foldl(dictFoldable)(function (m) {
              return function (v) {
                  return insert(dictOrd)(v.value0)(v.value1)(m);
              };
          })(empty);
      };
  };
  exports["empty"] = empty;
  exports["insert"] = insert;
  exports["lookup"] = lookup;
  exports["fromFoldable"] = fromFoldable;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Plugins.Registry"] = $PS["Agrippa.Plugins.Registry"] || {};
  var exports = $PS["Agrippa.Plugins.Registry"];
  var Agrippa_Plugins_Calculator = $PS["Agrippa.Plugins.Calculator"];
  var Agrippa_Plugins_Clock = $PS["Agrippa.Plugins.Clock"];
  var Agrippa_Plugins_FileSystem_LinuxFileSearch = $PS["Agrippa.Plugins.FileSystem.LinuxFileSearch"];
  var Agrippa_Plugins_FileSystem_MacAppSearch = $PS["Agrippa.Plugins.FileSystem.MacAppSearch"];
  var Agrippa_Plugins_FileSystem_MacFileSearch = $PS["Agrippa.Plugins.FileSystem.MacFileSearch"];
  var Agrippa_Plugins_FileSystem_UnixExecutableSearch = $PS["Agrippa.Plugins.FileSystem.UnixExecutableSearch"];
  var Agrippa_Plugins_FileSystem_WinExecutableSearch = $PS["Agrippa.Plugins.FileSystem.WinExecutableSearch"];
  var Agrippa_Plugins_FileSystem_WinFileSearch = $PS["Agrippa.Plugins.FileSystem.WinFileSearch"];
  var Agrippa_Plugins_KeePass1 = $PS["Agrippa.Plugins.KeePass1"];
  var Agrippa_Plugins_MortgageCalc = $PS["Agrippa.Plugins.MortgageCalc"];
  var Agrippa_Plugins_OnlineSearch = $PS["Agrippa.Plugins.OnlineSearch"];
  var Agrippa_Plugins_Snippets = $PS["Agrippa.Plugins.Snippets"];
  var Agrippa_Plugins_TaskSearch = $PS["Agrippa.Plugins.TaskSearch"];
  var Data_Foldable = $PS["Data.Foldable"];
  var Data_Functor = $PS["Data.Functor"];
  var Data_Map_Internal = $PS["Data.Map.Internal"];
  var Data_Ord = $PS["Data.Ord"];
  var Data_Tuple = $PS["Data.Tuple"];                
  var plugins = [ Agrippa_Plugins_Calculator.calculator, Agrippa_Plugins_Clock.clock, Agrippa_Plugins_TaskSearch.taskSearch, Agrippa_Plugins_MortgageCalc.mortgageCalc, Agrippa_Plugins_OnlineSearch.onlineSearch, Agrippa_Plugins_Snippets.snippets, Agrippa_Plugins_FileSystem_LinuxFileSearch.linuxFileSearch, Agrippa_Plugins_FileSystem_MacAppSearch.macAppSearch, Agrippa_Plugins_FileSystem_MacFileSearch.macFileSearch, Agrippa_Plugins_FileSystem_UnixExecutableSearch.unixExecutableSearch, Agrippa_Plugins_FileSystem_WinExecutableSearch.winExecutableSearch, Agrippa_Plugins_FileSystem_WinFileSearch.winFileSearch, Agrippa_Plugins_KeePass1.keePass1 ];
  var namesToPlugins = Data_Map_Internal.fromFoldable(Data_Ord.ordString)(Data_Foldable.foldableArray)(Data_Functor.map(Data_Functor.functorArray)(function (v) {
      return new Data_Tuple.Tuple(v.name, v);
  })(plugins));
  exports["namesToPlugins"] = namesToPlugins;
})(PS);
(function(exports) {
  "use strict";

  exports.fromNumberImpl = function (just) {
    return function (nothing) {
      return function (n) {
        /* jshint bitwise: false */
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };

  exports.toNumber = function (n) {
    return n;
  };
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Data.Int"] = $PS["Data.Int"] || {};
  var exports = $PS["Data.Int"];
  var $foreign = $PS["Data.Int"];
  var Data_Boolean = $PS["Data.Boolean"];
  var Data_Bounded = $PS["Data.Bounded"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Global = $PS["Global"];
  var $$Math = $PS["Math"];         
  var fromNumber = $foreign.fromNumberImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var unsafeClamp = function (x) {
      if (x === Global.infinity) {
          return 0;
      };
      if (x === -Global.infinity) {
          return 0;
      };
      if (x >= $foreign.toNumber(Data_Bounded.top(Data_Bounded.boundedInt))) {
          return Data_Bounded.top(Data_Bounded.boundedInt);
      };
      if (x <= $foreign.toNumber(Data_Bounded.bottom(Data_Bounded.boundedInt))) {
          return Data_Bounded.bottom(Data_Bounded.boundedInt);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.fromMaybe(0)(fromNumber(x));
      };
      throw new Error("Failed pattern match at Data.Int (line 66, column 1 - line 66, column 29): " + [ x.constructor.name ]);
  }; 
  var ceil = function ($25) {
      return unsafeClamp($$Math.ceil($25));
  };
  exports["fromNumber"] = fromNumber;
  exports["ceil"] = ceil;
})(PS);
(function(exports) {
  "use strict";

  exports.new = function (val) {
    return function () {
      return { value: val };
    };
  };

  exports.read = function (ref) {
    return function () {
      return ref.value;
    };
  };

  exports.write = function (val) {
    return function (ref) {
      return function () {
        ref.value = val;
        return {};
      };
    };
  };
})(PS["Effect.Ref"] = PS["Effect.Ref"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect.Ref"] = $PS["Effect.Ref"] || {};
  var exports = $PS["Effect.Ref"];
  var $foreign = $PS["Effect.Ref"];
  exports["new"] = $foreign["new"];
  exports["read"] = $foreign.read;
  exports["write"] = $foreign.write;
})(PS);
(function(exports) {
  /* global exports */
  "use strict";

  exports.setTimeout = function (ms) {
    return function (fn) {
      return function () {
        return setTimeout(fn, ms);
      };
    };
  };

  exports.clearTimeout = function (id) {
    return function () {
      clearTimeout(id);
    };
  };
})(PS["Effect.Timer"] = PS["Effect.Timer"] || {});
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Effect.Timer"] = $PS["Effect.Timer"] || {};
  var exports = $PS["Effect.Timer"];
  var $foreign = $PS["Effect.Timer"];
  exports["setTimeout"] = $foreign.setTimeout;
  exports["clearTimeout"] = $foreign.clearTimeout;
})(PS);
(function($PS) {
  // Generated by purs version 0.12.5
  "use strict";
  $PS["Agrippa.Main"] = $PS["Agrippa.Main"] || {};
  var exports = $PS["Agrippa.Main"];
  var Affjax = $PS["Affjax"];
  var Affjax_ResponseFormat = $PS["Affjax.ResponseFormat"];
  var Agrippa_Config = $PS["Agrippa.Config"];
  var Agrippa_Help = $PS["Agrippa.Help"];
  var Agrippa_Plugins_Registry = $PS["Agrippa.Plugins.Registry"];
  var Agrippa_Utils = $PS["Agrippa.Utils"];
  var Control_Applicative = $PS["Control.Applicative"];
  var Control_Bind = $PS["Control.Bind"];
  var Control_Monad_Except = $PS["Control.Monad.Except"];
  var Data_Either = $PS["Data.Either"];
  var Data_Function = $PS["Data.Function"];
  var Data_Int = $PS["Data.Int"];
  var Data_List_Types = $PS["Data.List.Types"];
  var Data_Map_Internal = $PS["Data.Map.Internal"];
  var Data_Maybe = $PS["Data.Maybe"];
  var Data_Ord = $PS["Data.Ord"];
  var Data_Show = $PS["Data.Show"];
  var Data_String_CodePoints = $PS["Data.String.CodePoints"];
  var Data_String_Utils = $PS["Data.String.Utils"];
  var Data_Unit = $PS["Data.Unit"];
  var Effect = $PS["Effect"];
  var Effect_Aff = $PS["Effect.Aff"];
  var Effect_Ref = $PS["Effect.Ref"];
  var Effect_Timer = $PS["Effect.Timer"];
  var Foreign = $PS["Foreign"];
  var Foreign_Object = $PS["Foreign.Object"];
  var JQuery = $PS["JQuery"];                
  var Task = (function () {
      function Task(value0) {
          this.value0 = value0;
      };
      Task.create = function (value0) {
          return new Task(value0);
      };
      return Task;
  })();
  var setupPromptAfterKeyTimeout = function (taskConfig) {
      return function (promptAfterKeyTimeout) {
          return function (timeoutIdRefMb) {
              return function __do() {
                  var v = Effect_Ref.read(timeoutIdRefMb)();
                  Data_Maybe["maybe'"](Control_Applicative.pure(Effect.applicativeEffect))(Effect_Timer.clearTimeout)(v)();
                  var taskKeyTimeoutE = Agrippa_Config.getNumberVal("keyTimeoutInMs")(taskConfig);
                  var taskKeyTimeout = (function () {
                      if (taskKeyTimeoutE instanceof Data_Either.Left) {
                          return 0;
                      };
                      if (taskKeyTimeoutE instanceof Data_Either.Right) {
                          return Data_Int.ceil(taskKeyTimeoutE.value0);
                      };
                      throw new Error("Failed pattern match at Agrippa.Main (line 152, column 24 - line 154, column 38): " + [ taskKeyTimeoutE.constructor.name ]);
                  })();
                  var v1 = Effect_Timer.setTimeout(taskKeyTimeout)(promptAfterKeyTimeout)();
                  return Effect_Ref.write(new Data_Maybe.Just(v1))(timeoutIdRefMb)();
              };
          };
      };
  };
  var setTheme = function (config) {
      var v = Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.lookupConfigVal("preferences")(config))(Agrippa_Config.getStringVal("theme"));
      if (v instanceof Data_Either.Right && v.value0 === "minimal") {
          return function __do() {
              Control_Bind.bind(Effect.bindEffect)(JQuery.body)(JQuery.addClass("minimal"))();
              Control_Bind.bind(Effect.bindEffect)(JQuery.select("#agrippa-task"))(JQuery.addClass("minimal"))();
              return Control_Bind.bind(Effect.bindEffect)(JQuery.select("#agrippa-contact"))(JQuery.addClass("minimal"))();
          };
      };
      if (v instanceof Data_Either.Left) {
          return Control_Bind.bind(Effect.bindEffect)(JQuery.body)(JQuery.addClass(v.value0));
      };
      return Control_Applicative.pure(Effect.applicativeEffect)(Data_Unit.unit);
  };
  var installRestartServerListener = function __do() {
      var v = JQuery.select("#agrippa-restart-button")();
      return JQuery.on("click")(function (v1) {
          return function (v2) {
              return Effect_Aff.runAff_(function (v3) {
                  return Agrippa_Utils.displayOutputText("Restarting server... Please reload or visit the new address if that has been changed.");
              })(Affjax.get(Affjax_ResponseFormat.ignore)("/agrippa/restart/"));
          };
      })(v)();
  };
  var findTask = function (config) {
      return function (wholeInput) {
          return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_String_CodePoints.indexOf(" ")(wholeInput))(function (v) {
              return Control_Bind.bind(Data_Maybe.bindMaybe)(new Data_Maybe.Just(Data_String_CodePoints.splitAt(v)(wholeInput)))(function (v1) {
                  return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Either.hush(Agrippa_Config.getObjectVal("tasks")(config)))(function (v2) {
                      return Control_Bind.bind(Data_Maybe.bindMaybe)(Foreign_Object.lookup(v1.before)(v2))(function (v3) {
                          return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Either.hush(Agrippa_Config.getStringVal("name")(v3)))(function (v4) {
                              return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Either.hush(Agrippa_Config.getStringVal("plugin")(v3)))(function (v5) {
                                  return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Map_Internal.lookup(Data_Ord.ordString)(v5)(Agrippa_Plugins_Registry.namesToPlugins))(function (v6) {
                                      return new Data_Maybe.Just(new Task({
                                          name: v4,
                                          plugin: v6,
                                          input: v1.after,
                                          config: v3
                                      }));
                                  });
                              });
                          });
                      });
                  });
              });
          });
      };
  };
  var execTask = function (v) {
      return function (keyCode) {
          return function (timeoutIdRefMb) {
              return function __do() {
                  var v1 = (function () {
                      if (keyCode === 13) {
                          return v.value0.plugin.activate(v.value0.name)(v.value0.config)(v.value0.input)();
                      };
                      setupPromptAfterKeyTimeout(v.value0.config)(v.value0.plugin.promptAfterKeyTimeout(v.value0.name)(v.value0.config)(v.value0.input)(Agrippa_Utils.displayOutput))(timeoutIdRefMb)();
                      return v.value0.plugin.prompt(v.value0.name)(v.value0.config)(v.value0.input)();
                  })();
                  return Data_Maybe["maybe'"](Control_Applicative.pure(Effect.applicativeEffect))(Agrippa_Utils.displayOutput)(v1)();
              };
          };
      };
  };
  var displaySelectedTask = function (t) {
      return Control_Bind.bind(Effect.bindEffect)(JQuery.select("#agrippa-task"))(JQuery.setText(t));
  };
  var displayTaskCandidates = function (config) {
      return function (wholeInput) {
          return function (taskPromptTail) {
              return function __do() {
                  var v = JQuery.create("<table>")();
                  Agrippa_Utils.createTaskTableRow("<th>")("Keyword")("Task")(Agrippa_Utils.createTuple3Plain)(Agrippa_Utils.createTuple3Plain)(v)();
                  Agrippa_Utils.createTaskTableRows(config)(v)(function (keyword) {
                      return Data_String_Utils.startsWith(wholeInput)(keyword);
                  })(Data_Function["const"](true))(Agrippa_Utils.createTuple3Highlighted(wholeInput))(Agrippa_Utils.createTuple3Plain)();
                  Agrippa_Utils.displayOutput(v)();
                  return displaySelectedTask("Showing task candidates." + taskPromptTail)();
              };
          };
      };
  };
  var handleNoSelectedTask = function (config) {
      return function (keyCodeMb) {
          return function (wholeInput) {
              return function (timeoutIdRefMb) {
                  var findDefaultTask = Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Either.hush(Agrippa_Config.lookupConfigVal("preferences")(config)))(function (v) {
                      return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Either.hush(Agrippa_Config.lookupConfigVal("defaultTask")(v)))(function (v1) {
                          return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Either.hush(Agrippa_Config.getStringVal("name")(v1)))(function (v2) {
                              return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Either.hush(Agrippa_Config.getStringVal("plugin")(v1)))(function (v3) {
                                  return Control_Bind.bind(Data_Maybe.bindMaybe)(Data_Map_Internal.lookup(Data_Ord.ordString)(v3)(Agrippa_Plugins_Registry.namesToPlugins))(function (v4) {
                                      return new Data_Maybe.Just(new Task({
                                          name: v2,
                                          plugin: v4,
                                          input: wholeInput,
                                          config: v1
                                      }));
                                  });
                              });
                          });
                      });
                  });
                  if (findDefaultTask instanceof Data_Maybe.Just) {
                      return function __do() {
                          displayTaskCandidates(config)(wholeInput)("  Press <Enter> to activate the default task (" + (findDefaultTask.value0.value0.name + ")."))();
                          if (keyCodeMb instanceof Data_Maybe.Just && keyCodeMb.value0 === 13) {
                              return execTask(findDefaultTask.value0)(13)(timeoutIdRefMb)();
                          };
                          return Data_Unit.unit;
                      };
                  };
                  if (findDefaultTask instanceof Data_Maybe.Nothing) {
                      return displayTaskCandidates(config)(wholeInput)("");
                  };
                  throw new Error("Failed pattern match at Agrippa.Main (line 112, column 3 - line 119, column 3): " + [ findDefaultTask.constructor.name ]);
              };
          };
      };
  };
  var handleInput = function (config) {
      return function (keyCode) {
          return function (wholeInput) {
              return function (timeoutIdRefMb) {
                  return function __do() {
                      Control_Bind.bind(Effect.bindEffect)(JQuery.body)(JQuery.off("keyup"))();
                      var v = findTask(config)(wholeInput);
                      if (v instanceof Data_Maybe.Just) {
                          displaySelectedTask(v.value0.value0.name)();
                          return execTask(v.value0)(keyCode)(timeoutIdRefMb)();
                      };
                      if (v instanceof Data_Maybe.Nothing) {
                          return handleNoSelectedTask(config)(new Data_Maybe.Just(keyCode))(wholeInput)(timeoutIdRefMb)();
                      };
                      throw new Error("Failed pattern match at Agrippa.Main (line 92, column 3 - line 96, column 110): " + [ v.constructor.name ]);
                  };
              };
          };
      };
  };
  var inputListener = function (config) {
      return function (prevInputRef) {
          return function (timeoutIdRefMb) {
              return function (event) {
                  return function (inputField) {
                      return function __do() {
                          var v = JQuery.getWhich(event)();
                          var v1 = JQuery.getValue(inputField)();
                          var v2 = Control_Monad_Except.runExcept(Foreign.readString(v1));
                          if (v2 instanceof Data_Either.Left) {
                              return Agrippa_Utils.displayOutputText(Data_Show.show(Data_List_Types.showNonEmptyList(Foreign.showForeignError))(v2.value0))();
                          };
                          if (v2 instanceof Data_Either.Right) {
                              var v3 = Effect_Ref.read(prevInputRef)();
                              Effect_Ref.write(v2.value0)(prevInputRef)();
                              var $83 = v3 === v2.value0 && v !== 13;
                              if ($83) {
                                  return Data_Unit.unit;
                              };
                              return handleInput(config)(v)(v2.value0)(timeoutIdRefMb)();
                          };
                          throw new Error("Failed pattern match at Agrippa.Main (line 71, column 3 - line 80, column 66): " + [ v2.constructor.name ]);
                      };
                  };
              };
          };
      };
  };
  var installInputListener = function (config) {
      return function (timeoutIdRefMb) {
          return function __do() {
              var v = JQuery.select("#agrippa-input")();
              var v1 = Effect_Ref["new"]("")();
              return JQuery.on("keyup")(inputListener(config)(v1)(timeoutIdRefMb))(v)();
          };
      };
  };
  var main = (function () {
      var affHandler = function (v) {
          if (v instanceof Data_Either.Right && (v.value0.status === 200 && v.value0.body instanceof Data_Either.Right)) {
              return function __do() {
                  setTheme(v.value0.body.value0)();
                  Agrippa_Help.createHelp(v.value0.body.value0)();
                  var v1 = Effect_Ref["new"](Data_Maybe.Nothing.value)();
                  installInputListener(v.value0.body.value0)(v1)();
                  installRestartServerListener();
                  return handleNoSelectedTask(v.value0.body.value0)(Data_Maybe.Nothing.value)("")(v1)();
              };
          };
          return Agrippa_Utils.displayOutputText("Failed to retrieve config from server.");
      };
      return JQuery.ready(Effect_Aff.runAff_(affHandler)(Affjax.get(Affjax_ResponseFormat.json)("/agrippa/config/")));
  })();
  exports["main"] = main;
})(PS);
PS["Agrippa.Main"].main();
}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
