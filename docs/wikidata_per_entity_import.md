## Wikidata per-entity import

Start the server
```sh
npm start
```
Or make it run as a daemon if you want to keep it running
(requires [`forever`](npmjs.com/package/forever) to be installed globally)
```sh
npm run daemon
```

Then `POST` the `ids` of entities you want to import, specifying to which `type`  it should be added:
* with curl
```sh
curl -XPOST http://localhost:3000 -d 'type=genres&ids=Q112983|Q185598'
```
* with [request](https://github.com/request/request)
```javascript
request.post('http://localhost:3000', {
  json: {
    type: 'genres',
    ids: ['Q112983', 'Q185598']
  }
})
```

Both request would import Q112983 and Q185598 to `/wikidata/genres`
