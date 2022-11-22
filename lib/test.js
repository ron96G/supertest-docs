const { Test } = require("supertest");
const Document = require("./document.js");

class DocTest extends Test {
  /**
   * Initialize a new `DocTest` with the given `app`,
   * request `method` and `path`.
   *
   * @param {Server} app
   * @param {String} method
   * @param {String} path
   * @api public
   */
  constructor(app, method, path) {
    super(app, method, path);
  }

  /**
   * Invoke original supertest end.
   * @param {Function} fn
   * @api public
   */
  end(fn) {
    return super.end((err, res) => {
      if (this.generatedDocsName) {
        const document = Document.fromTest(
          this.generatedDocsName,
          this,
          res,
          this.docsOpts
        );
        document.write();
      }
      return fn(err, res);
    });
  }

  /**
   * Document the request
   * @param {string} name
   * @param {*} opts
   */
  document(name, opts = {}) {
    this.generatedDocsName = name;
    this.docsOpts = opts;

    return this;
  }

  /**
   * Invoke original supertest send
   * @param {*} data
   * @returns
   */
  send(data) {
    this._docsData = data;
    super.send(data);
    return this;
  }

  setD(key, val, description) {
    if (!this._docsHeaders) {
      this._docsHeaders = {};
    }
    if (description) {
      this._docsHeaders[key] = {
        value: val,
        description: description,
      };
    } else {
      this._docsHeaders[key] = val;
    }
    super.set(key, val);
    return this;
  }
}

module.exports = DocTest;
