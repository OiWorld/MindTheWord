!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in g||(g[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==m.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=g[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(m.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=g[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return D[e]||(D[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},r.name);t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=g[s],f=D[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=v(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=g[e];if(t)t.declarative?p(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=v(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=g[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(e){var r={};if("object"==typeof e||"function"==typeof e){var t=e&&e.hasOwnProperty;if(h)for(var n in e)f(r,e,n)||c(r,e,n,t);else for(var n in e)c(r,e,n,t)}return r["default"]=e,y(r,"__useDefault",{value:!0}),r}function c(e,r,t,n){(!n||r.hasOwnProperty(t))&&(e[t]=r[t])}function f(e,r,t){try{var n;return(n=Object.getOwnPropertyDescriptor(r,t))&&y(e,t,n),!0}catch(o){return!1}}function p(r,t){var n=g[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==m.call(t,u)&&(g[u]?p(u,t):v(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function v(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return _(e.substr(6));var r=g[e];if(!r)throw"Module "+e+" not present.";return a(e),p(e,[]),g[e]=void 0,r.declarative&&y(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var g={},m=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},h=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(x){h=!1}var y;!function(){try{Object.defineProperty({},"a",{})&&(y=Object.defineProperty)}catch(e){y=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var D={},_="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,I={"@empty":{}};return function(e,n,o){return function(a){a(function(a){for(var u={_nodeRequire:_,register:r,registerDynamic:t,get:v,set:function(e,r){I[e]=r},newModule:function(e){return e}},d=0;d<n.length;d++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[d],arguments[d]);o(u);var i=v(e[0]);if(e.length>1)for(var d=1;d<e.length;d++)v(e[d]);return i.__useDefault?i["default"]:i})}}}("undefined"!=typeof self?self:global)

(["1"], [], function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic("2", ["3"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $ = $__require('3');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  return module.exports;
});

$__System.registerDynamic("4", ["2"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {
    "default": $__require('2'),
    __esModule: true
  };
  return module.exports;
});

$__System.registerDynamic("5", ["4"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _Object$defineProperty = $__require('4')["default"];
  exports["default"] = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.__esModule = true;
  return module.exports;
});

$__System.registerDynamic("6", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  exports["default"] = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  exports.__esModule = true;
  return module.exports;
});

$__System.registerDynamic("7", ["8", "9", "a"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $export = $__require('8'),
      core = $__require('9'),
      fails = $__require('a');
  module.exports = function(KEY, exec) {
    var fn = (core.Object || {})[KEY] || Object[KEY],
        exp = {};
    exp[KEY] = exec(fn);
    $export($export.S + $export.F * fails(function() {
      fn(1);
    }), 'Object', exp);
  };
  return module.exports;
});

$__System.registerDynamic("b", ["c", "7"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var toObject = $__require('c');
  $__require('7')('keys', function($keys) {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });
  return module.exports;
});

$__System.registerDynamic("d", ["b", "9"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  $__require('b');
  module.exports = $__require('9').Object.keys;
  return module.exports;
});

$__System.registerDynamic("e", ["d"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {
    "default": $__require('d'),
    __esModule: true
  };
  return module.exports;
});

$__System.registerDynamic("f", ["10", "11"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var toInteger = $__require('10'),
      defined = $__require('11');
  module.exports = function(TO_STRING) {
    return function(that, pos) {
      var s = String(defined(that)),
          i = toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l)
        return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };
  return module.exports;
});

$__System.registerDynamic("12", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = true;
  return module.exports;
});

$__System.registerDynamic("13", ["14"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = $__require('14');
  return module.exports;
});

$__System.registerDynamic("15", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = function(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };
  return module.exports;
});

$__System.registerDynamic("a", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = function(exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
  return module.exports;
});

$__System.registerDynamic("16", ["a"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = !$__require('a')(function() {
    return Object.defineProperty({}, 'a', {get: function() {
        return 7;
      }}).a != 7;
  });
  return module.exports;
});

$__System.registerDynamic("14", ["3", "15", "16"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $ = $__require('3'),
      createDesc = $__require('15');
  module.exports = $__require('16') ? function(object, key, value) {
    return $.setDesc(object, key, createDesc(1, value));
  } : function(object, key, value) {
    object[key] = value;
    return object;
  };
  return module.exports;
});

$__System.registerDynamic("17", ["3", "15", "18", "14", "19"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $ = $__require('3'),
      descriptor = $__require('15'),
      setToStringTag = $__require('18'),
      IteratorPrototype = {};
  $__require('14')(IteratorPrototype, $__require('19')('iterator'), function() {
    return this;
  });
  module.exports = function(Constructor, NAME, next) {
    Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
    setToStringTag(Constructor, NAME + ' Iterator');
  };
  return module.exports;
});

$__System.registerDynamic("1a", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function(it, key) {
    return hasOwnProperty.call(it, key);
  };
  return module.exports;
});

$__System.registerDynamic("18", ["3", "1a", "19"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var def = $__require('3').setDesc,
      has = $__require('1a'),
      TAG = $__require('19')('toStringTag');
  module.exports = function(it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG))
      def(it, TAG, {
        configurable: true,
        value: tag
      });
  };
  return module.exports;
});

$__System.registerDynamic("3", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  return module.exports;
});

$__System.registerDynamic("1b", ["12", "8", "13", "14", "1a", "1c", "17", "18", "3", "19"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var LIBRARY = $__require('12'),
      $export = $__require('8'),
      redefine = $__require('13'),
      hide = $__require('14'),
      has = $__require('1a'),
      Iterators = $__require('1c'),
      $iterCreate = $__require('17'),
      setToStringTag = $__require('18'),
      getProto = $__require('3').getProto,
      ITERATOR = $__require('19')('iterator'),
      BUGGY = !([].keys && 'next' in [].keys()),
      FF_ITERATOR = '@@iterator',
      KEYS = 'keys',
      VALUES = 'values';
  var returnThis = function() {
    return this;
  };
  module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function(kind) {
      if (!BUGGY && kind in proto)
        return proto[kind];
      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };
        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }
      return function entries() {
        return new Constructor(this, kind);
      };
    };
    var TAG = NAME + ' Iterator',
        DEF_VALUES = DEFAULT == VALUES,
        VALUES_BUG = false,
        proto = Base.prototype,
        $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
        $default = $native || getMethod(DEFAULT),
        methods,
        key;
    if ($native) {
      var IteratorPrototype = getProto($default.call(new Base));
      setToStringTag(IteratorPrototype, TAG, true);
      if (!LIBRARY && has(proto, FF_ITERATOR))
        hide(IteratorPrototype, ITERATOR, returnThis);
      if (DEF_VALUES && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() {
          return $native.call(this);
        };
      }
    }
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide(proto, ITERATOR, $default);
    }
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: !DEF_VALUES ? $default : getMethod('entries')
      };
      if (FORCED)
        for (key in methods) {
          if (!(key in proto))
            redefine(proto, key, methods[key]);
        }
      else
        $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };
  return module.exports;
});

$__System.registerDynamic("1d", ["f", "1b"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $at = $__require('f')(true);
  $__require('1b')(String, 'String', function(iterated) {
    this._t = String(iterated);
    this._i = 0;
  }, function() {
    var O = this._t,
        index = this._i,
        point;
    if (index >= O.length)
      return {
        value: undefined,
        done: true
      };
    point = $at(O, index);
    this._i += point.length;
    return {
      value: point,
      done: false
    };
  });
  return module.exports;
});

$__System.registerDynamic("1e", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = function(it) {
    if (typeof it != 'function')
      throw TypeError(it + ' is not a function!');
    return it;
  };
  return module.exports;
});

$__System.registerDynamic("1f", ["1e"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var aFunction = $__require('1e');
  module.exports = function(fn, that, length) {
    aFunction(fn);
    if (that === undefined)
      return fn;
    switch (length) {
      case 1:
        return function(a) {
          return fn.call(that, a);
        };
      case 2:
        return function(a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function(a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function() {
      return fn.apply(that, arguments);
    };
  };
  return module.exports;
});

$__System.registerDynamic("8", ["20", "9", "1f"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var global = $__require('20'),
      core = $__require('9'),
      ctx = $__require('1f'),
      PROTOTYPE = 'prototype';
  var $export = function(type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        IS_WRAP = type & $export.W,
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
        key,
        own,
        out;
    if (IS_GLOBAL)
      source = name;
    for (key in source) {
      own = !IS_FORCED && target && key in target;
      if (own && key in exports)
        continue;
      out = own ? target[key] : source[key];
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? (function(C) {
        var F = function(param) {
          return this instanceof C ? new C(param) : C(param);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      if (IS_PROTO)
        (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
    }
  };
  $export.F = 1;
  $export.G = 2;
  $export.S = 4;
  $export.P = 8;
  $export.B = 16;
  $export.W = 32;
  module.exports = $export;
  return module.exports;
});

$__System.registerDynamic("11", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = function(it) {
    if (it == undefined)
      throw TypeError("Can't call method on  " + it);
    return it;
  };
  return module.exports;
});

$__System.registerDynamic("c", ["11"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var defined = $__require('11');
  module.exports = function(it) {
    return Object(defined(it));
  };
  return module.exports;
});

$__System.registerDynamic("21", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = function(it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };
  return module.exports;
});

$__System.registerDynamic("22", ["21"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var isObject = $__require('21');
  module.exports = function(it) {
    if (!isObject(it))
      throw TypeError(it + ' is not an object!');
    return it;
  };
  return module.exports;
});

$__System.registerDynamic("23", ["22"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var anObject = $__require('22');
  module.exports = function(iterator, fn, value, entries) {
    try {
      return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined)
        anObject(ret.call(iterator));
      throw e;
    }
  };
  return module.exports;
});

$__System.registerDynamic("24", ["1c", "19"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var Iterators = $__require('1c'),
      ITERATOR = $__require('19')('iterator'),
      ArrayProto = Array.prototype;
  module.exports = function(it) {
    return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
  };
  return module.exports;
});

$__System.registerDynamic("10", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var ceil = Math.ceil,
      floor = Math.floor;
  module.exports = function(it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };
  return module.exports;
});

$__System.registerDynamic("25", ["10"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var toInteger = $__require('10'),
      min = Math.min;
  module.exports = function(it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
  };
  return module.exports;
});

$__System.registerDynamic("26", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var toString = {}.toString;
  module.exports = function(it) {
    return toString.call(it).slice(8, -1);
  };
  return module.exports;
});

$__System.registerDynamic("27", ["26", "19"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var cof = $__require('26'),
      TAG = $__require('19')('toStringTag'),
      ARG = cof(function() {
        return arguments;
      }()) == 'Arguments';
  module.exports = function(it) {
    var O,
        T,
        B;
    return it === undefined ? 'Undefined' : it === null ? 'Null' : typeof(T = (O = Object(it))[TAG]) == 'string' ? T : ARG ? cof(O) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };
  return module.exports;
});

$__System.registerDynamic("1c", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {};
  return module.exports;
});

$__System.registerDynamic("28", ["27", "19", "1c", "9"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var classof = $__require('27'),
      ITERATOR = $__require('19')('iterator'),
      Iterators = $__require('1c');
  module.exports = $__require('9').getIteratorMethod = function(it) {
    if (it != undefined)
      return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
  };
  return module.exports;
});

$__System.registerDynamic("29", ["20"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var global = $__require('20'),
      SHARED = '__core-js_shared__',
      store = global[SHARED] || (global[SHARED] = {});
  module.exports = function(key) {
    return store[key] || (store[key] = {});
  };
  return module.exports;
});

$__System.registerDynamic("2a", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var id = 0,
      px = Math.random();
  module.exports = function(key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };
  return module.exports;
});

$__System.registerDynamic("20", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number')
    __g = global;
  return module.exports;
});

$__System.registerDynamic("19", ["29", "2a", "20"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var store = $__require('29')('wks'),
      uid = $__require('2a'),
      Symbol = $__require('20').Symbol;
  module.exports = function(name) {
    return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
  };
  return module.exports;
});

$__System.registerDynamic("2b", ["19"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var ITERATOR = $__require('19')('iterator'),
      SAFE_CLOSING = false;
  try {
    var riter = [7][ITERATOR]();
    riter['return'] = function() {
      SAFE_CLOSING = true;
    };
    Array.from(riter, function() {
      throw 2;
    });
  } catch (e) {}
  module.exports = function(exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING)
      return false;
    var safe = false;
    try {
      var arr = [7],
          iter = arr[ITERATOR]();
      iter.next = function() {
        safe = true;
      };
      arr[ITERATOR] = function() {
        return iter;
      };
      exec(arr);
    } catch (e) {}
    return safe;
  };
  return module.exports;
});

$__System.registerDynamic("2c", ["1f", "8", "c", "23", "24", "25", "28", "2b"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var ctx = $__require('1f'),
      $export = $__require('8'),
      toObject = $__require('c'),
      call = $__require('23'),
      isArrayIter = $__require('24'),
      toLength = $__require('25'),
      getIterFn = $__require('28');
  $export($export.S + $export.F * !$__require('2b')(function(iter) {
    Array.from(iter);
  }), 'Array', {from: function from(arrayLike) {
      var O = toObject(arrayLike),
          C = typeof this == 'function' ? this : Array,
          $$ = arguments,
          $$len = $$.length,
          mapfn = $$len > 1 ? $$[1] : undefined,
          mapping = mapfn !== undefined,
          index = 0,
          iterFn = getIterFn(O),
          length,
          result,
          step,
          iterator;
      if (mapping)
        mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
      if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
        for (iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++) {
          result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
        }
      } else {
        length = toLength(O.length);
        for (result = new C(length); length > index; index++) {
          result[index] = mapping ? mapfn(O[index], index) : O[index];
        }
      }
      result.length = index;
      return result;
    }});
  return module.exports;
});

$__System.registerDynamic("9", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var core = module.exports = {version: '1.2.6'};
  if (typeof __e == 'number')
    __e = core;
  return module.exports;
});

$__System.registerDynamic("2d", ["1d", "2c", "9"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  $__require('1d');
  $__require('2c');
  module.exports = $__require('9').Array.from;
  return module.exports;
});

$__System.registerDynamic("2e", ["2d"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {
    "default": $__require('2d'),
    __esModule: true
  };
  return module.exports;
});

$__System.register('2f', ['5', '6', 'e', '2e'], function (_export) {
  var _createClass, _classCallCheck, _Object$keys, _Array$from, ContentScript;

  return {
    setters: [function (_) {
      _createClass = _['default'];
    }, function (_2) {
      _classCallCheck = _2['default'];
    }, function (_e) {
      _Object$keys = _e['default'];
    }, function (_e2) {
      _Array$from = _e2['default'];
    }],
    execute: function () {
      /*
      1. ngram deprecate
      2. getAllWords optimize
      3. replace toList with ES6 Array.from and destructing
      4. remove injectCSS and injectScript
      5. optimize intersect
      6. modularize utils
      7. Better Cleaning of source words
      8. to List edit
      */

      'use strict';

      ContentScript = (function () {
        function ContentScript() {
          _classCallCheck(this, ContentScript);

          this.srcLang = '';
          this.targetLang = '';
          this.ngramMin = 1;
          this.ngramMax = 1;
        }

        _createClass(ContentScript, [{
          key: 'translate',
          value: function translate() {
            var _this = this;

            chrome.runtime.sendMessage({
              getOptions: '1'
            }, function (res) {
              console.log('options:', res);
              if (res.activation === true) {
                _this.ngramMin = res.ngramMin;
                _this.ngramMax = res.ngramMax;
                _this.srcLang = res.sourceLanguage;
                _this.targetLanguage = res.targetLanguage;
                _this.userDefinedTranslations = res.userDefinedTranslations;
                _this.translationProbability = res.translationProbability;
                _this.userBlacklistedWords = res.userBlacklistedWords;

                var countedWords = _this.getAllWords(_this.ngramMin, _this.ngramMax);
                console.log(countedWords, _Object$keys(countedWords).length);
                // var filteredWords = this.userDefinedTranslations ?
                //   this.filterToUserDefined(countedWords, this.translationProbability, this.userDefinedTranslations) :
                // this.filter(countedWords, this.translationProbability, this.userDefinedTranslations, this.userBlacklistedWords);
                var filteredWords = _this.filter(countedWords, _this.translationProbability, _this.userDefinedTranslations, _this.userBlacklistedWords);
                console.log(filteredWords);
                _this.requestTranslations(filteredWords, function (tMap) {
                  _this.processTranslations(tMap, _this.userDefinedTranslations);
                });
              } else {
                console.log('switched off');
              }
            });
          }
        }, {
          key: 'getAllWords',
          value: function getAllWords(ngramMin, ngramMax) {
            console.log('getAllWords: ngramMin = ' + ngramMin + '; ngramMax = ' + ngramMax);
            var countedWords = {};
            var paragraphs = document.getElementsByTagName('p');
            console.log('Getting words from all ' + paragraphs.length + ' paragraphs');
            for (var i = 0; i < paragraphs.length; i++) {
              var words = paragraphs[i].innerText.split(/\s|,|[.()]|\d/g);
              for (var j = 0; j < words.length; j++) {
                for (var b = ngramMin; b <= ngramMax; b++) {
                  var word = words.slice(j, j + b).join(' ');
                  if (!(word in countedWords)) {
                    countedWords[word] = 0;
                  }
                  countedWords[word] += 1;
                }
              }
            }
            return countedWords;
          }
        }, {
          key: 'filterToUserDefined',
          value: function filterToUserDefined(countedWords, translationProbability, userDefinedTranslations, userBlacklistedWords) {
            var blackListReg = new RegExp(userBlacklistedWords);
            var a = _Array$from(userDefinedTranslations);
            var b = _Array$from(countedWords);
            var countedWordsList = this.intersect(a, b);
            var targetLength = Math.floor(_Object$keys(countedWords).length * translationProbability / 100);
            return this.toMap(countedWordsList.slice(0, targetLength - 1));
          }
        }, {
          key: 'filter',
          value: function filter(countedWords, translationProbability, userDefinedTranslations, userBlacklistedWords) {
            var blackListReg = new RegExp(userBlacklistedWords);
            var countedWordsList = this.shuffle(this.toList(countedWords, function (word, count) {
              return !!word && word.length >= 2 && // no words that are too short
              word !== '' && !/\d/.test(word) && // no empty words
              word.charAt(0) != word.charAt(0).toUpperCase() && // no proper nouns
              !blackListReg.test(word.toLowerCase()); // no blacklisted words
            }));
            var targetLength = Math.floor(_Object$keys(countedWords).length * translationProbability / 100);
            return this.toMap(countedWordsList.slice(0, targetLength - 1));
          }
        }, {
          key: 'requestTranslations',
          value: function requestTranslations(sourceWords, callback) {
            console.log('requestTranslations');
            console.log('Source Words: ', sourceWords);
            chrome.runtime.sendMessage({
              wordsToBeTranslated: sourceWords
            }, function (response) {
              callback(response.translationMap);
            });
          }
        }, {
          key: 'containsIllegalCharacters',
          value: function containsIllegalCharacters(s) {
            return (/[0-9{}.,;:]/.test(s)
            );
          }
        }, {
          key: 'processTranslations',
          value: function processTranslations(translationMap, userDefinedTMap) {
            var filteredTMap = {};
            for (var w in translationMap) {
              if (w != translationMap[w] && translationMap[w] !== '' && !userDefinedTMap[w] && !this.containsIllegalCharacters(translationMap[w])) {
                filteredTMap[w] = translationMap[w];
              }
            }

            for (w in userDefinedTMap) {
              if (w != userDefinedTMap[w]) {
                filteredTMap[w] = userDefinedTMap[w];
              }
            }

            if (_Object$keys(filteredTMap).length !== 0) {
              var paragraphs = document.getElementsByTagName('p');
              for (var i = 0; i < paragraphs.length; i++) {
                this.deepHTMLReplacement(paragraphs[i], filteredTMap, this.invertMap(filteredTMap));
              }
            }
          }
        }, {
          key: 'deepHTMLReplacement',
          value: function deepHTMLReplacement(node, tMap, iTMap) {
            var badTags = ['TEXTAREA', 'INPUT', 'SCRIPT', 'CODE', 'A'];
            if (node.nodeType == Node.TEXT_NODE) {
              var newNodeValue = this.replaceAll(node.nodeValue, tMap);
              if (newNodeValue != node.nodeValue) {
                node.nodeValue = newNodeValue;
                var parent = node.parentNode;
                parent.innerHTML = this.replaceAll(parent.innerHTML, iTMap);
              }
            } else if (node.nodeType === Node.ELEMENT_NODE && badTags.indexOf(node.tagName) <= -1) {
              var innerNodes = node.childNodes;
              for (var index = 0; index < innerNodes.length - 1; index++) {
                this.deepHTMLReplacement(innerNodes[index], tMap, iTMap);
              }
            }
          }
        }, {
          key: 'replaceAll',
          value: function replaceAll(text, translationMap) {
            var _this2 = this;

            console.log('replaceAll');
            var rExp = '';
            var sortedSourceWords = _Object$keys(translationMap).sort(function sortDescending(w1, w2) {
              return w2.length - w1.length;
            });
            // Construct the rExp string based on the sorted source words.
            sortedSourceWords.forEach(function (sourceWord) {
              rExp += '(\\s' + _this2.escapeRegExp(sourceWord) + '\\s)|';
            });
            rExp = rExp.substring(0, rExp.length - 1);
            // console.log('rExp: ' + rExp);
            var regExp = new RegExp(rExp, 'gm');
            var newText = text.replace(regExp, function (m) {
              if (translationMap[m.substring(1, m.length - 1)] !== null) {
                return ' ' + translationMap[m.substring(1, m.length - 1)] + ' ';
              } else {
                return ' ' + m + ' ';
              }
            });
            console.log(newText);
            return newText;
          }
        }, {
          key: 'invertMap',
          value: function invertMap(map) {
            var iMap = {};
            var swapJs = this.toggleAllElements(this);
            for (var e in map) {
              iMap[map[e]] = '<span data-sl="' + this.srcLang + '" data-tl="' + this.targetLanguage + '" data-query="' + e + '" data-original="' + e + '" data-translated="' + map[e] + '" class="mtwTranslatedWord" onClick="' + swapJs + '">' + map[e] + '</span>';
            }
            return iMap;
          }
        }, {
          key: 'toggleAllElements',
          value: function toggleAllElements() {
            console.log('toggleAllElements start');
            // this.translated = !this.translated;
            var words = document.getElementsByClassName('mtwTranslatedWord');
            for (var i = 0; i < words.length; i++) {
              var word = words[i];
              if (isNaN(word.innerText)) {
                //isNaN returns true if parameter does NOT contain a number
                word.innerText = this.translated ? word.dataset.translated : word.dataset.original;
              }
            }
            console.log('toggleAllElements end');
          }

          /**********************utils*******************************/

        }, {
          key: 'escapeRegExp',
          value: function escapeRegExp(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
          }
        }, {
          key: 'toList',
          value: function toList(map, filter) {
            var list = [];
            for (var item in map) {
              if (filter(item, map[item])) {
                list.push(item);
              }
            }
            return list;
          }
        }, {
          key: 'shuffle',
          value: function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
          }
        }, {
          key: 'toMap',
          value: function toMap(list) {
            var map = {};
            for (var i = 0; i < list.length; i++) {
              map[list[i]] = 1;
            }
            return map;
          }
        }, {
          key: 'intersect',
          value: function intersect() {
            var i,
                all,
                shortest,
                nShortest,
                n,
                len,
                ret = [],
                obj = {},
                nOthers;
            nOthers = arguments.length - 1;
            nShortest = arguments[0].length;
            shortest = 0;
            for (i = 0; i <= nOthers; i++) {
              n = arguments[i].length;
              if (n < nShortest) {
                shortest = i;
                nShortest = n;
              }
            }
            for (i = 0; i <= nOthers; i++) {
              n = i === shortest ? 0 : i || shortest; //Read the shortest array first. Read the first array instead of the shortest
              len = arguments[n].length;
              for (var j = 0; j < len; j++) {
                var elem = arguments[n][j];
                if (obj[elem] === i - 1) {
                  if (i === nOthers) {
                    ret.push(elem);
                    obj[elem] = 0;
                  } else {
                    obj[elem] = i;
                  }
                } else if (i === 0) {
                  obj[elem] = 0;
                }
              }
            }
            return ret;
          }
        }]);

        return ContentScript;
      })();

      _export('ContentScript', ContentScript);
    }
  };
});
$__System.register('1', ['2f'], function (_export) {
  'use strict';

  var ContentScript, MTWTranslator;
  return {
    setters: [function (_f) {
      ContentScript = _f.ContentScript;
    }],
    execute: function () {

      console.log('mtw content script running');

      MTWTranslator = new ContentScript();

      MTWTranslator.translate();
    }
  };
});
})
(function(factory) {
  factory();
});
//# sourceMappingURL=mtw.js.map