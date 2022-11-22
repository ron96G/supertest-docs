# Supertest Documentation Plugin

A plugin for [supertest](https://github.com/visionmedia/supertest) that can be used to document REST APIs. It is influenced by the Spring-Boot solution [restdocs](https://spring.io/projects/spring-restdocs).

It uses the request/response from the supertest call in a unit-test to generate snippets.
These snippets may then be used to enhance or further generate any documentation.

It may also be used independently of supertest. This could be useful when documenting events where the API is developed by another team and there is no mock in place (see [here](test/document.test.js#L87)).

## Supported Formats

The generated snippets are all in a specific output format. The following formats are supported:

### Markdown

Which could be used with [mkdocs](https://www.mkdocs.org/).

---

## Generated Snippets (Examples)

Currently the following snippets are generated when using supertest in a unit-test.
These were generated using the following unit-test (see [here](test/document.test.js#L38)):

```js
request(url)
  .post("/jsonTest")
  // name here defines the output directory
  .document("requestDocument(json)", { 
    host: "test.host.com:443",
    protocol: "https",
  })
  .setD("Content-Type", "application/json", "Content-Type must be JSON")
  .set("Accept", "application/json")
  .send({ name: "john" })
  .expect({ hello: "world" }, done);
```

All generated snippets can then be found under `generated-snippets/requestDocument(json)/`.

### Curl Request

```bash
$ curl 'https://test.host.com/jsonTest' -i -X POST \
	-H 'Content-Type: application/json' \
	-H 'Accept: application/json' \
	-d '{"name":"john"}'
```

### HTTP Request

```
POST /jsonTest HTTP/1.1
Host: test.host.com
Accept-Encoding: gzip, deflate
Content-Type: application/json
Accept: application/json

{
  "name": "john"
}
```

### HTTP Response

```
Status-Code: "200 OK"
x-powered-by: Express
content-type: application/json; charset=utf-8
etag: W/"11-IkjuL6CqqtmReFMfkkvwC0sKj04"

{
  "hello": "world"
}
```

### Request Body

```json
{
  "name": "john"
}
```

### Request Headers

| Name           | Description               |
| :------------- | :------------------------ |
| `Content-Type` | Content-Type must be JSON |

### Response Body

```json
{
  "hello": "world"
}
```

### Response Headers

No relevant information.

---