"use strict";

const fs = require("fs");
const path = require("path");
const {
  replaceHostInURL,
  stringifyBody,
  stringifyHeaders,
  writeToFile,
} = require("./util");
const { DEFAULT_PROTOCOL_VERSION, HOP_BY_HOP_HEADERS } = require("./constants");
const FORMATS = require("./formatter");

class Document {
  /**
   *
   * @param {string} name Name of the snippet in filesystem
   * @param req Contains required information about the request
   * @param res Contains required information about the response
   * @param opts Configurations
   */
  constructor(name, req, res, opts) {
    this.name = name;

    const url = replaceHostInURL(req.url, opts.host, opts.protocol);

    if (!req._header) {
      const httpHeader = `${req.method.toUpperCase()} ${
        url.pathname
      } ${DEFAULT_PROTOCOL_VERSION}`;
      req._header = stringifyHeaders({
        [httpHeader]: undefined,
        Host: url.host,
        ...req.headers,
      });
    }

    this.req = {
      url: url.toString(),
      method: req.method.toUpperCase(),
      headers: this.getHeadersAsObject(
        req,
        opts.maxHeaderLength,
        url.host,
        false
      ),
      headersWithPrefix: this.getHeadersAsObject(
        req,
        opts.maxHeaderLength,
        url.host,
        true
      ),
      body: req.text || req.data,
    };

    this.res = {
      headers: this.getHeadersAsObject(res, opts.maxHeaderLength),
      statusCode: res.statusCode,
      body: res.text || res.data,
    };

    this.opts = opts;

    const outputDirectory = opts.outputDir ?? "generated-snippets";
    this.fileDirectory = path.join(outputDirectory, name);
  }

  static fromTest(name, test, res, opts) {
    test.data = test._docsData;
    if (test._docsHeaders) {
      test.headers = {
        ...test.header,
        ...test._docsHeaders,
      };
    }
    test._header = test.req._header;

    return new Document(name, test, res, opts);
  }

  clean() {
    fs.rmSync(this.fileDirectory, { recursive: true });
  }

  write() {
    const { req, res, fileDirectory } = this;

    fs.mkdirSync(fileDirectory, { recursive: true });

    // currently only markdown is supported
    const formatter = FORMATS["markdown"];

    writeToFile(
      path.join(this.fileDirectory, "curl-request.md"),
      formatter.curlFormat(req.url, req.method, req.headers, req.body)
    );

    writeToFile(
      path.join(this.fileDirectory, "http-request.md"),
      formatter.httpFormat(req.headersWithPrefix, req.body)
    );

    writeToFile(
      path.join(fileDirectory, "request-body.md"),
      formatter.bodyFormat(
        req.body,
        this.getCodeBlockType(req.headersWithPrefix)
      )
    );

    writeToFile(
      path.join(fileDirectory, "request-headers.md"),
      formatter.headersFormat(req.headers)
    );

    writeToFile(
      path.join(fileDirectory, "http-response.md"),
      formatter.httpFormat(res.headers, res.body, res.statusCode)
    );
    writeToFile(
      path.join(fileDirectory, "response-body.md"),
      formatter.bodyFormat(res.body, this.getCodeBlockType(res.headers))
    );
    writeToFile(
      path.join(fileDirectory, "response-headers.md"),
      formatter.headersFormat(res.headers)
    );
  }

  getCodeBlockType(headersObj) {
    let type = headersObj["Content-Type"] ?? headersObj["content-type"];

    if (!type) return "";
    if (typeof type === "object") {
      type = type.value;
    }
    if (type.includes("json")) return "json";
    return "";
  }

  getHeadersAsObject(
    obj,
    maxLength = 40,
    host = undefined,
    preferRawHeader = false
  ) {
    let headers = obj.headers || obj.header;
    if (!headers || preferRawHeader) {
      headers = {};
      if (obj._header && typeof obj._header === "string") {
        const listOfHeaders = obj._header
          .split("\r\n")
          .filter((i) => i)
          .map((i) => i.split(":", 2));
        listOfHeaders.forEach((h) => {
          if (!h[1]) {
            headers[h[0].trim()] = undefined;
          } else {
            headers[h[0].trim()] = h[1].trim();
          }
        });
      }
    }

    for (let [key, val] of Object.entries(headers)) {
      if (HOP_BY_HOP_HEADERS[key.toLowerCase()]) {
        delete headers[key];
      } else {
        if (typeof val == "string" && val.length > maxLength) {
          val = val.substring(0, maxLength);
          val += "...";
          headers[key] = val;
        }
      }
    }

    if (host && headers["Host"]) {
      headers["Host"] = host;
    }
    return headers;
  }

  getStringifiedHeaders(obj) {
    const headerObj = this.getHeadersAsObject(obj);
    return stringifyHeaders(headerObj);
  }

  getStringifiedBody(obj, parseAsJSON = true, pretty = true) {
    let body = obj.text || obj._data;
    return stringifyBody(body, parseAsJSON, pretty);
  }
}

module.exports = function (name, test, res, opts) {
  const document = Document.fromTest(name, test, res, opts);
  document.write();
};

module.exports = Document;
