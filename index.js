/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
  : window;


/**
 * Determine XHR.
 */

function getXHR() {
  if (root.XMLHttpRequest
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest();
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pairs.push(encodeURIComponent(key)
      + '=' + encodeURIComponent(obj[key]));
  }
  return pairs.join('&');
}

function noop(){}

var types = {
  'json': 'application/json',
  'form': 'application/x-www-form-urlencoded'
}

/**
 * 
 * @param {String} url
 * @param {String} opts [optional]
 * @param {String} callback
 * @api public
 */
function got(url, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }
  callback = callback || noop;
  var method = opts.method ? opts.method.toUpperCase() : 'GET';
  var headers = opts.headers || {};
  var timeout = opts.timeout || 10000;
  var type = opts.type || 'form';
  var xhr = getXHR();
  if (opts.query) {
    var query = serialize(opts.query);
    url += ~url.indexOf('?')
        ? '&' + query
        : '?' + query;
  }

  var aborted;
  var timer;

  if (timeout) {
     timer = setTimeout(function(){
       aborted = true;
       xhr.abort();
    }, timeout)
  }

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;
    if (0 == xhr.status) {
      if (aborted) return callback(new Error('timeout of ' + timeout + 'ms exceeded'));
      return callback(new Error('Origin is not allowed by Access-Control-Allow-Origin'));
    }
    cb();
  }

  // initiate request
  xhr.open(method, url, true);
  var data;
  // body
  if ('GET' != method && 'HEAD' != method && 'string' != typeof opts.body) {
    if (!headers['Content-Type']) headers['Content-Type'] = types[type];
    if (type === 'form') data = serialize(opts.body);
    if (type === 'json') data = JSON.stringify(opts.body);
    data = data || opts.body;
  }


  // set header fields
  for (var field in headers) {
    xhr.setRequestHeader(field, headers[field]);
  }

  xhr.send(data);

  function cb() {
    if (timer) clearTimeout(timer);
    var res = {};
    res.text = xhr.responseText;
    var type = xhr.getResponseHeader('Content-Type');
    if (type === 'application/json') {
      try {
        var body = JSON.parse(res.text);
        res.body = body;
      } catch(e) {
        return callback('parse result error');
      }
    }
    res.xhr = xhr;
    res.status = xhr.status;
    res.ok = (xhr.status / 100 === 2);
    callback(null, res);
  }
}

module.exports = got;
