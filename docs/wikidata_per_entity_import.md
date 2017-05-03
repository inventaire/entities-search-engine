## Wikidata per-entity import

Start the server
```sh
npm start
```
Or, if you're on Linux, you can make it run as a [systemd](https://en.wikipedia.org/wiki/Systemd) process
```sh
npm run add-to-systemd
sudo systemctl restart wsse
```

Then `POST` the `ids` of entities you want to import, sorted per `type`:

* with curl
```sh
curl -H "Content-Type: application/json" -XPOST http://localhost:3213 -d '{"humans":["Q421512"], "series":["Q3656893"]}'
```

* with an HTTP lib like [request](https://github.com/request/request)
```js
request.post({
  url: 'http://localhost:3213',
  json: {
    humans: ['Q421512'],
    series: ['Q3656893']
  }
})
```

Both request would import Q112983 and Q185598 to `/wikidata/genres`
