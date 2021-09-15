import request from "superagent";
import _ from "lodash";

class Request {
  constructor(uribase, defaultheaders) {
    this.base = uribase;
    this.headers = defaultheaders;
  }

  get(uri, query, headers) {
    return new Promise((resolve, reject) => {
      let rq = this._prepareRequest("GET", uri, query, headers, true);

      this._call(rq, resolve, reject);
    });
  }

  post(uri, body, query, headers) {
    return new Promise((resolve, reject) => {
      let rq = this._prepareRequest("POST", uri, query, headers, body);
      console.log(rq);
      this._call(rq, resolve, reject);
    });
  }

  put(uri, body, query, headers) {
    return new Promise((resolve, reject) => {
      let rq = this._prepareRequest("PUT", uri, query, headers, body);
      this._call(rq, resolve, reject);
    });
  }

  patch(uri, body, query, headers) {
    return new Promise((resolve, reject) => {
      let rq = this._prepareRequest("PATCH", uri, query, headers, body);
      this._call(rq, resolve, reject);
    });
  }

  delete(uri, query, headers) {
    return new Promise((resolve, reject) => {
      let rq = this._prepareRequest("DELETE", uri, query, headers, true);

      this._call(rq, resolve, reject);
    });
  }

  _prepareRequest(method, uri = {}, query = {}, heads = {}, json) {
    let url = this._getURL(uri, query),
      headers = this._getHeaders(heads);
    return { method, url, headers, json };
  }

  _getHeaders(headers) {
    return headers;
  }

  _getURL(uri, query) {
    return uri;
  }

  _getQueryString(options) {
    return _.map(
      _.omitBy(options, _.isUndefined),
      (value, key) => `${key}=${encodeURIComponent(value)}`
    ).join("&");
  }

  _call(rq, resolve, reject) {
    if (rq.method === "POST") {
      request
        .post(rq.url)
        .set(rq.headers)
        .send(rq.json)
        .end(function(err, response) {
          if (err) return reject(error);
          if (Math.floor(response.statusCode / 100) != 2)
            return reject(response);
          return resolve(response);
        });
    }
    if (rq.method === "GET") {
      request.get(rq.url).end(function(err, response) {
        if (err) return reject(error);
        if (Math.floor(response.statusCode / 100) != 2) return reject(response);
        return resolve(response);
      });
    }
  }
}

export default Request;
