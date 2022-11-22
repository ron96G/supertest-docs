"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("../index.js");
const Document = request.Document;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("document http requests", function () {
  it("should support text", function (done) {
    const app = express();
    app.use(bodyParser.text());
    let server;

    app.post("/textTest", function (req, res) {
      res.send("hello");
    });

    server = app.listen(function () {
      const url = "http://localhost:" + server.address().port;
      request(url)
        .post("/textTest")
        .document("requestDocument(text)", {
          host: "test.host.com",
        })
        .set("Content-Type", "text/plain")
        .setD(
          "Authorization",
          "Bearer abbreviate!_this_header_is_is_too_long",
          "Must authenticate"
        )
        .send("Hello World")
        .expect("hello", done);
    });
  });

  it("should support json", function (done) {
    const app = express();
    app.use(bodyParser.json());
    let server;

    app.post("/jsonTest", function (req, res) {
      res.json({ hello: "world" });
    });

    server = app.listen(function () {
      const url = "http://localhost:" + server.address().port;
      request(url)
        .post("/jsonTest")
        .document("requestDocument(json)", {
          host: "test.host.com:443",
          protocol: "https",
        })
        .setD("Content-Type", "application/json", "Content-Type must be JSON")
        .set("Accept", "application/json")
        .send({ name: "john" })
        .expect({ hello: "world" }, done);
    });
  });

  it("should support empty bodies", function (done) {
    const app = express();
    app.use(bodyParser.json());
    let server;

    app.get("/empty", function (req, res) {
      res.status(200).send();
    });

    server = app.listen(function () {
      const url = "http://localhost:" + server.address().port;
      request(url)
        .get("/empty")
        .document("emptyBody", {
          host: "test.host.com:443",
          protocol: "https",
        })
        .setD("Content-Type", "application/json", "Content-Type must be JSON")
        .set("Accept", "application/json")
        .send()
        .expect("", done);
    });
  });
});

describe("manual documentation", () => {
  it("should support manual documentation", function (done) {
    const req = {
      headers: {
        "Content-Type": {
          value: "application/json",
          description: "Hello World!",
        },
      },
      method: "POST",
      url: "https://some-host/your-webhook",
      data: {
        some: "data",
      },
    };

    const res = {
      headers: {
        "Content-Type": {
          value: "text/plain",
          description: "Type is of type text",
        },
      },
      statusCode: 200,
      data: "OK",
    };
    const document = new Document("manualDocument", req, res, {
      host: "test.host.com",
      protocol: "https",
    });
    document.write();

    done();
  });
});
