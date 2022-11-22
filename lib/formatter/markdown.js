const { stringifyBody, stringifyHeaders } = require("../util");
const STATUS_CODES = require("../statusCodes");
const { CODE_BLOCK_SEP, CURL_IGNORED_HEADERS } = require("../constants");

function httpFormat(headers, body, statusCode = undefined) {
  const content = [];
  content.push(CODE_BLOCK_SEP);
  if (statusCode) {
    content.push(`Status-Code: "${statusCode} ${STATUS_CODES[statusCode]}"`);
  }
  content.push(
    stringifyHeaders(headers),
    "",
    stringifyBody(body, true, true),
    CODE_BLOCK_SEP
  );
  return content.join("\n");
}

function bodyFormat(body, type) {
  return `${CODE_BLOCK_SEP}${type}
${stringifyBody(body, true, true)}
${CODE_BLOCK_SEP}`;
}

function headersFormat(headers) {
  const content = [];
  let hasContent = false;
  content.push("| Name | Description |", "| :---- | :---- |");

  for (const [k, v] of Object.entries(headers)) {
    if (v && v.description) {
      hasContent = true;
      content.push(`| \`${k.normalize("NFC")}\`| ${v.description} |`);
    }
  }
  content.push("\n");
  return hasContent ? content.join("\n") : "No relevant information.";
}

function curlFormat(url, method, headers, body, inBlock = true) {
  const content = [];
  content.push(`$ curl '${url}' -i -X ${method}`);
  for (const [k, v] of Object.entries(headers)) {
    if (!CURL_IGNORED_HEADERS[k.toLowerCase()]) {
      if (typeof v === "object") {
        content.push(`\t-H '${k}: ${v.value}'`);
      } else if (v) {
        content.push(`\t-H '${k}: ${v}'`);
      }
    }
  }

  if (body) {
    content.push(`\t-d '${stringifyBody(body, true, false)}'`);
  }
  if (inBlock) {
    const strContent = content.join(" \\\n");
    return `${CODE_BLOCK_SEP}bash\n${strContent}\n${CODE_BLOCK_SEP}`;
  }
  return content.join(" \\\n");
}

module.exports = {
  bodyFormat,
  curlFormat,
  headersFormat,
  httpFormat,
};
