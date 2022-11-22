const fs = require("fs");
const path = require("path");
const { URL } = require("url");

function stringifyHeaders(headers) {
  let headersList = [];
  for (const [k, v] of Object.entries(headers)) {
    if (!v) {
      headersList.push(k);
    } else {
      if (typeof v === "object") {
        headersList.push(`${k}: ${v.value}`);
      } else {
        headersList.push(`${k}: ${v}`);
      }
    }
  }
  return headersList.join("\r\n");
}

function stringifyBody(body, parseAsJSON = true, pretty = true) {
  if (body === undefined) return "";

  if (typeof body === "string" && parseAsJSON) {
    try {
      body = JSON.parse(body);
    } catch (e) {
      // pass
    }
  }
  const space = pretty ? "  " : "";
  if (typeof body === "object") {
    return JSON.stringify(body, "", space);
  }
  return body;
}

function replaceHostInURL(rawURL, host, protocol = "http") {
  const url = new URL(rawURL);
  url.host = host;
  url.protocol = protocol;
  return url;
}

function writeToFile(filepath, content) {
  if (content === "" || content === undefined) return;

  if (!fs.existsSync(filepath)) {
    const dirpath = path.dirname(filepath);
    fs.mkdirSync(dirpath, { recursive: true });
  }

  fs.writeFile(filepath, content, { encoding: "utf8" }, (err) => {
    if (err) console.error(`Failed to write to file ${filepath}: ${err}`);
  });
}

module.exports = {
  stringifyHeaders: stringifyHeaders,
  stringifyBody: stringifyBody,
  replaceHostInURL: replaceHostInURL,
  writeToFile: writeToFile,
};
