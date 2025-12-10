(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $author$project$Main$AttackerMove = {$: 'AttackerMove'};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Main$defaultIVs = {atk: 31, def: 31, hp: 31, spa: 31, spd: 31, spe: 31};
var $author$project$Main$defaultMove = {hits: 1, isCrit: false, name: ''};
var $author$project$Main$defaultStats = {atk: 0, def: 0, hp: 0, spa: 0, spd: 0, spe: 0};
var $author$project$Main$defaultAttacker = {
	ability: 'Static',
	boosts: $author$project$Main$defaultStats,
	curHP: 100,
	evs: {atk: 0, def: 0, hp: 0, spa: 252, spd: 4, spe: 252},
	isDynamaxed: false,
	item: '',
	ivs: $author$project$Main$defaultIVs,
	level: 50,
	moves: _List_fromArray(
		[
			{hits: 1, isCrit: false, name: 'Thunderbolt'},
			{hits: 1, isCrit: false, name: 'Volt Switch'},
			$author$project$Main$defaultMove,
			$author$project$Main$defaultMove
		]),
	nature: 'Timid',
	species: 'Pikachu',
	status: '',
	teraType: ''
};
var $author$project$Main$defaultDefender = {
	ability: 'Blaze',
	boosts: $author$project$Main$defaultStats,
	curHP: 100,
	evs: {atk: 0, def: 0, hp: 0, spa: 252, spd: 4, spe: 252},
	isDynamaxed: false,
	item: '',
	ivs: $author$project$Main$defaultIVs,
	level: 50,
	moves: _List_fromArray(
		[
			{hits: 1, isCrit: false, name: 'Flamethrower'},
			{hits: 1, isCrit: false, name: 'Air Slash'},
			{hits: 1, isCrit: false, name: 'Dragon Pulse'},
			$author$project$Main$defaultMove
		]),
	nature: 'Modest',
	species: 'Charizard',
	status: '',
	teraType: ''
};
var $author$project$Main$defaultSideConditions = {isAuroraVeil: false, isHelpingHand: false, isLightScreen: false, isReflect: false, isSteathRock: false, isTailwind: false, spikes: 0};
var $author$project$Main$defaultField = {attackerSide: $author$project$Main$defaultSideConditions, defenderSide: $author$project$Main$defaultSideConditions, gameType: 'Singles', isGravity: false, terrain: '', weather: ''};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Main$requestAbilityList = _Platform_outgoingPort('requestAbilityList', $elm$json$Json$Encode$int);
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$requestAvailableGames = _Platform_outgoingPort(
	'requestAvailableGames',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$requestItemList = _Platform_outgoingPort('requestItemList', $elm$json$Json$Encode$int);
var $author$project$Main$requestMoveList = _Platform_outgoingPort('requestMoveList', $elm$json$Json$Encode$int);
var $author$project$Main$requestNatureList = _Platform_outgoingPort(
	'requestNatureList',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$requestPokemonList = _Platform_outgoingPort('requestPokemonList', $elm$json$Json$Encode$int);
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$requestTrainerData = _Platform_outgoingPort('requestTrainerData', $elm$json$Json$Encode$string);
var $author$project$Main$init = function (flags) {
	var initialGen = 9;
	var initialGame = 'Scarlet/Violet';
	var initialModel = {abilityList: _List_Nil, allGameData: $elm$core$Dict$empty, attacker: $author$project$Main$defaultAttacker, attackerBaseStatsCollapsed: true, attackerLearnset: $elm$core$Maybe$Nothing, attackerSource: $elm$core$Maybe$Nothing, availableGames: _List_Nil, battleStateCollapsed: true, box: _List_Nil, boxCollapsed: true, defender: $author$project$Main$defaultDefender, defenderBaseStatsCollapsed: true, defenderEditMode: false, defenderLearnset: $elm$core$Maybe$Nothing, dragState: $elm$core$Maybe$Nothing, field: $author$project$Main$defaultField, fieldCollapsed: true, filteredEncounters: _List_Nil, generation: initialGen, itemList: _List_Nil, loading: true, moveList: _List_Nil, natureList: _List_Nil, openDropdown: $elm$core$Maybe$Nothing, pokemonList: _List_Nil, result: $elm$core$Maybe$Nothing, selectedGame: initialGame, selectedMoveIndex: 0, selectedMoveSource: $author$project$Main$AttackerMove, selectedTrainerIndex: 0, settingsLoaded: false, team: _List_Nil, trainerEncounters: _List_Nil, trainerSearchQuery: ''};
	return _Utils_Tuple2(
		initialModel,
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Main$requestPokemonList(initialGen),
					$author$project$Main$requestMoveList(initialGen),
					$author$project$Main$requestItemList(initialGen),
					$author$project$Main$requestAbilityList(initialGen),
					$author$project$Main$requestNatureList(_Utils_Tuple0),
					$author$project$Main$requestAvailableGames(_Utils_Tuple0),
					$author$project$Main$requestTrainerData(initialGame)
				])));
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$LoadedSettings = function (a) {
	return {$: 'LoadedSettings', a: a};
};
var $author$project$Main$ReceivedAbilityList = function (a) {
	return {$: 'ReceivedAbilityList', a: a};
};
var $author$project$Main$ReceivedAttackerLearnset = function (a) {
	return {$: 'ReceivedAttackerLearnset', a: a};
};
var $author$project$Main$ReceivedAvailableGames = function (a) {
	return {$: 'ReceivedAvailableGames', a: a};
};
var $author$project$Main$ReceivedCalculation = function (a) {
	return {$: 'ReceivedCalculation', a: a};
};
var $author$project$Main$ReceivedItemList = function (a) {
	return {$: 'ReceivedItemList', a: a};
};
var $author$project$Main$ReceivedMoveList = function (a) {
	return {$: 'ReceivedMoveList', a: a};
};
var $author$project$Main$ReceivedNatureList = function (a) {
	return {$: 'ReceivedNatureList', a: a};
};
var $author$project$Main$ReceivedPokemonList = function (a) {
	return {$: 'ReceivedPokemonList', a: a};
};
var $author$project$Main$ReceivedTrainerData = function (a) {
	return {$: 'ReceivedTrainerData', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$loadFromLocalStorage = _Platform_incomingPort('loadFromLocalStorage', $elm$json$Json$Decode$value);
var $author$project$Main$receiveAbilityList = _Platform_incomingPort('receiveAbilityList', $elm$json$Json$Decode$value);
var $author$project$Main$receiveAvailableGames = _Platform_incomingPort('receiveAvailableGames', $elm$json$Json$Decode$value);
var $author$project$Main$receiveCalculation = _Platform_incomingPort('receiveCalculation', $elm$json$Json$Decode$value);
var $author$project$Main$receiveItemList = _Platform_incomingPort('receiveItemList', $elm$json$Json$Decode$value);
var $author$project$Main$receiveLearnset = _Platform_incomingPort('receiveLearnset', $elm$json$Json$Decode$value);
var $author$project$Main$receiveMoveList = _Platform_incomingPort('receiveMoveList', $elm$json$Json$Decode$value);
var $author$project$Main$receiveNatureList = _Platform_incomingPort('receiveNatureList', $elm$json$Json$Decode$value);
var $author$project$Main$receivePokemonList = _Platform_incomingPort('receivePokemonList', $elm$json$Json$Decode$value);
var $author$project$Main$receiveTrainerData = _Platform_incomingPort('receiveTrainerData', $elm$json$Json$Decode$value);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$receiveCalculation($author$project$Main$ReceivedCalculation),
				$author$project$Main$receivePokemonList($author$project$Main$ReceivedPokemonList),
				$author$project$Main$receiveMoveList($author$project$Main$ReceivedMoveList),
				$author$project$Main$receiveItemList($author$project$Main$ReceivedItemList),
				$author$project$Main$receiveAbilityList($author$project$Main$ReceivedAbilityList),
				$author$project$Main$receiveNatureList($author$project$Main$ReceivedNatureList),
				$author$project$Main$receiveLearnset($author$project$Main$ReceivedAttackerLearnset),
				$author$project$Main$loadFromLocalStorage($author$project$Main$LoadedSettings),
				$author$project$Main$receiveAvailableGames($author$project$Main$ReceivedAvailableGames),
				$author$project$Main$receiveTrainerData($author$project$Main$ReceivedTrainerData)
			]));
};
var $author$project$Main$DefenderMove = {$: 'DefenderMove'};
var $author$project$Main$FromBox = function (a) {
	return {$: 'FromBox', a: a};
};
var $author$project$Main$FromTeam = function (a) {
	return {$: 'FromTeam', a: a};
};
var $author$project$Main$MoveToBox = function (a) {
	return {$: 'MoveToBox', a: a};
};
var $author$project$Main$MoveToTeam = function (a) {
	return {$: 'MoveToTeam', a: a};
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$abilityListDecoder = A2(
	$elm$json$Json$Decode$field,
	'abilities',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$Main$applyAbilityAutoTriggers = F2(
	function (model, ability) {
		var field = model.field;
		switch (ability) {
			case 'Drought':
				return _Utils_update(
					model,
					{
						field: _Utils_update(
							field,
							{weather: 'Sun'})
					});
			case 'Drizzle':
				return _Utils_update(
					model,
					{
						field: _Utils_update(
							field,
							{weather: 'Rain'})
					});
			case 'Sand Stream':
				return _Utils_update(
					model,
					{
						field: _Utils_update(
							field,
							{weather: 'Sand'})
					});
			case 'Snow Warning':
				return _Utils_update(
					model,
					{
						field: _Utils_update(
							field,
							{weather: 'Snow'})
					});
			case 'Air Lock':
				return _Utils_update(
					model,
					{
						field: _Utils_update(
							field,
							{weather: 'None'})
					});
			case 'Cloud Nine':
				return _Utils_update(
					model,
					{
						field: _Utils_update(
							field,
							{weather: 'None'})
					});
			default:
				return model;
		}
	});
var $author$project$Main$applyItemAutoTriggers = F3(
	function (model, item, isAttacker) {
		switch (item) {
			case 'Flame Orb':
				if (isAttacker) {
					var attacker = model.attacker;
					return _Utils_update(
						model,
						{
							attacker: _Utils_update(
								attacker,
								{status: 'Burn'})
						});
				} else {
					var defender = model.defender;
					return _Utils_update(
						model,
						{
							defender: _Utils_update(
								defender,
								{status: 'Burn'})
						});
				}
			case 'Toxic Orb':
				if (isAttacker) {
					var attacker = model.attacker;
					return _Utils_update(
						model,
						{
							attacker: _Utils_update(
								attacker,
								{status: 'Poison'})
						});
				} else {
					var defender = model.defender;
					return _Utils_update(
						model,
						{
							defender: _Utils_update(
								defender,
								{status: 'Poison'})
						});
				}
			default:
				return model;
		}
	});
var $author$project$Main$availableGamesDecoder = A2(
	$elm$json$Json$Decode$field,
	'games',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
var $author$project$Main$CalculationResult = F4(
	function (attackerResults, defenderResults, attackerSpeed, defenderSpeed) {
		return {attackerResults: attackerResults, attackerSpeed: attackerSpeed, defenderResults: defenderResults, defenderSpeed: defenderSpeed};
	});
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Main$MoveResult = F6(
	function (moveName, damage, damagePercent, description, koChance, damageRolls) {
		return {damage: damage, damagePercent: damagePercent, damageRolls: damageRolls, description: description, koChance: koChance, moveName: moveName};
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$json$Json$Decode$map6 = _Json_map6;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Main$moveResultDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Main$MoveResult,
	A2($elm$json$Json$Decode$field, 'moveName', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'damage',
		A3(
			$elm$json$Json$Decode$map2,
			$elm$core$Tuple$pair,
			A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$int),
			A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$int))),
	A2(
		$elm$json$Json$Decode$field,
		'damagePercent',
		A3(
			$elm$json$Json$Decode$map2,
			$elm$core$Tuple$pair,
			A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$float))),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'koChance', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'damageRolls',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int)));
var $author$project$Main$calculationResultDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$CalculationResult,
	A2(
		$elm$json$Json$Decode$field,
		'attackerResults',
		$elm$json$Json$Decode$list($author$project$Main$moveResultDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'defenderResults',
		$elm$json$Json$Decode$list($author$project$Main$moveResultDecoder)),
	A2($elm$json$Json$Decode$field, 'attackerSpeed', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'defenderSpeed', $elm$json$Json$Decode$int));
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Main$getStarterMoves = function (species) {
	var moveName1 = function () {
		switch (species) {
			case 'Bulbasaur':
				return 'Tackle';
			case 'Charmander':
				return 'Scratch';
			case 'Squirtle':
				return 'Tackle';
			case 'Chikorita':
				return 'Tackle';
			case 'Cyndaquil':
				return 'Tackle';
			case 'Totodile':
				return 'Scratch';
			case 'Treecko':
				return 'Pound';
			case 'Torchic':
				return 'Scratch';
			case 'Mudkip':
				return 'Tackle';
			case 'Turtwig':
				return 'Tackle';
			case 'Chimchar':
				return 'Scratch';
			case 'Piplup':
				return 'Pound';
			case 'Snivy':
				return 'Tackle';
			case 'Tepig':
				return 'Tackle';
			case 'Oshawott':
				return 'Tackle';
			case 'Chespin':
				return 'Tackle';
			case 'Fennekin':
				return 'Scratch';
			case 'Froakie':
				return 'Pound';
			case 'Rowlet':
				return 'Tackle';
			case 'Litten':
				return 'Scratch';
			case 'Popplio':
				return 'Pound';
			case 'Grookey':
				return 'Scratch';
			case 'Scorbunny':
				return 'Tackle';
			case 'Sobble':
				return 'Pound';
			case 'Sprigatito':
				return 'Scratch';
			case 'Fuecoco':
				return 'Tackle';
			case 'Quaxly':
				return 'Pound';
			default:
				return 'Tackle';
		}
	}();
	return _List_fromArray(
		[
			{hits: 1, isCrit: false, name: moveName1},
			{hits: 1, isCrit: false, name: ''},
			{hits: 1, isCrit: false, name: ''},
			{hits: 1, isCrit: false, name: ''}
		]);
};
var $author$project$Main$createStarterPokemonState = F2(
	function (generation, species) {
		var moves = $author$project$Main$getStarterMoves(species);
		var defaultIv = 15;
		var defaultDv = 8;
		var ivs = (generation <= 2) ? {atk: defaultDv * 2, def: defaultDv * 2, hp: defaultDv * 2, spa: defaultDv * 2, spd: defaultDv * 2, spe: defaultDv * 2} : {atk: defaultIv, def: defaultIv, hp: defaultIv, spa: defaultIv, spd: defaultIv, spe: defaultIv};
		return {
			ability: '',
			boosts: $author$project$Main$defaultStats,
			curHP: 100,
			evs: {atk: 0, def: 0, hp: 0, spa: 0, spd: 0, spe: 0},
			isDynamaxed: false,
			item: '',
			ivs: ivs,
			level: 5,
			moves: moves,
			nature: 'Hardy',
			species: species,
			status: '',
			teraType: ''
		};
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Main$encodeSideConditions = function (side) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'isReflect',
				$elm$json$Json$Encode$bool(side.isReflect)),
				_Utils_Tuple2(
				'isLightScreen',
				$elm$json$Json$Encode$bool(side.isLightScreen)),
				_Utils_Tuple2(
				'isAuroraVeil',
				$elm$json$Json$Encode$bool(side.isAuroraVeil)),
				_Utils_Tuple2(
				'isTailwind',
				$elm$json$Json$Encode$bool(side.isTailwind)),
				_Utils_Tuple2(
				'isHelpingHand',
				$elm$json$Json$Encode$bool(side.isHelpingHand)),
				_Utils_Tuple2(
				'spikes',
				$elm$json$Json$Encode$int(side.spikes)),
				_Utils_Tuple2(
				'isSR',
				$elm$json$Json$Encode$bool(side.isSteathRock))
			]));
};
var $author$project$Main$encodeField = function (field) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'gameType',
				$elm$json$Json$Encode$string(field.gameType)),
				_Utils_Tuple2(
				'weather',
				$elm$json$Json$Encode$string(field.weather)),
				_Utils_Tuple2(
				'terrain',
				$elm$json$Json$Encode$string(field.terrain)),
				_Utils_Tuple2(
				'isGravity',
				$elm$json$Json$Encode$bool(field.isGravity)),
				_Utils_Tuple2(
				'attackerSide',
				$author$project$Main$encodeSideConditions(field.attackerSide)),
				_Utils_Tuple2(
				'defenderSide',
				$author$project$Main$encodeSideConditions(field.defenderSide))
			]));
};
var $author$project$Main$encodeMove = function (move) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(move.name)),
				_Utils_Tuple2(
				'isCrit',
				$elm$json$Json$Encode$bool(move.isCrit)),
				_Utils_Tuple2(
				'hits',
				$elm$json$Json$Encode$int(move.hits))
			]));
};
var $author$project$Main$encodeStats = function (stats) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'hp',
				$elm$json$Json$Encode$int(stats.hp)),
				_Utils_Tuple2(
				'atk',
				$elm$json$Json$Encode$int(stats.atk)),
				_Utils_Tuple2(
				'def',
				$elm$json$Json$Encode$int(stats.def)),
				_Utils_Tuple2(
				'spa',
				$elm$json$Json$Encode$int(stats.spa)),
				_Utils_Tuple2(
				'spd',
				$elm$json$Json$Encode$int(stats.spd)),
				_Utils_Tuple2(
				'spe',
				$elm$json$Json$Encode$int(stats.spe))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Main$encodePokemon = function (pokemon) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'species',
				$elm$json$Json$Encode$string(pokemon.species)),
				_Utils_Tuple2(
				'level',
				$elm$json$Json$Encode$int(pokemon.level)),
				_Utils_Tuple2(
				'nature',
				$elm$json$Json$Encode$string(pokemon.nature)),
				_Utils_Tuple2(
				'ability',
				$elm$json$Json$Encode$string(pokemon.ability)),
				_Utils_Tuple2(
				'item',
				$elm$json$Json$Encode$string(pokemon.item)),
				_Utils_Tuple2(
				'evs',
				$author$project$Main$encodeStats(pokemon.evs)),
				_Utils_Tuple2(
				'ivs',
				$author$project$Main$encodeStats(pokemon.ivs)),
				_Utils_Tuple2(
				'boosts',
				$author$project$Main$encodeStats(pokemon.boosts)),
				_Utils_Tuple2(
				'status',
				$elm$json$Json$Encode$string(pokemon.status)),
				_Utils_Tuple2(
				'curHP',
				$elm$json$Json$Encode$int(pokemon.curHP)),
				_Utils_Tuple2(
				'teraType',
				$elm$json$Json$Encode$string(pokemon.teraType)),
				_Utils_Tuple2(
				'isDynamaxed',
				$elm$json$Json$Encode$bool(pokemon.isDynamaxed)),
				_Utils_Tuple2(
				'moves',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeMove, pokemon.moves))
			]));
};
var $author$project$Main$encodeCalculationRequest = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'generation',
				$elm$json$Json$Encode$int(model.generation)),
				_Utils_Tuple2(
				'attacker',
				$author$project$Main$encodePokemon(model.attacker)),
				_Utils_Tuple2(
				'defender',
				$author$project$Main$encodePokemon(model.defender)),
				_Utils_Tuple2(
				'moves',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeMove, model.attacker.moves)),
				_Utils_Tuple2(
				'field',
				$author$project$Main$encodeField(model.field))
			]));
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(_Utils_Tuple0),
				dictionary));
	});
var $author$project$Main$encodePokemonSource = function (maybeSource) {
	if (maybeSource.$ === 'Just') {
		if (maybeSource.a.$ === 'FromTeam') {
			var index = maybeSource.a.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('team')),
						_Utils_Tuple2(
						'index',
						$elm$json$Json$Encode$int(index))
					]));
		} else {
			var index = maybeSource.a.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('box')),
						_Utils_Tuple2(
						'index',
						$elm$json$Json$Encode$int(index))
					]));
		}
	} else {
		return $elm$json$Json$Encode$null;
	}
};
var $author$project$Main$encodeGameSaveData = function (data) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'team',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodePokemon, data.team)),
				_Utils_Tuple2(
				'box',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodePokemon, data.box)),
				_Utils_Tuple2(
				'attackerSource',
				$author$project$Main$encodePokemonSource(data.attackerSource)),
				_Utils_Tuple2(
				'attacker',
				function () {
					var _v0 = data.attacker;
					if (_v0.$ === 'Just') {
						var pokemon = _v0.a;
						return $author$project$Main$encodePokemon(pokemon);
					} else {
						return $elm$json$Json$Encode$null;
					}
				}()),
				_Utils_Tuple2(
				'defender',
				function () {
					var _v1 = data.defender;
					if (_v1.$ === 'Just') {
						var pokemon = _v1.a;
						return $author$project$Main$encodePokemon(pokemon);
					} else {
						return $elm$json$Json$Encode$null;
					}
				}()),
				_Utils_Tuple2(
				'selectedTrainerIndex',
				$elm$json$Json$Encode$int(data.selectedTrainerIndex))
			]));
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $author$project$Main$encodeSettings = function (model) {
	var currentGameData = {
		attacker: $elm$core$Maybe$Just(model.attacker),
		attackerSource: model.attackerSource,
		box: model.box,
		defender: $elm$core$Maybe$Just(model.defender),
		selectedTrainerIndex: model.selectedTrainerIndex,
		team: model.team
	};
	var updatedGameData = $elm$core$String$isEmpty(model.selectedGame) ? model.allGameData : A3($elm$core$Dict$insert, model.selectedGame, currentGameData, model.allGameData);
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'currentGame',
				$elm$json$Json$Encode$string(model.selectedGame)),
				_Utils_Tuple2(
				'gameData',
				A3($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $author$project$Main$encodeGameSaveData, updatedGameData))
			]));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$Main$filterEncounters = F2(
	function (query, encounters) {
		if ($elm$core$String$isEmpty(query)) {
			return encounters;
		} else {
			var lowerQuery = $elm$core$String$toLower(query);
			return A2(
				$elm$core$List$filter,
				function (encounter) {
					return A2(
						$elm$core$String$contains,
						lowerQuery,
						$elm$core$String$toLower(encounter.trainerName)) || (A2(
						$elm$core$String$contains,
						lowerQuery,
						$elm$core$String$toLower(encounter.trainerClass)) || (A2(
						$elm$core$String$contains,
						lowerQuery,
						$elm$core$String$toLower(encounter.location)) || A2(
						$elm$core$List$any,
						function (pokemon) {
							return A2(
								$elm$core$String$contains,
								lowerQuery,
								$elm$core$String$toLower(pokemon.species));
						},
						encounter.team)));
				},
				encounters);
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Main$findEncounterIndex = F2(
	function (target, encounters) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$first,
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var enc = _v0.b;
						return _Utils_eq(enc.trainerName, target.trainerName) && (_Utils_eq(enc.location, target.location) && _Utils_eq(enc.trainerClass, target.trainerClass));
					},
					A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, encounters))));
	});
var $author$project$Main$gameToGeneration = function (game) {
	switch (game) {
		case 'Red/Blue':
			return 1;
		case 'Yellow':
			return 1;
		case 'Gold/Silver':
			return 2;
		case 'Crystal':
			return 2;
		case 'Ruby/Sapphire':
			return 3;
		case 'Emerald':
			return 3;
		case 'FireRed/LeafGreen':
			return 3;
		case 'Diamond/Pearl':
			return 4;
		case 'Platinum':
			return 4;
		case 'HeartGold/SoulSilver':
			return 4;
		case 'Black/White':
			return 5;
		case 'Black2/White2':
			return 5;
		case 'X/Y':
			return 6;
		case 'OmegaRuby/AlphaSapphire':
			return 6;
		case 'Sun/Moon':
			return 7;
		case 'UltraSun/UltraMoon':
			return 7;
		case 'Sword/Shield':
			return 8;
		case 'BrilliantDiamond/ShiningPearl':
			return 8;
		case 'Scarlet/Violet':
			return 9;
		default:
			return 9;
	}
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Main$getPlayerStarterFromRival = F2(
	function (generation, rivalPokemon) {
		switch (generation) {
			case 1:
				switch (rivalPokemon) {
					case 'Charmander':
						return 'Bulbasaur';
					case 'Squirtle':
						return 'Charmander';
					case 'Bulbasaur':
						return 'Squirtle';
					case 'Charmeleon':
						return 'Bulbasaur';
					case 'Wartortle':
						return 'Charmander';
					case 'Ivysaur':
						return 'Squirtle';
					case 'Charizard':
						return 'Bulbasaur';
					case 'Blastoise':
						return 'Charmander';
					case 'Venusaur':
						return 'Squirtle';
					default:
						return 'Bulbasaur';
				}
			case 2:
				switch (rivalPokemon) {
					case 'Cyndaquil':
						return 'Chikorita';
					case 'Totodile':
						return 'Cyndaquil';
					case 'Chikorita':
						return 'Totodile';
					case 'Quilava':
						return 'Chikorita';
					case 'Croconaw':
						return 'Cyndaquil';
					case 'Bayleef':
						return 'Totodile';
					case 'Typhlosion':
						return 'Chikorita';
					case 'Feraligatr':
						return 'Cyndaquil';
					case 'Meganium':
						return 'Totodile';
					default:
						return 'Cyndaquil';
				}
			case 3:
				switch (rivalPokemon) {
					case 'Treecko':
						return 'Mudkip';
					case 'Torchic':
						return 'Treecko';
					case 'Mudkip':
						return 'Torchic';
					case 'Grovyle':
						return 'Mudkip';
					case 'Combusken':
						return 'Treecko';
					case 'Marshtomp':
						return 'Torchic';
					case 'Sceptile':
						return 'Mudkip';
					case 'Blaziken':
						return 'Treecko';
					case 'Swampert':
						return 'Torchic';
					case 'Charmander':
						return 'Bulbasaur';
					case 'Squirtle':
						return 'Charmander';
					case 'Bulbasaur':
						return 'Squirtle';
					case 'Charizard':
						return 'Bulbasaur';
					case 'Blastoise':
						return 'Charmander';
					case 'Venusaur':
						return 'Squirtle';
					default:
						return 'Treecko';
				}
			case 4:
				switch (rivalPokemon) {
					case 'Turtwig':
						return 'Chimchar';
					case 'Chimchar':
						return 'Piplup';
					case 'Piplup':
						return 'Turtwig';
					case 'Grotle':
						return 'Chimchar';
					case 'Monferno':
						return 'Piplup';
					case 'Prinplup':
						return 'Turtwig';
					case 'Torterra':
						return 'Chimchar';
					case 'Infernape':
						return 'Piplup';
					case 'Empoleon':
						return 'Turtwig';
					case 'Cyndaquil':
						return 'Chikorita';
					case 'Totodile':
						return 'Cyndaquil';
					case 'Chikorita':
						return 'Totodile';
					default:
						return 'Turtwig';
				}
			case 5:
				switch (rivalPokemon) {
					case 'Snivy':
						return 'Tepig';
					case 'Tepig':
						return 'Oshawott';
					case 'Oshawott':
						return 'Snivy';
					case 'Servine':
						return 'Tepig';
					case 'Pignite':
						return 'Oshawott';
					case 'Dewott':
						return 'Snivy';
					case 'Serperior':
						return 'Tepig';
					case 'Emboar':
						return 'Oshawott';
					case 'Samurott':
						return 'Snivy';
					default:
						return 'Snivy';
				}
			case 6:
				switch (rivalPokemon) {
					case 'Chespin':
						return 'Fennekin';
					case 'Fennekin':
						return 'Froakie';
					case 'Froakie':
						return 'Chespin';
					case 'Quilladin':
						return 'Fennekin';
					case 'Braixen':
						return 'Froakie';
					case 'Frogadier':
						return 'Chespin';
					case 'Chesnaught':
						return 'Fennekin';
					case 'Delphox':
						return 'Froakie';
					case 'Greninja':
						return 'Chespin';
					case 'Treecko':
						return 'Mudkip';
					case 'Torchic':
						return 'Treecko';
					case 'Mudkip':
						return 'Torchic';
					default:
						return 'Chespin';
				}
			case 7:
				switch (rivalPokemon) {
					case 'Rowlet':
						return 'Litten';
					case 'Litten':
						return 'Popplio';
					case 'Popplio':
						return 'Rowlet';
					case 'Dartrix':
						return 'Litten';
					case 'Torracat':
						return 'Popplio';
					case 'Brionne':
						return 'Rowlet';
					case 'Decidueye':
						return 'Litten';
					case 'Incineroar':
						return 'Popplio';
					case 'Primarina':
						return 'Rowlet';
					default:
						return 'Rowlet';
				}
			case 8:
				switch (rivalPokemon) {
					case 'Grookey':
						return 'Scorbunny';
					case 'Scorbunny':
						return 'Sobble';
					case 'Sobble':
						return 'Grookey';
					case 'Thwackey':
						return 'Scorbunny';
					case 'Raboot':
						return 'Sobble';
					case 'Drizzile':
						return 'Grookey';
					case 'Rillaboom':
						return 'Scorbunny';
					case 'Cinderace':
						return 'Sobble';
					case 'Inteleon':
						return 'Grookey';
					case 'Turtwig':
						return 'Chimchar';
					case 'Chimchar':
						return 'Piplup';
					case 'Piplup':
						return 'Turtwig';
					default:
						return 'Grookey';
				}
			case 9:
				switch (rivalPokemon) {
					case 'Sprigatito':
						return 'Fuecoco';
					case 'Fuecoco':
						return 'Quaxly';
					case 'Quaxly':
						return 'Sprigatito';
					case 'Floragato':
						return 'Fuecoco';
					case 'Crocalor':
						return 'Quaxly';
					case 'Quaxwell':
						return 'Sprigatito';
					case 'Meowscarada':
						return 'Fuecoco';
					case 'Skeledirge':
						return 'Quaxly';
					case 'Quaquaval':
						return 'Sprigatito';
					default:
						return 'Sprigatito';
				}
			default:
				return 'Pikachu';
		}
	});
var $author$project$Main$getSelectedEncounter = function (model) {
	return $elm$core$List$head(
		A2($elm$core$List$drop, model.selectedTrainerIndex, model.trainerEncounters));
};
var $author$project$Main$itemListDecoder = A2(
	$elm$json$Json$Decode$field,
	'items',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
var $author$project$Main$LearnsetData = F6(
	function (species, levelup, tm, tutor, egg, other) {
		return {egg: egg, levelup: levelup, other: other, species: species, tm: tm, tutor: tutor};
	});
var $author$project$Main$learnsetDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Main$LearnsetData,
	A2($elm$json$Json$Decode$field, 'species', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'levelup',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'tm',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'tutor',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'egg',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'other',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Main$MoveData = F6(
	function (name, moveType, category, basePower, accuracy, isMultihit) {
		return {accuracy: accuracy, basePower: basePower, category: category, isMultihit: isMultihit, moveType: moveType, name: name};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Main$moveListDecoder = A2(
	$elm$json$Json$Decode$field,
	'moves',
	$elm$json$Json$Decode$list(
		A7(
			$elm$json$Json$Decode$map6,
			$author$project$Main$MoveData,
			A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'category', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'basePower', $elm$json$Json$Decode$int),
			A2($elm$json$Json$Decode$field, 'accuracy', $elm$json$Json$Decode$int),
			A2($elm$json$Json$Decode$field, 'isMultihit', $elm$json$Json$Decode$bool))));
var $author$project$Main$NatureData = F3(
	function (name, plus, minus) {
		return {minus: minus, name: name, plus: plus};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$Main$natureListDecoder = A2(
	$elm$json$Json$Decode$field,
	'natures',
	$elm$json$Json$Decode$list(
		A4(
			$elm$json$Json$Decode$map3,
			$author$project$Main$NatureData,
			A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2($elm$json$Json$Decode$field, 'plus', $elm$json$Json$Decode$string),
						$elm$json$Json$Decode$succeed('')
					])),
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2($elm$json$Json$Decode$field, 'minus', $elm$json$Json$Decode$string),
						$elm$json$Json$Decode$succeed('')
					])))));
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$PokemonData = function (name) {
	return function (types) {
		return function (baseStats) {
			return function (abilities) {
				return function (weightkg) {
					return function (prevo) {
						return function (evos) {
							return function (nfe) {
								return function (baseSpecies) {
									return function (forme) {
										return function (otherFormes) {
											return function (spriteUrl) {
												return function (spriteWidth) {
													return function (spriteHeight) {
														return function (isPixelated) {
															return {abilities: abilities, baseSpecies: baseSpecies, baseStats: baseStats, evos: evos, forme: forme, isPixelated: isPixelated, name: name, nfe: nfe, otherFormes: otherFormes, prevo: prevo, spriteHeight: spriteHeight, spriteUrl: spriteUrl, spriteWidth: spriteWidth, types: types, weightkg: weightkg};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Main$andMap = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $author$project$Main$Stats = F6(
	function (hp, atk, def, spa, spd, spe) {
		return {atk: atk, def: def, hp: hp, spa: spa, spd: spd, spe: spe};
	});
var $author$project$Main$statsDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Main$Stats,
	A2($elm$json$Json$Decode$field, 'hp', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'atk', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'def', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'spa', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'spd', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'spe', $elm$json$Json$Decode$int));
var $author$project$Main$pokemonDataDecoder = A2(
	$author$project$Main$andMap,
	A2($elm$json$Json$Decode$field, 'isPixelated', $elm$json$Json$Decode$bool),
	A2(
		$author$project$Main$andMap,
		A2($elm$json$Json$Decode$field, 'spriteHeight', $elm$json$Json$Decode$int),
		A2(
			$author$project$Main$andMap,
			A2($elm$json$Json$Decode$field, 'spriteWidth', $elm$json$Json$Decode$int),
			A2(
				$author$project$Main$andMap,
				A2($elm$json$Json$Decode$field, 'spriteUrl', $elm$json$Json$Decode$string),
				A2(
					$author$project$Main$andMap,
					A2(
						$elm$json$Json$Decode$field,
						'otherFormes',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
					A2(
						$author$project$Main$andMap,
						A2($elm$json$Json$Decode$field, 'forme', $elm$json$Json$Decode$string),
						A2(
							$author$project$Main$andMap,
							A2(
								$elm$json$Json$Decode$field,
								'baseSpecies',
								$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string)),
							A2(
								$author$project$Main$andMap,
								A2($elm$json$Json$Decode$field, 'nfe', $elm$json$Json$Decode$bool),
								A2(
									$author$project$Main$andMap,
									A2(
										$elm$json$Json$Decode$field,
										'evos',
										$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
									A2(
										$author$project$Main$andMap,
										A2(
											$elm$json$Json$Decode$field,
											'prevo',
											$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string)),
										A2(
											$author$project$Main$andMap,
											A2($elm$json$Json$Decode$field, 'weightkg', $elm$json$Json$Decode$float),
											A2(
												$author$project$Main$andMap,
												A2(
													$elm$json$Json$Decode$field,
													'abilities',
													$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
												A2(
													$author$project$Main$andMap,
													A2($elm$json$Json$Decode$field, 'baseStats', $author$project$Main$statsDecoder),
													A2(
														$author$project$Main$andMap,
														A2(
															$elm$json$Json$Decode$field,
															'types',
															$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
														A2(
															$author$project$Main$andMap,
															A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
															$elm$json$Json$Decode$succeed($author$project$Main$PokemonData))))))))))))))));
var $author$project$Main$pokemonListDecoder = A2(
	$elm$json$Json$Decode$field,
	'pokemon',
	$elm$json$Json$Decode$list($author$project$Main$pokemonDataDecoder));
var $author$project$Main$requestCalculation = _Platform_outgoingPort('requestCalculation', $elm$core$Basics$identity);
var $author$project$Main$requestLearnset = _Platform_outgoingPort(
	'requestLearnset',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'generation',
					$elm$json$Json$Encode$int($.generation)),
					_Utils_Tuple2(
					'species',
					$elm$json$Json$Encode$string($.species))
				]));
	});
var $author$project$Main$saveToLocalStorage = _Platform_outgoingPort('saveToLocalStorage', $elm$core$Basics$identity);
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Main$Settings = F2(
	function (currentGame, gameData) {
		return {currentGame: currentGame, gameData: gameData};
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$Main$GameSaveData = F6(
	function (team, box, attackerSource, attacker, defender, selectedTrainerIndex) {
		return {attacker: attacker, attackerSource: attackerSource, box: box, defender: defender, selectedTrainerIndex: selectedTrainerIndex, team: team};
	});
var $author$project$Main$PokemonState = function (species) {
	return function (level) {
		return function (nature) {
			return function (ability) {
				return function (item) {
					return function (evs) {
						return function (ivs) {
							return function (boosts) {
								return function (status) {
									return function (curHP) {
										return function (teraType) {
											return function (isDynamaxed) {
												return function (moves) {
													return {ability: ability, boosts: boosts, curHP: curHP, evs: evs, isDynamaxed: isDynamaxed, item: item, ivs: ivs, level: level, moves: moves, nature: nature, species: species, status: status, teraType: teraType};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Main$MoveState = F3(
	function (name, isCrit, hits) {
		return {hits: hits, isCrit: isCrit, name: name};
	});
var $author$project$Main$moveStateDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$MoveState,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'isCrit', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'hits', $elm$json$Json$Decode$int));
var $author$project$Main$pokemonDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (f) {
		return A2(
			$elm$json$Json$Decode$map,
			f,
			A2(
				$elm$json$Json$Decode$field,
				'moves',
				$elm$json$Json$Decode$list($author$project$Main$moveStateDecoder)));
	},
	A2(
		$elm$json$Json$Decode$andThen,
		function (f) {
			return A2(
				$elm$json$Json$Decode$map,
				f,
				$elm$json$Json$Decode$oneOf(
					_List_fromArray(
						[
							A2($elm$json$Json$Decode$field, 'isDynamaxed', $elm$json$Json$Decode$bool),
							$elm$json$Json$Decode$succeed(false)
						])));
		},
		A2(
			$elm$json$Json$Decode$andThen,
			function (f) {
				return A2(
					$elm$json$Json$Decode$map,
					f,
					$elm$json$Json$Decode$oneOf(
						_List_fromArray(
							[
								A2($elm$json$Json$Decode$field, 'teraType', $elm$json$Json$Decode$string),
								$elm$json$Json$Decode$succeed('')
							])));
			},
			A2(
				$elm$json$Json$Decode$andThen,
				function (f) {
					return A2(
						$elm$json$Json$Decode$map,
						f,
						A2($elm$json$Json$Decode$field, 'curHP', $elm$json$Json$Decode$int));
				},
				A2(
					$elm$json$Json$Decode$andThen,
					function (f) {
						return A2(
							$elm$json$Json$Decode$map,
							f,
							A2($elm$json$Json$Decode$field, 'status', $elm$json$Json$Decode$string));
					},
					A2(
						$elm$json$Json$Decode$andThen,
						function (f) {
							return A2(
								$elm$json$Json$Decode$map,
								f,
								$elm$json$Json$Decode$oneOf(
									_List_fromArray(
										[
											A2($elm$json$Json$Decode$field, 'boosts', $author$project$Main$statsDecoder),
											$elm$json$Json$Decode$succeed($author$project$Main$defaultStats)
										])));
						},
						A2(
							$elm$json$Json$Decode$andThen,
							function (f) {
								return A2(
									$elm$json$Json$Decode$map,
									f,
									$elm$json$Json$Decode$oneOf(
										_List_fromArray(
											[
												A2($elm$json$Json$Decode$field, 'ivs', $author$project$Main$statsDecoder),
												$elm$json$Json$Decode$succeed($author$project$Main$defaultIVs)
											])));
							},
							A2(
								$elm$json$Json$Decode$andThen,
								function (f) {
									return A2(
										$elm$json$Json$Decode$map,
										f,
										$elm$json$Json$Decode$oneOf(
											_List_fromArray(
												[
													A2($elm$json$Json$Decode$field, 'evs', $author$project$Main$statsDecoder),
													$elm$json$Json$Decode$succeed($author$project$Main$defaultStats)
												])));
								},
								A2(
									$elm$json$Json$Decode$andThen,
									function (f) {
										return A2(
											$elm$json$Json$Decode$map,
											f,
											A2($elm$json$Json$Decode$field, 'item', $elm$json$Json$Decode$string));
									},
									A2(
										$elm$json$Json$Decode$andThen,
										function (f) {
											return A2(
												$elm$json$Json$Decode$map,
												f,
												A2($elm$json$Json$Decode$field, 'ability', $elm$json$Json$Decode$string));
										},
										A2(
											$elm$json$Json$Decode$andThen,
											function (f) {
												return A2(
													$elm$json$Json$Decode$map,
													f,
													A2($elm$json$Json$Decode$field, 'nature', $elm$json$Json$Decode$string));
											},
											A2(
												$elm$json$Json$Decode$andThen,
												function (f) {
													return A2(
														$elm$json$Json$Decode$map,
														f,
														A2($elm$json$Json$Decode$field, 'level', $elm$json$Json$Decode$int));
												},
												A2(
													$elm$json$Json$Decode$andThen,
													function (f) {
														return A2(
															$elm$json$Json$Decode$map,
															f,
															A2($elm$json$Json$Decode$field, 'species', $elm$json$Json$Decode$string));
													},
													$elm$json$Json$Decode$succeed($author$project$Main$PokemonState))))))))))))));
var $author$project$Main$pokemonSourceDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			$elm$json$Json$Decode$map2,
			F2(
				function (sourceType, index) {
					switch (sourceType) {
						case 'team':
							return $elm$core$Maybe$Just(
								$author$project$Main$FromTeam(index));
						case 'box':
							return $elm$core$Maybe$Just(
								$author$project$Main$FromBox(index));
						default:
							return $elm$core$Maybe$Nothing;
					}
				}),
			A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'index', $elm$json$Json$Decode$int)),
			$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
		]));
var $author$project$Main$gameSaveDataDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Main$GameSaveData,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'team',
				$elm$json$Json$Decode$list($author$project$Main$pokemonDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'box',
				$elm$json$Json$Decode$list($author$project$Main$pokemonDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'attackerSource', $author$project$Main$pokemonSourceDecoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'attacker',
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $author$project$Main$pokemonDecoder)),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'defender',
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $author$project$Main$pokemonDecoder)),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'selectedTrainerIndex', $elm$json$Json$Decode$int),
				$elm$json$Json$Decode$succeed(0)
			])));
var $author$project$Main$settingsDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$Settings,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'currentGame', $elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$field, 'game', $elm$json$Json$Decode$string)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'gameData',
				$elm$json$Json$Decode$dict($author$project$Main$gameSaveDataDecoder)),
				$elm$json$Json$Decode$succeed($elm$core$Dict$empty)
			])));
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Main$TrainerEncounter = F7(
	function (id, trainerClass, trainerName, location, game, isDouble, team) {
		return {game: game, id: id, isDouble: isDouble, location: location, team: team, trainerClass: trainerClass, trainerName: trainerName};
	});
var $elm$json$Json$Decode$map7 = _Json_map7;
var $author$project$Main$TrainerPokemon = F8(
	function (species, level, ability, item, nature, ivs, evs, moves) {
		return {ability: ability, evs: evs, item: item, ivs: ivs, level: level, moves: moves, nature: nature, species: species};
	});
var $elm$json$Json$Decode$map8 = _Json_map8;
var $author$project$Main$trainerPokemonDecoder = A9(
	$elm$json$Json$Decode$map8,
	$author$project$Main$TrainerPokemon,
	A2($elm$json$Json$Decode$field, 'species', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'level', $elm$json$Json$Decode$int),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'ability', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'item', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'nature', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('Hardy')
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'ivs', $author$project$Main$statsDecoder),
				$elm$json$Json$Decode$succeed($author$project$Main$defaultIVs)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'evs', $author$project$Main$statsDecoder),
				$elm$json$Json$Decode$succeed($author$project$Main$defaultStats)
			])),
	A2(
		$elm$json$Json$Decode$field,
		'moves',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Main$trainerEncounterDecoder = A8(
	$elm$json$Json$Decode$map7,
	$author$project$Main$TrainerEncounter,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'trainerClass', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'trainerName', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'location', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'game', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'isDouble', $elm$json$Json$Decode$bool),
				$elm$json$Json$Decode$succeed(false)
			])),
	A2(
		$elm$json$Json$Decode$field,
		'team',
		$elm$json$Json$Decode$list($author$project$Main$trainerPokemonDecoder)));
var $author$project$Main$trainerDataDecoder = A2(
	$elm$json$Json$Decode$field,
	'encounters',
	$elm$json$Json$Decode$list($author$project$Main$trainerEncounterDecoder));
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Main$trainerPokemonToState = function (pokemon) {
	var moves = A2(
		$elm$core$List$map,
		function (moveName) {
			return {
				hits: 1,
				isCrit: false,
				name: (moveName === 'No Move') ? '' : moveName
			};
		},
		A2($elm$core$List$take, 4, pokemon.moves));
	var paddedMoves = _Utils_ap(
		moves,
		A2(
			$elm$core$List$repeat,
			4 - $elm$core$List$length(moves),
			$author$project$Main$defaultMove));
	return {
		ability: pokemon.ability,
		boosts: $author$project$Main$defaultStats,
		curHP: 100,
		evs: pokemon.evs,
		isDynamaxed: false,
		item: pokemon.item,
		ivs: pokemon.ivs,
		level: pokemon.level,
		moves: paddedMoves,
		nature: $elm$core$String$isEmpty(pokemon.nature) ? 'Hardy' : pokemon.nature,
		species: pokemon.species,
		status: '',
		teraType: ''
	};
};
var $author$project$Main$updateAndCalculate = F2(
	function (updateFn, model) {
		var updatedModel = updateFn(model);
		var modelWithAutoSave = function () {
			var _v0 = updatedModel.attackerSource;
			if (_v0.$ === 'Just') {
				if (_v0.a.$ === 'FromTeam') {
					var index = _v0.a.a;
					var newTeam = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, p) {
								return _Utils_eq(i, index) ? updatedModel.attacker : p;
							}),
						updatedModel.team);
					return _Utils_update(
						updatedModel,
						{team: newTeam});
				} else {
					var index = _v0.a.a;
					var newBox = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, p) {
								return _Utils_eq(i, index) ? updatedModel.attacker : p;
							}),
						updatedModel.box);
					return _Utils_update(
						updatedModel,
						{box: newBox});
				}
			} else {
				return updatedModel;
			}
		}();
		var newModel = modelWithAutoSave;
		var saveCmd = $author$project$Main$saveToLocalStorage(
			$author$project$Main$encodeSettings(newModel));
		var isValidSpecies = function (speciesName) {
			return A2(
				$elm$core$List$any,
				function (p) {
					return _Utils_eq(p.name, speciesName);
				},
				newModel.pokemonList);
		};
		var shouldCalc = (!$elm$core$String$isEmpty(newModel.attacker.species)) && ((!$elm$core$String$isEmpty(newModel.defender.species)) && (isValidSpecies(newModel.attacker.species) && isValidSpecies(newModel.defender.species)));
		return shouldCalc ? _Utils_Tuple2(
			newModel,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Main$requestCalculation(
						$author$project$Main$encodeCalculationRequest(newModel)),
						saveCmd
					]))) : _Utils_Tuple2(newModel, saveCmd);
	});
var $author$project$Main$updateStat = F3(
	function (statName, value, stats) {
		switch (statName) {
			case 'hp':
				return _Utils_update(
					stats,
					{hp: value});
			case 'atk':
				return _Utils_update(
					stats,
					{atk: value});
			case 'def':
				return _Utils_update(
					stats,
					{def: value});
			case 'spa':
				return _Utils_update(
					stats,
					{spa: value});
			case 'spd':
				return _Utils_update(
					stats,
					{spd: value});
			case 'spe':
				return _Utils_update(
					stats,
					{spe: value});
			default:
				return stats;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 'SetGeneration':
					var gen = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{generation: gen, loading: true}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$requestPokemonList(gen),
									$author$project$Main$requestMoveList(gen),
									$author$project$Main$requestItemList(gen),
									$author$project$Main$requestAbilityList(gen)
								])));
				case 'SetAttackerSpecies':
					var species = msg.a;
					var speciesChanged = !_Utils_eq(species, model.attacker.species);
					var newSource = speciesChanged ? $elm$core$Maybe$Nothing : model.attackerSource;
					var learnsetCmd = (!$elm$core$String$isEmpty(species)) ? $author$project$Main$requestLearnset(
						{generation: model.generation, species: species}) : $elm$core$Platform$Cmd$none;
					var _v1 = A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{species: species}),
									attackerSource: newSource
								});
						},
						model);
					var updatedModel = _v1.a;
					var calcCmd = _v1.b;
					return _Utils_Tuple2(
						updatedModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[calcCmd, learnsetCmd])));
				case 'SetDefenderSpecies':
					var species = msg.a;
					var learnsetCmd = (!$elm$core$String$isEmpty(species)) ? $author$project$Main$requestLearnset(
						{generation: model.generation, species: species}) : $elm$core$Platform$Cmd$none;
					var _v2 = A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{species: species})
								});
						},
						model);
					var updatedModel = _v2.a;
					var calcCmd = _v2.b;
					return _Utils_Tuple2(
						updatedModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[calcCmd, learnsetCmd])));
				case 'SetAttackerLevel':
					var level = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{level: level})
								});
						},
						model);
				case 'SetDefenderLevel':
					var level = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{level: level})
								});
						},
						model);
				case 'SetAttackerNature':
					var nature = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{nature: nature})
								});
						},
						model);
				case 'SetDefenderNature':
					var nature = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{nature: nature})
								});
						},
						model);
				case 'SetAttackerAbility':
					var ability = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							var modelWithAbility = _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{ability: ability}),
									openDropdown: $elm$core$Maybe$Nothing
								});
							return A2($author$project$Main$applyAbilityAutoTriggers, modelWithAbility, ability);
						},
						model);
				case 'SetDefenderAbility':
					var ability = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var modelWithAbility = _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{ability: ability}),
									openDropdown: $elm$core$Maybe$Nothing
								});
							return A2($author$project$Main$applyAbilityAutoTriggers, modelWithAbility, ability);
						},
						model);
				case 'SetAttackerItem':
					var item = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							var modelWithItem = _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{item: item}),
									openDropdown: $elm$core$Maybe$Nothing
								});
							return A3($author$project$Main$applyItemAutoTriggers, modelWithItem, item, true);
						},
						model);
				case 'SetDefenderItem':
					var item = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var modelWithItem = _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{item: item}),
									openDropdown: $elm$core$Maybe$Nothing
								});
							return A3($author$project$Main$applyItemAutoTriggers, modelWithItem, item, false);
						},
						model);
				case 'SetAttackerStatus':
					var status = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{status: status})
								});
						},
						model);
				case 'SetDefenderStatus':
					var status = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{status: status})
								});
						},
						model);
				case 'SetAttackerMove':
					var index = msg.a;
					var moveName = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							var moves = A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, mv) {
										return _Utils_eq(i, index) ? _Utils_update(
											mv,
											{name: moveName}) : mv;
									}),
								attacker.moves);
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{moves: moves}),
									openDropdown: $elm$core$Maybe$Nothing
								});
						},
						model);
				case 'SetDefenderMove':
					var index = msg.a;
					var moveName = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var moves = A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, mv) {
										return _Utils_eq(i, index) ? _Utils_update(
											mv,
											{name: moveName}) : mv;
									}),
								defender.moves);
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{moves: moves})
								});
						},
						model);
				case 'SetFieldWeather':
					var weather = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{weather: weather})
								});
						},
						model);
				case 'SetFieldTerrain':
					var terrain = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{terrain: terrain})
								});
						},
						model);
				case 'SetFieldGameType':
					var gameType = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{gameType: gameType})
								});
						},
						model);
				case 'Calculate':
					var isValidSpecies = function (speciesName) {
						return A2(
							$elm$core$List$any,
							function (p) {
								return _Utils_eq(p.name, speciesName);
							},
							model.pokemonList);
					};
					var shouldCalc = (!$elm$core$String$isEmpty(model.attacker.species)) && ((!$elm$core$String$isEmpty(model.defender.species)) && (isValidSpecies(model.attacker.species) && isValidSpecies(model.defender.species)));
					return shouldCalc ? _Utils_Tuple2(
						model,
						$author$project$Main$requestCalculation(
							$author$project$Main$encodeCalculationRequest(model))) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'ReceivedCalculation':
					var value = msg.a;
					var _v3 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$calculationResultDecoder, value);
					if (_v3.$ === 'Ok') {
						var result = _v3.a;
						var findHighestDamageIndex = function (results) {
							return A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$map,
									$elm$core$Tuple$first,
									$elm$core$List$head(
										A2(
											$elm$core$List$sortBy,
											function (_v5) {
												var dmg = _v5.b;
												return -dmg;
											},
											A2(
												$elm$core$List$indexedMap,
												F2(
													function (i, r) {
														return ($elm$core$String$isEmpty(r.moveName) || (r.moveName === '(No Move)')) ? _Utils_Tuple2(i, 0) : _Utils_Tuple2(i, r.damage.b);
													}),
												results)))));
						};
						var attackerFaster = _Utils_cmp(result.attackerSpeed, result.defenderSpeed) > 0;
						var _v4 = attackerFaster ? _Utils_Tuple2(
							$author$project$Main$AttackerMove,
							findHighestDamageIndex(result.attackerResults)) : _Utils_Tuple2(
							$author$project$Main$DefenderMove,
							findHighestDamageIndex(result.defenderResults));
						var newSource = _v4.a;
						var newIndex = _v4.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									result: $elm$core$Maybe$Just(result),
									selectedMoveIndex: newIndex,
									selectedMoveSource: newSource
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedPokemonList':
					var value = msg.a;
					var _v6 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$pokemonListDecoder, value);
					if (_v6.$ === 'Ok') {
						var pokemonList = _v6.a;
						var newModel = _Utils_update(
							model,
							{loading: false, pokemonList: pokemonList});
						var isValidSpecies = function (speciesName) {
							return A2(
								$elm$core$List$any,
								function (p) {
									return _Utils_eq(p.name, speciesName);
								},
								pokemonList);
						};
						var shouldCalc = (!$elm$core$String$isEmpty(newModel.attacker.species)) && ((!$elm$core$String$isEmpty(newModel.defender.species)) && (isValidSpecies(newModel.attacker.species) && isValidSpecies(newModel.defender.species)));
						return shouldCalc ? _Utils_Tuple2(
							newModel,
							$author$project$Main$requestCalculation(
								$author$project$Main$encodeCalculationRequest(newModel))) : _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{loading: false}),
							$elm$core$Platform$Cmd$none);
					}
				case 'ReceivedMoveList':
					var value = msg.a;
					var _v7 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$moveListDecoder, value);
					if (_v7.$ === 'Ok') {
						var moveList = _v7.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{moveList: moveList}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedItemList':
					var value = msg.a;
					var _v8 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$itemListDecoder, value);
					if (_v8.$ === 'Ok') {
						var itemList = _v8.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{itemList: itemList}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedAbilityList':
					var value = msg.a;
					var _v9 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$abilityListDecoder, value);
					if (_v9.$ === 'Ok') {
						var abilityList = _v9.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{abilityList: abilityList}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedNatureList':
					var value = msg.a;
					var _v10 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$natureListDecoder, value);
					if (_v10.$ === 'Ok') {
						var natureList = _v10.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{natureList: natureList}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedAttackerLearnset':
					var value = msg.a;
					var _v11 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$learnsetDecoder, value);
					if (_v11.$ === 'Ok') {
						var learnset = _v11.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									attackerLearnset: $elm$core$Maybe$Just(learnset)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedDefenderLearnset':
					var value = msg.a;
					var _v12 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$learnsetDecoder, value);
					if (_v12.$ === 'Ok') {
						var learnset = _v12.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									defenderLearnset: $elm$core$Maybe$Just(learnset)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'SetAttackerEV':
					var statName = msg.a;
					var value = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var clampedValue = A3($elm$core$Basics$clamp, 0, 252, value);
							var attacker = m.attacker;
							var evs = attacker.evs;
							var newEvs = ((m.generation === 1) && ((statName === 'spa') || (statName === 'spd'))) ? A3(
								$author$project$Main$updateStat,
								'spd',
								clampedValue,
								A3($author$project$Main$updateStat, 'spa', clampedValue, evs)) : A3($author$project$Main$updateStat, statName, clampedValue, evs);
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{evs: newEvs})
								});
						},
						model);
				case 'SetDefenderEV':
					var statName = msg.a;
					var value = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var evs = defender.evs;
							var clampedValue = A3($elm$core$Basics$clamp, 0, 252, value);
							var newEvs = ((m.generation === 1) && ((statName === 'spa') || (statName === 'spd'))) ? A3(
								$author$project$Main$updateStat,
								'spd',
								clampedValue,
								A3($author$project$Main$updateStat, 'spa', clampedValue, evs)) : A3($author$project$Main$updateStat, statName, clampedValue, evs);
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{evs: newEvs})
								});
						},
						model);
				case 'SetAttackerIV':
					var statName = msg.a;
					var value = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var clampedValue = A3($elm$core$Basics$clamp, 0, 31, value);
							var attacker = m.attacker;
							var ivs = attacker.ivs;
							var newIvs = ((m.generation === 1) && ((statName === 'spa') || (statName === 'spd'))) ? A3(
								$author$project$Main$updateStat,
								'spd',
								clampedValue,
								A3($author$project$Main$updateStat, 'spa', clampedValue, ivs)) : A3($author$project$Main$updateStat, statName, clampedValue, ivs);
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{ivs: newIvs})
								});
						},
						model);
				case 'SetDefenderIV':
					var statName = msg.a;
					var value = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var ivs = defender.ivs;
							var clampedValue = A3($elm$core$Basics$clamp, 0, 31, value);
							var newIvs = ((m.generation === 1) && ((statName === 'spa') || (statName === 'spd'))) ? A3(
								$author$project$Main$updateStat,
								'spd',
								clampedValue,
								A3($author$project$Main$updateStat, 'spa', clampedValue, ivs)) : A3($author$project$Main$updateStat, statName, clampedValue, ivs);
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{ivs: newIvs})
								});
						},
						model);
				case 'SetAttackerTeraType':
					var teraType = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{teraType: teraType})
								});
						},
						model);
				case 'SetDefenderTeraType':
					var teraType = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{teraType: teraType})
								});
						},
						model);
				case 'SetAttackerBoost':
					var statName = msg.a;
					var value = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var clampedValue = A3($elm$core$Basics$clamp, -6, 6, value);
							var attacker = m.attacker;
							var boosts = attacker.boosts;
							var newBoosts = A3($author$project$Main$updateStat, statName, clampedValue, boosts);
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{boosts: newBoosts})
								});
						},
						model);
				case 'SetDefenderBoost':
					var statName = msg.a;
					var value = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var clampedValue = A3($elm$core$Basics$clamp, -6, 6, value);
							var boosts = defender.boosts;
							var newBoosts = A3($author$project$Main$updateStat, statName, clampedValue, boosts);
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{boosts: newBoosts})
								});
						},
						model);
				case 'SetAttackerCurHP':
					var hp = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var clampedHP = A3($elm$core$Basics$clamp, 0, 100, hp);
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{curHP: clampedHP})
								});
						},
						model);
				case 'SetDefenderCurHP':
					var hp = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var clampedHP = A3($elm$core$Basics$clamp, 0, 100, hp);
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{curHP: clampedHP})
								});
						},
						model);
				case 'SetAttackerMoveCrit':
					var index = msg.a;
					var isCrit = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							var moves = A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, mv) {
										return _Utils_eq(i, index) ? _Utils_update(
											mv,
											{isCrit: isCrit}) : mv;
									}),
								attacker.moves);
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{moves: moves})
								});
						},
						model);
				case 'SetAttackerMoveHits':
					var index = msg.a;
					var hits = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var clampedHits = A3($elm$core$Basics$clamp, 1, 10, hits);
							var attacker = m.attacker;
							var moves = A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, mv) {
										return _Utils_eq(i, index) ? _Utils_update(
											mv,
											{hits: clampedHits}) : mv;
									}),
								attacker.moves);
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{moves: moves})
								});
						},
						model);
				case 'SetDefenderMoveCrit':
					var index = msg.a;
					var isCrit = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var moves = A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, mv) {
										return _Utils_eq(i, index) ? _Utils_update(
											mv,
											{isCrit: isCrit}) : mv;
									}),
								defender.moves);
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{moves: moves})
								});
						},
						model);
				case 'SetDefenderMoveHits':
					var index = msg.a;
					var hits = msg.b;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							var clampedHits = A3($elm$core$Basics$clamp, 1, 10, hits);
							var moves = A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, mv) {
										return _Utils_eq(i, index) ? _Utils_update(
											mv,
											{hits: clampedHits}) : mv;
									}),
								defender.moves);
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{moves: moves})
								});
						},
						model);
				case 'SetAttackerSideReflect':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var attackerSide = field.attackerSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											attackerSide: _Utils_update(
												attackerSide,
												{isReflect: val})
										})
								});
						},
						model);
				case 'SetAttackerSideLightScreen':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var attackerSide = field.attackerSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											attackerSide: _Utils_update(
												attackerSide,
												{isLightScreen: val})
										})
								});
						},
						model);
				case 'SetAttackerSideAuroraVeil':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var attackerSide = field.attackerSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											attackerSide: _Utils_update(
												attackerSide,
												{isAuroraVeil: val})
										})
								});
						},
						model);
				case 'SetAttackerSideTailwind':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var attackerSide = field.attackerSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											attackerSide: _Utils_update(
												attackerSide,
												{isTailwind: val})
										})
								});
						},
						model);
				case 'SetAttackerSideHelpingHand':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var attackerSide = field.attackerSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											attackerSide: _Utils_update(
												attackerSide,
												{isHelpingHand: val})
										})
								});
						},
						model);
				case 'SetAttackerSideSpikes':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var clampedVal = A3($elm$core$Basics$clamp, 0, 3, val);
							var attackerSide = field.attackerSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											attackerSide: _Utils_update(
												attackerSide,
												{spikes: clampedVal})
										})
								});
						},
						model);
				case 'SetAttackerSideStealthRock':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var attackerSide = field.attackerSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											attackerSide: _Utils_update(
												attackerSide,
												{isSteathRock: val})
										})
								});
						},
						model);
				case 'SetDefenderSideReflect':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var defenderSide = field.defenderSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											defenderSide: _Utils_update(
												defenderSide,
												{isReflect: val})
										})
								});
						},
						model);
				case 'SetDefenderSideLightScreen':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var defenderSide = field.defenderSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											defenderSide: _Utils_update(
												defenderSide,
												{isLightScreen: val})
										})
								});
						},
						model);
				case 'SetDefenderSideAuroraVeil':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var defenderSide = field.defenderSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											defenderSide: _Utils_update(
												defenderSide,
												{isAuroraVeil: val})
										})
								});
						},
						model);
				case 'SetDefenderSideTailwind':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var defenderSide = field.defenderSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											defenderSide: _Utils_update(
												defenderSide,
												{isTailwind: val})
										})
								});
						},
						model);
				case 'SetDefenderSideHelpingHand':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var defenderSide = field.defenderSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											defenderSide: _Utils_update(
												defenderSide,
												{isHelpingHand: val})
										})
								});
						},
						model);
				case 'SetDefenderSideSpikes':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var defenderSide = field.defenderSide;
							var clampedVal = A3($elm$core$Basics$clamp, 0, 3, val);
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											defenderSide: _Utils_update(
												defenderSide,
												{spikes: clampedVal})
										})
								});
						},
						model);
				case 'SetDefenderSideStealthRock':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var field = m.field;
							var defenderSide = field.defenderSide;
							return _Utils_update(
								m,
								{
									field: _Utils_update(
										field,
										{
											defenderSide: _Utils_update(
												defenderSide,
												{isSteathRock: val})
										})
								});
						},
						model);
				case 'SetAttackerDynamax':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{isDynamaxed: val})
								});
						},
						model);
				case 'SetDefenderDynamax':
					var val = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var defender = m.defender;
							return _Utils_update(
								m,
								{
									defender: _Utils_update(
										defender,
										{isDynamaxed: val})
								});
						},
						model);
				case 'SelectMove':
					var source = msg.a;
					var index = msg.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								selectedMoveIndex: A3($elm$core$Basics$clamp, 0, 3, index),
								selectedMoveSource: source
							}),
						$elm$core$Platform$Cmd$none);
				case 'LoadedSettings':
					var value = msg.a;
					var _v13 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$settingsDecoder, value);
					if (_v13.$ === 'Ok') {
						var settings = _v13.a;
						var game = settings.currentGame;
						var gen = $author$project$Main$gameToGeneration(game);
						var maybeGameData = A2($elm$core$Dict$get, game, settings.gameData);
						var loadedAttacker = A2(
							$elm$core$Maybe$withDefault,
							model.attacker,
							A2(
								$elm$core$Maybe$andThen,
								function ($) {
									return $.attacker;
								},
								maybeGameData));
						var loadedAttackerSource = A2(
							$elm$core$Maybe$andThen,
							function ($) {
								return $.attackerSource;
							},
							maybeGameData);
						var loadedBox = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.box;
								},
								maybeGameData));
						var loadedDefender = A2(
							$elm$core$Maybe$withDefault,
							model.defender,
							A2(
								$elm$core$Maybe$andThen,
								function ($) {
									return $.defender;
								},
								maybeGameData));
						var loadedTeam = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.team;
								},
								maybeGameData));
						var loadedTrainerIndex = A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.selectedTrainerIndex;
								},
								maybeGameData));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{allGameData: settings.gameData, attacker: loadedAttacker, attackerSource: loadedAttackerSource, box: loadedBox, defender: loadedDefender, generation: gen, loading: true, selectedGame: game, selectedTrainerIndex: loadedTrainerIndex, settingsLoaded: true, team: loadedTeam}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$requestPokemonList(gen),
										$author$project$Main$requestMoveList(gen),
										$author$project$Main$requestItemList(gen),
										$author$project$Main$requestAbilityList(gen),
										$author$project$Main$requestTrainerData(game)
									])));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedAvailableGames':
					var value = msg.a;
					var _v14 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$availableGamesDecoder, value);
					if (_v14.$ === 'Ok') {
						var games = _v14.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{availableGames: games}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ReceivedTrainerData':
					var value = msg.a;
					var _v15 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$trainerDataDecoder, value);
					if (_v15.$ === 'Ok') {
						var encounters = _v15.a;
						var filtered = A2($author$project$Main$filterEncounters, model.trainerSearchQuery, encounters);
						var _v16 = function () {
							if (model.settingsLoaded) {
								return _Utils_Tuple3(model.attacker, model.defender, model.selectedTrainerIndex);
							} else {
								var _v17 = $elm$core$List$head(encounters);
								if (_v17.$ === 'Just') {
									var firstEncounter = _v17.a;
									var _v18 = $elm$core$List$head(firstEncounter.team);
									if (_v18.$ === 'Just') {
										var rivalPokemon = _v18.a;
										var playerStarter = A2($author$project$Main$getPlayerStarterFromRival, model.generation, rivalPokemon.species);
										var defender = $author$project$Main$trainerPokemonToState(rivalPokemon);
										var attacker = A2($author$project$Main$createStarterPokemonState, model.generation, playerStarter);
										return _Utils_Tuple3(attacker, defender, 0);
									} else {
										return _Utils_Tuple3(model.attacker, model.defender, 0);
									}
								} else {
									return _Utils_Tuple3(model.attacker, model.defender, 0);
								}
							}
						}();
						var newAttacker = _v16.a;
						var newDefender = _v16.b;
						var newTrainerIndex = _v16.c;
						var newModel = _Utils_update(
							model,
							{attacker: newAttacker, defender: newDefender, filteredEncounters: filtered, selectedTrainerIndex: newTrainerIndex, trainerEncounters: encounters});
						var isValidSpecies = function (speciesName) {
							return A2(
								$elm$core$List$any,
								function (p) {
									return _Utils_eq(p.name, speciesName);
								},
								newModel.pokemonList);
						};
						return ((!$elm$core$String$isEmpty(newAttacker.species)) && ((!$elm$core$String$isEmpty(newDefender.species)) && (isValidSpecies(newAttacker.species) && isValidSpecies(newDefender.species)))) ? _Utils_Tuple2(
							newModel,
							$author$project$Main$requestCalculation(
								$author$project$Main$encodeCalculationRequest(newModel))) : _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'SetSelectedGame':
					var game = msg.a;
					var newGen = $author$project$Main$gameToGeneration(game);
					var genChanged = !_Utils_eq(newGen, model.generation);
					var currentGameData = {
						attacker: $elm$core$Maybe$Just(model.attacker),
						attackerSource: model.attackerSource,
						box: model.box,
						defender: $elm$core$Maybe$Just(model.defender),
						selectedTrainerIndex: model.selectedTrainerIndex,
						team: model.team
					};
					var updatedAllGameData = $elm$core$String$isEmpty(model.selectedGame) ? model.allGameData : A3($elm$core$Dict$insert, model.selectedGame, currentGameData, model.allGameData);
					var maybeNewGameData = A2($elm$core$Dict$get, game, updatedAllGameData);
					var newAttacker = A2(
						$elm$core$Maybe$withDefault,
						model.attacker,
						A2(
							$elm$core$Maybe$andThen,
							function ($) {
								return $.attacker;
							},
							maybeNewGameData));
					var newAttackerSource = A2(
						$elm$core$Maybe$andThen,
						function ($) {
							return $.attackerSource;
						},
						maybeNewGameData);
					var newBox = A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.box;
							},
							maybeNewGameData));
					var newDefender = A2(
						$elm$core$Maybe$withDefault,
						model.defender,
						A2(
							$elm$core$Maybe$andThen,
							function ($) {
								return $.defender;
							},
							maybeNewGameData));
					var newTeam = A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.team;
							},
							maybeNewGameData));
					var newTrainerIndex = A2(
						$elm$core$Maybe$withDefault,
						0,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.selectedTrainerIndex;
							},
							maybeNewGameData));
					var newModel = _Utils_update(
						model,
						{
							allGameData: updatedAllGameData,
							attacker: newAttacker,
							attackerSource: newAttackerSource,
							box: newBox,
							defender: newDefender,
							filteredEncounters: _List_Nil,
							generation: newGen,
							loading: genChanged,
							selectedGame: game,
							selectedTrainerIndex: newTrainerIndex,
							settingsLoaded: !_Utils_eq(maybeNewGameData, $elm$core$Maybe$Nothing),
							team: newTeam,
							trainerEncounters: _List_Nil,
							trainerSearchQuery: ''
						});
					return _Utils_Tuple2(
						newModel,
						$elm$core$String$isEmpty(game) ? $elm$core$Platform$Cmd$none : $elm$core$Platform$Cmd$batch(
							_Utils_ap(
								_List_fromArray(
									[
										$author$project$Main$requestTrainerData(game),
										$author$project$Main$saveToLocalStorage(
										$author$project$Main$encodeSettings(newModel))
									]),
								genChanged ? _List_fromArray(
									[
										$author$project$Main$requestPokemonList(newGen),
										$author$project$Main$requestMoveList(newGen),
										$author$project$Main$requestItemList(newGen),
										$author$project$Main$requestAbilityList(newGen)
									]) : _List_Nil)));
				case 'SetTrainerSearchQuery':
					var query = msg.a;
					var filtered = A2($author$project$Main$filterEncounters, query, model.trainerEncounters);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{filteredEncounters: filtered, trainerSearchQuery: query}),
						$elm$core$Platform$Cmd$none);
				case 'SelectTrainer':
					var index = msg.a;
					var newModel = _Utils_update(
						model,
						{
							selectedTrainerIndex: A3(
								$elm$core$Basics$clamp,
								0,
								$elm$core$List$length(model.trainerEncounters) - 1,
								index)
						});
					return _Utils_Tuple2(
						newModel,
						$author$project$Main$saveToLocalStorage(
							$author$project$Main$encodeSettings(newModel)));
				case 'SelectFromSearchResults':
					var encounter = msg.a;
					var _v19 = A2($author$project$Main$findEncounterIndex, encounter, model.trainerEncounters);
					if (_v19.$ === 'Just') {
						var index = _v19.a;
						var newModel = _Utils_update(
							model,
							{filteredEncounters: model.trainerEncounters, selectedTrainerIndex: index, trainerSearchQuery: ''});
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$saveToLocalStorage(
								$author$project$Main$encodeSettings(newModel)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'CloseSearchDropdown':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{filteredEncounters: model.trainerEncounters, trainerSearchQuery: ''}),
						$elm$core$Platform$Cmd$none);
				case 'NextTrainer':
					var newIndex = (_Utils_cmp(
						model.selectedTrainerIndex,
						$elm$core$List$length(model.trainerEncounters) - 1) < 0) ? (model.selectedTrainerIndex + 1) : model.selectedTrainerIndex;
					var newModel = _Utils_update(
						model,
						{selectedTrainerIndex: newIndex});
					return _Utils_Tuple2(
						newModel,
						$author$project$Main$saveToLocalStorage(
							$author$project$Main$encodeSettings(newModel)));
				case 'PrevTrainer':
					var newIndex = (model.selectedTrainerIndex > 0) ? (model.selectedTrainerIndex - 1) : 0;
					var newModel = _Utils_update(
						model,
						{selectedTrainerIndex: newIndex});
					return _Utils_Tuple2(
						newModel,
						$author$project$Main$saveToLocalStorage(
							$author$project$Main$encodeSettings(newModel)));
				case 'LoadTrainerToDefender':
					var pokemonIndex = msg.a;
					var _v20 = $author$project$Main$getSelectedEncounter(model);
					if (_v20.$ === 'Just') {
						var encounter = _v20.a;
						var _v21 = $elm$core$List$head(
							A2($elm$core$List$drop, pokemonIndex, encounter.team));
						if (_v21.$ === 'Just') {
							var trainerPokemon = _v21.a;
							var newDefender = $author$project$Main$trainerPokemonToState(trainerPokemon);
							return A2(
								$author$project$Main$updateAndCalculate,
								function (m) {
									return _Utils_update(
										m,
										{defender: newDefender});
								},
								model);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'AddToBox':
					var newIndex = $elm$core$List$length(model.box);
					var newBox = _Utils_ap(
						model.box,
						_List_fromArray(
							[model.attacker]));
					var newModel = _Utils_update(
						model,
						{
							attackerSource: $elm$core$Maybe$Just(
								$author$project$Main$FromBox(newIndex)),
							box: newBox
						});
					return _Utils_Tuple2(
						newModel,
						$author$project$Main$saveToLocalStorage(
							$author$project$Main$encodeSettings(newModel)));
				case 'LoadFromBox':
					var index = msg.a;
					var _v22 = $elm$core$List$head(
						A2($elm$core$List$drop, index, model.box));
					if (_v22.$ === 'Just') {
						var pokemon = _v22.a;
						var newModel = _Utils_update(
							model,
							{
								attacker: pokemon,
								attackerSource: $elm$core$Maybe$Just(
									$author$project$Main$FromBox(index))
							});
						return A2(
							$author$project$Main$updateAndCalculate,
							function (m) {
								return m;
							},
							newModel);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'RemoveFromBox':
					var index = msg.a;
					var newSource = function () {
						var _v23 = model.attackerSource;
						if ((_v23.$ === 'Just') && (_v23.a.$ === 'FromBox')) {
							var sourceIndex = _v23.a.a;
							return _Utils_eq(sourceIndex, index) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(sourceIndex, index) > 0) ? $elm$core$Maybe$Just(
								$author$project$Main$FromBox(sourceIndex - 1)) : model.attackerSource);
						} else {
							return model.attackerSource;
						}
					}();
					var newBox = _Utils_ap(
						A2($elm$core$List$take, index, model.box),
						A2($elm$core$List$drop, index + 1, model.box));
					var newModel = _Utils_update(
						model,
						{attackerSource: newSource, box: newBox});
					return _Utils_Tuple2(
						newModel,
						$author$project$Main$saveToLocalStorage(
							$author$project$Main$encodeSettings(newModel)));
				case 'AddToTeam':
					if ($elm$core$List$length(model.team) >= 6) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var newTeam = _Utils_ap(
							model.team,
							_List_fromArray(
								[model.attacker]));
						var newIndex = $elm$core$List$length(model.team);
						var newModel = _Utils_update(
							model,
							{
								attackerSource: $elm$core$Maybe$Just(
									$author$project$Main$FromTeam(newIndex)),
								team: newTeam
							});
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$saveToLocalStorage(
								$author$project$Main$encodeSettings(newModel)));
					}
				case 'LoadFromTeam':
					var index = msg.a;
					var _v24 = $elm$core$List$head(
						A2($elm$core$List$drop, index, model.team));
					if (_v24.$ === 'Just') {
						var pokemon = _v24.a;
						var newModel = _Utils_update(
							model,
							{
								attacker: pokemon,
								attackerSource: $elm$core$Maybe$Just(
									$author$project$Main$FromTeam(index))
							});
						return A2(
							$author$project$Main$updateAndCalculate,
							function (m) {
								return m;
							},
							newModel);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'RemoveFromTeam':
					var index = msg.a;
					var newTeam = _Utils_ap(
						A2($elm$core$List$take, index, model.team),
						A2($elm$core$List$drop, index + 1, model.team));
					var newSource = function () {
						var _v25 = model.attackerSource;
						if ((_v25.$ === 'Just') && (_v25.a.$ === 'FromTeam')) {
							var sourceIndex = _v25.a.a;
							return _Utils_eq(sourceIndex, index) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(sourceIndex, index) > 0) ? $elm$core$Maybe$Just(
								$author$project$Main$FromTeam(sourceIndex - 1)) : model.attackerSource);
						} else {
							return model.attackerSource;
						}
					}();
					var newModel = _Utils_update(
						model,
						{attackerSource: newSource, team: newTeam});
					return _Utils_Tuple2(
						newModel,
						$author$project$Main$saveToLocalStorage(
							$author$project$Main$encodeSettings(newModel)));
				case 'MoveToTeam':
					var boxIndex = msg.a;
					var _v26 = $elm$core$List$head(
						A2($elm$core$List$drop, boxIndex, model.box));
					if (_v26.$ === 'Just') {
						var pokemon = _v26.a;
						if ($elm$core$List$length(model.team) >= 6) {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						} else {
							var newTeam = _Utils_ap(
								model.team,
								_List_fromArray(
									[pokemon]));
							var newSource = function () {
								var _v27 = model.attackerSource;
								if ((_v27.$ === 'Just') && (_v27.a.$ === 'FromBox')) {
									var sourceIndex = _v27.a.a;
									return _Utils_eq(sourceIndex, boxIndex) ? $elm$core$Maybe$Just(
										$author$project$Main$FromTeam(
											$elm$core$List$length(model.team))) : ((_Utils_cmp(sourceIndex, boxIndex) > 0) ? $elm$core$Maybe$Just(
										$author$project$Main$FromBox(sourceIndex - 1)) : model.attackerSource);
								} else {
									return model.attackerSource;
								}
							}();
							var newBox = _Utils_ap(
								A2($elm$core$List$take, boxIndex, model.box),
								A2($elm$core$List$drop, boxIndex + 1, model.box));
							var newModel = _Utils_update(
								model,
								{attackerSource: newSource, box: newBox, team: newTeam});
							return _Utils_Tuple2(
								newModel,
								$author$project$Main$saveToLocalStorage(
									$author$project$Main$encodeSettings(newModel)));
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'MoveToBox':
					var teamIndex = msg.a;
					var _v28 = $elm$core$List$head(
						A2($elm$core$List$drop, teamIndex, model.team));
					if (_v28.$ === 'Just') {
						var pokemon = _v28.a;
						var newTeam = _Utils_ap(
							A2($elm$core$List$take, teamIndex, model.team),
							A2($elm$core$List$drop, teamIndex + 1, model.team));
						var newSource = function () {
							var _v29 = model.attackerSource;
							if ((_v29.$ === 'Just') && (_v29.a.$ === 'FromTeam')) {
								var sourceIndex = _v29.a.a;
								return _Utils_eq(sourceIndex, teamIndex) ? $elm$core$Maybe$Just(
									$author$project$Main$FromBox(
										$elm$core$List$length(model.box))) : ((_Utils_cmp(sourceIndex, teamIndex) > 0) ? $elm$core$Maybe$Just(
									$author$project$Main$FromTeam(sourceIndex - 1)) : model.attackerSource);
							} else {
								return model.attackerSource;
							}
						}();
						var newBox = _Utils_ap(
							model.box,
							_List_fromArray(
								[pokemon]));
						var newModel = _Utils_update(
							model,
							{attackerSource: newSource, box: newBox, team: newTeam});
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$saveToLocalStorage(
								$author$project$Main$encodeSettings(newModel)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'EvolvePokemonInBox':
					var boxIndex = msg.a;
					var targetSpecies = msg.b;
					var _v30 = $elm$core$List$head(
						A2($elm$core$List$drop, boxIndex, model.box));
					if (_v30.$ === 'Just') {
						var pokemon = _v30.a;
						var evolvedPokemon = _Utils_update(
							pokemon,
							{
								moves: A2(
									$elm$core$List$map,
									function (_v32) {
										return {hits: 1, isCrit: false, name: ''};
									},
									A2($elm$core$List$range, 1, 4)),
								species: targetSpecies
							});
						var newAttacker = function () {
							var _v31 = model.attackerSource;
							if ((_v31.$ === 'Just') && (_v31.a.$ === 'FromBox')) {
								var sourceIndex = _v31.a.a;
								return _Utils_eq(sourceIndex, boxIndex) ? evolvedPokemon : model.attacker;
							} else {
								return model.attacker;
							}
						}();
						var newBox = _Utils_ap(
							A2($elm$core$List$take, boxIndex, model.box),
							_Utils_ap(
								_List_fromArray(
									[evolvedPokemon]),
								A2($elm$core$List$drop, boxIndex + 1, model.box)));
						var newModel = _Utils_update(
							model,
							{attacker: newAttacker, box: newBox});
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$saveToLocalStorage(
								$author$project$Main$encodeSettings(newModel)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'EvolvePokemonInTeam':
					var teamIndex = msg.a;
					var targetSpecies = msg.b;
					var _v33 = $elm$core$List$head(
						A2($elm$core$List$drop, teamIndex, model.team));
					if (_v33.$ === 'Just') {
						var pokemon = _v33.a;
						var evolvedPokemon = _Utils_update(
							pokemon,
							{
								moves: A2(
									$elm$core$List$map,
									function (_v35) {
										return {hits: 1, isCrit: false, name: ''};
									},
									A2($elm$core$List$range, 1, 4)),
								species: targetSpecies
							});
						var newAttacker = function () {
							var _v34 = model.attackerSource;
							if ((_v34.$ === 'Just') && (_v34.a.$ === 'FromTeam')) {
								var sourceIndex = _v34.a.a;
								return _Utils_eq(sourceIndex, teamIndex) ? evolvedPokemon : model.attacker;
							} else {
								return model.attacker;
							}
						}();
						var newTeam = _Utils_ap(
							A2($elm$core$List$take, teamIndex, model.team),
							_Utils_ap(
								_List_fromArray(
									[evolvedPokemon]),
								A2($elm$core$List$drop, teamIndex + 1, model.team)));
						var newModel = _Utils_update(
							model,
							{attacker: newAttacker, team: newTeam});
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$saveToLocalStorage(
								$author$project$Main$encodeSettings(newModel)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'SwitchAttackerForm':
					var targetSpecies = msg.a;
					return A2(
						$author$project$Main$updateAndCalculate,
						function (m) {
							var attacker = m.attacker;
							return _Utils_update(
								m,
								{
									attacker: _Utils_update(
										attacker,
										{species: targetSpecies})
								});
						},
						model);
				case 'SwitchTeamPokemonForm':
					var teamIndex = msg.a;
					var targetSpecies = msg.b;
					var _v36 = $elm$core$List$head(
						A2($elm$core$List$drop, teamIndex, model.team));
					if (_v36.$ === 'Just') {
						var pokemon = _v36.a;
						var updatedPokemon = _Utils_update(
							pokemon,
							{species: targetSpecies});
						var newTeam = _Utils_ap(
							A2($elm$core$List$take, teamIndex, model.team),
							_Utils_ap(
								_List_fromArray(
									[updatedPokemon]),
								A2($elm$core$List$drop, teamIndex + 1, model.team)));
						var newAttacker = function () {
							var _v37 = model.attackerSource;
							if ((_v37.$ === 'Just') && (_v37.a.$ === 'FromTeam')) {
								var sourceIndex = _v37.a.a;
								return _Utils_eq(sourceIndex, teamIndex) ? updatedPokemon : model.attacker;
							} else {
								return model.attacker;
							}
						}();
						var newModel = _Utils_update(
							model,
							{attacker: newAttacker, team: newTeam});
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$saveToLocalStorage(
								$author$project$Main$encodeSettings(newModel)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'SwitchBoxPokemonForm':
					var boxIndex = msg.a;
					var targetSpecies = msg.b;
					var _v38 = $elm$core$List$head(
						A2($elm$core$List$drop, boxIndex, model.box));
					if (_v38.$ === 'Just') {
						var pokemon = _v38.a;
						var updatedPokemon = _Utils_update(
							pokemon,
							{species: targetSpecies});
						var newBox = _Utils_ap(
							A2($elm$core$List$take, boxIndex, model.box),
							_Utils_ap(
								_List_fromArray(
									[updatedPokemon]),
								A2($elm$core$List$drop, boxIndex + 1, model.box)));
						var newAttacker = function () {
							var _v39 = model.attackerSource;
							if ((_v39.$ === 'Just') && (_v39.a.$ === 'FromBox')) {
								var sourceIndex = _v39.a.a;
								return _Utils_eq(sourceIndex, boxIndex) ? updatedPokemon : model.attacker;
							} else {
								return model.attacker;
							}
						}();
						var newModel = _Utils_update(
							model,
							{attacker: newAttacker, box: newBox});
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$saveToLocalStorage(
								$author$project$Main$encodeSettings(newModel)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'DragStart':
					var source = msg.a;
					var index = msg.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								dragState: $elm$core$Maybe$Just(
									{index: index, source: source})
							}),
						$elm$core$Platform$Cmd$none);
				case 'DragEnd':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dragState: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none);
				case 'DragOver':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'DropOnTeam':
					var _v40 = model.dragState;
					if (_v40.$ === 'Just') {
						var source = _v40.a.source;
						var index = _v40.a.index;
						if (source.$ === 'DragFromBox') {
							var $temp$msg = $author$project$Main$MoveToTeam(index),
								$temp$model = _Utils_update(
								model,
								{dragState: $elm$core$Maybe$Nothing});
							msg = $temp$msg;
							model = $temp$model;
							continue update;
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{dragState: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'DropOnBox':
					var _v42 = model.dragState;
					if (_v42.$ === 'Just') {
						var source = _v42.a.source;
						var index = _v42.a.index;
						if (source.$ === 'DragFromTeam') {
							var $temp$msg = $author$project$Main$MoveToBox(index),
								$temp$model = _Utils_update(
								model,
								{dragState: $elm$core$Maybe$Nothing});
							msg = $temp$msg;
							model = $temp$model;
							continue update;
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{dragState: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'ToggleFieldCollapsed':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{fieldCollapsed: !model.fieldCollapsed}),
						$elm$core$Platform$Cmd$none);
				case 'ToggleBattleStateCollapsed':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{battleStateCollapsed: !model.battleStateCollapsed}),
						$elm$core$Platform$Cmd$none);
				case 'ToggleAttackerBaseStatsCollapsed':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{attackerBaseStatsCollapsed: !model.attackerBaseStatsCollapsed}),
						$elm$core$Platform$Cmd$none);
				case 'ToggleDefenderBaseStatsCollapsed':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{defenderBaseStatsCollapsed: !model.defenderBaseStatsCollapsed}),
						$elm$core$Platform$Cmd$none);
				case 'ToggleBoxCollapsed':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{boxCollapsed: !model.boxCollapsed}),
						$elm$core$Platform$Cmd$none);
				case 'ToggleDefenderEditMode':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{defenderEditMode: !model.defenderEditMode}),
						$elm$core$Platform$Cmd$none);
				case 'ToggleDropdown':
					var dropdownId = msg.a;
					var newOpenDropdown = _Utils_eq(
						model.openDropdown,
						$elm$core$Maybe$Just(dropdownId)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(dropdownId);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{openDropdown: newOpenDropdown}),
						$elm$core$Platform$Cmd$none);
				default:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{openDropdown: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$Main$CloseDropdown = {$: 'CloseDropdown'};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$SetSelectedGame = function (a) {
	return {$: 'SetSelectedGame', a: a};
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$header = _VirtualDom_node('header');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewHeader = function (model) {
	return A2(
		$elm$html$Html$header,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card bg-base-200 p-4 mb-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex items-center justify-between')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-2xl font-bold text-primary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Trevenant')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput($author$project$Main$SetSelectedGame),
								$elm$html$Html$Attributes$class('select select-bordered select-sm')
							]),
						A2(
							$elm$core$List$map,
							function (game) {
								return A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value(game),
											$elm$html$Html$Attributes$selected(
											_Utils_eq(game, model.selectedGame))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(game)
										]));
							},
							model.availableGames))
					]))
			]));
};
var $author$project$Main$ToggleBattleStateCollapsed = {$: 'ToggleBattleStateCollapsed'};
var $author$project$Main$ToggleFieldCollapsed = {$: 'ToggleFieldCollapsed'};
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $author$project$Main$ToggleAttackerBaseStatsCollapsed = {$: 'ToggleAttackerBaseStatsCollapsed'};
var $author$project$Main$AttackerAbilityDropdown = {$: 'AttackerAbilityDropdown'};
var $author$project$Main$DefenderAbilityDropdown = {$: 'DefenderAbilityDropdown'};
var $author$project$Main$SetAttackerAbility = function (a) {
	return {$: 'SetAttackerAbility', a: a};
};
var $author$project$Main$SetAttackerLevel = function (a) {
	return {$: 'SetAttackerLevel', a: a};
};
var $author$project$Main$SetAttackerNature = function (a) {
	return {$: 'SetAttackerNature', a: a};
};
var $author$project$Main$SetAttackerSpecies = function (a) {
	return {$: 'SetAttackerSpecies', a: a};
};
var $author$project$Main$SetDefenderAbility = function (a) {
	return {$: 'SetDefenderAbility', a: a};
};
var $author$project$Main$SetDefenderLevel = function (a) {
	return {$: 'SetDefenderLevel', a: a};
};
var $author$project$Main$SetDefenderNature = function (a) {
	return {$: 'SetDefenderNature', a: a};
};
var $author$project$Main$SetDefenderSpecies = function (a) {
	return {$: 'SetDefenderSpecies', a: a};
};
var $author$project$Main$ToggleDropdown = function (a) {
	return {$: 'ToggleDropdown', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Main$getFilteredAbilityList = F3(
	function (speciesName, pokemonList, allAbilities) {
		var speciesData = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (p) {
					return _Utils_eq(p.name, speciesName);
				},
				pokemonList));
		var actualAbilities = function () {
			if (speciesData.$ === 'Just') {
				var data = speciesData.a;
				return data.abilities;
			} else {
				return _List_Nil;
			}
		}();
		var otherAbilities = A2(
			$elm$core$List$filter,
			function (a) {
				return !A2($elm$core$List$member, a, actualAbilities);
			},
			allAbilities);
		return _Utils_ap(actualAbilities, otherAbilities);
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$list = _VirtualDom_attribute('list');
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Main$SetAttackerEV = F2(
	function (a, b) {
		return {$: 'SetAttackerEV', a: a, b: b};
	});
var $author$project$Main$SetDefenderEV = F2(
	function (a, b) {
		return {$: 'SetDefenderEV', a: a, b: b};
	});
var $author$project$Main$viewEVsCompact = F3(
	function (pokemon, generation, isAttacker) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('label py-1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label-text text-xs')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('EVs')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('grid grid-cols-6 gap-1')
						]),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var statName = _v0.a;
							var statLabel = _v0.b;
							var getValue = _v0.c;
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-control')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('label py-0')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('label-text text-xs')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(statLabel)
													]))
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(
													getValue(pokemon.evs))),
												$elm$html$Html$Events$onInput(
												function (v) {
													return isAttacker ? A2(
														$author$project$Main$SetAttackerEV,
														statName,
														A2(
															$elm$core$Maybe$withDefault,
															0,
															$elm$core$String$toInt(v))) : A2(
														$author$project$Main$SetDefenderEV,
														statName,
														A2(
															$elm$core$Maybe$withDefault,
															0,
															$elm$core$String$toInt(v)));
												}),
												$elm$html$Html$Attributes$min('0'),
												$elm$html$Html$Attributes$max('252'),
												$elm$html$Html$Attributes$class('input input-bordered input-xs w-full text-center')
											]),
										_List_Nil)
									]));
						},
						_List_fromArray(
							[
								_Utils_Tuple3(
								'hp',
								'HP',
								function ($) {
									return $.hp;
								}),
								_Utils_Tuple3(
								'atk',
								'Atk',
								function ($) {
									return $.atk;
								}),
								_Utils_Tuple3(
								'def',
								'Def',
								function ($) {
									return $.def;
								}),
								_Utils_Tuple3(
								'spa',
								'SpA',
								function ($) {
									return $.spa;
								}),
								_Utils_Tuple3(
								'spd',
								'SpD',
								function ($) {
									return $.spd;
								}),
								_Utils_Tuple3(
								'spe',
								'Spe',
								function ($) {
									return $.spe;
								})
							])))
				]));
	});
var $author$project$Main$SetAttackerIV = F2(
	function (a, b) {
		return {$: 'SetAttackerIV', a: a, b: b};
	});
var $author$project$Main$SetDefenderIV = F2(
	function (a, b) {
		return {$: 'SetDefenderIV', a: a, b: b};
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Main$viewIVsCompact = F3(
	function (pokemon, generation, isAttacker) {
		var maxIV = (generation <= 2) ? 15 : 31;
		var label_ = (generation <= 2) ? 'DVs' : 'IVs';
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('label py-1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label-text text-xs')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(label_)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('grid grid-cols-6 gap-1')
						]),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var statName = _v0.a;
							var statLabel = _v0.b;
							var getValue = _v0.c;
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-control')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('label py-0')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('label-text text-xs')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(statLabel)
													]))
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('number'),
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(
													A2(
														$elm$core$Basics$min,
														maxIV,
														getValue(pokemon.ivs)))),
												$elm$html$Html$Events$onInput(
												function (v) {
													return isAttacker ? A2(
														$author$project$Main$SetAttackerIV,
														statName,
														A2(
															$elm$core$Maybe$withDefault,
															maxIV,
															$elm$core$String$toInt(v))) : A2(
														$author$project$Main$SetDefenderIV,
														statName,
														A2(
															$elm$core$Maybe$withDefault,
															maxIV,
															$elm$core$String$toInt(v)));
												}),
												$elm$html$Html$Attributes$min('0'),
												$elm$html$Html$Attributes$max(
												$elm$core$String$fromInt(maxIV)),
												$elm$html$Html$Attributes$class('input input-bordered input-xs w-full text-center')
											]),
										_List_Nil)
									]));
						},
						_List_fromArray(
							[
								_Utils_Tuple3(
								'hp',
								'HP',
								function ($) {
									return $.hp;
								}),
								_Utils_Tuple3(
								'atk',
								'Atk',
								function ($) {
									return $.atk;
								}),
								_Utils_Tuple3(
								'def',
								'Def',
								function ($) {
									return $.def;
								}),
								_Utils_Tuple3(
								'spa',
								'SpA',
								function ($) {
									return $.spa;
								}),
								_Utils_Tuple3(
								'spd',
								'SpD',
								function ($) {
									return $.spd;
								}),
								_Utils_Tuple3(
								'spe',
								'Spe',
								function ($) {
									return $.spe;
								})
							])))
				]));
	});
var $author$project$Main$viewBaseStatsContent = F7(
	function (pokemon, pokemonList, abilityList, natureList, generation, isAttacker, openDropdown) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col gap-3')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label py-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label-text text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Species')
										]))
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$value(pokemon.species),
									$elm$html$Html$Events$onInput(
									isAttacker ? $author$project$Main$SetAttackerSpecies : $author$project$Main$SetDefenderSpecies),
									$elm$html$Html$Attributes$list(
									isAttacker ? 'attackerSpeciesList' : 'defenderSpeciesList'),
									$elm$html$Html$Attributes$placeholder('Search Pokemon...'),
									$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
								]),
							_List_Nil),
							A3(
							$elm$html$Html$Keyed$node,
							'datalist',
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id(
									isAttacker ? 'attackerSpeciesList' : 'defenderSpeciesList')
								]),
							A2(
								$elm$core$List$map,
								function (p) {
									return _Utils_Tuple2(
										p.name,
										A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value(p.name)
												]),
											_List_Nil));
								},
								pokemonList))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label py-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label-text text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Level')
										]))
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('number'),
									$elm$html$Html$Attributes$value(
									$elm$core$String$fromInt(pokemon.level)),
									$elm$html$Html$Events$onInput(
									function (v) {
										return isAttacker ? $author$project$Main$SetAttackerLevel(
											A2(
												$elm$core$Maybe$withDefault,
												50,
												$elm$core$String$toInt(v))) : $author$project$Main$SetDefenderLevel(
											A2(
												$elm$core$Maybe$withDefault,
												50,
												$elm$core$String$toInt(v)));
									}),
									$elm$html$Html$Attributes$min('1'),
									$elm$html$Html$Attributes$max('100'),
									$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
								]),
							_List_Nil)
						])),
					(generation >= 3) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label py-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label-text text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Nature')
										]))
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									isAttacker ? $author$project$Main$SetAttackerNature : $author$project$Main$SetDefenderNature),
									$elm$html$Html$Attributes$class('select select-bordered select-xs w-full')
								]),
							A2(
								$elm$core$List$map,
								function (n) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(n.name),
												$elm$html$Html$Attributes$selected(
												_Utils_eq(pokemon.nature, n.name))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												_Utils_ap(
													n.name,
													((n.plus !== '') && (n.minus !== '')) ? (' (+' + (n.plus + ('/-' + (n.minus + ')')))) : ''))
											]));
								},
								natureList))
						])) : $elm$html$Html$text(''),
					function () {
					if (generation >= 3) {
						var filteredAbilities = A2(
							$elm$core$List$filter,
							function (a) {
								return $elm$core$String$isEmpty(pokemon.ability) || A2(
									$elm$core$String$contains,
									$elm$core$String$toLower(pokemon.ability),
									$elm$core$String$toLower(a));
							},
							A3($author$project$Main$getFilteredAbilityList, pokemon.species, pokemonList, abilityList));
						var dropdownId = isAttacker ? $author$project$Main$AttackerAbilityDropdown : $author$project$Main$DefenderAbilityDropdown;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-control relative')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label py-1')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('label-text text-xs')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Ability')
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('flex gap-1')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('text'),
													$elm$html$Html$Attributes$value(pokemon.ability),
													$elm$html$Html$Events$onInput(
													isAttacker ? $author$project$Main$SetAttackerAbility : $author$project$Main$SetDefenderAbility),
													$elm$html$Html$Attributes$placeholder('Search Ability...'),
													$elm$html$Html$Attributes$class('input input-bordered input-xs flex-1'),
													$elm$html$Html$Events$onFocus(
													$author$project$Main$ToggleDropdown(dropdownId))
												]),
											_List_Nil),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('button'),
													$elm$html$Html$Events$onClick(
													$author$project$Main$ToggleDropdown(dropdownId)),
													$elm$html$Html$Attributes$class('btn btn-xs btn-square')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('▼')
												]))
										])),
									_Utils_eq(
									openDropdown,
									$elm$core$Maybe$Just(dropdownId)) ? A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-base-100 border border-base-300 rounded shadow-lg')
										]),
									A2(
										$elm$core$List$map,
										function (a) {
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('px-3 py-2 hover:bg-base-200 cursor-pointer text-xs'),
														$elm$html$Html$Events$onClick(
														isAttacker ? $author$project$Main$SetAttackerAbility(a) : $author$project$Main$SetDefenderAbility(a))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(a)
													]));
										},
										filteredAbilities)) : $elm$html$Html$text('')
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}(),
					A3($author$project$Main$viewEVsCompact, pokemon, generation, isAttacker),
					A3($author$project$Main$viewIVsCompact, pokemon, generation, isAttacker)
				]));
	});
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Main$viewCollapsibleSection = F4(
	function (title, isCollapsed, toggleMsg, content) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card bg-base-200 p-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(toggleMsg),
							$elm$html$Html$Attributes$class('flex items-center justify-between w-full text-left')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-semibold text-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-base-content/60')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									isCollapsed ? '▼' : '▲')
								]))
						])),
					isCollapsed ? $elm$html$Html$text('') : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mt-4 pt-4 border-t border-base-300')
						]),
					_List_fromArray(
						[content]))
				]));
	});
var $author$project$Main$AttackerItemDropdown = {$: 'AttackerItemDropdown'};
var $author$project$Main$AttackerMoveDropdown = function (a) {
	return {$: 'AttackerMoveDropdown', a: a};
};
var $author$project$Main$SetAttackerItem = function (a) {
	return {$: 'SetAttackerItem', a: a};
};
var $author$project$Main$SetAttackerMove = F2(
	function (a, b) {
		return {$: 'SetAttackerMove', a: a, b: b};
	});
var $author$project$Main$getFilteredMoveList = F2(
	function (maybeLearnset, allMoves) {
		if (maybeLearnset.$ === 'Just') {
			var learnset = maybeLearnset.a;
			var learnableMoves = _Utils_ap(
				learnset.levelup,
				_Utils_ap(
					learnset.tm,
					_Utils_ap(
						learnset.tutor,
						_Utils_ap(learnset.egg, learnset.other))));
			var learnableMovesData = A2(
				$elm$core$List$filter,
				function (m) {
					return A2($elm$core$List$member, m.name, learnableMoves);
				},
				allMoves);
			var otherMovesData = A2(
				$elm$core$List$filter,
				function (m) {
					return !A2($elm$core$List$member, m.name, learnableMoves);
				},
				allMoves);
			return _Utils_ap(learnableMovesData, otherMovesData);
		} else {
			return allMoves;
		}
	});
var $author$project$Main$getMoveSource = F2(
	function (maybeLearnset, moveName) {
		if (maybeLearnset.$ === 'Just') {
			var learnset = maybeLearnset.a;
			return A2($elm$core$List$member, moveName, learnset.levelup) ? ' [Level]' : (A2($elm$core$List$member, moveName, learnset.tm) ? ' [TM]' : (A2($elm$core$List$member, moveName, learnset.tutor) ? ' [Tutor]' : (A2($elm$core$List$member, moveName, learnset.egg) ? ' [Egg]' : (A2($elm$core$List$member, moveName, learnset.other) ? ' [Other]' : ''))));
		} else {
			return '';
		}
	});
var $author$project$Main$viewLoadoutSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card bg-base-200 p-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-sm font-semibold text-primary mb-3')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Loadout')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mb-3')
					]),
				_List_fromArray(
					[
						function () {
						if (model.generation >= 2) {
							var filteredItems = A2(
								$elm$core$List$filter,
								function (item) {
									return $elm$core$String$isEmpty(model.attacker.item) || A2(
										$elm$core$String$contains,
										$elm$core$String$toLower(model.attacker.item),
										$elm$core$String$toLower(item));
								},
								model.itemList);
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-control relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('label py-1')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('label-text text-xs')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Item')
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex gap-1')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$value(model.attacker.item),
														$elm$html$Html$Events$onInput($author$project$Main$SetAttackerItem),
														$elm$html$Html$Attributes$placeholder('Search Item...'),
														$elm$html$Html$Attributes$class('input input-bordered input-xs flex-1'),
														$elm$html$Html$Events$onFocus(
														$author$project$Main$ToggleDropdown($author$project$Main$AttackerItemDropdown))
													]),
												_List_Nil),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('button'),
														$elm$html$Html$Events$onClick(
														$author$project$Main$ToggleDropdown($author$project$Main$AttackerItemDropdown)),
														$elm$html$Html$Attributes$class('btn btn-xs btn-square')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('▼')
													]))
											])),
										_Utils_eq(
										model.openDropdown,
										$elm$core$Maybe$Just($author$project$Main$AttackerItemDropdown)) ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-base-100 border border-base-300 rounded shadow-lg')
											]),
										A2(
											$elm$core$List$map,
											function (item) {
												return A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('px-3 py-2 hover:bg-base-200 cursor-pointer text-xs'),
															$elm$html$Html$Events$onClick(
															$author$project$Main$SetAttackerItem(item))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(item)
														]));
											},
											filteredItems)) : $elm$html$Html$text('')
									]));
						} else {
							return $elm$html$Html$text('');
						}
					}()
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid grid-cols-2 gap-2')
					]),
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, move) {
							var moveData = $elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (m) {
										return _Utils_eq(m.name, move.name);
									},
									model.moveList));
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-control relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex gap-1')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$value(move.name),
														$elm$html$Html$Events$onInput(
														$author$project$Main$SetAttackerMove(index)),
														$elm$html$Html$Attributes$placeholder(
														'Move ' + $elm$core$String$fromInt(index + 1)),
														$elm$html$Html$Attributes$class('input input-bordered input-xs flex-1'),
														$elm$html$Html$Events$onFocus(
														$author$project$Main$ToggleDropdown(
															$author$project$Main$AttackerMoveDropdown(index)))
													]),
												_List_Nil),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('button'),
														$elm$html$Html$Events$onClick(
														$author$project$Main$ToggleDropdown(
															$author$project$Main$AttackerMoveDropdown(index))),
														$elm$html$Html$Attributes$class('btn btn-xs btn-square')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('▼')
													]))
											])),
										function () {
										if (_Utils_eq(
											model.openDropdown,
											$elm$core$Maybe$Just(
												$author$project$Main$AttackerMoveDropdown(index)))) {
											var isExactMatch = A2(
												$elm$core$List$any,
												function (m) {
													return _Utils_eq(m.name, move.name);
												},
												model.moveList);
											var filteredMoves = A2(
												$elm$core$List$filter,
												function (m) {
													return $elm$core$String$isEmpty(move.name) || (isExactMatch || A2(
														$elm$core$String$contains,
														$elm$core$String$toLower(move.name),
														$elm$core$String$toLower(m.name)));
												},
												A2($author$project$Main$getFilteredMoveList, model.attackerLearnset, model.moveList));
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-base-100 border border-base-300 rounded shadow-lg')
													]),
												A2(
													$elm$core$List$map,
													function (m) {
														return A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('px-3 py-2 hover:bg-base-200 cursor-pointer text-xs'),
																	$elm$html$Html$Events$onClick(
																	A2($author$project$Main$SetAttackerMove, index, m.name))
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	_Utils_ap(
																		m.name,
																		A2($author$project$Main$getMoveSource, model.attackerLearnset, m.name)))
																]));
													},
													filteredMoves));
										} else {
											return $elm$html$Html$text('');
										}
									}(),
										function () {
										if (moveData.$ === 'Just') {
											var data = moveData.a;
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('text-xs text-base-content/60 mt-1 px-1')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														data.moveType + (' • ' + (data.category + (' • BP: ' + (((data.basePower > 0) ? $elm$core$String$fromInt(data.basePower) : '—') + (' • Acc: ' + ((data.accuracy < 100) ? ($elm$core$String$fromInt(data.accuracy) + '%') : '—')))))))
													]));
										} else {
											return $elm$html$Html$text('');
										}
									}()
									]));
						}),
					model.attacker.moves))
			]));
};
var $author$project$Main$AddToBox = {$: 'AddToBox'};
var $author$project$Main$AddToTeam = {$: 'AddToTeam'};
var $author$project$Main$DragFromBox = {$: 'DragFromBox'};
var $author$project$Main$DragFromTeam = {$: 'DragFromTeam'};
var $author$project$Main$DragOver = {$: 'DragOver'};
var $author$project$Main$DropOnBox = {$: 'DropOnBox'};
var $author$project$Main$DropOnTeam = {$: 'DropOnTeam'};
var $author$project$Main$ToggleBoxCollapsed = {$: 'ToggleBoxCollapsed'};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$Main$onDrop = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'drop',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, true)));
};
var $author$project$Main$BoxEvolutionDropdown = function (a) {
	return {$: 'BoxEvolutionDropdown', a: a};
};
var $author$project$Main$BoxFormDropdown = function (a) {
	return {$: 'BoxFormDropdown', a: a};
};
var $author$project$Main$DragEnd = {$: 'DragEnd'};
var $author$project$Main$DragStart = F2(
	function (a, b) {
		return {$: 'DragStart', a: a, b: b};
	});
var $author$project$Main$EvolvePokemonInBox = F2(
	function (a, b) {
		return {$: 'EvolvePokemonInBox', a: a, b: b};
	});
var $author$project$Main$LoadFromBox = function (a) {
	return {$: 'LoadFromBox', a: a};
};
var $author$project$Main$RemoveFromBox = function (a) {
	return {$: 'RemoveFromBox', a: a};
};
var $author$project$Main$SwitchBoxPokemonForm = F2(
	function (a, b) {
		return {$: 'SwitchBoxPokemonForm', a: a, b: b};
	});
var $elm$html$Html$Attributes$draggable = _VirtualDom_attribute('draggable');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$viewBoxPokemonCompact = F3(
	function (model, index, pokemon) {
		var pokemonData = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (p) {
					return _Utils_eq(p.name, pokemon.species);
				},
				model.pokemonList));
		var isSelected = function () {
			var _v4 = model.attackerSource;
			if ((_v4.$ === 'Just') && (_v4.a.$ === 'FromBox')) {
				var i = _v4.a.a;
				return _Utils_eq(i, index);
			} else {
				return false;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					isSelected ? 'flex items-center justify-between p-2 bg-base-300 rounded cursor-pointer border-2 border-primary' : 'flex items-center justify-between p-2 bg-base-300 rounded cursor-pointer border border-transparent hover:border-primary'),
					$elm$html$Html$Events$onClick(
					$author$project$Main$LoadFromBox(index)),
					$elm$html$Html$Attributes$draggable('true'),
					A2(
					$elm$html$Html$Events$on,
					'dragstart',
					$elm$json$Json$Decode$succeed(
						A2($author$project$Main$DragStart, $author$project$Main$DragFromBox, index))),
					A2(
					$elm$html$Html$Events$on,
					'dragend',
					$elm$json$Json$Decode$succeed($author$project$Main$DragEnd))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center gap-2')
						]),
					_List_fromArray(
						[
							function () {
							if (pokemonData.$ === 'Just') {
								var data = pokemonData.a;
								return A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(data.spriteUrl),
											$elm$html$Html$Attributes$class(
											data.isPixelated ? 'w-8 h-8' : 'w-8 h-8'),
											A2(
											$elm$html$Html$Attributes$style,
											'image-rendering',
											data.isPixelated ? 'pixelated' : 'auto')
										]),
									_List_Nil);
							} else {
								return $elm$html$Html$text('');
							}
						}(),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xs font-medium')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(pokemon.species)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xs text-base-content/60')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'L' + $elm$core$String$fromInt(pokemon.level))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center gap-1')
						]),
					_List_fromArray(
						[
							function () {
							if (pokemonData.$ === 'Just') {
								var data = pokemonData.a;
								if (!$elm$core$List$isEmpty(data.evos)) {
									if ($elm$core$List$length(data.evos) === 1) {
										var _v2 = $elm$core$List$head(data.evos);
										if (_v2.$ === 'Just') {
											var evo = _v2.a;
											return A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-success'),
														A2(
														$elm$html$Html$Events$stopPropagationOn,
														'click',
														$elm$json$Json$Decode$succeed(
															_Utils_Tuple2(
																A2($author$project$Main$EvolvePokemonInBox, index, evo),
																true)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('→' + evo)
													]));
										} else {
											return $elm$html$Html$text('');
										}
									} else {
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('relative')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-success'),
															A2(
															$elm$html$Html$Events$stopPropagationOn,
															'click',
															$elm$json$Json$Decode$succeed(
																_Utils_Tuple2(
																	$author$project$Main$ToggleDropdown(
																		$author$project$Main$BoxEvolutionDropdown(index)),
																	true)))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Evolve ▼')
														])),
													_Utils_eq(
													model.openDropdown,
													$elm$core$Maybe$Just(
														$author$project$Main$BoxEvolutionDropdown(index))) ? A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('absolute z-50 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow-lg')
														]),
													A2(
														$elm$core$List$map,
														function (evo) {
															return A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('px-3 py-2 hover:bg-base-200 cursor-pointer text-xs whitespace-nowrap'),
																		A2(
																		$elm$html$Html$Events$stopPropagationOn,
																		'click',
																		$elm$json$Json$Decode$succeed(
																			_Utils_Tuple2(
																				A2($author$project$Main$EvolvePokemonInBox, index, evo),
																				true)))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('→ ' + evo)
																	]));
														},
														data.evos)) : $elm$html$Html$text('')
												]));
									}
								} else {
									return $elm$html$Html$text('');
								}
							} else {
								return $elm$html$Html$text('');
							}
						}(),
							function () {
							if (pokemonData.$ === 'Just') {
								var data = pokemonData.a;
								return (!$elm$core$List$isEmpty(data.otherFormes)) ? A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('relative')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-info'),
													A2(
													$elm$html$Html$Events$stopPropagationOn,
													'click',
													$elm$json$Json$Decode$succeed(
														_Utils_Tuple2(
															$author$project$Main$ToggleDropdown(
																$author$project$Main$BoxFormDropdown(index)),
															true)))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Form ▼')
												])),
											_Utils_eq(
											model.openDropdown,
											$elm$core$Maybe$Just(
												$author$project$Main$BoxFormDropdown(index))) ? A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('absolute z-50 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow-lg')
												]),
											A2(
												$elm$core$List$map,
												function (form) {
													return A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('px-3 py-2 hover:bg-base-200 cursor-pointer text-xs whitespace-nowrap'),
																A2(
																$elm$html$Html$Events$stopPropagationOn,
																'click',
																$elm$json$Json$Decode$succeed(
																	_Utils_Tuple2(
																		A2($author$project$Main$SwitchBoxPokemonForm, index, form),
																		true)))
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(form)
															]));
												},
												data.otherFormes)) : $elm$html$Html$text('')
										])) : $elm$html$Html$text('');
							} else {
								return $elm$html$Html$text('');
							}
						}(),
							($elm$core$List$length(model.team) < 6) ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-xs btn-ghost'),
									A2(
									$elm$html$Html$Events$stopPropagationOn,
									'click',
									$elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											$author$project$Main$MoveToTeam(index),
											true)))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('→Team')
								])) : $elm$html$Html$text(''),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-error'),
									A2(
									$elm$html$Html$Events$stopPropagationOn,
									'click',
									$elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											$author$project$Main$RemoveFromBox(index),
											true)))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('×')
								]))
						]))
				]));
	});
var $author$project$Main$EvolvePokemonInTeam = F2(
	function (a, b) {
		return {$: 'EvolvePokemonInTeam', a: a, b: b};
	});
var $author$project$Main$LoadFromTeam = function (a) {
	return {$: 'LoadFromTeam', a: a};
};
var $author$project$Main$RemoveFromTeam = function (a) {
	return {$: 'RemoveFromTeam', a: a};
};
var $author$project$Main$SwitchTeamPokemonForm = F2(
	function (a, b) {
		return {$: 'SwitchTeamPokemonForm', a: a, b: b};
	});
var $author$project$Main$TeamEvolutionDropdown = function (a) {
	return {$: 'TeamEvolutionDropdown', a: a};
};
var $author$project$Main$TeamFormDropdown = function (a) {
	return {$: 'TeamFormDropdown', a: a};
};
var $author$project$Main$viewTeamPokemonCompact = F3(
	function (model, index, pokemon) {
		var pokemonData = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (p) {
					return _Utils_eq(p.name, pokemon.species);
				},
				model.pokemonList));
		var isSelected = function () {
			var _v4 = model.attackerSource;
			if ((_v4.$ === 'Just') && (_v4.a.$ === 'FromTeam')) {
				var i = _v4.a.a;
				return _Utils_eq(i, index);
			} else {
				return false;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					isSelected ? 'flex items-center justify-between p-2 bg-base-300 rounded cursor-pointer border-2 border-primary' : 'flex items-center justify-between p-2 bg-base-300 rounded cursor-pointer border border-transparent hover:border-primary'),
					$elm$html$Html$Events$onClick(
					$author$project$Main$LoadFromTeam(index)),
					$elm$html$Html$Attributes$draggable('true'),
					A2(
					$elm$html$Html$Events$on,
					'dragstart',
					$elm$json$Json$Decode$succeed(
						A2($author$project$Main$DragStart, $author$project$Main$DragFromTeam, index))),
					A2(
					$elm$html$Html$Events$on,
					'dragend',
					$elm$json$Json$Decode$succeed($author$project$Main$DragEnd))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center gap-2')
						]),
					_List_fromArray(
						[
							function () {
							if (pokemonData.$ === 'Just') {
								var data = pokemonData.a;
								return A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(data.spriteUrl),
											$elm$html$Html$Attributes$class(
											data.isPixelated ? 'w-8 h-8' : 'w-8 h-8'),
											A2(
											$elm$html$Html$Attributes$style,
											'image-rendering',
											data.isPixelated ? 'pixelated' : 'auto')
										]),
									_List_Nil);
							} else {
								return $elm$html$Html$text('');
							}
						}(),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xs font-medium')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(pokemon.species)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xs text-base-content/60')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'L' + $elm$core$String$fromInt(pokemon.level))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center gap-1')
						]),
					_List_fromArray(
						[
							function () {
							if (pokemonData.$ === 'Just') {
								var data = pokemonData.a;
								if (!$elm$core$List$isEmpty(data.evos)) {
									if ($elm$core$List$length(data.evos) === 1) {
										var _v2 = $elm$core$List$head(data.evos);
										if (_v2.$ === 'Just') {
											var evo = _v2.a;
											return A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-success'),
														A2(
														$elm$html$Html$Events$stopPropagationOn,
														'click',
														$elm$json$Json$Decode$succeed(
															_Utils_Tuple2(
																A2($author$project$Main$EvolvePokemonInTeam, index, evo),
																true)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('→' + evo)
													]));
										} else {
											return $elm$html$Html$text('');
										}
									} else {
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('relative')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-success'),
															A2(
															$elm$html$Html$Events$stopPropagationOn,
															'click',
															$elm$json$Json$Decode$succeed(
																_Utils_Tuple2(
																	$author$project$Main$ToggleDropdown(
																		$author$project$Main$TeamEvolutionDropdown(index)),
																	true)))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Evolve ▼')
														])),
													_Utils_eq(
													model.openDropdown,
													$elm$core$Maybe$Just(
														$author$project$Main$TeamEvolutionDropdown(index))) ? A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('absolute z-50 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow-lg')
														]),
													A2(
														$elm$core$List$map,
														function (evo) {
															return A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('px-3 py-2 hover:bg-base-200 cursor-pointer text-xs whitespace-nowrap'),
																		A2(
																		$elm$html$Html$Events$stopPropagationOn,
																		'click',
																		$elm$json$Json$Decode$succeed(
																			_Utils_Tuple2(
																				A2($author$project$Main$EvolvePokemonInTeam, index, evo),
																				true)))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('→ ' + evo)
																	]));
														},
														data.evos)) : $elm$html$Html$text('')
												]));
									}
								} else {
									return $elm$html$Html$text('');
								}
							} else {
								return $elm$html$Html$text('');
							}
						}(),
							function () {
							if (pokemonData.$ === 'Just') {
								var data = pokemonData.a;
								return (!$elm$core$List$isEmpty(data.otherFormes)) ? A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('relative')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-info'),
													A2(
													$elm$html$Html$Events$stopPropagationOn,
													'click',
													$elm$json$Json$Decode$succeed(
														_Utils_Tuple2(
															$author$project$Main$ToggleDropdown(
																$author$project$Main$TeamFormDropdown(index)),
															true)))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Form ▼')
												])),
											_Utils_eq(
											model.openDropdown,
											$elm$core$Maybe$Just(
												$author$project$Main$TeamFormDropdown(index))) ? A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('absolute z-50 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow-lg')
												]),
											A2(
												$elm$core$List$map,
												function (form) {
													return A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('px-3 py-2 hover:bg-base-200 cursor-pointer text-xs whitespace-nowrap'),
																A2(
																$elm$html$Html$Events$stopPropagationOn,
																'click',
																$elm$json$Json$Decode$succeed(
																	_Utils_Tuple2(
																		A2($author$project$Main$SwitchTeamPokemonForm, index, form),
																		true)))
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(form)
															]));
												},
												data.otherFormes)) : $elm$html$Html$text('')
										])) : $elm$html$Html$text('');
							} else {
								return $elm$html$Html$text('');
							}
						}(),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Main$MoveToBox(index)),
									$elm$html$Html$Attributes$class('btn btn-xs btn-ghost'),
									A2(
									$elm$html$Html$Events$stopPropagationOn,
									'click',
									$elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											$author$project$Main$MoveToBox(index),
											true)))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('→Box')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Main$RemoveFromTeam(index)),
									$elm$html$Html$Attributes$class('btn btn-xs btn-ghost text-error'),
									A2(
									$elm$html$Html$Events$stopPropagationOn,
									'click',
									$elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											$author$project$Main$RemoveFromTeam(index),
											true)))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('×')
								]))
						]))
				]));
	});
var $author$project$Main$viewTeamBoxSection = function (model) {
	var isDraggingOverTeam = function () {
		var _v1 = model.dragState;
		if (_v1.$ === 'Just') {
			var source = _v1.a.source;
			return _Utils_eq(source, $author$project$Main$DragFromBox);
		} else {
			return false;
		}
	}();
	var isDraggingOverBox = function () {
		var _v0 = model.dragState;
		if (_v0.$ === 'Just') {
			var source = _v0.a.source;
			return _Utils_eq(source, $author$project$Main$DragFromTeam);
		} else {
			return false;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card bg-base-200 p-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						isDraggingOverTeam ? 'pb-4 mb-4 border-b border-primary' : 'pb-4 mb-4 border-b border-base-300'),
						A2(
						$elm$html$Html$Events$preventDefaultOn,
						'dragover',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Main$DragOver, true))),
						$author$project$Main$onDrop($author$project$Main$DropOnTeam)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex justify-between items-center mb-3')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm font-semibold text-primary')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Team (' + ($elm$core$String$fromInt(
											$elm$core$List$length(model.team)) + '/6)'))
									])),
								($elm$core$List$length(model.team) < 6) ? A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$AddToTeam),
										$elm$html$Html$Attributes$class('btn btn-xs btn-outline btn-primary')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('+ Add')
									])) : $elm$html$Html$text('')
							])),
						$elm$core$List$isEmpty(model.team) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-xs text-base-content/60 text-center py-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No Pokemon in team')
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col gap-1')
							]),
						A2(
							$elm$core$List$indexedMap,
							$author$project$Main$viewTeamPokemonCompact(model),
							model.team))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$Events$preventDefaultOn,
						'dragover',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Main$DragOver, true))),
						$author$project$Main$onDrop($author$project$Main$DropOnBox)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$ToggleBoxCollapsed),
								$elm$html$Html$Attributes$class('flex items-center justify-between w-full text-left mb-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm font-semibold text-base-content/60')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Box [' + ($elm$core$String$fromInt(
											$elm$core$List$length(model.box)) + ']'))
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-xs text-base-content/60')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										model.boxCollapsed ? '▼' : '▲')
									]))
							])),
						model.boxCollapsed ? $elm$html$Html$text('') : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								isDraggingOverBox ? 'max-h-40 overflow-y-auto border-2 border-primary rounded-lg p-2' : 'max-h-40 overflow-y-auto')
							]),
						_List_fromArray(
							[
								$elm$core$List$isEmpty(model.box) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-xs text-base-content/60 text-center py-2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Box is empty')
									])) : A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex flex-col gap-1')
									]),
								A2(
									$elm$core$List$indexedMap,
									$author$project$Main$viewBoxPokemonCompact(model),
									model.box)),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$AddToBox),
										$elm$html$Html$Attributes$class('btn btn-xs btn-ghost w-full mt-2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('+ Add to Box')
									]))
							]))
					]))
			]));
};
var $author$project$Main$viewAttackerColumn = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col gap-4')
			]),
		_List_fromArray(
			[
				$author$project$Main$viewTeamBoxSection(model),
				$author$project$Main$viewLoadoutSection(model),
				A4(
				$author$project$Main$viewCollapsibleSection,
				'Base Stats',
				model.attackerBaseStatsCollapsed,
				$author$project$Main$ToggleAttackerBaseStatsCollapsed,
				A7($author$project$Main$viewBaseStatsContent, model.attacker, model.pokemonList, model.abilityList, model.natureList, model.generation, true, model.openDropdown))
			]));
};
var $author$project$Main$SetAttackerBoost = F2(
	function (a, b) {
		return {$: 'SetAttackerBoost', a: a, b: b};
	});
var $author$project$Main$SetAttackerCurHP = function (a) {
	return {$: 'SetAttackerCurHP', a: a};
};
var $author$project$Main$SetAttackerStatus = function (a) {
	return {$: 'SetAttackerStatus', a: a};
};
var $author$project$Main$SetAttackerTeraType = function (a) {
	return {$: 'SetAttackerTeraType', a: a};
};
var $author$project$Main$SetDefenderBoost = F2(
	function (a, b) {
		return {$: 'SetDefenderBoost', a: a, b: b};
	});
var $author$project$Main$SetDefenderCurHP = function (a) {
	return {$: 'SetDefenderCurHP', a: a};
};
var $author$project$Main$SetDefenderStatus = function (a) {
	return {$: 'SetDefenderStatus', a: a};
};
var $author$project$Main$SetDefenderTeraType = function (a) {
	return {$: 'SetDefenderTeraType', a: a};
};
var $elm$html$Html$datalist = _VirtualDom_node('datalist');
var $author$project$Main$viewBattleStateSection = F4(
	function (title, pokemon, generation, isAttacker) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card bg-base-200 p-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-sm font-semibold text-primary mb-3')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Battle State')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-3')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label py-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label-text text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('HP')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center gap-2')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('range'),
											$elm$html$Html$Attributes$min('0'),
											$elm$html$Html$Attributes$max('100'),
											$elm$html$Html$Attributes$value(
											$elm$core$String$fromInt(pokemon.curHP)),
											$elm$html$Html$Events$onInput(
											function (v) {
												return isAttacker ? $author$project$Main$SetAttackerCurHP(
													A2(
														$elm$core$Maybe$withDefault,
														100,
														$elm$core$String$toInt(v))) : $author$project$Main$SetDefenderCurHP(
													A2(
														$elm$core$Maybe$withDefault,
														100,
														$elm$core$String$toInt(v)));
											}),
											$elm$html$Html$Attributes$class('range range-xs range-primary flex-1')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-xs w-8 text-right')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(pokemon.curHP) + '%')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-3')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label py-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label-text text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Status')
										]))
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									isAttacker ? $author$project$Main$SetAttackerStatus : $author$project$Main$SetDefenderStatus),
									$elm$html$Html$Attributes$class('select select-bordered select-xs w-full')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value(''),
											$elm$html$Html$Attributes$selected(pokemon.status === '')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Healthy')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('Paralysis'),
											$elm$html$Html$Attributes$selected(pokemon.status === 'Paralysis')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Paralysis')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('Poison'),
											$elm$html$Html$Attributes$selected(pokemon.status === 'Poison')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Poison')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('Burn'),
											$elm$html$Html$Attributes$selected(pokemon.status === 'Burn')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Burn')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('Sleep'),
											$elm$html$Html$Attributes$selected(pokemon.status === 'Sleep')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Sleep')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('Freeze'),
											$elm$html$Html$Attributes$selected(pokemon.status === 'Freeze')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Freeze')
										]))
								]))
						])),
					(generation >= 9) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-3')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label py-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label-text text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Tera Type')
										]))
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$value(pokemon.teraType),
									$elm$html$Html$Events$onInput(
									isAttacker ? $author$project$Main$SetAttackerTeraType : $author$project$Main$SetDefenderTeraType),
									$elm$html$Html$Attributes$list(title + 'TeraTypeList'),
									$elm$html$Html$Attributes$placeholder('None'),
									$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$datalist,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id(title + 'TeraTypeList')
								]),
							A2(
								$elm$core$List$map,
								function (t) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(t)
											]),
										_List_Nil);
								},
								_List_fromArray(
									['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'])))
						])) : $elm$html$Html$text(''),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label py-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('label-text text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Stat Boosts')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('grid grid-cols-3 gap-1')
								]),
							A2(
								$elm$core$List$map,
								function (_v0) {
									var statName = _v0.a;
									var statLabel = _v0.b;
									var getValue = _v0.c;
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('form-control')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$label,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('label py-0')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('label-text text-xs')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(statLabel)
															]))
													])),
												A2(
												$elm$html$Html$select,
												_List_fromArray(
													[
														$elm$html$Html$Events$onInput(
														function (v) {
															return isAttacker ? A2(
																$author$project$Main$SetAttackerBoost,
																statName,
																A2(
																	$elm$core$Maybe$withDefault,
																	0,
																	$elm$core$String$toInt(v))) : A2(
																$author$project$Main$SetDefenderBoost,
																statName,
																A2(
																	$elm$core$Maybe$withDefault,
																	0,
																	$elm$core$String$toInt(v)));
														}),
														$elm$html$Html$Attributes$class('select select-bordered select-xs w-full')
													]),
												A2(
													$elm$core$List$map,
													function (i) {
														return A2(
															$elm$html$Html$option,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$value(
																	$elm$core$String$fromInt(i)),
																	$elm$html$Html$Attributes$selected(
																	_Utils_eq(
																		getValue(pokemon.boosts),
																		i))
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	(i > 0) ? ('+' + $elm$core$String$fromInt(i)) : $elm$core$String$fromInt(i))
																]));
													},
													$elm$core$List$reverse(
														A2($elm$core$List$range, -6, 6))))
											]));
								},
								_List_fromArray(
									[
										_Utils_Tuple3(
										'atk',
										'Atk',
										function ($) {
											return $.atk;
										}),
										_Utils_Tuple3(
										'def',
										'Def',
										function ($) {
											return $.def;
										}),
										_Utils_Tuple3(
										'spa',
										'SpA',
										function ($) {
											return $.spa;
										}),
										_Utils_Tuple3(
										'spd',
										'SpD',
										function ($) {
											return $.spd;
										}),
										_Utils_Tuple3(
										'spe',
										'Spe',
										function ($) {
											return $.spe;
										})
									])))
						]))
				]));
	});
var $author$project$Main$viewBattleStatesContent = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('grid grid-cols-1 lg:grid-cols-2 gap-4')
			]),
		_List_fromArray(
			[
				A4($author$project$Main$viewBattleStateSection, 'Attacker', model.attacker, model.generation, true),
				A4($author$project$Main$viewBattleStateSection, 'Defender', model.defender, model.generation, false)
			]));
};
var $author$project$Main$SetAttackerMoveCrit = F2(
	function (a, b) {
		return {$: 'SetAttackerMoveCrit', a: a, b: b};
	});
var $author$project$Main$SetDefenderMoveCrit = F2(
	function (a, b) {
		return {$: 'SetDefenderMoveCrit', a: a, b: b};
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$round = _Basics_round;
var $author$project$Main$formatDamagePercent = function (_v0) {
	var minP = _v0.a;
	var maxP = _v0.b;
	return $elm$core$String$fromFloat(
		$elm$core$Basics$round(minP * 10) / 10) + (' - ' + ($elm$core$String$fromFloat(
		$elm$core$Basics$round(maxP * 10) / 10) + '%'));
};
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Main$viewDamageDetailsCenter = F5(
	function (result, selectedSource, selectedIndex, attacker, defender) {
		var selectedResult = function () {
			if (selectedSource.$ === 'AttackerMove') {
				return $elm$core$List$head(
					A2($elm$core$List$drop, selectedIndex, result.attackerResults));
			} else {
				return $elm$core$List$head(
					A2($elm$core$List$drop, selectedIndex, result.defenderResults));
			}
		}();
		var selectedMove = function () {
			if (selectedSource.$ === 'AttackerMove') {
				return $elm$core$List$head(
					A2($elm$core$List$drop, selectedIndex, attacker.moves));
			} else {
				return $elm$core$List$head(
					A2($elm$core$List$drop, selectedIndex, defender.moves));
			}
		}();
		var isCrit = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.isCrit;
				},
				selectedMove));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col justify-center items-center')
				]),
			_List_fromArray(
				[
					function () {
					if (selectedResult.$ === 'Just') {
						var moveResult = selectedResult.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-xl font-bold text-success mb-1')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Main$formatDamagePercent(moveResult.damagePercent))
										])),
									(!$elm$core$String$isEmpty(moveResult.koChance)) ? A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-xs text-warning mb-2')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(moveResult.koChance)
										])) : $elm$html$Html$text(''),
									A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('flex items-center gap-2 mt-2 mb-2 cursor-pointer')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('checkbox'),
													$elm$html$Html$Attributes$checked(isCrit),
													$elm$html$Html$Events$onCheck(
													function (checked) {
														if (selectedSource.$ === 'AttackerMove') {
															return A2($author$project$Main$SetAttackerMoveCrit, selectedIndex, checked);
														} else {
															return A2($author$project$Main$SetDefenderMoveCrit, selectedIndex, checked);
														}
													}),
													$elm$html$Html$Attributes$class('checkbox checkbox-sm')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-sm text-base-content/80')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Critical Hit')
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-xs text-base-content/60')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											A2(
												$elm$core$String$join,
												', ',
												A2($elm$core$List$map, $elm$core$String$fromInt, moveResult.damageRolls)))
										]))
								]));
					} else {
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center text-xs text-base-content/60')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Click a move')
								]));
					}
				}()
				]));
	});
var $author$project$Main$SelectMove = F2(
	function (a, b) {
		return {$: 'SelectMove', a: a, b: b};
	});
var $author$project$Main$isValidMove = F2(
	function (moveName, moveList) {
		return $elm$core$String$isEmpty(moveName) ? false : A2(
			$elm$core$List$any,
			function (move) {
				return _Utils_eq(move.name, moveName);
			},
			moveList);
	});
var $author$project$Main$viewMoveButtonColumn = F8(
	function (moveList, pokemonName, results, mySpeed, theirSpeed, source, selectedSource, selectedIndex) {
		var validResults = A2(
			$elm$core$List$filter,
			function (result) {
				return A2($author$project$Main$isValidMove, result.moveName, moveList);
			},
			results);
		var isSlower = _Utils_cmp(mySpeed, theirSpeed) < 0;
		var isAttacker = _Utils_eq(source, $author$project$Main$AttackerMove);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col gap-1')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center gap-1 mb-1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-xs font-medium truncate')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(pokemonName)
								])),
							isSlower ? A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('badge badge-warning badge-xs')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('slow')
								])) : $elm$html$Html$text('')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-col gap-1')
						]),
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (index, result) {
								var isSelected = _Utils_eq(selectedSource, source) && _Utils_eq(selectedIndex, index);
								return A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											A2($author$project$Main$SelectMove, source, index)),
											$elm$html$Html$Attributes$class(
											isSelected ? 'p-1.5 rounded bg-base-300 border-2 border-primary text-left text-xs' : 'p-1.5 rounded bg-base-300 border border-base-300 hover:border-primary text-left text-xs')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(result.moveName)
										]));
							}),
						validResults))
				]));
	});
var $author$project$Main$viewDamageResultsPanel = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card bg-base-200 p-4')
			]),
		_List_fromArray(
			[
				function () {
				var _v0 = model.result;
				if (_v0.$ === 'Nothing') {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-center text-base-content/60 py-8')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Select Pokemon and moves to see damage calculations')
							]));
				} else {
					var result = _v0.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('grid grid-cols-3 gap-2')
							]),
						_List_fromArray(
							[
								A8($author$project$Main$viewMoveButtonColumn, model.moveList, model.attacker.species, result.attackerResults, result.attackerSpeed, result.defenderSpeed, $author$project$Main$AttackerMove, model.selectedMoveSource, model.selectedMoveIndex),
								A5($author$project$Main$viewDamageDetailsCenter, result, model.selectedMoveSource, model.selectedMoveIndex, model.attacker, model.defender),
								A8($author$project$Main$viewMoveButtonColumn, model.moveList, model.defender.species, result.defenderResults, result.defenderSpeed, result.attackerSpeed, $author$project$Main$DefenderMove, model.selectedMoveSource, model.selectedMoveIndex)
							]));
				}
			}()
			]));
};
var $author$project$Main$ToggleDefenderBaseStatsCollapsed = {$: 'ToggleDefenderBaseStatsCollapsed'};
var $author$project$Main$SetDefenderItem = function (a) {
	return {$: 'SetDefenderItem', a: a};
};
var $author$project$Main$SetDefenderMove = F2(
	function (a, b) {
		return {$: 'SetDefenderMove', a: a, b: b};
	});
var $author$project$Main$ToggleDefenderEditMode = {$: 'ToggleDefenderEditMode'};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $author$project$Main$viewDefenderInfoSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card bg-base-200 p-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex items-center justify-between mb-3')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-sm font-semibold text-primary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Defender Info')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$ToggleDefenderEditMode),
								$elm$html$Html$Attributes$class('btn btn-xs btn-ghost')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.defenderEditMode ? 'Done' : 'Edit')
							]))
					])),
				model.defenderEditMode ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-col gap-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.defender.species),
										$elm$html$Html$Events$onInput($author$project$Main$SetDefenderSpecies),
										$elm$html$Html$Attributes$list('defenderSpeciesListEdit'),
										$elm$html$Html$Attributes$placeholder('Species'),
										$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
									]),
								_List_Nil),
								A3(
								$elm$html$Html$Keyed$node,
								'datalist',
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('defenderSpeciesListEdit')
									]),
								A2(
									$elm$core$List$map,
									function (p) {
										return _Utils_Tuple2(
											p.name,
											A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(p.name)
													]),
												_List_Nil));
									},
									model.pokemonList))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('number'),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.defender.level)),
										$elm$html$Html$Events$onInput(
										function (v) {
											return $author$project$Main$SetDefenderLevel(
												A2(
													$elm$core$Maybe$withDefault,
													50,
													$elm$core$String$toInt(v)));
										}),
										$elm$html$Html$Attributes$placeholder('Level'),
										$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
									]),
								_List_Nil)
							])),
						(model.generation >= 2) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.defender.item),
										$elm$html$Html$Events$onInput($author$project$Main$SetDefenderItem),
										$elm$html$Html$Attributes$list('defenderItemListEdit'),
										$elm$html$Html$Attributes$placeholder('Item'),
										$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
									]),
								_List_Nil),
								A3(
								$elm$html$Html$Keyed$node,
								'datalist',
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('defenderItemListEdit')
									]),
								A2(
									$elm$core$List$map,
									function (item) {
										return _Utils_Tuple2(
											item,
											A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(item)
													]),
												_List_Nil));
									},
									model.itemList))
							])) : $elm$html$Html$text(''),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('grid grid-cols-2 gap-1')
							]),
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (index, move) {
									return A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$value(move.name),
												$elm$html$Html$Events$onInput(
												$author$project$Main$SetDefenderMove(index)),
												$elm$html$Html$Attributes$list(
												'defenderMoveListEdit' + $elm$core$String$fromInt(index)),
												$elm$html$Html$Attributes$placeholder(
												'Move ' + $elm$core$String$fromInt(index + 1)),
												$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
											]),
										_List_Nil);
								}),
							model.defender.moves))
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-xs')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-medium text-base-content')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.defender.species + (' L' + $elm$core$String$fromInt(model.defender.level)))
							])),
						((model.generation >= 3) && (!$elm$core$String$isEmpty(model.defender.ability))) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-secondary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(model.defender.ability)
							])) : $elm$html$Html$text(''),
						((model.generation >= 2) && (!$elm$core$String$isEmpty(model.defender.item))) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-warning')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(model.defender.item)
							])) : $elm$html$Html$text(''),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-base-content/60 mt-1')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(
									$elm$core$String$join,
									', ',
									A2(
										$elm$core$List$filter,
										A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
										A2(
											$elm$core$List$map,
											function ($) {
												return $.name;
											},
											model.defender.moves))))
							]))
					]))
			]));
};
var $author$project$Main$LoadTrainerToDefender = function (a) {
	return {$: 'LoadTrainerToDefender', a: a};
};
var $author$project$Main$NextTrainer = {$: 'NextTrainer'};
var $author$project$Main$PrevTrainer = {$: 'PrevTrainer'};
var $author$project$Main$SelectFromSearchResults = function (a) {
	return {$: 'SelectFromSearchResults', a: a};
};
var $author$project$Main$SetTrainerSearchQuery = function (a) {
	return {$: 'SetTrainerSearchQuery', a: a};
};
var $author$project$Main$viewTrainerSelectionSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card bg-base-200 p-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-sm font-semibold text-primary mb-3')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Trainer Selection')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-control mb-3 relative')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$value(model.trainerSearchQuery),
								$elm$html$Html$Events$onInput($author$project$Main$SetTrainerSearchQuery),
								$elm$html$Html$Attributes$placeholder('Search trainers...'),
								$elm$html$Html$Attributes$class('input input-bordered input-xs w-full')
							]),
						_List_Nil),
						((!$elm$core$String$isEmpty(model.trainerSearchQuery)) && (!$elm$core$List$isEmpty(model.filteredEncounters))) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded mt-1 max-h-48 overflow-y-auto z-10 shadow-lg')
							]),
						A2(
							$elm$core$List$map,
							function (enc) {
								return A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Main$SelectFromSearchResults(enc)),
											$elm$html$Html$Attributes$class('block w-full text-left p-2 hover:bg-base-300 text-xs')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-medium')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(enc.trainerClass + (' ' + enc.trainerName))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text-base-content/60')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(enc.location)
												]))
										]));
							},
							A2($elm$core$List$take, 10, model.filteredEncounters))) : $elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex items-center justify-between mb-3')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$PrevTrainer),
								$elm$html$Html$Attributes$class('btn btn-xs btn-ghost')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('← Prev')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-xs text-base-content/60')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(model.selectedTrainerIndex + 1) + ('/' + $elm$core$String$fromInt(
									$elm$core$List$length(model.trainerEncounters))))
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$NextTrainer),
								$elm$html$Html$Attributes$class('btn btn-xs btn-ghost')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Next →')
							]))
					])),
				function () {
				var _v0 = $elm$core$List$head(
					A2($elm$core$List$drop, model.selectedTrainerIndex, model.trainerEncounters));
				if (_v0.$ === 'Just') {
					var encounter = _v0.a;
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-xs text-base-content/60 mb-2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(encounter.trainerClass + (' ' + (encounter.trainerName + (' - ' + encounter.location))))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('grid grid-cols-3 gap-1')
									]),
								A2(
									$elm$core$List$indexedMap,
									F2(
										function (index, tp) {
											return A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick(
														$author$project$Main$LoadTrainerToDefender(index)),
														$elm$html$Html$Attributes$class('p-1 bg-base-300 rounded text-xs hover:border-primary border border-transparent')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('font-medium truncate')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(tp.species)
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('text-base-content/60')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																'L' + $elm$core$String$fromInt(tp.level))
															]))
													]));
										}),
									encounter.team))
							]));
				} else {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-xs text-base-content/60 text-center')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No trainer selected')
							]));
				}
			}()
			]));
};
var $author$project$Main$viewDefenderColumn = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col gap-4')
			]),
		_List_fromArray(
			[
				$author$project$Main$viewTrainerSelectionSection(model),
				$author$project$Main$viewDefenderInfoSection(model),
				A4(
				$author$project$Main$viewCollapsibleSection,
				'Base Stats',
				model.defenderBaseStatsCollapsed,
				$author$project$Main$ToggleDefenderBaseStatsCollapsed,
				A7($author$project$Main$viewBaseStatsContent, model.defender, model.pokemonList, model.abilityList, model.natureList, model.generation, false, model.openDropdown))
			]));
};
var $author$project$Main$SetFieldGameType = function (a) {
	return {$: 'SetFieldGameType', a: a};
};
var $author$project$Main$SetFieldTerrain = function (a) {
	return {$: 'SetFieldTerrain', a: a};
};
var $author$project$Main$SetFieldWeather = function (a) {
	return {$: 'SetFieldWeather', a: a};
};
var $author$project$Main$SetAttackerSideLightScreen = function (a) {
	return {$: 'SetAttackerSideLightScreen', a: a};
};
var $author$project$Main$SetAttackerSideReflect = function (a) {
	return {$: 'SetAttackerSideReflect', a: a};
};
var $author$project$Main$SetAttackerSideStealthRock = function (a) {
	return {$: 'SetAttackerSideStealthRock', a: a};
};
var $author$project$Main$SetAttackerSideTailwind = function (a) {
	return {$: 'SetAttackerSideTailwind', a: a};
};
var $author$project$Main$SetDefenderSideLightScreen = function (a) {
	return {$: 'SetDefenderSideLightScreen', a: a};
};
var $author$project$Main$SetDefenderSideReflect = function (a) {
	return {$: 'SetDefenderSideReflect', a: a};
};
var $author$project$Main$SetDefenderSideStealthRock = function (a) {
	return {$: 'SetDefenderSideStealthRock', a: a};
};
var $author$project$Main$SetDefenderSideTailwind = function (a) {
	return {$: 'SetDefenderSideTailwind', a: a};
};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $author$project$Main$viewSideConditionsCompact = F3(
	function (title, conditions, isAttacker) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h4,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-xs font-semibold text-base-content/60 mb-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('grid grid-cols-2 gap-x-4 gap-y-1 text-xs')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center gap-1 cursor-pointer')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(conditions.isReflect),
											$elm$html$Html$Events$onCheck(
											isAttacker ? $author$project$Main$SetAttackerSideReflect : $author$project$Main$SetDefenderSideReflect),
											$elm$html$Html$Attributes$class('checkbox checkbox-xs checkbox-primary')
										]),
									_List_Nil),
									$elm$html$Html$text('Reflect')
								])),
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center gap-1 cursor-pointer')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(conditions.isLightScreen),
											$elm$html$Html$Events$onCheck(
											isAttacker ? $author$project$Main$SetAttackerSideLightScreen : $author$project$Main$SetDefenderSideLightScreen),
											$elm$html$Html$Attributes$class('checkbox checkbox-xs checkbox-primary')
										]),
									_List_Nil),
									$elm$html$Html$text('L. Screen')
								])),
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center gap-1 cursor-pointer')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(conditions.isTailwind),
											$elm$html$Html$Events$onCheck(
											isAttacker ? $author$project$Main$SetAttackerSideTailwind : $author$project$Main$SetDefenderSideTailwind),
											$elm$html$Html$Attributes$class('checkbox checkbox-xs checkbox-primary')
										]),
									_List_Nil),
									$elm$html$Html$text('Tailwind')
								])),
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center gap-1 cursor-pointer')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(conditions.isSteathRock),
											$elm$html$Html$Events$onCheck(
											isAttacker ? $author$project$Main$SetAttackerSideStealthRock : $author$project$Main$SetDefenderSideStealthRock),
											$elm$html$Html$Attributes$class('checkbox checkbox-xs checkbox-primary')
										]),
									_List_Nil),
									$elm$html$Html$text('Stealth Rock')
								]))
						]))
				]));
	});
var $author$project$Main$viewFieldConditionsContent = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col gap-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid grid-cols-2 sm:grid-cols-3 gap-4')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('label')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('label-text text-xs')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Format')
											]))
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Main$SetFieldGameType),
										$elm$html$Html$Attributes$class('select select-bordered select-xs w-full')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Singles'),
												$elm$html$Html$Attributes$selected(model.field.gameType === 'Singles')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Singles')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Doubles'),
												$elm$html$Html$Attributes$selected(model.field.gameType === 'Doubles')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Doubles')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('label')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('label-text text-xs')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Weather')
											]))
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Main$SetFieldWeather),
										$elm$html$Html$Attributes$class('select select-bordered select-xs w-full')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(''),
												$elm$html$Html$Attributes$selected(model.field.weather === '')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('None')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Sun'),
												$elm$html$Html$Attributes$selected(model.field.weather === 'Sun')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Sun')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Rain'),
												$elm$html$Html$Attributes$selected(model.field.weather === 'Rain')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Rain')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Sand'),
												$elm$html$Html$Attributes$selected(model.field.weather === 'Sand')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Sand')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Snow'),
												$elm$html$Html$Attributes$selected(model.field.weather === 'Snow')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Snow')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('label')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('label-text text-xs')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Terrain')
											]))
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Main$SetFieldTerrain),
										$elm$html$Html$Attributes$class('select select-bordered select-xs w-full')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(''),
												$elm$html$Html$Attributes$selected(model.field.terrain === '')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('None')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Electric'),
												$elm$html$Html$Attributes$selected(model.field.terrain === 'Electric')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Electric')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Grassy'),
												$elm$html$Html$Attributes$selected(model.field.terrain === 'Grassy')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Grassy')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Misty'),
												$elm$html$Html$Attributes$selected(model.field.terrain === 'Misty')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Misty')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Psychic'),
												$elm$html$Html$Attributes$selected(model.field.terrain === 'Psychic')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Psychic')
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid grid-cols-1 md:grid-cols-2 gap-4')
					]),
				_List_fromArray(
					[
						A3($author$project$Main$viewSideConditionsCompact, 'Attacker Side', model.field.attackerSide, true),
						A3($author$project$Main$viewSideConditionsCompact, 'Defender Side', model.field.defenderSide, false)
					]))
			]));
};
var $author$project$Main$viewMain = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col gap-4')
			]),
		_List_fromArray(
			[
				$author$project$Main$viewDamageResultsPanel(model),
				A4(
				$author$project$Main$viewCollapsibleSection,
				'Field Conditions',
				model.fieldCollapsed,
				$author$project$Main$ToggleFieldCollapsed,
				$author$project$Main$viewFieldConditionsContent(model)),
				A4(
				$author$project$Main$viewCollapsibleSection,
				'Battle State',
				model.battleStateCollapsed,
				$author$project$Main$ToggleBattleStateCollapsed,
				$author$project$Main$viewBattleStatesContent(model)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid grid-cols-1 lg:grid-cols-2 gap-4')
					]),
				_List_fromArray(
					[
						$author$project$Main$viewAttackerColumn(model),
						$author$project$Main$viewDefenderColumn(model)
					]))
			]));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container mx-auto p-4 max-w-7xl')
			]),
		_List_fromArray(
			[
				(!_Utils_eq(model.openDropdown, $elm$core$Maybe$Nothing)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fixed inset-0 z-40'),
						$elm$html$Html$Events$onClick($author$project$Main$CloseDropdown)
					]),
				_List_Nil) : $elm$html$Html$text(''),
				$author$project$Main$viewHeader(model),
				$author$project$Main$viewMain(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (generations) {
			return $elm$json$Json$Decode$succeed(
				{generations: generations});
		},
		A2(
			$elm$json$Json$Decode$field,
			'generations',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int))))(0)}});}(this));