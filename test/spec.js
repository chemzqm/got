var assert = require('assert');
var got = require('got');

describe('got', function() {

  it('should send the get request', function(done) {
    got('/test', function (err, res) {
      assert(res.status === 200);
      done(err);
    })
  });

  it('should send query object', function (done) {
    got('http://node-js.qiming.me/', {
      query: {
        name: 'tobi',
        age: 22
      }
    }, function (err, res) {
      assert(res.body.query.name === 'tobi');
      assert(res.body.query.age === '22');
      assert(res.status == 200);
      done(err);
    })
  })

  it('should support other method', function (done) {
    got('/test', {
      method: 'post'
    }, function (err, res) {
      assert(res.ok === false);
      assert(res.status === 404);
      done(err);
    })
  })

  it('should support form body', function (done) {
    got('http://node-js.qiming.me', {
      method: 'post',
      body: {
        name: 'tobi'
      }
    }, function (err, res) {
      assert(res.body.body.name === 'tobi');
      done(err);
    })
  })

  it('should support json body', function (done) {
    got('http://node-js.qiming.me', {
      method: 'post',
      body: {
        name: 'tobi'
      },
      type: 'json'
    }, function (err, res) {
      assert(res.body.body.name === 'tobi');
      done(err);
    })
  })

  it('should support custom headers', function (done) {
    got('http://node-js.qiming.me', {
      headers: {
        'X-Test': 'got'
      }
    }, function (err, res) {
      assert(res.body.headers['x-test'] === 'got');
      done(err);
    })
  })

  it('should support cross domain error', function (done) {
    got('http://www.baidu.com', function (err, res) {
      assert(err.message == 'Origin is not allowed by Access-Control-Allow-Origin');
      done();
    })
  })

  it('should support timeout error', function (done) {
    this.timeout(30000);
    got('http://node-js.qiming.me/timeout/5', {
      timeout: 3000
    }, function(err, res) {
      assert(err.message == 'timeout of 3000ms exceeded');
      done();
    })
  })

  it('should support 404', function (done) {
    got('http://node-js.qiming.me/404', function(err, res) {
      assert(null == err);
      assert(res.ok === false);
      assert(res.status === 404);
      done();
    })
  })
})
