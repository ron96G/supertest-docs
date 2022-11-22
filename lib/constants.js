const CODE_BLOCK_SEP = "```";
const HOP_BY_HOP_HEADERS = {
  connection: true,
  "keep-alive": true,
  "transfer-encoding": true,
  te: true,
  connection: true,
  trailer: true,
  upgrade: true,
  date: true,
  "content-length": true,
};

const CURL_IGNORED_HEADERS = {
  "content-length": true,
  host: true,
};

const DEFAULT_PROTOCOL_VERSION = "HTTP/1.1";

module.exports = {
  CODE_BLOCK_SEP: CODE_BLOCK_SEP,
  HOP_BY_HOP_HEADERS: HOP_BY_HOP_HEADERS,
  CURL_IGNORED_HEADERS: CURL_IGNORED_HEADERS,
  PROTOCOL_VERSION: DEFAULT_PROTOCOL_VERSION,
};
