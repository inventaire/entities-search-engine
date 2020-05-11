## Inventaire batch import using CouchDB views

Using [`couch-view-by-keys`](https://github.com/maxlath/couch-view-by-keys) `>= v4`

```sh
COUCHDB_AUTH_HOST=http://username:password@localhost:5984
# Using the same name for the CouchDB database and the ElasticSearch index
ENTITIES_DB_NAME=entities-prod
DB="$COUCHDB_AUTH_HOST/$ENTITIES_DB_NAME"

couch-view-by-keys --docs $DB/_design/entities/_view/byClaim "['wdt:P31', 'wd:Q5']" | ./bin/import_to_elasticsearch humans
couch-view-by-keys --docs $DB/_design/entities/_view/byClaim "['wdt:P31', 'wd:Q571']" | ./bin/import_to_elasticsearch works
couch-view-by-keys --docs $DB/_design/entities/_view/byClaim "['wdt:P31', 'wd:Q277759']" | ./bin/import_to_elasticsearch series
```
