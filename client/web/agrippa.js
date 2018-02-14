(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
// Generated by purs bundle 0.11.7
var PS = {};
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
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
})(PS["Control.Semigroupoid"] = PS["Control.Semigroupoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Category = function (Semigroupoid0, id) {
      this.Semigroupoid0 = Semigroupoid0;
      this.id = id;
  };
  var id = function (dict) {
      return dict.id;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["Category"] = Category;
  exports["id"] = id;
  exports["categoryFn"] = categoryFn;
})(PS["Control.Category"] = PS["Control.Category"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Category = PS["Control.Category"];        
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
})(PS["Data.Function"] = PS["Data.Function"] || {});
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Show"];     
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
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  exports["unit"] = $foreign.unit;
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];        
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
  var voidRight = function (dictFunctor) {
      return function (x) {
          return map(dictFunctor)(Data_Function["const"](x));
      };
  };
  var functorFn = new Functor(Control_Semigroupoid.compose(Control_Semigroupoid.semigroupoidFn));
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["void"] = $$void;
  exports["voidRight"] = voidRight;
  exports["voidLeft"] = voidLeft;
  exports["functorFn"] = functorFn;
  exports["functorArray"] = functorArray;
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];        
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
              return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"](Control_Category.id(Control_Category.categoryFn)))(a))(b);
          };
      };
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
  exports["applyFirst"] = applyFirst;
  exports["applySecond"] = applySecond;
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
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
})(PS["Control.Applicative"] = PS["Control.Applicative"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
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
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
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

  exports.runPure = function (f) {
    return f();
  };

  exports.foreachE = function (as) {
    return function (f) {
      return function () {
        for (var i = 0, l = as.length; i < l; i++) {
          f(as[i])();
        }
      };
    };
  };
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
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
})(PS["Control.Monad"] = PS["Control.Monad"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var monadEff = new Control_Monad.Monad(function () {
      return applicativeEff;
  }, function () {
      return bindEff;
  });
  var bindEff = new Control_Bind.Bind(function () {
      return applyEff;
  }, $foreign.bindE);
  var applyEff = new Control_Apply.Apply(function () {
      return functorEff;
  }, Control_Monad.ap(monadEff));
  var applicativeEff = new Control_Applicative.Applicative(function () {
      return applyEff;
  }, $foreign.pureE);
  var functorEff = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEff));
  exports["functorEff"] = functorEff;
  exports["applyEff"] = applyEff;
  exports["applicativeEff"] = applicativeEff;
  exports["bindEff"] = bindEff;
  exports["monadEff"] = monadEff;
  exports["runPure"] = $foreign.runPure;
  exports["foreachE"] = $foreign.foreachE;
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
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

  exports.body = function() {
      return jQuery(document.body);
  };

  exports.clear = function(ob) {
      return function() {
          ob.empty();
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

  exports.setVisible = function(flag) {
      return function(ob) {
          return function() {
              ob.toggle(flag);
          };
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
})(PS["Control.Monad.Eff.JQuery"] = PS["Control.Monad.Eff.JQuery"] || {});
(function(exports) {
    "use strict";

  exports.toForeign = function (value) {
    return value;
  };

  exports.unsafeFromForeign = function (value) {
    return value;
  };

  exports.tagOf = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
    "use strict";

  exports.concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
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
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Functor = PS["Data.Functor"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var Alt = function (Functor0, alt) {
      this.Functor0 = Functor0;
      this.alt = alt;
  };                                                       
  var alt = function (dict) {
      return dict.alt;
  };
  exports["Alt"] = Alt;
  exports["alt"] = alt;
})(PS["Control.Alt"] = PS["Control.Alt"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Category = PS["Control.Category"];        
  var Bifunctor = function (bimap) {
      this.bimap = bimap;
  };
  var bimap = function (dict) {
      return dict.bimap;
  };
  var lmap = function (dictBifunctor) {
      return function (f) {
          return bimap(dictBifunctor)(f)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  exports["bimap"] = bimap;
  exports["Bifunctor"] = Bifunctor;
  exports["lmap"] = lmap;
})(PS["Data.Bifunctor"] = PS["Data.Bifunctor"] || {});
(function(exports) {
    "use strict";

  exports.refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Eq"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Eq = function (eq) {
      this.eq = eq;
  }; 
  var eqString = new Eq($foreign.refEq);
  var eqInt = new Eq($foreign.refEq);
  var eq = function (dict) {
      return dict.eq;
  };
  exports["Eq"] = Eq;
  exports["eq"] = eq;
  exports["eqInt"] = eqInt;
  exports["eqString"] = eqString;
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];        
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
})(PS["Data.Ordering"] = PS["Data.Ordering"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];        
  var unsafeCompare = $foreign.unsafeCompareImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
  exports["unsafeCompare"] = unsafeCompare;
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Ord"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord_Unsafe = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
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
  var compare = function (dict) {
      return dict.compare;
  };
  var comparing = function (dictOrd) {
      return function (f) {
          return Data_Function.on(compare(dictOrd))(f);
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
              throw new Error("Failed pattern match at Data.Ord line 123, column 3 - line 126, column 12: " + [ v.constructor.name ]);
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
              throw new Error("Failed pattern match at Data.Ord line 114, column 3 - line 117, column 12: " + [ v.constructor.name ]);
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
})(PS["Data.Ord"] = PS["Data.Ord"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Bounded"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Unit = PS["Data.Unit"];        
  var Bounded = function (Ord0, bottom, top) {
      this.Ord0 = Ord0;
      this.bottom = bottom;
      this.top = top;
  };
  var top = function (dict) {
      return dict.top;
  };              
  var bottom = function (dict) {
      return dict.bottom;
  };
  exports["Bounded"] = Bounded;
  exports["bottom"] = bottom;
  exports["top"] = top;
})(PS["Data.Bounded"] = PS["Data.Bounded"] || {});
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Data_Functor = PS["Data.Functor"];        
  var Plus = function (Alt0, empty) {
      this.Alt0 = Alt0;
      this.empty = empty;
  };       
  var empty = function (dict) {
      return dict.empty;
  };
  exports["Plus"] = Plus;
  exports["empty"] = empty;
})(PS["Control.Plus"] = PS["Control.Plus"] || {});
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.HeytingAlgebra"];
  var Data_Unit = PS["Data.Unit"];        
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
})(PS["Data.HeytingAlgebra"] = PS["Data.HeytingAlgebra"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Functor = PS["Data.Functor"];        
  var Alternative = function (Applicative0, Plus1) {
      this.Applicative0 = Applicative0;
      this.Plus1 = Plus1;
  };
  exports["Alternative"] = Alternative;
})(PS["Control.Alternative"] = PS["Control.Alternative"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var otherwise = true;
  exports["otherwise"] = otherwise;
})(PS["Data.Boolean"] = PS["Data.Boolean"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
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
})(PS["Data.Monoid"] = PS["Data.Monoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
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
  var maybe = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v;
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe line 219, column 1 - line 219, column 51: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
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
  var fromJust = function (dictPartial) {
      return function (v) {
          var __unused = function (dictPartial1) {
              return function ($dollar34) {
                  return $dollar34;
              };
          };
          return __unused(dictPartial)((function () {
              if (v instanceof Just) {
                  return v.value0;
              };
              throw new Error("Failed pattern match at Data.Maybe line 270, column 1 - line 270, column 46: " + [ v.constructor.name ]);
          })());
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
          throw new Error("Failed pattern match at Data.Maybe line 68, column 1 - line 68, column 35: " + [ v.constructor.name, v1.constructor.name ]);
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
          throw new Error("Failed pattern match at Data.Maybe line 127, column 1 - line 127, column 33: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applicativeMaybe = new Control_Applicative.Applicative(function () {
      return applyMaybe;
  }, Just.create);
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["maybe"] = maybe;
  exports["isNothing"] = isNothing;
  exports["fromJust"] = fromJust;
  exports["functorMaybe"] = functorMaybe;
  exports["applyMaybe"] = applyMaybe;
  exports["applicativeMaybe"] = applicativeMaybe;
  exports["bindMaybe"] = bindMaybe;
  exports["eqMaybe"] = eqMaybe;
})(PS["Data.Maybe"] = PS["Data.Maybe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Prelude = PS["Prelude"];        
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
  var alaF = function (dictFunctor) {
      return function (dictFunctor1) {
          return function (dictNewtype) {
              return function (dictNewtype1) {
                  return function (v) {
                      return function (f) {
                          return function ($64) {
                              return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($64)));
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
})(PS["Data.Newtype"] = PS["Data.Newtype"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
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
  var newtypeDisj = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Disj);
  var monoidDisj = function (dictHeytingAlgebra) {
      return new Data_Monoid.Monoid(function () {
          return semigroupDisj(dictHeytingAlgebra);
      }, Data_HeytingAlgebra.ff(dictHeytingAlgebra));
  };
  exports["Disj"] = Disj;
  exports["newtypeDisj"] = newtypeDisj;
  exports["semigroupDisj"] = semigroupDisj;
  exports["monoidDisj"] = monoidDisj;
})(PS["Data.Monoid.Disj"] = PS["Data.Monoid.Disj"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Foldable"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Endo = PS["Data.Monoid.Endo"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
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
          return traverse_(dictApplicative)(dictFoldable)(Control_Category.id(Control_Category.categoryFn));
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
          return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.Disj)(foldMap(dictFoldable)(Data_Monoid_Disj.monoidDisj(dictHeytingAlgebra)));
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
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
    "use strict";

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function Cont(fn) {
      this.fn = fn;
    }

    var emptyList = {};

    var ConsCell = function (head, tail) {
      this.head = head;
      this.tail = tail;
    };

    function consList(x) {
      return function (xs) {
        return new ConsCell(x, xs);
      };
    }

    function listToArray(list) {
      var arr = [];
      var xs = list;
      while (xs !== emptyList) {
        arr.push(xs.head);
        xs = xs.tail;
      }
      return arr;
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            var buildFrom = function (x, ys) {
              return apply(map(consList)(f(x)))(ys);
            };

            var go = function (acc, currentLen, xs) {
              if (currentLen === 0) {
                return acc;
              } else {
                var last = xs[currentLen - 1];
                return new Cont(function () {
                  return go(buildFrom(last, acc), currentLen - 1, xs);
                });
              }
            };

            return function (array) {
              var result = go(pure(emptyList), array.length, array);
              while (result instanceof Cont) {
                result = result.fn();
              }

              return map(listToArray)(result);
            };
          };
        };
      };
    };
  }();
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Traversable"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Traversable_Accum = PS["Data.Traversable.Accum"];
  var Data_Traversable_Accum_Internal = PS["Data.Traversable.Accum.Internal"];
  var Prelude = PS["Prelude"];        
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
          return traverse(dictTraversable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
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
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
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
  var functorEither = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Left) {
              return new Left(v1.value0);
          };
          if (v1 instanceof Right) {
              return new Right(v(v1.value0));
          };
          throw new Error("Failed pattern match at Data.Either line 36, column 1 - line 36, column 45: " + [ v.constructor.name, v1.constructor.name ]);
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
              throw new Error("Failed pattern match at Data.Either line 229, column 1 - line 229, column 64: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var bifunctorEither = new Data_Bifunctor.Bifunctor(function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return new Left(v(v2.value0));
              };
              if (v2 instanceof Right) {
                  return new Right(v1(v2.value0));
              };
              throw new Error("Failed pattern match at Data.Either line 43, column 1 - line 43, column 45: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
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
          throw new Error("Failed pattern match at Data.Either line 79, column 1 - line 79, column 41: " + [ v.constructor.name, v1.constructor.name ]);
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
  var altEither = new Control_Alt.Alt(function () {
      return functorEither;
  }, function (v) {
      return function (v1) {
          if (v instanceof Left) {
              return v1;
          };
          return v;
      };
  });
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["functorEither"] = functorEither;
  exports["bifunctorEither"] = bifunctorEither;
  exports["applyEither"] = applyEither;
  exports["applicativeEither"] = applicativeEither;
  exports["altEither"] = altEither;
  exports["bindEither"] = bindEither;
  exports["monadEither"] = monadEither;
})(PS["Data.Either"] = PS["Data.Either"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var MonadThrow = function (Monad0, throwError) {
      this.Monad0 = Monad0;
      this.throwError = throwError;
  };
  var throwError = function (dict) {
      return dict.throwError;
  };
  exports["throwError"] = throwError;
  exports["MonadThrow"] = MonadThrow;
})(PS["Control.Monad.Error.Class"] = PS["Control.Monad.Error.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Unit = PS["Data.Unit"];        
  var Lazy = function (defer) {
      this.defer = defer;
  }; 
  var defer = function (dict) {
      return dict.defer;
  };
  var fix = function (dictLazy) {
      return function (f) {
          return defer(dictLazy)(function (v) {
              return f(fix(dictLazy)(f));
          });
      };
  };
  exports["defer"] = defer;
  exports["Lazy"] = Lazy;
  exports["fix"] = fix;
})(PS["Control.Lazy"] = PS["Control.Lazy"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Field = PS["Data.Field"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var Identity = function (x) {
      return x;
  };
  var newtypeIdentity = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Identity);
  var functorIdentity = new Data_Functor.Functor(function (f) {
      return function (v) {
          return f(v);
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
})(PS["Data.Identity"] = PS["Data.Identity"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Unsafe = PS["Control.Monad.Eff.Unsafe"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
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
              throw new Error("Failed pattern match at Control.Monad.Rec.Class line 96, column 3 - line 96, column 25: " + [ v.constructor.name ]);
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
              throw new Error("Failed pattern match at Control.Monad.Rec.Class line 112, column 7 - line 112, column 33: " + [ v.constructor.name ]);
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
              throw new Error("Failed pattern match at Control.Monad.Rec.Class line 32, column 1 - line 32, column 41: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
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
})(PS["Control.Monad.Rec.Class"] = PS["Control.Monad.Rec.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Biapplicative = PS["Control.Biapplicative"];
  var Control_Biapply = PS["Control.Biapply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Distributive = PS["Data.Distributive"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Type_Equality = PS["Type.Equality"];        
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
})(PS["Data.Tuple"] = PS["Data.Tuple"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];        
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
})(PS["Control.Monad.Except.Trans"] = PS["Control.Monad.Except.Trans"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Newtype = PS["Data.Newtype"];
  var Prelude = PS["Prelude"];                                                           
  var runExcept = function ($0) {
      return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(Control_Monad_Except_Trans.runExceptT($0));
  };
  exports["runExcept"] = runExcept;
})(PS["Control.Monad.Except"] = PS["Control.Monad.Except"] || {});
(function(exports) {
    "use strict";

  exports.toNumber = function (n) {
    return n;
  };
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {
  /* globals exports */
  "use strict";               

  exports.isFinite = isFinite;

  exports.readFloat = parseFloat;                 
  exports.encodeURIComponent = encodeURIComponent;
})(PS["Global"] = PS["Global"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Global"];
  exports["isFinite"] = $foreign["isFinite"];
  exports["readFloat"] = $foreign.readFloat;
  exports["encodeURIComponent"] = $foreign["encodeURIComponent"];
})(PS["Global"] = PS["Global"] || {});
(function(exports) {
    "use strict";

  exports.pow = function (n) {
    return function (p) {
      return Math.pow(n, p);
    };
  };
})(PS["Math"] = PS["Math"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Math"];
  exports["pow"] = $foreign.pow;
})(PS["Math"] = PS["Math"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Int"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_DivisionRing = PS["Data.DivisionRing"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Field = PS["Data.Field"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Int_Bits = PS["Data.Int.Bits"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Global = PS["Global"];
  var $$Math = PS["Math"];
  var Prelude = PS["Prelude"];
  exports["toNumber"] = $foreign.toNumber;
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.FunctorWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var FunctorWithIndex = function (Functor0, mapWithIndex) {
      this.Functor0 = Functor0;
      this.mapWithIndex = mapWithIndex;
  };
  var mapWithIndex = function (dict) {
      return dict.mapWithIndex;
  };
  exports["FunctorWithIndex"] = FunctorWithIndex;
  exports["mapWithIndex"] = mapWithIndex;
})(PS["Data.FunctorWithIndex"] = PS["Data.FunctorWithIndex"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Endo = PS["Data.Monoid.Endo"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
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
})(PS["Data.FoldableWithIndex"] = PS["Data.FoldableWithIndex"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Traversable_Accum = PS["Data.Traversable.Accum"];
  var Data_Traversable_Accum_Internal = PS["Data.Traversable.Accum.Internal"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
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
})(PS["Data.TraversableWithIndex"] = PS["Data.TraversableWithIndex"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_TraversableWithIndex = PS["Data.TraversableWithIndex"];
  var Prelude = PS["Prelude"];        
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
  exports["NonEmpty"] = NonEmpty;
  exports["singleton"] = singleton;
  exports["showNonEmpty"] = showNonEmpty;
})(PS["Data.NonEmpty"] = PS["Data.NonEmpty"] || {});
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
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Unfoldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var Unfoldable = function (unfoldr) {
      this.unfoldr = unfoldr;
  };
  var unfoldr = function (dict) {
      return dict.unfoldr;
  };
  var unfoldableArray = new Unfoldable($foreign.unfoldrArrayImpl(Data_Maybe.isNothing)(Data_Maybe.fromJust())(Data_Tuple.fst)(Data_Tuple.snd));
  exports["Unfoldable"] = Unfoldable;
  exports["unfoldr"] = unfoldr;
  exports["unfoldableArray"] = unfoldableArray;
})(PS["Data.Unfoldable"] = PS["Data.Unfoldable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semigroup_Foldable = PS["Data.Semigroup.Foldable"];
  var Data_Semigroup_Traversable = PS["Data.Semigroup.Traversable"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_TraversableWithIndex = PS["Data.TraversableWithIndex"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];        
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
  var foldableList = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return Data_Foldable.foldl(foldableList)(function (acc) {
              return function ($158) {
                  return Data_Semigroup.append(dictMonoid.Semigroup0())(acc)(f($158));
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
                  throw new Error("Failed pattern match at Data.List.Types line 81, column 12 - line 83, column 30: " + [ v.constructor.name ]);
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
          return function ($159) {
              return Data_Foldable.foldl(foldableList)(Data_Function.flip(f))(b)(rev($159));
          };
      };
  });
  var functorList = new Data_Functor.Functor(function (f) {
      return Data_Foldable.foldr(foldableList)(function (x) {
          return function (acc) {
              return new Cons(f(x), acc);
          };
      })(Nil.value);
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
})(PS["Data.List.Types"] = PS["Data.List.Types"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];                                                   
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
      throw new Error("Failed pattern match at Data.List line 259, column 1 - line 259, column 66: " + [ v.constructor.name ]);
  };
  var toUnfoldable = function (dictUnfoldable) {
      return Data_Unfoldable.unfoldr(dictUnfoldable)(function (xs) {
          return Data_Functor.map(Data_Maybe.functorMaybe)(function (rec) {
              return new Data_Tuple.Tuple(rec.head, rec.tail);
          })(uncons(xs));
      });
  };
  var tail = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just(v.value1);
      };
      throw new Error("Failed pattern match at Data.List line 245, column 1 - line 245, column 43: " + [ v.constructor.name ]);
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
                  throw new Error("Failed pattern match at Data.List line 368, column 3 - line 368, column 19: " + [ acc.constructor.name, v.constructor.name ]);
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
  var head = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just(v.value0);
      };
      throw new Error("Failed pattern match at Data.List line 230, column 1 - line 230, column 22: " + [ v.constructor.name ]);
  };
  exports["toUnfoldable"] = toUnfoldable;
  exports["manyRec"] = manyRec;
  exports["head"] = head;
  exports["tail"] = tail;
  exports["uncons"] = uncons;
  exports["reverse"] = reverse;
})(PS["Data.List"] = PS["Data.List"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semigroup_Foldable = PS["Data.Semigroup.Foldable"];
  var Data_Semigroup_Traversable = PS["Data.Semigroup.Traversable"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  var singleton = function ($160) {
      return Data_List_Types.NonEmptyList(Data_NonEmpty.singleton(Data_List_Types.plusList)($160));
  };
  exports["singleton"] = singleton;
})(PS["Data.List.NonEmpty"] = PS["Data.List.NonEmpty"] || {});
(function(exports) {
    "use strict";

  exports._charAt = function (just) {
    return function (nothing) {
      return function (i) {
        return function (s) {
          return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
        };
      };
    };
  };

  exports.fromCharArray = function (a) {
    return a.join("");
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

  exports["_indexOf'"] = function (just) {
    return function (nothing) {
      return function (x) {
        return function (startAt) {
          return function (s) {
            if (startAt < 0 || startAt > s.length) return nothing;
            var i = s.indexOf(x, startAt);
            return i === -1 ? nothing : just(i);
          };
        };
      };
    };
  };

  exports.length = function (s) {
    return s.length;
  };

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
        return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
      };
    };
  };

  exports._splitAt = function (just) {
    return function (nothing) {
      return function (i) {
        return function (s) {
          return i >= 0 && i < s.length ?
                 just({ before: s.substring(0, i), after: s.substring(i) }) :
                 nothing;
        };
      };
    };
  };

  exports.toLower = function (s) {
    return s.toLowerCase();
  };

  exports.trim = function (s) {
    return s.trim();
  };
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.String"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_String_Unsafe = PS["Data.String.Unsafe"];
  var Prelude = PS["Prelude"];        
  var Replacement = function (x) {
      return x;
  };
  var splitAt = $foreign._splitAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var indexOf$prime = $foreign["_indexOf'"](Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var indexOf = $foreign._indexOf(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);      
  var charAt = $foreign._charAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  exports["Replacement"] = Replacement;
  exports["charAt"] = charAt;
  exports["indexOf"] = indexOf;
  exports["indexOf'"] = indexOf$prime;
  exports["splitAt"] = splitAt;
  exports["fromCharArray"] = $foreign.fromCharArray;
  exports["length"] = $foreign.length;
  exports["replace"] = $foreign.replace;
  exports["replaceAll"] = $foreign.replaceAll;
  exports["toLower"] = $foreign.toLower;
  exports["trim"] = $foreign.trim;
})(PS["Data.String"] = PS["Data.String"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Foreign"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Int = PS["Data.Int"];
  var Data_List_NonEmpty = PS["Data.List.NonEmpty"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Prelude = PS["Prelude"];        
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
  var JSONError = (function () {
      function JSONError(value0) {
          this.value0 = value0;
      };
      JSONError.create = function (value0) {
          return new JSONError(value0);
      };
      return JSONError;
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
      if (v instanceof JSONError) {
          return "(JSONError " + (Data_Show.show(Data_Show.showString)(v.value0) + ")");
      };
      if (v instanceof TypeMismatch) {
          return "(TypeMismatch " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(Data_Show.showString)(v.value1) + ")")));
      };
      throw new Error("Failed pattern match at Data.Foreign line 64, column 1 - line 64, column 47: " + [ v.constructor.name ]);
  });
  var fail = function ($121) {
      return Control_Monad_Error_Class.throwError(Control_Monad_Except_Trans.monadThrowExceptT(Data_Identity.monadIdentity))(Data_List_NonEmpty.singleton($121));
  };
  var unsafeReadTagged = function (tag) {
      return function (value) {
          if ($foreign.tagOf(value) === tag) {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
          };
          if (Data_Boolean.otherwise) {
              return fail(new TypeMismatch(tag, $foreign.tagOf(value)));
          };
          throw new Error("Failed pattern match at Data.Foreign line 104, column 1 - line 104, column 55: " + [ tag.constructor.name, value.constructor.name ]);
      };
  };
  var readString = unsafeReadTagged("String");
  exports["ForeignError"] = ForeignError;
  exports["TypeMismatch"] = TypeMismatch;
  exports["ErrorAtIndex"] = ErrorAtIndex;
  exports["ErrorAtProperty"] = ErrorAtProperty;
  exports["JSONError"] = JSONError;
  exports["unsafeReadTagged"] = unsafeReadTagged;
  exports["readString"] = readString;
  exports["fail"] = fail;
  exports["showForeignError"] = showForeignError;
  exports["toForeign"] = $foreign.toForeign;
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff.JQuery"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Prelude = PS["Prelude"];
  var hide = $foreign.setVisible(false);
  var display = $foreign.setVisible(true);
  var addClass = function (cls) {
      return $foreign.setClass(cls)(true);
  };
  exports["addClass"] = addClass;
  exports["hide"] = hide;
  exports["display"] = display;
  exports["ready"] = $foreign.ready;
  exports["select"] = $foreign.select;
  exports["create"] = $foreign.create;
  exports["setProp"] = $foreign.setProp;
  exports["getProp"] = $foreign.getProp;
  exports["append"] = $foreign.append;
  exports["clear"] = $foreign.clear;
  exports["body"] = $foreign.body;
  exports["setText"] = $foreign.setText;
  exports["getValue"] = $foreign.getValue;
  exports["setValue"] = $foreign.setValue;
  exports["toggle"] = $foreign.toggle;
  exports["on"] = $foreign.on;
  exports["off"] = $foreign.off;
  exports["getWhich"] = $foreign.getWhich;
})(PS["Control.Monad.Eff.JQuery"] = PS["Control.Monad.Eff.JQuery"] || {});
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

  exports.fromFoldableImpl = (function () {
    // jshint maxparams: 2
    function Cons(head, tail) {
      this.head = head;
      this.tail = tail;
    }
    var emptyList = {};

    function curryCons(head) {
      return function (tail) {
        return new Cons(head, tail);
      };
    }

    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }

    return function (foldr) {
      return function (xs) {
        return listToArray(foldr(curryCons)(emptyList)(xs));
      };
    };
  })();

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
      // jshint maxparams: 2
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Array"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array_ST = PS["Data.Array.ST"];
  var Data_Array_ST_Iterator = PS["Data.Array.ST.Iterator"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];                                                        
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
              throw new Error("Failed pattern match at Data.Array line 139, column 3 - line 141, column 26: " + [ i.constructor.name ]);
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
                  throw new Error("Failed pattern match at Data.Array line 698, column 15 - line 703, column 1: " + [ v.constructor.name ]);
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
  var fromFoldable = function (dictFoldable) {
      return $foreign.fromFoldableImpl(Data_Foldable.foldr(dictFoldable));
  };
  exports["fromFoldable"] = fromFoldable;
  exports["toUnfoldable"] = toUnfoldable;
  exports["uncons"] = uncons;
  exports["sortBy"] = sortBy;
  exports["sortWith"] = sortWith;
  exports["unsafeIndex"] = unsafeIndex;
  exports["range"] = $foreign.range;
  exports["cons"] = $foreign.cons;
  exports["snoc"] = $foreign.snoc;
  exports["reverse"] = $foreign.reverse;
  exports["zipWith"] = $foreign.zipWith;
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var DOM = PS["DOM"];
  var Data_Array = PS["Data.Array"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var numOfShortcuts = 9;
  var mToE = function (v) {
      return function (v1) {
          if (v1 instanceof Data_Maybe.Nothing) {
              return new Data_Either.Left(v);
          };
          if (v1 instanceof Data_Maybe.Just) {
              return new Data_Either.Right(v1.value0);
          };
          throw new Error("Failed pattern match at Agrippa.Utils line 49, column 1 - line 49, column 47: " + [ v.constructor.name, v1.constructor.name ]);
      };
  };
  var displayOutput = function (node) {
      return function __do() {
          var v = Control_Monad_Eff_JQuery.select("#agrippa-output")();
          Control_Monad_Eff_JQuery.clear(v)();
          return Control_Monad_Eff_JQuery.append(node)(v)();
      };
  };
  var createTextNode = function (t) {
      return function __do() {
          var v = Control_Monad_Eff_JQuery.create("<div>")();
          Control_Monad_Eff_JQuery.setText(t)(v)();
          return v;
      };
  };
  var displayOutputText = function (t) {
      return Control_Bind.bind(Control_Monad_Eff.bindEff)(createTextNode(t))(displayOutput);
  };
  var appendShortcutLabel = function (htmlTag) {
      return function (label) {
          return function (parent) {
              return function __do() {
                  var v = Control_Monad_Eff_JQuery.create(htmlTag)();
                  Control_Monad_Eff_JQuery.addClass("agrippa-shortcut-prompt")(v)();
                  Control_Monad_Eff_JQuery.setText(label)(v)();
                  return Control_Monad_Eff_JQuery.append(v)(parent)();
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
                  return Data_Foldable.sequence_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableArray)(Data_Array.zipWith(appendShortcutLabel(htmlTag))(Data_Functor.map(Data_Functor.functorArray)(function (index) {
                      return "ctrl+shift+" + Data_Show.show(Data_Show.showInt)(index);
                  })(Data_Array.range(1)(numOfShortcuts)))(v.value0.tail))();
              };
          };
          if (v instanceof Data_Maybe.Nothing) {
              return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit);
          };
          throw new Error("Failed pattern match at Agrippa.Utils line 33, column 3 - line 40, column 25: " + [ v.constructor.name ]);
      };
  };
  exports["addShortcutLabels"] = addShortcutLabels;
  exports["createTextNode"] = createTextNode;
  exports["displayOutput"] = displayOutput;
  exports["displayOutputText"] = displayOutputText;
  exports["mToE"] = mToE;
})(PS["Agrippa.Utils"] = PS["Agrippa.Utils"] || {});
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

  exports._foldJson = function (isNull, isBool, isNum, isStr, isArr, isObj, j) {
    if (j == null) return isNull(null);
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Function.Uncurried"];
  var Data_Unit = PS["Data.Unit"];
  exports["runFn4"] = $foreign.runFn4;
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
    "use strict";

  exports._copyEff = function (m) {
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
    return f;
  };

  exports._fmapStrMap = function (m0, f) {
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
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
(function(exports) {
    "use strict";

  exports["new"] = function () {
    return {};
  };

  exports.poke = function (m) {
    return function (k) {
      return function (v) {
        return function () {
          m[k] = v;
          return m;
        };
      };
    };
  };
})(PS["Data.StrMap.ST"] = PS["Data.StrMap.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.StrMap.ST"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Maybe = PS["Data.Maybe"];
  exports["new"] = $foreign["new"];
  exports["poke"] = $foreign.poke;
})(PS["Data.StrMap.ST"] = PS["Data.StrMap.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.StrMap"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array = PS["Data.Array"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap_ST = PS["Data.StrMap.ST"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_TraversableWithIndex = PS["Data.TraversableWithIndex"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];        
  var values = $foreign.toArrayWithKey(function (v) {
      return function (v1) {
          return v1;
      };
  });
  var toUnfoldable = function (dictUnfoldable) {
      return function ($46) {
          return Data_Array.toUnfoldable(dictUnfoldable)($foreign.toArrayWithKey(Data_Tuple.Tuple.create)($46));
      };
  };
  var toAscUnfoldable = function (dictUnfoldable) {
      return function ($47) {
          return Data_Array.toUnfoldable(dictUnfoldable)(Data_Array.sortWith(Data_Ord.ordString)(Data_Tuple.fst)($foreign.toArrayWithKey(Data_Tuple.Tuple.create)($47)));
      };
  };                                                             
  var thawST = $foreign._copyEff;
  var pureST = function (f) {
      return Control_Monad_Eff.runPure($foreign.runST(f));
  };
  var mutate = function (f) {
      return function (m) {
          return pureST(function __do() {
              var v = thawST(m)();
              var v1 = f(v)();
              return v;
          });
      };
  };                                                                                                 
  var mapWithKey = function (f) {
      return function (m) {
          return $foreign._mapWithKey(m, f);
      };
  };
  var lookup = Data_Function_Uncurried.runFn4($foreign._lookup)(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
  var insert = function (k) {
      return function (v) {
          return mutate(function (s) {
              return Data_Functor["void"](Control_Monad_Eff.functorEff)(Data_StrMap_ST.poke(s)(k)(v));
          });
      };
  };
  var functorStrMap = new Data_Functor.Functor(function (f) {
      return function (m) {
          return $foreign._fmapStrMap(m, f);
      };
  });
  var functorWithIndexStrMap = new Data_FunctorWithIndex.FunctorWithIndex(function () {
      return functorStrMap;
  }, mapWithKey);
  var fromFoldable = function (dictFoldable) {
      return function (l) {
          return pureST(function __do() {
              var v = Data_StrMap_ST["new"]();
              Control_Monad_Eff.foreachE(Data_Array.fromFoldable(dictFoldable)(l))(function (v1) {
                  return Data_Functor["void"](Control_Monad_Eff.functorEff)(Data_StrMap_ST.poke(v)(v1.value0)(v1.value1));
              })();
              return v;
          });
      };
  };
  var foldM = function (dictMonad) {
      return function (f) {
          return function (z) {
              return $foreign._foldM(Control_Bind.bind(dictMonad.Bind1()))(f)(Control_Applicative.pure(dictMonad.Applicative0())(z));
          };
      };
  };
  var fold = $foreign._foldM(Data_Function.applyFlipped);
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
  var foldableStrMap = new Data_Foldable.Foldable(function (dictMonoid) {
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
  var foldableWithIndexStrMap = new Data_FoldableWithIndex.FoldableWithIndex(function () {
      return foldableStrMap;
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
  var traversableWithIndexStrMap = new Data_TraversableWithIndex.TraversableWithIndex(function () {
      return foldableWithIndexStrMap;
  }, function () {
      return functorWithIndexStrMap;
  }, function () {
      return traversableStrMap;
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
  var traversableStrMap = new Data_Traversable.Traversable(function () {
      return foldableStrMap;
  }, function () {
      return functorStrMap;
  }, function (dictApplicative) {
      return Data_Traversable.traverse(traversableStrMap)(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
  }, function (dictApplicative) {
      return function ($48) {
          return Data_TraversableWithIndex.traverseWithIndex(traversableWithIndexStrMap)(dictApplicative)(Data_Function["const"]($48));
      };
  });
  var filterWithKey = function (predicate) {
      return function (m) {
          var go = (function () {
              var step = function (acc) {
                  return function (k) {
                      return function (v) {
                          var $42 = predicate(k)(v);
                          if ($42) {
                              return Data_StrMap_ST.poke(acc)(k)(v);
                          };
                          return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(acc);
                      };
                  };
              };
              return function __do() {
                  var v = Data_StrMap_ST["new"]();
                  return foldM(Control_Monad_Eff.monadEff)(step)(v)(m)();
              };
          })();
          return pureST(go);
      };
  };
  var filterKeys = function (predicate) {
      return filterWithKey(function ($49) {
          return Data_Function["const"](predicate($49));
      });
  };
  exports["insert"] = insert;
  exports["lookup"] = lookup;
  exports["toUnfoldable"] = toUnfoldable;
  exports["toAscUnfoldable"] = toAscUnfoldable;
  exports["fromFoldable"] = fromFoldable;
  exports["mapWithKey"] = mapWithKey;
  exports["filterWithKey"] = filterWithKey;
  exports["filterKeys"] = filterKeys;
  exports["values"] = values;
  exports["fold"] = fold;
  exports["foldMap"] = foldMap;
  exports["foldM"] = foldM;
  exports["thawST"] = thawST;
  exports["pureST"] = pureST;
  exports["functorStrMap"] = functorStrMap;
  exports["functorWithIndexStrMap"] = functorWithIndexStrMap;
  exports["foldableStrMap"] = foldableStrMap;
  exports["foldableWithIndexStrMap"] = foldableWithIndexStrMap;
  exports["traversableStrMap"] = traversableStrMap;
  exports["traversableWithIndexStrMap"] = traversableWithIndexStrMap;
  exports["empty"] = $foreign.empty;
  exports["toArrayWithKey"] = $foreign.toArrayWithKey;
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Argonaut.Core"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var verbJsonType = function (def) {
      return function (f) {
          return function (fold) {
              return fold(def)(f);
          };
      };
  };
  var toJsonType = verbJsonType(Data_Maybe.Nothing.value)(Data_Maybe.Just.create);
  var showJson = new Data_Show.Show($foreign.stringify);             
  var foldJsonString = function (d) {
      return function (f) {
          return function (j) {
              return $foreign._foldJson(Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), f, Data_Function["const"](d), Data_Function["const"](d), j);
          };
      };
  };                                        
  var toString = toJsonType(foldJsonString);
  var foldJsonObject = function (d) {
      return function (f) {
          return function (j) {
              return $foreign._foldJson(Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), f, j);
          };
      };
  };                                        
  var toObject = toJsonType(foldJsonObject);
  var foldJsonBoolean = function (d) {
      return function (f) {
          return function (j) {
              return $foreign._foldJson(Data_Function["const"](d), f, Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), j);
          };
      };
  };                                          
  var toBoolean = toJsonType(foldJsonBoolean);
  var foldJsonArray = function (d) {
      return function (f) {
          return function (j) {
              return $foreign._foldJson(Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), Data_Function["const"](d), f, Data_Function["const"](d), j);
          };
      };
  };                                      
  var toArray = toJsonType(foldJsonArray);
  exports["foldJsonBoolean"] = foldJsonBoolean;
  exports["foldJsonString"] = foldJsonString;
  exports["foldJsonArray"] = foldJsonArray;
  exports["foldJsonObject"] = foldJsonObject;
  exports["toBoolean"] = toBoolean;
  exports["toString"] = toString;
  exports["toArray"] = toArray;
  exports["toObject"] = toObject;
  exports["showJson"] = showJson;
  exports["fromString"] = $foreign.fromString;
  exports["fromObject"] = $foreign.fromObject;
})(PS["Data.Argonaut.Core"] = PS["Data.Argonaut.Core"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_Either = PS["Data.Either"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var lookupConfigVal = function (key) {
      return function (config) {
          return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Utils.mToE("Config Error: expect JSON object.")(Data_Argonaut_Core.toObject(config)))(function (v) {
              return Agrippa_Utils.mToE("Config Error: expect JSON object with a(n) '" + (key + "' key."))(Data_StrMap.lookup(key)(v));
          });
      };
  };
  var getConvertedVal = function (key) {
      return function (config) {
          return function (convert) {
              return Control_Bind.bind(Data_Either.bindEither)(lookupConfigVal(key)(config))(function (v) {
                  return Agrippa_Utils.mToE("Config Error: expect value of '" + (key + "' to be a different type."))(convert(v));
              });
          };
      };
  };
  var getStrMapVal = function (key) {
      return function (config) {
          return getConvertedVal(key)(config)(Data_Argonaut_Core.toObject);
      };
  };
  var getStringVal = function (key) {
      return function (config) {
          return getConvertedVal(key)(config)(Data_Argonaut_Core.toString);
      };
  };
  var getBooleanVal = function (key) {
      return function (config) {
          return getConvertedVal(key)(config)(Data_Argonaut_Core.toBoolean);
      };
  };
  exports["getBooleanVal"] = getBooleanVal;
  exports["lookupConfigVal"] = lookupConfigVal;
  exports["getStrMapVal"] = getStrMapVal;
  exports["getStringVal"] = getStringVal;
})(PS["Agrippa.Config"] = PS["Agrippa.Config"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var DOM = PS["DOM"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];        
  var helpLinkHandler = function (helpContent) {
      return function (v) {
          return function (v1) {
              return Control_Monad_Eff_JQuery.toggle(helpContent);
          };
      };
  };
  var getKeywordsToTaskNames = function (config) {
      return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.getStrMapVal("tasks")(config))(function (v) {
          return Data_Traversable.traverse(Data_StrMap.traversableStrMap)(Data_Either.applicativeEither)(Agrippa_Config.getStringVal("name"))(v);
      });
  };
  var buildHelpTextForTask = function (v) {
      var createTd = function (contents) {
          return function (tr) {
              return function __do() {
                  var td = Control_Monad_Eff_JQuery.create("<td>")();
                  return Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Control_Monad_Eff_JQuery.setText(contents)(td))(Control_Monad_Eff_JQuery.append(td)(tr))();
              };
          };
      };
      return function __do() {
          var v1 = Control_Monad_Eff_JQuery.select("#agrippa-help-table")();
          var v2 = Control_Monad_Eff_JQuery.create("<tr>")();
          return Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Control_Apply.applySecond(Control_Monad_Eff.applyEff)(createTd(v.value0)(v2))(createTd(v.value1)(v2)))(Control_Monad_Eff_JQuery.append(v2)(v1))();
      };
  };
  var buildHelpTextForTasks = function (config) {
      var v = getKeywordsToTaskNames(config);
      if (v instanceof Data_Either.Left) {
          return Agrippa_Utils.displayOutputText(v.value0);
      };
      if (v instanceof Data_Either.Right) {
          return Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableArray)(buildHelpTextForTask)(Data_StrMap.toAscUnfoldable(Data_Unfoldable.unfoldableArray)(v.value0));
      };
      throw new Error("Failed pattern match at Agrippa.Help line 30, column 3 - line 33, column 69: " + [ v.constructor.name ]);
  };
  var buildHelp = function (config) {
      return function __do() {
          var v = Control_Monad_Eff_JQuery.select("#agrippa-help-link")();
          var v1 = Control_Monad_Eff_JQuery.select("#agrippa-help-content")();
          (function () {
              var v2 = Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.lookupConfigVal("preferences")(config))(Agrippa_Config.getBooleanVal("showHelpByDefault"));
              if (v2 instanceof Data_Either.Left) {
                  return Agrippa_Utils.displayOutputText(v2.value0);
              };
              if (v2 instanceof Data_Either.Right) {
                  if (v2.value0) {
                      return Control_Monad_Eff_JQuery.display(v1);
                  };
                  return Control_Monad_Eff_JQuery.hide(v1);
              };
              throw new Error("Failed pattern match at Agrippa.Help line 20, column 3 - line 24, column 38: " + [ v2.constructor.name ]);
          })()();
          buildHelpTextForTasks(config)();
          return Control_Monad_Eff_JQuery.on("click")(helpLinkHandler(v1))(v)();
      };
  };
  exports["buildHelp"] = buildHelp;
})(PS["Agrippa.Help"] = PS["Agrippa.Help"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Maybe = PS["Data.Maybe"];
  var Global = PS["Global"];
  var Prelude = PS["Prelude"];  
  var $$isFinite = Global["isFinite"];
  var fromString = (function () {
      var check = function (num) {
          if ($$isFinite(num)) {
              return new Data_Maybe.Just(num);
          };
          if (Data_Boolean.otherwise) {
              return Data_Maybe.Nothing.value;
          };
          throw new Error("Failed pattern match at Data.Number line 45, column 5 - line 46, column 39: " + [ num.constructor.name ]);
      };
      return function ($1) {
          return check(Global.readFloat($1));
      };
  })();
  exports["fromString"] = fromString;
})(PS["Data.Number"] = PS["Data.Number"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
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
              var $34 = {};
              for (var $35 in v2) {
                  if ({}.hasOwnProperty.call(v2, $35)) {
                      $34[$35] = v2[$35];
                  };
              };
              $34.pos = v1.pos;
              return $34;
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
          return function ($83) {
              return Data_Functor.map(Data_Either.functorEither)(function (v1) {
                  return {
                      result: f(v1.result),
                      suffix: v1.suffix
                  };
              })(v($83));
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
              throw new Error("Failed pattern match at Text.Parsing.StringParser line 88, column 7 - line 88, column 70: " + [ v.constructor.name ]);
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
})(PS["Text.Parsing.StringParser"] = PS["Text.Parsing.StringParser"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_StringParser = PS["Text.Parsing.StringParser"];        
  var withError = function (p) {
      return function (msg) {
          return Control_Alt.alt(Text_Parsing_StringParser.altParser)(p)(Text_Parsing_StringParser.fail(msg));
      };
  };
  var many = Data_List.manyRec(Text_Parsing_StringParser.monadRecParser)(Text_Parsing_StringParser.alternativeParser);
  var many1 = function (p) {
      return Control_Apply.apply(Text_Parsing_StringParser.applyParser)(Data_Functor.map(Text_Parsing_StringParser.functorParser)(Data_List_Types.Cons.create)(p))(many(p));
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
})(PS["Text.Parsing.StringParser.Combinators"] = PS["Text.Parsing.StringParser.Combinators"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_StringParser = PS["Text.Parsing.StringParser"];
  var Text_Parsing_StringParser_Combinators = PS["Text.Parsing.StringParser.Combinators"];        
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
                      var $22 = {};
                      for (var $23 in accum) {
                          if ({}.hasOwnProperty.call(accum, $23)) {
                              $22[$23] = accum[$23];
                          };
                      };
                      $22.nassoc = new Data_List_Types.Cons(v.value0, accum.nassoc);
                      return $22;
                  };
                  if (v instanceof Infix && v.value1 instanceof AssocLeft) {
                      var $27 = {};
                      for (var $28 in accum) {
                          if ({}.hasOwnProperty.call(accum, $28)) {
                              $27[$28] = accum[$28];
                          };
                      };
                      $27.lassoc = new Data_List_Types.Cons(v.value0, accum.lassoc);
                      return $27;
                  };
                  if (v instanceof Infix && v.value1 instanceof AssocRight) {
                      var $32 = {};
                      for (var $33 in accum) {
                          if ({}.hasOwnProperty.call(accum, $33)) {
                              $32[$33] = accum[$33];
                          };
                      };
                      $32.rassoc = new Data_List_Types.Cons(v.value0, accum.rassoc);
                      return $32;
                  };
                  if (v instanceof Prefix) {
                      var $37 = {};
                      for (var $38 in accum) {
                          if ({}.hasOwnProperty.call(accum, $38)) {
                              $37[$38] = accum[$38];
                          };
                      };
                      $37.prefix = new Data_List_Types.Cons(v.value0, accum.prefix);
                      return $37;
                  };
                  if (v instanceof Postfix) {
                      var $41 = {};
                      for (var $42 in accum) {
                          if ({}.hasOwnProperty.call(accum, $42)) {
                              $41[$42] = accum[$42];
                          };
                      };
                      $41.postfix = new Data_List_Types.Cons(v.value0, accum.postfix);
                      return $41;
                  };
                  throw new Error("Failed pattern match at Text.Parsing.StringParser.Expr line 59, column 5 - line 59, column 68: " + [ v.constructor.name, accum.constructor.name ]);
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
                  var postfixP = Control_Alt.alt(Text_Parsing_StringParser.altParser)(postfixOp)(Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(Control_Category.id(Control_Category.categoryFn)));
                  var prefixOp = Text_Parsing_StringParser_Combinators.withError(Text_Parsing_StringParser_Combinators.choice(Data_List_Types.foldableList)(accum.prefix))("");
                  var prefixP = Control_Alt.alt(Text_Parsing_StringParser.altParser)(prefixOp)(Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(Control_Category.id(Control_Category.categoryFn)));
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
})(PS["Text.Parsing.StringParser.Expr"] = PS["Text.Parsing.StringParser.Expr"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array = PS["Data.Array"];
  var Data_Char = PS["Data.Char"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Data_String_Regex = PS["Data.String.Regex"];
  var Data_String_Regex_Flags = PS["Data.String.Regex.Flags"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_StringParser = PS["Text.Parsing.StringParser"];
  var Text_Parsing_StringParser_Combinators = PS["Text.Parsing.StringParser.Combinators"];        
  var string = function (nt) {
      return function (s) {
          if (Data_Eq.eq(Data_Maybe.eqMaybe(Data_Eq.eqInt))(Data_String["indexOf'"](nt)(s.pos)(s.str))(new Data_Maybe.Just(s.pos))) {
              return new Data_Either.Right({
                  result: nt,
                  suffix: {
                      str: s.str,
                      pos: s.pos + Data_String.length(nt) | 0
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
      var v1 = Data_String.charAt(v.pos)(v.str);
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
      throw new Error("Failed pattern match at Text.Parsing.StringParser.String line 45, column 3 - line 47, column 64: " + [ v1.constructor.name ]);
  };
  var anyDigit = Text_Parsing_StringParser["try"](Control_Bind.bind(Text_Parsing_StringParser.bindParser)(anyChar)(function (v) {
      var $39 = v >= "0" && v <= "9";
      if ($39) {
          return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(v);
      };
      return Text_Parsing_StringParser.fail("Character " + (Data_Show.show(Data_Show.showChar)(v) + " is not a digit"));
  }));
  var satisfy = function (f) {
      return Text_Parsing_StringParser["try"](Control_Bind.bind(Text_Parsing_StringParser.bindParser)(anyChar)(function (v) {
          var $43 = f(v);
          if ($43) {
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
})(PS["Text.Parsing.StringParser.String"] = PS["Text.Parsing.StringParser.String"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var Data_Either = PS["Data.Either"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Number = PS["Data.Number"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];
  var Text_Parsing_StringParser = PS["Text.Parsing.StringParser"];
  var Text_Parsing_StringParser_Combinators = PS["Text.Parsing.StringParser.Combinators"];
  var Text_Parsing_StringParser_Expr = PS["Text.Parsing.StringParser.Expr"];
  var Text_Parsing_StringParser_String = PS["Text.Parsing.StringParser.String"];        
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
  var table = [ [ new Text_Parsing_StringParser_Expr.Prefix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_String.string("-"))(ExprNeg.create)), new Text_Parsing_StringParser_Expr.Prefix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_String.string("+"))(Control_Category.id(Control_Category.categoryFn))) ], [ new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_String.string("*"))(ExprMul.create), Text_Parsing_StringParser_Expr.AssocLeft.value), new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_String.string("/"))(ExprDiv.create), Text_Parsing_StringParser_Expr.AssocLeft.value) ], [ new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_String.string("+"))(ExprAdd.create), Text_Parsing_StringParser_Expr.AssocLeft.value), new Text_Parsing_StringParser_Expr.Infix(Data_Functor.voidLeft(Text_Parsing_StringParser.functorParser)(Text_Parsing_StringParser_String.string("-"))(ExprSub.create), Text_Parsing_StringParser_Expr.AssocLeft.value) ] ];
  var exprParensParser = function (p) {
      return Text_Parsing_StringParser_Combinators.between(Text_Parsing_StringParser_String.string("("))(Text_Parsing_StringParser_String.string(")"))(p);
  };
  var exprNumParser = Control_Bind.bind(Text_Parsing_StringParser.bindParser)(Text_Parsing_StringParser_Combinators.many1(Control_Alt.alt(Text_Parsing_StringParser.altParser)(Text_Parsing_StringParser_String.anyDigit)(Text_Parsing_StringParser_String["char"]("."))))(function (v) {
      var strNum = Data_String.fromCharArray(Data_List.toUnfoldable(Data_Unfoldable.unfoldableArray)(v));
      var maybeNum = Data_Number.fromString(strNum);
      if (maybeNum instanceof Data_Maybe.Nothing) {
          return Text_Parsing_StringParser.fail("Can't parse " + (strNum + " to number."));
      };
      if (maybeNum instanceof Data_Maybe.Just) {
          return Control_Applicative.pure(Text_Parsing_StringParser.applicativeParser)(new ExprNum(maybeNum.value0));
      };
      throw new Error("Failed pattern match at Agrippa.Plugins.Calculator line 58, column 3 - line 60, column 35: " + [ maybeNum.constructor.name ]);
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
      throw new Error("Failed pattern match at Agrippa.Plugins.Calculator line 72, column 1 - line 72, column 28: " + [ v.constructor.name ]);
  };
  var evalExpr = function (v) {
      if (v instanceof Data_Either.Left) {
          return "Invalid expression.";
      };
      if (v instanceof Data_Either.Right) {
          return Data_Show.show(Data_Show.showNumber)(evalExpr$prime(v.value0));
      };
      throw new Error("Failed pattern match at Agrippa.Plugins.Calculator line 68, column 1 - line 68, column 45: " + [ v.constructor.name ]);
  };
  var calculate = function (v) {
      return function (v1) {
          return function (input) {
              return function (v2) {
                  return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode(evalExpr(parseExpr(Data_String.replaceAll(" ")("")(input)))));
              };
          };
      };
  };
  exports["calculate"] = calculate;
})(PS["Agrippa.Plugins.Calculator"] = PS["Agrippa.Plugins.Calculator"] || {});
(function(exports) {
    "use strict";

  exports.now = function () {
    return Date.now();
  };

  exports.nowOffset = function () {
    var dt = new Date();
    return dt.getTimezoneOffset();
  };
})(PS["Control.Monad.Eff.Now"] = PS["Control.Monad.Eff.Now"] || {});
(function(exports) {
    "use strict";

  var createDate = function (y, m, d) {
    var date = new Date(Date.UTC(y, m, d));
    if (y >= 0 && y < 100) {
      date.setUTCFullYear(y);
    }
    return date;
  };

  exports.canonicalDateImpl = function (ctor, y, m, d) {
    var date = createDate(y, m - 1, d);
    return ctor(date.getUTCFullYear())(date.getUTCMonth() + 1)(date.getUTCDate());
  };
})(PS["Data.Date"] = PS["Data.Date"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Char = PS["Data.Char"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
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
  var cardinality = function (dict) {
      return dict.cardinality;
  };
  exports["Enum"] = Enum;
  exports["succ"] = succ;
  exports["pred"] = pred;
  exports["BoundedEnum"] = BoundedEnum;
  exports["cardinality"] = cardinality;
  exports["toEnum"] = toEnum;
  exports["fromEnum"] = fromEnum;
})(PS["Data.Enum"] = PS["Data.Enum"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var January = (function () {
      function January() {

      };
      January.value = new January();
      return January;
  })();
  var February = (function () {
      function February() {

      };
      February.value = new February();
      return February;
  })();
  var March = (function () {
      function March() {

      };
      March.value = new March();
      return March;
  })();
  var April = (function () {
      function April() {

      };
      April.value = new April();
      return April;
  })();
  var May = (function () {
      function May() {

      };
      May.value = new May();
      return May;
  })();
  var June = (function () {
      function June() {

      };
      June.value = new June();
      return June;
  })();
  var July = (function () {
      function July() {

      };
      July.value = new July();
      return July;
  })();
  var August = (function () {
      function August() {

      };
      August.value = new August();
      return August;
  })();
  var September = (function () {
      function September() {

      };
      September.value = new September();
      return September;
  })();
  var October = (function () {
      function October() {

      };
      October.value = new October();
      return October;
  })();
  var November = (function () {
      function November() {

      };
      November.value = new November();
      return November;
  })();
  var December = (function () {
      function December() {

      };
      December.value = new December();
      return December;
  })();
  var ordYear = Data_Ord.ordInt;
  var ordDay = Data_Ord.ordInt;
  var eqMonth = new Data_Eq.Eq(function (x) {
      return function (y) {
          if (x instanceof January && y instanceof January) {
              return true;
          };
          if (x instanceof February && y instanceof February) {
              return true;
          };
          if (x instanceof March && y instanceof March) {
              return true;
          };
          if (x instanceof April && y instanceof April) {
              return true;
          };
          if (x instanceof May && y instanceof May) {
              return true;
          };
          if (x instanceof June && y instanceof June) {
              return true;
          };
          if (x instanceof July && y instanceof July) {
              return true;
          };
          if (x instanceof August && y instanceof August) {
              return true;
          };
          if (x instanceof September && y instanceof September) {
              return true;
          };
          if (x instanceof October && y instanceof October) {
              return true;
          };
          if (x instanceof November && y instanceof November) {
              return true;
          };
          if (x instanceof December && y instanceof December) {
              return true;
          };
          return false;
      };
  });
  var ordMonth = new Data_Ord.Ord(function () {
      return eqMonth;
  }, function (x) {
      return function (y) {
          if (x instanceof January && y instanceof January) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof January) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof January) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof February && y instanceof February) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof February) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof February) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof March && y instanceof March) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof March) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof March) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof April && y instanceof April) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof April) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof April) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof May && y instanceof May) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof May) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof May) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof June && y instanceof June) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof June) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof June) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof July && y instanceof July) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof July) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof July) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof August && y instanceof August) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof August) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof August) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof September && y instanceof September) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof September) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof September) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof October && y instanceof October) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof October) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof October) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof November && y instanceof November) {
              return Data_Ordering.EQ.value;
          };
          if (x instanceof November) {
              return Data_Ordering.LT.value;
          };
          if (y instanceof November) {
              return Data_Ordering.GT.value;
          };
          if (x instanceof December && y instanceof December) {
              return Data_Ordering.EQ.value;
          };
          throw new Error("Failed pattern match at Data.Date.Component line 63, column 8 - line 63, column 38: " + [ x.constructor.name, y.constructor.name ]);
      };
  });                       
  var boundedYear = new Data_Bounded.Bounded(function () {
      return ordYear;
  }, -271820 | 0, 275759);       
  var boundedMonth = new Data_Bounded.Bounded(function () {
      return ordMonth;
  }, January.value, December.value);
  var boundedEnumYear = new Data_Enum.BoundedEnum(function () {
      return boundedYear;
  }, function () {
      return enumYear;
  }, 547580, function (v) {
      return v;
  }, function (n) {
      if (n >= (-271821 | 0) && n <= 275759) {
          return new Data_Maybe.Just(n);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.Nothing.value;
      };
      throw new Error("Failed pattern match at Data.Date.Component line 37, column 1 - line 37, column 45: " + [ n.constructor.name ]);
  });
  var enumYear = new Data_Enum.Enum(function () {
      return ordYear;
  }, function ($110) {
      return Data_Enum.toEnum(boundedEnumYear)((function (v) {
          return v - 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumYear)($110)));
  }, function ($111) {
      return Data_Enum.toEnum(boundedEnumYear)((function (v) {
          return v + 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumYear)($111)));
  });
  var boundedEnumMonth = new Data_Enum.BoundedEnum(function () {
      return boundedMonth;
  }, function () {
      return enumMonth;
  }, 12, function (v) {
      if (v instanceof January) {
          return 1;
      };
      if (v instanceof February) {
          return 2;
      };
      if (v instanceof March) {
          return 3;
      };
      if (v instanceof April) {
          return 4;
      };
      if (v instanceof May) {
          return 5;
      };
      if (v instanceof June) {
          return 6;
      };
      if (v instanceof July) {
          return 7;
      };
      if (v instanceof August) {
          return 8;
      };
      if (v instanceof September) {
          return 9;
      };
      if (v instanceof October) {
          return 10;
      };
      if (v instanceof November) {
          return 11;
      };
      if (v instanceof December) {
          return 12;
      };
      throw new Error("Failed pattern match at Data.Date.Component line 90, column 14 - line 104, column 1: " + [ v.constructor.name ]);
  }, function (v) {
      if (v === 1) {
          return new Data_Maybe.Just(January.value);
      };
      if (v === 2) {
          return new Data_Maybe.Just(February.value);
      };
      if (v === 3) {
          return new Data_Maybe.Just(March.value);
      };
      if (v === 4) {
          return new Data_Maybe.Just(April.value);
      };
      if (v === 5) {
          return new Data_Maybe.Just(May.value);
      };
      if (v === 6) {
          return new Data_Maybe.Just(June.value);
      };
      if (v === 7) {
          return new Data_Maybe.Just(July.value);
      };
      if (v === 8) {
          return new Data_Maybe.Just(August.value);
      };
      if (v === 9) {
          return new Data_Maybe.Just(September.value);
      };
      if (v === 10) {
          return new Data_Maybe.Just(October.value);
      };
      if (v === 11) {
          return new Data_Maybe.Just(November.value);
      };
      if (v === 12) {
          return new Data_Maybe.Just(December.value);
      };
      return Data_Maybe.Nothing.value;
  });
  var enumMonth = new Data_Enum.Enum(function () {
      return ordMonth;
  }, function ($114) {
      return Data_Enum.toEnum(boundedEnumMonth)((function (v) {
          return v - 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumMonth)($114)));
  }, function ($115) {
      return Data_Enum.toEnum(boundedEnumMonth)((function (v) {
          return v + 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumMonth)($115)));
  });
  var boundedDay = new Data_Bounded.Bounded(function () {
      return ordDay;
  }, 1, 31);
  var boundedEnumDay = new Data_Enum.BoundedEnum(function () {
      return boundedDay;
  }, function () {
      return enumDay;
  }, 31, function (v) {
      return v;
  }, function (n) {
      if (n >= 1 && n <= 31) {
          return new Data_Maybe.Just(n);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.Nothing.value;
      };
      throw new Error("Failed pattern match at Data.Date.Component line 137, column 1 - line 137, column 43: " + [ n.constructor.name ]);
  });
  var enumDay = new Data_Enum.Enum(function () {
      return ordDay;
  }, function ($116) {
      return Data_Enum.toEnum(boundedEnumDay)((function (v) {
          return v - 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumDay)($116)));
  }, function ($117) {
      return Data_Enum.toEnum(boundedEnumDay)((function (v) {
          return v + 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumDay)($117)));
  });
  exports["January"] = January;
  exports["February"] = February;
  exports["March"] = March;
  exports["April"] = April;
  exports["May"] = May;
  exports["June"] = June;
  exports["July"] = July;
  exports["August"] = August;
  exports["September"] = September;
  exports["October"] = October;
  exports["November"] = November;
  exports["December"] = December;
  exports["ordYear"] = ordYear;
  exports["boundedYear"] = boundedYear;
  exports["enumYear"] = enumYear;
  exports["boundedEnumYear"] = boundedEnumYear;
  exports["eqMonth"] = eqMonth;
  exports["ordMonth"] = ordMonth;
  exports["boundedMonth"] = boundedMonth;
  exports["enumMonth"] = enumMonth;
  exports["boundedEnumMonth"] = boundedEnumMonth;
  exports["ordDay"] = ordDay;
  exports["boundedDay"] = boundedDay;
  exports["enumDay"] = enumDay;
  exports["boundedEnumDay"] = boundedEnumDay;
})(PS["Data.Date.Component"] = PS["Data.Date.Component"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Date"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Date_Component = PS["Data.Date.Component"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var $$Date = (function () {
      function $$Date(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      $$Date.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new $$Date(value0, value1, value2);
              };
          };
      };
      return $$Date;
  })();
  var year = function (v) {
      return v.value0;
  }; 
  var month = function (v) {
      return v.value1;
  };
  var day = function (v) {
      return v.value2;
  };
  var canonicalDate = function (y) {
      return function (m) {
          return function (d) {
              var mkDate = function (y$prime) {
                  return function (m$prime) {
                      return function (d$prime) {
                          return new $$Date(y$prime, Data_Maybe.fromJust()(Data_Enum.toEnum(Data_Date_Component.boundedEnumMonth)(m$prime)), d$prime);
                      };
                  };
              };
              return $foreign.canonicalDateImpl(mkDate, y, Data_Enum.fromEnum(Data_Date_Component.boundedEnumMonth)(m), d);
          };
      };
  };
  exports["canonicalDate"] = canonicalDate;
  exports["year"] = year;
  exports["month"] = month;
  exports["day"] = day;
})(PS["Data.Date"] = PS["Data.Date"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var ordSecond = Data_Ord.ordInt;
  var ordMinute = Data_Ord.ordInt;
  var ordMillisecond = Data_Ord.ordInt;
  var ordHour = Data_Ord.ordInt;
  var boundedSecond = new Data_Bounded.Bounded(function () {
      return ordSecond;
  }, 0, 59);
  var boundedMinute = new Data_Bounded.Bounded(function () {
      return ordMinute;
  }, 0, 59);
  var boundedMillisecond = new Data_Bounded.Bounded(function () {
      return ordMillisecond;
  }, 0, 999);
  var boundedHour = new Data_Bounded.Bounded(function () {
      return ordHour;
  }, 0, 23);
  var boundedEnumSecond = new Data_Enum.BoundedEnum(function () {
      return boundedSecond;
  }, function () {
      return enumSecond;
  }, 60, function (v) {
      return v;
  }, function (n) {
      if (n >= 0 && n <= 59) {
          return new Data_Maybe.Just(n);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.Nothing.value;
      };
      throw new Error("Failed pattern match at Data.Time.Component line 94, column 1 - line 94, column 49: " + [ n.constructor.name ]);
  });
  var enumSecond = new Data_Enum.Enum(function () {
      return ordSecond;
  }, function ($64) {
      return Data_Enum.toEnum(boundedEnumSecond)((function (v) {
          return v - 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumSecond)($64)));
  }, function ($65) {
      return Data_Enum.toEnum(boundedEnumSecond)((function (v) {
          return v + 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumSecond)($65)));
  });
  var boundedEnumMinute = new Data_Enum.BoundedEnum(function () {
      return boundedMinute;
  }, function () {
      return enumMinute;
  }, 60, function (v) {
      return v;
  }, function (n) {
      if (n >= 0 && n <= 59) {
          return new Data_Maybe.Just(n);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.Nothing.value;
      };
      throw new Error("Failed pattern match at Data.Time.Component line 64, column 1 - line 64, column 49: " + [ n.constructor.name ]);
  });
  var enumMinute = new Data_Enum.Enum(function () {
      return ordMinute;
  }, function ($66) {
      return Data_Enum.toEnum(boundedEnumMinute)((function (v) {
          return v - 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumMinute)($66)));
  }, function ($67) {
      return Data_Enum.toEnum(boundedEnumMinute)((function (v) {
          return v + 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumMinute)($67)));
  });
  var boundedEnumMillisecond = new Data_Enum.BoundedEnum(function () {
      return boundedMillisecond;
  }, function () {
      return enumMillisecond;
  }, 1000, function (v) {
      return v;
  }, function (n) {
      if (n >= 0 && n <= 999) {
          return new Data_Maybe.Just(n);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.Nothing.value;
      };
      throw new Error("Failed pattern match at Data.Time.Component line 125, column 1 - line 125, column 59: " + [ n.constructor.name ]);
  });
  var enumMillisecond = new Data_Enum.Enum(function () {
      return ordMillisecond;
  }, function ($68) {
      return Data_Enum.toEnum(boundedEnumMillisecond)((function (v) {
          return v - 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumMillisecond)($68)));
  }, function ($69) {
      return Data_Enum.toEnum(boundedEnumMillisecond)((function (v) {
          return v + 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumMillisecond)($69)));
  });
  var boundedEnumHour = new Data_Enum.BoundedEnum(function () {
      return boundedHour;
  }, function () {
      return enumHour;
  }, 24, function (v) {
      return v;
  }, function (n) {
      if (n >= 0 && n <= 23) {
          return new Data_Maybe.Just(n);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.Nothing.value;
      };
      throw new Error("Failed pattern match at Data.Time.Component line 34, column 1 - line 34, column 45: " + [ n.constructor.name ]);
  });
  var enumHour = new Data_Enum.Enum(function () {
      return ordHour;
  }, function ($70) {
      return Data_Enum.toEnum(boundedEnumHour)((function (v) {
          return v - 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumHour)($70)));
  }, function ($71) {
      return Data_Enum.toEnum(boundedEnumHour)((function (v) {
          return v + 1 | 0;
      })(Data_Enum.fromEnum(boundedEnumHour)($71)));
  });
  exports["ordHour"] = ordHour;
  exports["boundedHour"] = boundedHour;
  exports["enumHour"] = enumHour;
  exports["boundedEnumHour"] = boundedEnumHour;
  exports["ordMinute"] = ordMinute;
  exports["boundedMinute"] = boundedMinute;
  exports["enumMinute"] = enumMinute;
  exports["boundedEnumMinute"] = boundedEnumMinute;
  exports["ordSecond"] = ordSecond;
  exports["boundedSecond"] = boundedSecond;
  exports["enumSecond"] = enumSecond;
  exports["boundedEnumSecond"] = boundedEnumSecond;
  exports["ordMillisecond"] = ordMillisecond;
  exports["boundedMillisecond"] = boundedMillisecond;
  exports["enumMillisecond"] = enumMillisecond;
  exports["boundedEnumMillisecond"] = boundedEnumMillisecond;
})(PS["Data.Time.Component"] = PS["Data.Time.Component"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Int = PS["Data.Int"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Time_Component = PS["Data.Time.Component"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var $$Math = PS["Math"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var Time = (function () {
      function Time(value0, value1, value2, value3) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
          this.value3 = value3;
      };
      Time.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return function (value3) {
                      return new Time(value0, value1, value2, value3);
                  };
              };
          };
      };
      return Time;
  })();
  var second = function (v) {
      return v.value2;
  };
  var minute = function (v) {
      return v.value1;
  };
  var millisecond = function (v) {
      return v.value3;
  };
  var hour = function (v) {
      return v.value0;
  };
  exports["Time"] = Time;
  exports["hour"] = hour;
  exports["minute"] = minute;
  exports["second"] = second;
  exports["millisecond"] = millisecond;
})(PS["Data.Time"] = PS["Data.Time"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.DateTime"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Date = PS["Data.Date"];
  var Data_Date_Component = PS["Data.Date.Component"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Time = PS["Data.Time"];
  var Data_Time_Component = PS["Data.Time.Component"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var DateTime = (function () {
      function DateTime(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      DateTime.create = function (value0) {
          return function (value1) {
              return new DateTime(value0, value1);
          };
      };
      return DateTime;
  })();
  exports["DateTime"] = DateTime;
})(PS["Data.DateTime"] = PS["Data.DateTime"] || {});
(function(exports) {
    "use strict";

  exports.toDateTimeImpl = function (ctor) {
    return function (instant) {
      var dt = new Date(instant);
      return ctor (dt.getUTCFullYear())(dt.getUTCMonth() + 1)(dt.getUTCDate())(dt.getUTCHours())(dt.getUTCMinutes())(dt.getUTCSeconds())(dt.getUTCMilliseconds());
    };
  };
})(PS["Data.DateTime.Instant"] = PS["Data.DateTime.Instant"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.DateTime.Instant"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Date = PS["Data.Date"];
  var Data_Date_Component = PS["Data.Date.Component"];
  var Data_DateTime = PS["Data.DateTime"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Time = PS["Data.Time"];
  var Data_Time_Component = PS["Data.Time.Component"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  var toDateTime = (function () {
      var mkDateTime = function (y) {
          return function (mo) {
              return function (d) {
                  return function (h) {
                      return function (mi) {
                          return function (s) {
                              return function (ms) {
                                  return new Data_DateTime.DateTime(Data_Date.canonicalDate(y)(Data_Maybe.fromJust()(Data_Enum.toEnum(Data_Date_Component.boundedEnumMonth)(mo)))(d), new Data_Time.Time(h, mi, s, ms));
                              };
                          };
                      };
                  };
              };
          };
      };
      return $foreign.toDateTimeImpl(mkDateTime);
  })();
  exports["toDateTime"] = toDateTime;
})(PS["Data.DateTime.Instant"] = PS["Data.DateTime.Instant"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Data_DateTime = PS["Data.DateTime"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Locale = (function () {
      function Locale(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Locale.create = function (value0) {
          return function (value1) {
              return new Locale(value0, value1);
          };
      };
      return Locale;
  })();
  var LocalValue = (function () {
      function LocalValue(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      LocalValue.create = function (value0) {
          return function (value1) {
              return new LocalValue(value0, value1);
          };
      };
      return LocalValue;
  })();
  exports["Locale"] = Locale;
  exports["LocalValue"] = LocalValue;
})(PS["Data.DateTime.Locale"] = PS["Data.DateTime.Locale"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Now"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_DateTime = PS["Data.DateTime"];
  var Data_DateTime_Instant = PS["Data.DateTime.Instant"];
  var Data_DateTime_Locale = PS["Data.DateTime.Locale"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Prelude = PS["Prelude"];        
  var locale = Data_Functor.map(Control_Monad_Eff.functorEff)(Data_DateTime_Locale.Locale.create(Data_Maybe.Nothing.value))($foreign.nowOffset);
  var nowDateTime = Control_Apply.apply(Control_Monad_Eff.applyEff)(Data_Functor.map(Control_Monad_Eff.functorEff)(Data_DateTime_Locale.LocalValue.create)(locale))(Data_Functor.map(Control_Monad_Eff.functorEff)(Data_DateTime_Instant.toDateTime)($foreign.now));
  exports["nowDateTime"] = nowDateTime;
  exports["locale"] = locale;
})(PS["Control.Monad.Eff.Now"] = PS["Control.Monad.Eff.Now"] || {});
(function(exports) {
  /* global exports */
  "use strict";

  exports.jsdate = function (parts) {
    var t = Date.UTC(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond);
    return new Date(t);
  };

  exports.dateMethod = function (method, date) {
    return date[method]();
  };
})(PS["Data.JSDate"] = PS["Data.JSDate"] || {});
(function(exports) {
    "use strict";

  exports.error = function (msg) {
    return new Error(msg);
  };
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Exception"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];
  exports["error"] = $foreign.error;
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.JSDate"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Date = PS["Data.Date"];
  var Data_Date_Component = PS["Data.Date.Component"];
  var Data_DateTime = PS["Data.DateTime"];
  var Data_DateTime_Instant = PS["Data.DateTime.Instant"];
  var Data_Enum = PS["Data.Enum"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Int = PS["Data.Int"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Time = PS["Data.Time"];
  var Data_Time_Component = PS["Data.Time.Component"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Prelude = PS["Prelude"];
  var toTimeString = function (dt) {
      return $foreign.dateMethod("toTimeString", dt);
  };                                                                                                                                                
  var toDateString = function (dt) {
      return $foreign.dateMethod("toDateString", dt);
  };
  var fromDateTime = function (v) {
      return $foreign.jsdate({
          year: Data_Int.toNumber(Data_Enum.fromEnum(Data_Date_Component.boundedEnumYear)(Data_Date.year(v.value0))),
          month: Data_Int.toNumber(Data_Enum.fromEnum(Data_Date_Component.boundedEnumMonth)(Data_Date.month(v.value0)) - 1 | 0),
          day: Data_Int.toNumber(Data_Enum.fromEnum(Data_Date_Component.boundedEnumDay)(Data_Date.day(v.value0))),
          hour: Data_Int.toNumber(Data_Enum.fromEnum(Data_Time_Component.boundedEnumHour)(Data_Time.hour(v.value1))),
          minute: Data_Int.toNumber(Data_Enum.fromEnum(Data_Time_Component.boundedEnumMinute)(Data_Time.minute(v.value1))),
          second: Data_Int.toNumber(Data_Enum.fromEnum(Data_Time_Component.boundedEnumSecond)(Data_Time.second(v.value1))),
          millisecond: Data_Int.toNumber(Data_Enum.fromEnum(Data_Time_Component.boundedEnumMillisecond)(Data_Time.millisecond(v.value1)))
      });
  };
  exports["fromDateTime"] = fromDateTime;
  exports["toDateString"] = toDateString;
  exports["toTimeString"] = toTimeString;
})(PS["Data.JSDate"] = PS["Data.JSDate"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var Control_Monad_Eff_Now = PS["Control.Monad.Eff.Now"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var Data_DateTime_Locale = PS["Data.DateTime.Locale"];
  var Data_Functor = PS["Data.Functor"];
  var Data_JSDate = PS["Data.JSDate"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Prelude = PS["Prelude"];        
  var showTime = function (v) {
      return function (v1) {
          return function (v2) {
              return function (v3) {
                  return function __do() {
                      var v4 = Control_Monad_Eff_Now.nowDateTime();
                      return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode((function (jsDate) {
                          return Data_JSDate.toTimeString(jsDate) + (" " + Data_JSDate.toDateString(jsDate));
                      })(Data_JSDate.fromDateTime(v4.value1))))();
                  };
              };
          };
      };
  };
  exports["showTime"] = showTime;
})(PS["Agrippa.Plugins.Clock"] = PS["Agrippa.Plugins.Clock"] || {});
(function(exports) {
    "use strict";

  exports.shortcutHandler = function (openUrl) {
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
(function(exports) {
  /* globals setTimeout, clearTimeout, setImmediate, clearImmediate */
  "use strict";

  exports._makeAff = function (cb) {
    return function (success, error) {
      try {
        return cb(function (e) {
          return function () {
            error(e);
          };
        })(function (v) {
          return function () {
            success(v);
          };
        })();
      } catch (err) {
        error(err);
      }
    };
  };

  exports._pure = function (nonCanceler, v) {
    return function (success) {
      success(v);
      return nonCanceler;
    };
  };

  exports._fmap = function (f, aff) {
    return function (success, error) {
      return aff(function (v) {
        success(f(v));
      }, error);
    };
  };

  exports._bind = function (alwaysCanceler, aff, f) {
    return function (success, error) {
      var canceler1, canceler2;

      var isCanceled    = false;
      var requestCancel = false;

      var onCanceler = function () {};

      canceler1 = aff(function (v) {
        if (requestCancel) {
          isCanceled = true;

          return alwaysCanceler;
        } else {
          canceler2 = f(v)(success, error);

          onCanceler(canceler2);

          return canceler2;
        }
      }, error);

      return function (e) {
        return function (s, f) {
          requestCancel = true;

          if (canceler2 !== undefined) {
            return canceler2(e)(s, f);
          } else {
            return canceler1(e)(function (bool) {
              if (bool || isCanceled) {
                s(true);
              } else {
                onCanceler = function (canceler) {
                  canceler(e)(s, f);
                };
              }
            }, f);
          }
        };
      };
    };
  };

  exports._runAff = function (errorT, successT, aff) {
    // If errorT or successT throw, and an Aff is comprised only of synchronous
    // effects, then it's possible for makeAff/liftEff to accidentally catch
    // it, which may end up rerunning the Aff depending on error recovery
    // behavior. To mitigate this, we observe synchronicity using mutation. If
    // an Aff is observed to be synchronous, we let the stack reset and run the
    // handlers outside of the normal callback flow.
    return function () {
      var status = 0;
      var result, success;

      var canceler = aff(function (v) {
        if (status === 2) {
          successT(v)();
        } else {
          status = 1;
          result = v;
          success = true;
        }
      }, function (e) {
        if (status === 2) {
          errorT(e)();
        } else {
          status = 1;
          result = e;
          success = false;
        }
      });

      if (status === 1) {
        if (success) {
          successT(result)();
        } else {
          errorT(result)();
        }
      } else {
        status = 2;
      }

      return canceler;
    };
  };
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Aff"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Aff_Internal = PS["Control.Monad.Aff.Internal"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var runAff = function (ex) {
      return function (f) {
          return function (aff) {
              return $foreign._runAff(ex, f, aff);
          };
      };
  };         
  var makeAff$prime = function (h) {
      return $foreign._makeAff(h);
  };
  var functorAff = new Data_Functor.Functor(function (f) {
      return function (fa) {
          return $foreign._fmap(f, fa);
      };
  });
  var applyAff = new Control_Apply.Apply(function () {
      return functorAff;
  }, function (ff) {
      return function (fa) {
          return $foreign._bind(alwaysCanceler, ff, function (f) {
              return Data_Functor.map(functorAff)(f)(fa);
          });
      };
  });
  var applicativeAff = new Control_Applicative.Applicative(function () {
      return applyAff;
  }, function (v) {
      return $foreign._pure(nonCanceler, v);
  });
  var nonCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(false));
  var alwaysCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(true));
  var makeAff = function (h) {
      return makeAff$prime(function (e) {
          return function (a) {
              return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Function["const"](nonCanceler))(h(e)(a));
          };
      });
  };
  exports["makeAff"] = makeAff;
  exports["makeAff'"] = makeAff$prime;
  exports["nonCanceler"] = nonCanceler;
  exports["runAff"] = runAff;
  exports["functorAff"] = functorAff;
  exports["applyAff"] = applyAff;
  exports["applicativeAff"] = applicativeAff;
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
  /* global exports */
  /* global XMLHttpRequest */
  /* global module */
  /* global process */
  "use strict";

  // module Network.HTTP.Affjax

  // jshint maxparams: 5
  exports._ajax = function (mkHeader, options, canceler, errback, callback) {
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

    return function () {
      var xhr = platformSpecific.newXHR();
      var fixedUrl = platformSpecific.fixupUrl(options.url);
      xhr.open(options.method || "GET", fixedUrl, true, options.username, options.password);
      if (options.headers) {
        try {
          for (var i = 0, header; (header = options.headers[i]) != null; i++) {
            xhr.setRequestHeader(header.field, header.value);
          }
        }
        catch (e) {
          errback(e)();
        }
      }
      xhr.onerror = function () {
        errback(new Error("AJAX request failed: " + options.method + " " + options.url))();
      };
      xhr.onload = function () {
        callback({
          status: xhr.status,
          headers: xhr.getAllResponseHeaders().split("\r\n")
            .filter(function (header) {
              return header.length > 0;
            })
            .map(function (header) {
              var i = header.indexOf(":");
              return mkHeader(header.substring(0, i))(header.substring(i + 2));
            }),
          response: platformSpecific.getResponse(xhr)
        })();
      };
      xhr.responseType = options.responseType;
      xhr.withCredentials = options.withCredentials;
      xhr.send(options.content);
      return canceler(xhr);
    };
  };

  // jshint maxparams: 4
  exports._cancelAjax = function (xhr, cancelError, errback, callback) {
    return function () {
      try { xhr.abort(); } catch (e) { return callback(false)(); }
      return callback(true)();
    };
  };
})(PS["Network.HTTP.Affjax"] = PS["Network.HTTP.Affjax"] || {});
(function(exports) {
    "use strict";

  exports.newRef = function (val) {
    return function () {
      return { value: val };
    };
  };

  exports.readRef = function (ref) {
    return function () {
      return ref.value;
    };
  };

  exports.writeRef = function (ref) {
    return function (val) {
      return function () {
        ref.value = val;
        return {};
      };
    };
  };
})(PS["Control.Monad.Eff.Ref"] = PS["Control.Monad.Eff.Ref"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  exports["newRef"] = $foreign.newRef;
  exports["readRef"] = $foreign.readRef;
  exports["writeRef"] = $foreign.writeRef;
})(PS["Control.Monad.Eff.Ref"] = PS["Control.Monad.Eff.Ref"] || {});
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Argonaut.Parser"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_Either = PS["Data.Either"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];        
  var jsonParser = function (j) {
      return $foreign._jsonParser(Data_Either.Left.create, Data_Either.Right.create, j);
  };
  exports["jsonParser"] = jsonParser;
})(PS["Data.Argonaut.Parser"] = PS["Data.Argonaut.Parser"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
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
      throw new Error("Failed pattern match at Data.HTTP.Method line 42, column 1 - line 42, column 35: " + [ v.constructor.name ]);
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
})(PS["Data.HTTP.Method"] = PS["Data.HTTP.Method"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var MediaType = function (x) {
      return x;
  }; 
  var newtypeMediaType = new Data_Newtype.Newtype(function (n) {
      return n;
  }, MediaType);
  exports["MediaType"] = MediaType;
  exports["newtypeMediaType"] = newtypeMediaType;
})(PS["Data.MediaType"] = PS["Data.MediaType"] || {});
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Nullable"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var toNullable = Data_Maybe.maybe($foreign["null"])($foreign.notNull);
  var toMaybe = function (n) {
      return $foreign.nullable(n, Data_Maybe.Nothing.value, Data_Maybe.Just.create);
  };
  exports["toMaybe"] = toMaybe;
  exports["toNullable"] = toNullable;
})(PS["Data.Nullable"] = PS["Data.Nullable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_MediaType = PS["Data.MediaType"];           
  var applicationJSON = "application/json";
  exports["applicationJSON"] = applicationJSON;
})(PS["Data.MediaType.Common"] = PS["Data.MediaType.Common"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_File_Types = PS["DOM.File.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var DOM_XHR_Types = PS["DOM.XHR.Types"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_ArrayBuffer_Types = PS["Data.ArrayBuffer.Types"];
  var Data_FormURLEncoded = PS["Data.FormURLEncoded"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_MediaType_Common = PS["Data.MediaType.Common"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var Requestable = function (toRequest) {
      this.toRequest = toRequest;
  };
  var toRequest = function (dict) {
      return dict.toRequest;
  };
  var requestableJson = new Requestable(function (json) {
      return new Data_Tuple.Tuple(new Data_Maybe.Just(Data_MediaType_Common.applicationJSON), Data_Show.show(Data_Argonaut_Core.showJson)(json));
  });
  var defaultToRequest = function ($0) {
      return Data_Tuple.Tuple.create(Data_Maybe.Nothing.value)($0);
  };                                                                   
  var requestableUnit = new Requestable(defaultToRequest);
  exports["Requestable"] = Requestable;
  exports["toRequest"] = toRequest;
  exports["requestableJson"] = requestableJson;
  exports["requestableUnit"] = requestableUnit;
})(PS["Network.HTTP.Affjax.Request"] = PS["Network.HTTP.Affjax.Request"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_File_Types = PS["DOM.File.Types"];
  var DOM_Node_Types = PS["DOM.Node.Types"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_ArrayBuffer_Types = PS["Data.ArrayBuffer.Types"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_MediaType_Common = PS["Data.MediaType.Common"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var ArrayBufferResponse = (function () {
      function ArrayBufferResponse() {

      };
      ArrayBufferResponse.value = new ArrayBufferResponse();
      return ArrayBufferResponse;
  })();
  var BlobResponse = (function () {
      function BlobResponse() {

      };
      BlobResponse.value = new BlobResponse();
      return BlobResponse;
  })();
  var DocumentResponse = (function () {
      function DocumentResponse() {

      };
      DocumentResponse.value = new DocumentResponse();
      return DocumentResponse;
  })();
  var JSONResponse = (function () {
      function JSONResponse() {

      };
      JSONResponse.value = new JSONResponse();
      return JSONResponse;
  })();
  var StringResponse = (function () {
      function StringResponse() {

      };
      StringResponse.value = new StringResponse();
      return StringResponse;
  })();
  var Respondable = function (fromResponse, responseType) {
      this.fromResponse = fromResponse;
      this.responseType = responseType;
  }; 
  var responseTypeToString = function (v) {
      if (v instanceof ArrayBufferResponse) {
          return "arraybuffer";
      };
      if (v instanceof BlobResponse) {
          return "blob";
      };
      if (v instanceof DocumentResponse) {
          return "document";
      };
      if (v instanceof JSONResponse) {
          return "text";
      };
      if (v instanceof StringResponse) {
          return "text";
      };
      throw new Error("Failed pattern match at Network.HTTP.Affjax.Response line 48, column 1 - line 48, column 61: " + [ v.constructor.name ]);
  };
  var responseType = function (dict) {
      return dict.responseType;
  };
  var responsableUnit = new Respondable(Data_Function["const"](Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Unit.unit)), new Data_Tuple.Tuple(Data_Maybe.Nothing.value, StringResponse.value));
  var responsableJson = new Respondable(function ($8) {
      return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($8);
  }, new Data_Tuple.Tuple(new Data_Maybe.Just(Data_MediaType_Common.applicationJSON), JSONResponse.value));                                                             
  var fromResponse = function (dict) {
      return dict.fromResponse;
  };
  exports["ArrayBufferResponse"] = ArrayBufferResponse;
  exports["BlobResponse"] = BlobResponse;
  exports["DocumentResponse"] = DocumentResponse;
  exports["JSONResponse"] = JSONResponse;
  exports["StringResponse"] = StringResponse;
  exports["responseTypeToString"] = responseTypeToString;
  exports["Respondable"] = Respondable;
  exports["responseType"] = responseType;
  exports["fromResponse"] = fromResponse;
  exports["responsableUnit"] = responsableUnit;
  exports["responsableJson"] = responsableJson;
})(PS["Network.HTTP.Affjax.Response"] = PS["Network.HTTP.Affjax.Response"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
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
      throw new Error("Failed pattern match at Network.HTTP.RequestHeader line 29, column 1 - line 29, column 46: " + [ v.constructor.name ]);
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
      throw new Error("Failed pattern match at Network.HTTP.RequestHeader line 24, column 1 - line 24, column 45: " + [ v.constructor.name ]);
  };
  exports["Accept"] = Accept;
  exports["ContentType"] = ContentType;
  exports["RequestHeader"] = RequestHeader;
  exports["requestHeaderName"] = requestHeaderName;
  exports["requestHeaderValue"] = requestHeaderValue;
})(PS["Network.HTTP.RequestHeader"] = PS["Network.HTTP.RequestHeader"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Generic = PS["Data.Generic"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
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
})(PS["Network.HTTP.ResponseHeader"] = PS["Network.HTTP.ResponseHeader"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Network.HTTP.Affjax"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM_XHR_Types = PS["DOM.XHR.Types"];
  var Data_Argonaut_Parser = PS["Data.Argonaut.Parser"];
  var Data_Array = PS["Data.Array"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HTTP_Method = PS["Data.HTTP.Method"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Int = PS["Data.Int"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_MediaType = PS["Data.MediaType"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Time_Duration = PS["Data.Time.Duration"];
  var Data_Tuple = PS["Data.Tuple"];
  var $$Math = PS["Math"];
  var Network_HTTP_Affjax_Request = PS["Network.HTTP.Affjax.Request"];
  var Network_HTTP_Affjax_Response = PS["Network.HTTP.Affjax.Response"];
  var Network_HTTP_RequestHeader = PS["Network.HTTP.RequestHeader"];
  var Network_HTTP_ResponseHeader = PS["Network.HTTP.ResponseHeader"];
  var Network_HTTP_StatusCode = PS["Network.HTTP.StatusCode"];
  var Prelude = PS["Prelude"];
  var defaultRequest = {
      method: new Data_Either.Left(Data_HTTP_Method.GET.value),
      url: "/",
      headers: [  ],
      content: Data_Maybe.Nothing.value,
      username: Data_Maybe.Nothing.value,
      password: Data_Maybe.Nothing.value,
      withCredentials: false
  };
  var cancelAjax = function (xhr) {
      return function (err) {
          return Control_Monad_Aff.makeAff(function (eb) {
              return function (cb) {
                  return $foreign._cancelAjax(xhr, err, eb, cb);
              };
          });
      };
  };
  var affjax$prime = function (dictRequestable) {
      return function (dictRespondable) {
          return function (req) {
              return function (eb) {
                  return function (cb) {
                      var responseSettings = Network_HTTP_Affjax_Response.responseType(dictRespondable);
                      var requestSettings = (function () {
                          var v = Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_Affjax_Request.toRequest(dictRequestable))(req.content);
                          if (v instanceof Data_Maybe.Nothing) {
                              return new Data_Tuple.Tuple(Data_Maybe.Nothing.value, Data_Maybe.Nothing.value);
                          };
                          if (v instanceof Data_Maybe.Just) {
                              return new Data_Tuple.Tuple(v.value0.value0, new Data_Maybe.Just(v.value0.value1));
                          };
                          throw new Error("Failed pattern match at Network.HTTP.Affjax line 262, column 21 - line 264, column 49: " + [ v.constructor.name ]);
                      })();
                      var parseJSON = function ($105) {
                          return Data_Either.either(function ($106) {
                              return Data_Foreign.fail(Data_Foreign.JSONError.create($106));
                          })(function ($107) {
                              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Foreign.toForeign($107));
                          })(Data_Argonaut_Parser.jsonParser($105));
                      };
                      var fromResponse$prime = (function () {
                          var v = Data_Tuple.snd(responseSettings);
                          if (v instanceof Network_HTTP_Affjax_Response.JSONResponse) {
                              return Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Network_HTTP_Affjax_Response.fromResponse(dictRespondable))(Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(parseJSON)(Data_Foreign.readString));
                          };
                          return Network_HTTP_Affjax_Response.fromResponse(dictRespondable);
                      })();
                      var cb$prime = function (res) {
                          var v = Data_Functor.map(Data_Either.functorEither)(function (v1) {
                              var $72 = {};
                              for (var $73 in res) {
                                  if ({}.hasOwnProperty.call(res, $73)) {
                                      $72[$73] = res[$73];
                                  };
                              };
                              $72.response = v1;
                              return $72;
                          })(Control_Monad_Except.runExcept(fromResponse$prime(res.response)));
                          if (v instanceof Data_Either.Left) {
                              return eb(Control_Monad_Eff_Exception.error(Data_Show.show(Data_List_Types.showNonEmptyList(Data_Foreign.showForeignError))(v.value0)));
                          };
                          if (v instanceof Data_Either.Right) {
                              return cb(v.value0);
                          };
                          throw new Error("Failed pattern match at Network.HTTP.Affjax line 281, column 13 - line 283, column 26: " + [ v.constructor.name ]);
                      };
                      var addHeader = function (mh) {
                          return function (hs) {
                              if (mh instanceof Data_Maybe.Just && !Data_Foldable.any(Data_Foldable.foldableArray)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Function.on(Data_Eq.eq(Data_Eq.eqString))(Network_HTTP_RequestHeader.requestHeaderName)(mh.value0))(hs)) {
                                  return Data_Array.snoc(hs)(mh.value0);
                              };
                              return hs;
                          };
                      };
                      var headers = addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_RequestHeader.ContentType.create)(Data_Tuple.fst(requestSettings)))(addHeader(Data_Functor.map(Data_Maybe.functorMaybe)(Network_HTTP_RequestHeader.Accept.create)(Data_Tuple.fst(responseSettings)))(req.headers));
                      var req$prime = {
                          method: Data_HTTP_Method.print(req.method),
                          url: req.url,
                          headers: Data_Functor.map(Data_Functor.functorArray)(function (h) {
                              return {
                                  field: Network_HTTP_RequestHeader.requestHeaderName(h),
                                  value: Network_HTTP_RequestHeader.requestHeaderValue(h)
                              };
                          })(headers),
                          content: Data_Nullable.toNullable(Data_Tuple.snd(requestSettings)),
                          responseType: Network_HTTP_Affjax_Response.responseTypeToString(Data_Tuple.snd(responseSettings)),
                          username: Data_Nullable.toNullable(req.username),
                          password: Data_Nullable.toNullable(req.password),
                          withCredentials: req.withCredentials
                      };
                      return $foreign._ajax(Network_HTTP_ResponseHeader.responseHeader, req$prime, cancelAjax, eb, cb$prime);
                  };
              };
          };
      };
  };
  var affjax = function (dictRequestable) {
      return function (dictRespondable) {
          return function ($108) {
              return Control_Monad_Aff["makeAff'"](affjax$prime(dictRequestable)(dictRespondable)($108));
          };
      };
  };                                                                   
  var get = function (dictRespondable) {
      return function (u) {
          return affjax(Network_HTTP_Affjax_Request.requestableUnit)(dictRespondable)((function () {
              var $83 = {};
              for (var $84 in defaultRequest) {
                  if ({}.hasOwnProperty.call(defaultRequest, $84)) {
                      $83[$84] = defaultRequest[$84];
                  };
              };
              $83.url = u;
              return $83;
          })());
      };
  };
  var post = function (dictRequestable) {
      return function (dictRespondable) {
          return function (u) {
              return function (c) {
                  return affjax(dictRequestable)(dictRespondable)((function () {
                      var $92 = {};
                      for (var $93 in defaultRequest) {
                          if ({}.hasOwnProperty.call(defaultRequest, $93)) {
                              $92[$93] = defaultRequest[$93];
                          };
                      };
                      $92.method = new Data_Either.Left(Data_HTTP_Method.POST.value);
                      $92.url = u;
                      $92.content = new Data_Maybe.Just(c);
                      return $92;
                  })());
              };
          };
      };
  };
  exports["defaultRequest"] = defaultRequest;
  exports["affjax"] = affjax;
  exports["get"] = get;
  exports["post"] = post;
})(PS["Network.HTTP.Affjax"] = PS["Network.HTTP.Affjax"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Agrippa.Plugins.FileSystem.Commons"];
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_String = PS["Data.String"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Unit = PS["Data.Unit"];
  var Global = PS["Global"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Network_HTTP_Affjax_Request = PS["Network.HTTP.Affjax.Request"];
  var Network_HTTP_Affjax_Response = PS["Network.HTTP.Affjax.Response"];
  var Prelude = PS["Prelude"];        
  var open = function (openUrl) {
      return function (v) {
          return function (v1) {
              return function (v2) {
                  return function (v3) {
                      return function __do() {
                          Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_JQuery.body)(Control_Monad_Eff_JQuery.on("keyup")($foreign.shortcutHandler(openUrl)))();
                          var v4 = Control_Monad_Eff_JQuery.select("#agrippa-output > div > div:first > a")();
                          var v5 = Control_Monad_Eff_JQuery.getProp("href")(v4)();
                          var v6 = Control_Monad_Except.runExcept(Data_Foreign.readString(v5));
                          if (v6 instanceof Data_Either.Left) {
                              return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode(Data_Show.show(Data_List_Types.showNonEmptyList(Data_Foreign.showForeignError))(v6.value0)))();
                          };
                          if (v6 instanceof Data_Either.Right) {
                              return Data_Functor.voidRight(Control_Monad_Eff.functorEff)(Data_Maybe.Nothing.value)(Control_Monad_Aff.runAff(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))(Network_HTTP_Affjax.get(Network_HTTP_Affjax_Response.responsableUnit)(v6.value0)))();
                          };
                          throw new Error("Failed pattern match at Agrippa.Plugins.FileSystem.Commons line 73, column 3 - line 79, column 47: " + [ v6.constructor.name ]);
                      };
                  };
              };
          };
      };
  };
  var buildSuggestReq = function (taskName) {
      return function (term) {
          return Data_Argonaut_Core.fromObject(Data_StrMap.insert("taskName")(Data_Argonaut_Core.fromString(taskName))(Data_StrMap.insert("term")(Data_Argonaut_Core.fromString(term))(Data_StrMap.empty)));
      };
  };
  var buildNode = function (openUrl) {
      return function (item) {
          return function __do() {
              var v = Control_Monad_Eff_JQuery.create("<a>")();
              Control_Monad_Eff_JQuery.setText(item)(v)();
              Control_Monad_Eff_JQuery.setProp("href")(openUrl + ("?item=" + Global["encodeURIComponent"](item)))(v)();
              var v1 = Control_Monad_Eff_JQuery.create("<div>")();
              Control_Monad_Eff_JQuery.append(v)(v1)();
              return v1;
          };
      };
  };
  var buildOutput = function (openUrl) {
      return function (contents) {
          return function __do() {
              var v = Control_Monad_Eff_JQuery.create("<div>")();
              (function () {
                  var v1 = Control_Bind.composeKleisliFlipped(Data_Maybe.bindMaybe)(Data_Traversable.traverse(Data_Traversable.traversableArray)(Data_Maybe.applicativeMaybe)(Data_Argonaut_Core.toString))(Data_Argonaut_Core.toArray)(contents);
                  if (v1 instanceof Data_Maybe.Just) {
                      return function __do() {
                          Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_JQuery.body)(Control_Monad_Eff_JQuery.on("keyup")($foreign.shortcutHandler(openUrl)))();
                          var v2 = Data_Traversable.traverse(Data_Traversable.traversableArray)(Control_Monad_Eff.applicativeEff)(buildNode(openUrl))(v1.value0)();
                          Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableArray)(Data_Function.flip(Control_Monad_Eff_JQuery.append)(v))(v2)();
                          return Agrippa_Utils.addShortcutLabels("<span>")(v2)();
                      };
                  };
                  if (v1 instanceof Data_Maybe.Nothing) {
                      return Control_Monad_Eff_JQuery.setText("Error: expect a JSON array of strings from server.")(v);
                  };
                  throw new Error("Failed pattern match at Agrippa.Plugins.FileSystem.Commons line 44, column 3 - line 51, column 80: " + [ v1.constructor.name ]);
              })()();
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
                          return Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Control_Monad_Aff.runAff(Data_Function["const"](Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Unit.unit)))(function (v) {
                              return Control_Bind.bind(Control_Monad_Eff.bindEff)(buildOutput(openUrl)(v.response))(displayOutput);
                          })(Network_HTTP_Affjax.post(Network_HTTP_Affjax_Request.requestableJson)(Network_HTTP_Affjax_Response.responsableJson)(suggestUrl)(buildSuggestReq(taskName)(Data_String.trim(input)))))(Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Searching...")));
                      };
                  };
              };
          };
      };
  };
  exports["open"] = open;
  exports["suggest"] = suggest;
})(PS["Agrippa.Plugins.FileSystem.Commons"] = PS["Agrippa.Plugins.FileSystem.Commons"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Plugins_FileSystem_Commons = PS["Agrippa.Plugins.FileSystem.Commons"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var DOM = PS["DOM"];
  var Data_Maybe = PS["Data.Maybe"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Prelude = PS["Prelude"];        
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/executable/suggest")("/agrippa/executable/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/executable/open");
  exports["open"] = open;
  exports["suggest"] = suggest;
})(PS["Agrippa.Plugins.FileSystem.ExecutableSearch"] = PS["Agrippa.Plugins.FileSystem.ExecutableSearch"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Plugins_FileSystem_Commons = PS["Agrippa.Plugins.FileSystem.Commons"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var DOM = PS["DOM"];
  var Data_Maybe = PS["Data.Maybe"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Prelude = PS["Prelude"];        
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/linux-file/suggest")("/agrippa/linux-file/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/linux-file/open");
  exports["open"] = open;
  exports["suggest"] = suggest;
})(PS["Agrippa.Plugins.FileSystem.LinuxFileSearch"] = PS["Agrippa.Plugins.FileSystem.LinuxFileSearch"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Plugins_FileSystem_Commons = PS["Agrippa.Plugins.FileSystem.Commons"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var DOM = PS["DOM"];
  var Data_Maybe = PS["Data.Maybe"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Prelude = PS["Prelude"];        
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/mac-app/suggest")("/agrippa/mac-app/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/mac-app/open");
  exports["open"] = open;
  exports["suggest"] = suggest;
})(PS["Agrippa.Plugins.FileSystem.MacAppSearch"] = PS["Agrippa.Plugins.FileSystem.MacAppSearch"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Plugins_FileSystem_Commons = PS["Agrippa.Plugins.FileSystem.Commons"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var DOM = PS["DOM"];
  var Data_Maybe = PS["Data.Maybe"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Prelude = PS["Prelude"];        
  var suggest = Agrippa_Plugins_FileSystem_Commons.suggest("/agrippa/mac-file/suggest")("/agrippa/mac-file/open");
  var open = Agrippa_Plugins_FileSystem_Commons.open("/agrippa/mac-file/open");
  exports["open"] = open;
  exports["suggest"] = suggest;
})(PS["Agrippa.Plugins.FileSystem.MacFileSearch"] = PS["Agrippa.Plugins.FileSystem.MacFileSearch"] || {});
(function(exports) {function wrap(method) {
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Number.Format"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];        
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
      throw new Error("Failed pattern match at Data.Number.Format line 59, column 1 - line 59, column 40: " + [ v.constructor.name ]);
  };
  var fixed = function ($6) {
      return Fixed.create(Data_Ord.clamp(Data_Ord.ordInt)(0)(20)($6));
  };
  exports["fixed"] = fixed;
  exports["toStringWith"] = toStringWith;
})(PS["Data.Number.Format"] = PS["Data.Number.Format"] || {});
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
  exports.words              = words;
})(PS["Data.String.Utils"] = PS["Data.String.Utils"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.String.Utils"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array = PS["Data.Array"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Data_String_Regex = PS["Data.String.Regex"];
  var Data_String_Regex_Flags = PS["Data.String.Regex.Flags"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  exports["includes"] = $foreign.includes;
  exports["words"] = $foreign.words;
})(PS["Data.String.Utils"] = PS["Data.String.Utils"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var DOM = PS["DOM"];
  var Data_Array = PS["Data.Array"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Number = PS["Data.Number"];
  var Data_Number_Format = PS["Data.Number.Format"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_String = PS["Data.String"];
  var Data_String_Utils = PS["Data.String.Utils"];
  var Data_Traversable = PS["Data.Traversable"];
  var $$Math = PS["Math"];
  var Prelude = PS["Prelude"];        
  var truncate2 = function (n) {
      return Data_Number_Format.toStringWith(Data_Number_Format.fixed(2))(n);
  };
  var truncate0 = function (n) {
      return Data_Number_Format.toStringWith(Data_Number_Format.fixed(0))(n);
  };
  var showUsage = function (v) {
      return function (v1) {
          return function (v2) {
              return function (v3) {
                  return function __do() {
                      var v4 = Agrippa_Utils.createTextNode("<Loan Amount> <Interest Rate (%)> <Mortgage Period (years)>")();
                      var v5 = Agrippa_Utils.createTextNode("E.g.: 300000 4 30<Enter>")();
                      var v6 = Control_Monad_Eff_JQuery.create("<div>")();
                      Control_Monad_Eff_JQuery.append(v4)(v6)();
                      Control_Monad_Eff_JQuery.append(v5)(v6)();
                      return new Data_Maybe.Just(v6);
                  };
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
                                  var $39 = installmentNumber >= periodInYear * 12.0;
                                  if ($39) {
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
          var v1 = Control_Monad_Eff_JQuery.create("<td>")();
          Control_Monad_Eff_JQuery.setText(truncate0(v.installmentNumber))(v1)();
          var v2 = Control_Monad_Eff_JQuery.create("<td>")();
          Control_Monad_Eff_JQuery.setText(truncate2(v.principal))(v2)();
          var v3 = Control_Monad_Eff_JQuery.create("<td>")();
          Control_Monad_Eff_JQuery.setText(truncate2(v.interest))(v3)();
          var v4 = Control_Monad_Eff_JQuery.create("<td>")();
          Control_Monad_Eff_JQuery.setText(truncate2(v.balance))(v4)();
          var v5 = Control_Monad_Eff_JQuery.create("<tr>")();
          Control_Monad_Eff_JQuery.append(v1)(v5)();
          Control_Monad_Eff_JQuery.append(v2)(v5)();
          Control_Monad_Eff_JQuery.append(v3)(v5)();
          Control_Monad_Eff_JQuery.append(v4)(v5)();
          Control_Monad_Eff_JQuery.addClass("agrippa-mortgage-calc-tr")(v5)();
          return v5;
      };
  };
  var buildTableHeader = function __do() {
      var v = Control_Monad_Eff_JQuery.create("<th>")();
      Control_Monad_Eff_JQuery.setText("Installment #")(v)();
      var v1 = Control_Monad_Eff_JQuery.create("<th>")();
      Control_Monad_Eff_JQuery.setText("Principal")(v1)();
      var v2 = Control_Monad_Eff_JQuery.create("<th>")();
      Control_Monad_Eff_JQuery.setText("Interest")(v2)();
      var v3 = Control_Monad_Eff_JQuery.create("<th>")();
      Control_Monad_Eff_JQuery.setText("Balance")(v3)();
      var v4 = Control_Monad_Eff_JQuery.create("<tr>")();
      Control_Monad_Eff_JQuery.append(v)(v4)();
      Control_Monad_Eff_JQuery.append(v1)(v4)();
      Control_Monad_Eff_JQuery.append(v2)(v4)();
      Control_Monad_Eff_JQuery.append(v3)(v4)();
      return v4;
  };
  var buildTable = function (installments) {
      return function __do() {
          var v = Control_Monad_Eff_JQuery.create("<table>")();
          var v1 = buildTableHeader();
          var v2 = Data_Traversable.traverse(Data_Traversable.traversableArray)(Control_Monad_Eff.applicativeEff)(buildTableRow)(installments)();
          Control_Monad_Eff_JQuery.append(v1)(v)();
          Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableArray)(Data_Function.flip(Control_Monad_Eff_JQuery.append)(v))(v2)();
          return v;
      };
  };
  var calculateMortgage = function (v) {
      return function (v1) {
          return function (input) {
              return function (v2) {
                  var v3 = Data_String_Utils.words(Data_String.trim(input));
                  if (v3.length === 3) {
                      var v4 = parseInput(v3[0])(v3[1])(v3[2]);
                      if (v4 instanceof Data_Maybe.Just) {
                          var interestRatePercent = v4.value0.interestRate / 100.0;
                          var monthlyPayment = calcMonthlyPayment(v4.value0.loanAmount)(interestRatePercent)(v4.value0.periodInYear);
                          var amortization = calculateAmortization(monthlyPayment)(v4.value0.loanAmount)(interestRatePercent)(v4.value0.periodInYear);
                          return function __do() {
                              var v5 = Control_Monad_Eff_JQuery.create("<div>")();
                              var v6 = Control_Monad_Eff_JQuery.create("<div>")();
                              Control_Monad_Eff_JQuery.setText("Monthly payment is: " + (truncate2(monthlyPayment) + "."))(v6)();
                              var v7 = Control_Monad_Eff_JQuery.create("<div>")();
                              Control_Monad_Eff_JQuery.setText("Amortizaton:")(v7)();
                              var v8 = buildTable(amortization)();
                              Control_Monad_Eff_JQuery.append(v6)(v5)();
                              Control_Monad_Eff_JQuery.append(v7)(v5)();
                              Control_Monad_Eff_JQuery.append(v8)(v5)();
                              return new Data_Maybe.Just(v5);
                          };
                      };
                      if (v4 instanceof Data_Maybe.Nothing) {
                          return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Failed to parse input parameter(s)."));
                      };
                      throw new Error("Failed pattern match at Agrippa.Plugins.MortgageCalc line 45, column 7 - line 62, column 5: " + [ v4.constructor.name ]);
                  };
                  return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode("Failed to parse input parameter(s)."));
              };
          };
      };
  };
  exports["calculateMortgage"] = calculateMortgage;
  exports["showUsage"] = showUsage;
})(PS["Agrippa.Plugins.MortgageCalc"] = PS["Agrippa.Plugins.MortgageCalc"] || {});
(function(exports) {
  /* global window */
  "use strict";

  exports.window = function () {
    return window;
  };
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["DOM.HTML"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  exports["window"] = $foreign.window;
})(PS["DOM.HTML"] = PS["DOM.HTML"] || {});
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

  exports.url = function (window) {
    return function () {
      return window.URL;
    };
  };
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["DOM.HTML.Window"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_WebStorage_Types = PS["DOM.WebStorage.Types"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Nullable = PS["Data.Nullable"];
  var Data_Ord = PS["Data.Ord"];
  var Prelude = PS["Prelude"];
  var open = function (url$prime) {
      return function (name) {
          return function (features) {
              return function (window) {
                  return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)($foreign._open(url$prime)(name)(features)(window));
              };
          };
      };
  };
  exports["open"] = open;
})(PS["DOM.HTML.Window"] = PS["DOM.HTML.Window"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var DOM_HTML = PS["DOM.HTML"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var DOM_HTML_Window = PS["DOM.HTML.Window"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_String = PS["Data.String"];
  var Global = PS["Global"];
  var Prelude = PS["Prelude"];        
  var openUrl = function (url) {
      return function __do() {
          var v = DOM_HTML.window();
          var v1 = DOM_HTML_Window.open(url)("_self")("")(v)();
          if (v1 instanceof Data_Maybe.Nothing) {
              return "I can't get a window object.  Something went really wrong...";
          };
          if (v1 instanceof Data_Maybe.Just) {
              return "Opening...";
          };
          throw new Error("Failed pattern match at Agrippa.Plugins.OnlineSearch line 42, column 8 - line 46, column 1: " + [ v1.constructor.name ]);
      };
  };
  var completeUrl = function (url) {
      return function (input) {
          return Data_String.replace("${q}")(Data_String.Replacement(Global["encodeURIComponent"](Data_String.trim(input))))(url);
      };
  };
  var prompt = function (v) {
      return function (config) {
          return function (input) {
              return function (v1) {
                  return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode((function () {
                      var v2 = Agrippa_Config.getStringVal("url")(config);
                      if (v2 instanceof Data_Either.Left) {
                          return v2.value0;
                      };
                      if (v2 instanceof Data_Either.Right) {
                          return "Keep typing the query.  Press <Enter> to visit " + (completeUrl(v2.value0)(input) + ".");
                      };
                      throw new Error("Failed pattern match at Agrippa.Plugins.OnlineSearch line 24, column 3 - line 26, column 103: " + [ v2.constructor.name ]);
                  })()));
              };
          };
      };
  };
  var search = function (v) {
      return function (config) {
          return function (input) {
              return function (v1) {
                  return Control_Bind.bindFlipped(Control_Monad_Eff.bindEff)(function ($18) {
                      return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)(Agrippa_Utils.createTextNode($18));
                  })((function () {
                      var v2 = Agrippa_Config.getStringVal("url")(config);
                      if (v2 instanceof Data_Either.Left) {
                          return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(v2.value0);
                      };
                      if (v2 instanceof Data_Either.Right) {
                          return openUrl(completeUrl(v2.value0)(input));
                      };
                      throw new Error("Failed pattern match at Agrippa.Plugins.OnlineSearch line 34, column 3 - line 36, column 49: " + [ v2.constructor.name ]);
                  })());
              };
          };
      };
  };
  exports["search"] = search;
  exports["prompt"] = prompt;
})(PS["Agrippa.Plugins.OnlineSearch"] = PS["Agrippa.Plugins.OnlineSearch"] || {});
(function(exports) {
    "use strict";

  exports.shortcutHandler = function (evt) {
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

  exports.copyButtonHandler = function (evt) {
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Agrippa.Plugins.Snippets"];
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var DOM = PS["DOM"];
  var Data_Argonaut_Core = PS["Data.Argonaut.Core"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_String = PS["Data.String"];
  var Data_String_Utils = PS["Data.String.Utils"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var copy = function (v) {
      return function (v1) {
          return function (v2) {
              return function (v3) {
                  return Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_JQuery.body)(Control_Monad_Eff_JQuery.on("keyup")($foreign.shortcutHandler)))($foreign.clickFirstCopyButton))(Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Maybe.Nothing.value));
              };
          };
      };
  };
  var buildTableRow = function (key) {
      return function (value) {
          var val = (function () {
              var v = Data_Argonaut_Core.toString(value);
              if (v instanceof Data_Maybe.Nothing) {
                  return "Error: snippets must be strings.";
              };
              if (v instanceof Data_Maybe.Just) {
                  return v.value0;
              };
              throw new Error("Failed pattern match at Agrippa.Plugins.Snippets line 42, column 13 - line 44, column 27: " + [ v.constructor.name ]);
          })();
          return function __do() {
              var v = Control_Monad_Eff_JQuery.create("<td>")();
              Control_Monad_Eff_JQuery.setText(key)(v)();
              var v1 = Control_Monad_Eff_JQuery.create("<input>")();
              Control_Monad_Eff_JQuery.setValue(val)(v1)();
              Control_Monad_Eff_JQuery.addClass("agrippa-snippet")(v1)();
              var v2 = Control_Monad_Eff_JQuery.create("<td>")();
              Control_Monad_Eff_JQuery.append(v1)(v2)();
              var v3 = Control_Monad_Eff_JQuery.create("<button>")();
              Control_Monad_Eff_JQuery.setText("Copy")(v3)();
              Control_Monad_Eff_JQuery.on("click")($foreign.copyButtonHandler)(v3)();
              var v4 = Control_Monad_Eff_JQuery.create("<td>")();
              Control_Monad_Eff_JQuery.append(v3)(v4)();
              var v5 = Control_Monad_Eff_JQuery.create("<tr>")();
              Control_Monad_Eff_JQuery.append(v)(v5)();
              Control_Monad_Eff_JQuery.append(v2)(v5)();
              Control_Monad_Eff_JQuery.append(v4)(v5)();
              return v5;
          };
      };
  };
  var buildTable = function (candidates) {
      return function __do() {
          Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_JQuery.body)(Control_Monad_Eff_JQuery.on("keyup")($foreign.shortcutHandler))();
          var v = Data_Traversable.sequence(Data_Traversable.traversableArray)(Control_Monad_Eff.applicativeEff)(Data_StrMap.toArrayWithKey(buildTableRow)(candidates))();
          var v1 = Control_Monad_Eff_JQuery.create("<table>")();
          Data_Foldable.traverse_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableArray)(Data_Function.flip(Control_Monad_Eff_JQuery.append)(v1))(v)();
          Agrippa_Utils.addShortcutLabels("<td>")(v)();
          return v1;
      };
  };
  var suggest = function (v) {
      return function (config) {
          return function (input) {
              return function (displayOutput) {
                  return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Maybe.Just.create)((function () {
                      var v1 = Agrippa_Config.getStrMapVal("snippets")(config);
                      if (v1 instanceof Data_Either.Left) {
                          return Agrippa_Utils.createTextNode(v1.value0);
                      };
                      if (v1 instanceof Data_Either.Right) {
                          var candidates = Data_StrMap.filterKeys(function ($28) {
                              return Data_String_Utils.includes(Data_String.toLower(Data_String.trim(input)))(Data_String.toLower($28));
                          })(v1.value0);
                          return buildTable(candidates);
                      };
                      throw new Error("Failed pattern match at Agrippa.Plugins.Snippets line 24, column 3 - line 29, column 31: " + [ v1.constructor.name ]);
                  })());
              };
          };
      };
  };
  exports["copy"] = copy;
  exports["suggest"] = suggest;
})(PS["Agrippa.Plugins.Snippets"] = PS["Agrippa.Plugins.Snippets"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Plugins_Calculator = PS["Agrippa.Plugins.Calculator"];
  var Agrippa_Plugins_Clock = PS["Agrippa.Plugins.Clock"];
  var Agrippa_Plugins_FileSystem_ExecutableSearch = PS["Agrippa.Plugins.FileSystem.ExecutableSearch"];
  var Agrippa_Plugins_FileSystem_LinuxFileSearch = PS["Agrippa.Plugins.FileSystem.LinuxFileSearch"];
  var Agrippa_Plugins_FileSystem_MacAppSearch = PS["Agrippa.Plugins.FileSystem.MacAppSearch"];
  var Agrippa_Plugins_FileSystem_MacFileSearch = PS["Agrippa.Plugins.FileSystem.MacFileSearch"];
  var Agrippa_Plugins_MortgageCalc = PS["Agrippa.Plugins.MortgageCalc"];
  var Agrippa_Plugins_OnlineSearch = PS["Agrippa.Plugins.OnlineSearch"];
  var Agrippa_Plugins_Snippets = PS["Agrippa.Plugins.Snippets"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var Control_Monad_Eff_Now = PS["Control.Monad.Eff.Now"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Tuple = PS["Data.Tuple"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Prelude = PS["Prelude"];
  var plugins = [ {
      name: "Calculator",
      onInputChange: Agrippa_Plugins_Calculator.calculate,
      onActivation: Agrippa_Plugins_Calculator.calculate
  }, {
      name: "Clock",
      onInputChange: Agrippa_Plugins_Clock.showTime,
      onActivation: Agrippa_Plugins_Clock.showTime
  }, {
      name: "Mortgage Calculator",
      onInputChange: Agrippa_Plugins_MortgageCalc.showUsage,
      onActivation: Agrippa_Plugins_MortgageCalc.calculateMortgage
  }, {
      name: "OnlineSearch",
      onInputChange: Agrippa_Plugins_OnlineSearch.prompt,
      onActivation: Agrippa_Plugins_OnlineSearch.search
  }, {
      name: "Snippets",
      onInputChange: Agrippa_Plugins_Snippets.suggest,
      onActivation: Agrippa_Plugins_Snippets.copy
  }, {
      name: "ExecutableSearch",
      onInputChange: Agrippa_Plugins_FileSystem_ExecutableSearch.suggest,
      onActivation: Agrippa_Plugins_FileSystem_ExecutableSearch.open
  }, {
      name: "LinuxFileSearch",
      onInputChange: Agrippa_Plugins_FileSystem_LinuxFileSearch.suggest,
      onActivation: Agrippa_Plugins_FileSystem_LinuxFileSearch.open
  }, {
      name: "MacFileSearch",
      onInputChange: Agrippa_Plugins_FileSystem_MacFileSearch.suggest,
      onActivation: Agrippa_Plugins_FileSystem_MacFileSearch.open
  }, {
      name: "MacAppSearch",
      onInputChange: Agrippa_Plugins_FileSystem_MacAppSearch.suggest,
      onActivation: Agrippa_Plugins_FileSystem_MacAppSearch.open
  } ];
  var namesToPlugins = Data_StrMap.fromFoldable(Data_Foldable.foldableArray)(Data_Functor.map(Data_Functor.functorArray)(function (v) {
      return new Data_Tuple.Tuple(v.name, v);
  })(plugins));
  exports["namesToPlugins"] = namesToPlugins;
})(PS["Agrippa.Plugins.Registry"] = PS["Agrippa.Plugins.Registry"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Agrippa_Config = PS["Agrippa.Config"];
  var Agrippa_Help = PS["Agrippa.Help"];
  var Agrippa_Plugins_Registry = PS["Agrippa.Plugins.Registry"];
  var Agrippa_Utils = PS["Agrippa.Utils"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_JQuery = PS["Control.Monad.Eff.JQuery"];
  var Control_Monad_Eff_Now = PS["Control.Monad.Eff.Now"];
  var Control_Monad_Eff_Ref = PS["Control.Monad.Eff.Ref"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var DOM = PS["DOM"];
  var DOM_HTML_Types = PS["DOM.HTML.Types"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_String = PS["Data.String"];
  var Data_Unit = PS["Data.Unit"];
  var Network_HTTP_Affjax = PS["Network.HTTP.Affjax"];
  var Network_HTTP_Affjax_Response = PS["Network.HTTP.Affjax.Response"];
  var Prelude = PS["Prelude"];        
  var Task = (function () {
      function Task(value0) {
          this.value0 = value0;
      };
      Task.create = function (value0) {
          return new Task(value0);
      };
      return Task;
  })();
  var loadConfig = function (onSuccess) {
      return Data_Functor["void"](Control_Monad_Eff.functorEff)(Control_Monad_Aff.runAff(function (v) {
          return Agrippa_Utils.displayOutputText("Failed to retrieve config from server.");
      })(function (v) {
          return onSuccess(v.response);
      })(Network_HTTP_Affjax.get(Network_HTTP_Affjax_Response.responsableJson)("/agrippa/config/")));
  };
  var findTask = function (config) {
      return function (wholeInput) {
          return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Utils.mToE("No keyword found in input.")(Data_String.indexOf(" ")(wholeInput)))(function (v) {
              return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Utils.mToE("Failed to parse input.  This is impossible!")(Data_String.splitAt(v)(wholeInput)))(function (v1) {
                  return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.getStrMapVal("tasks")(config))(function (v2) {
                      return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Utils.mToE("Keyword '" + (v1.before + "' not found in config."))(Data_StrMap.lookup(v1.before)(v2)))(function (v3) {
                          return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.getStringVal("name")(v3))(function (v4) {
                              return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.getStringVal("plugin")(v3))(function (v5) {
                                  return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Utils.mToE("Can't find plugin with name '" + (v5 + "'."))(Data_StrMap.lookup(v5)(Agrippa_Plugins_Registry.namesToPlugins)))(function (v6) {
                                      return Control_Applicative.pure(Data_Either.applicativeEither)(new Task({
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
  var findDefaultTask = function (config) {
      return function (wholeInput) {
          return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.lookupConfigVal("preferences")(config))(function (v) {
              return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.lookupConfigVal("defaultTask")(v))(function (v1) {
                  return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.getStringVal("name")(v1))(function (v2) {
                      return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Config.getStringVal("plugin")(v1))(function (v3) {
                          return Control_Bind.bind(Data_Either.bindEither)(Agrippa_Utils.mToE("Can't find plugin with name '" + (v3 + "'."))(Data_StrMap.lookup(v3)(Agrippa_Plugins_Registry.namesToPlugins)))(function (v4) {
                              return Control_Applicative.pure(Data_Either.applicativeEither)(new Task({
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
      };
  };
  var displayTask = function (t) {
      return Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_JQuery.select("#agrippa-task"))(Control_Monad_Eff_JQuery.setText(t));
  };
  var execTask = function (v) {
      return function (keyCode) {
          return function __do() {
              displayTask(v.value0.name)();
              var activateOrPrompt = (function () {
                  var $41 = keyCode === 13;
                  if ($41) {
                      return v.value0.plugin.onActivation;
                  };
                  return v.value0.plugin.onInputChange;
              })();
              var v1 = activateOrPrompt(v.value0.name)(v.value0.config)(v.value0.input)(Agrippa_Utils.displayOutput)();
              if (v1 instanceof Data_Maybe.Just) {
                  return Agrippa_Utils.displayOutput(v1.value0)();
              };
              if (v1 instanceof Data_Maybe.Nothing) {
                  return Data_Unit.unit;
              };
              throw new Error("Failed pattern match at Agrippa.Main line 109, column 3 - line 111, column 27: " + [ v1.constructor.name ]);
          };
      };
  };
  var dispatchToTask = function (config) {
      return function (keyCode) {
          return function (wholeInput) {
              var v = Control_Alt.alt(Data_Either.altEither)(findTask(config)(wholeInput))(findDefaultTask(config)(wholeInput));
              if (v instanceof Data_Either.Left) {
                  return Agrippa_Utils.displayOutputText(v.value0);
              };
              if (v instanceof Data_Either.Right) {
                  return Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Control_Bind.bind(Control_Monad_Eff.bindEff)(Control_Monad_Eff_JQuery.body)(Control_Monad_Eff_JQuery.off("keyup")))(execTask(v.value0)(keyCode));
              };
              throw new Error("Failed pattern match at Agrippa.Main line 73, column 3 - line 75, column 66: " + [ v.constructor.name ]);
          };
      };
  };
  var inputHandler = function (config) {
      return function (prevInputRef) {
          return function (event) {
              return function (inputField) {
                  return function __do() {
                      var v = Control_Monad_Eff_JQuery.getWhich(event)();
                      var v1 = Control_Monad_Eff_JQuery.getValue(inputField)();
                      var v2 = Control_Monad_Except.runExcept(Data_Foreign.readString(v1));
                      if (v2 instanceof Data_Either.Left) {
                          return Agrippa_Utils.displayOutputText(Data_Show.show(Data_List_Types.showNonEmptyList(Data_Foreign.showForeignError))(v2.value0))();
                      };
                      if (v2 instanceof Data_Either.Right) {
                          var v3 = Control_Monad_Eff_Ref.readRef(prevInputRef)();
                          Control_Monad_Eff_Ref.writeRef(prevInputRef)(v2.value0)();
                          var $60 = v3 === v2.value0 && v !== 13;
                          if ($60) {
                              return Data_Unit.unit;
                          };
                          return dispatchToTask(config)(v)(v2.value0)();
                      };
                      throw new Error("Failed pattern match at Agrippa.Main line 53, column 3 - line 60, column 54: " + [ v2.constructor.name ]);
                  };
              };
          };
      };
  };
  var installInputHandler = function (config) {
      return function __do() {
          var v = Control_Monad_Eff_JQuery.select("#agrippa-input")();
          var v1 = Control_Monad_Eff_Ref.newRef("")();
          return Control_Monad_Eff_JQuery.on("keyup")(inputHandler(config)(v1))(v)();
      };
  };
  var main = Control_Monad_Eff_JQuery.ready(loadConfig(function (config) {
      return Control_Apply.applySecond(Control_Monad_Eff.applyEff)(Agrippa_Help.buildHelp(config))(installInputHandler(config));
  }));
  exports["main"] = main;
})(PS["Agrippa.Main"] = PS["Agrippa.Main"] || {});
PS["Agrippa.Main"].main();

}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
