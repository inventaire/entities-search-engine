## Inventaire batch import using CouchDB views

```sh
COUCHDB_AUTH_HOST=http://username:password@localhost:5984
# Using the same name for the CouchDB database and the ElasticSearch index
ENTITIES_DB_NAME=entities-prod
ENTITIES_DB_NAME=entities-prod
couch-view-by-keys $COUCHDB_AUTH_HOST/$ENTITIES_DB_NAME/_design/entities/_view/byClaim "['wdt:P31', 'wd:Q5']" | ./bin/import_to_elasticsearch $ENTITIES_DB_NAME humans
couch-view-by-keys $COUCHDB_AUTH_HOST/$ENTITIES_DB_NAME/_design/entities/_view/byClaim "['wdt:P31', 'wd:Q571']" | ./bin/import_to_elasticsearch $ENTITIES_DB_NAME works
```
