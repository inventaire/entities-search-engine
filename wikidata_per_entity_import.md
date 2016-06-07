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


## Batch import using SPARQL queries results

* Write a SPARL query `SELECT`ing only one variable (with no label) that should output the ids of the entities you would like to import. Save this query in the folder `queries/sparql/${type}.rq` with, *type* being the type you would like it to have in ElasticSearch.

* Run the query: `npm run update-query-results type-a type-b`. This will save the corresponding ids into `queries/results/${type}.json`

* After starting the server (see above), import the results: `npm run import-query-results type-a type-b`

Both commands can be passed `all` instead of a list of types to run all the queries in the `queries/sparql` folder, and import all the results from `queries/results` in ElasticSearch, via the server.
