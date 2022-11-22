```bash
$ curl 'http://test.host.com:56668/textTest' -i -X POST \
	-H 'Content-Type: text/plain' \
	-H 'Authorization: Bearer abbreviate!_this_header_is_is_too_long' \
	-d 'Hello World'
```