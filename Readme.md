# got

  simple xhr utility.

  no event supported.

  no binary supported.

## Installation

  Install with [component(1)](http://component.io):

    $ component install chemzqm/got

## API

### got(url, [option], callback)

* `url` is the url to request

* optional `option` could contains:

  * `method` get, post, delete, head, `get` by default
  * `query` query string or query object serialized by `encodeURIComponent`
  * `body` request body send to the server side, by default encoded by `encodeURIComponent`
  * `type` request body type, could be `json` and `form`, `form` by default
  * `headers` headers to be sent
  * `timeout` request timeout in millisecond, `10s` by default

* callback function takes two arguments

  * `err` is error object could be `network error`, `crossDomain error` or `timeout error`.
  * `res` is the response object has `res.text` for plain response text, `res.status` for status code, `res.body` for parsed response body if response content type is json, `res.ok` is true if `status==2xx`

## License

  MIT
