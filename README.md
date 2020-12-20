> :warning: This repository has been archived as now the [inventaire server itself takes care of keeping Elasticsearch entities and wikidata indexes updated](https://github.com/inventaire/inventaire/blob/master/docs/indexation.md)

# Entities Search Engine

Scripts and microservice to feed an ElasticSearch with [Wikidata](https://wikidata.org) and [Inventaire](https://inventaire.io) entities (see *[entities map](https://inventaire.github.io/entities-map/)*), and keep those up-to-date, to answer questions like *"give me all the humans with a name starting by xxx"* in a super snappy way, typically for the needs of an autocomplete field.

For the Wikidata-only version see the archived branch  [`#wikidata-subset-search-engine`](https://github.com/inventaire/entities-search-engine/tree/wikidata-subset-search-engine) branch.

## Summary
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](SETUP.md)
  - [Dependencies](#dependencies)
  - [Start server](#start-server)
- [Data imports](#data-imports)
  - [from scratch](#from-scratch)
    - [add](#add)
      - [Wikidata entities](#wikidata-entities)
      - [Inventaire entities](#inventaire-entities)
    - [update](#update)
    - [remove](#remove)
  - [importing dumps](#importing-dumps)
- [Query ElasticSearch](#query-elasticsearch)
- [References](#references)
- [Donate](#donate)
- [See Also](#see-also)
- [You may also like](#you-may-also-like)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup
see [setup](./SETUP.md)

### Dependencies
see [setup](./SETUP.md) to install dependencies:
* [NodeJs](http://nodejs.org/) `>= v6.4`
* [ElasticSearch](https://www.elastic.co/fr/products/elasticsearch) (this repo was developed targeting ElasticSearch `v2.4`, but it should work with newer version with some minimal changes)
* [Nginx](http://nginx.org/en/)
* [Let's Encrypt](http://letsencrypt.org/)
* already installed in any good *nix* system: curl, gzip

### Start server
see *[Wikidata and Inventaire per-entity import](./docs/wikidata_and_inventaire_per_entity_import.md)*

## Data imports

### from scratch

#### add
##### Wikidata entities
3 ways to import Wikidata entities data into your ElasticSearch instance
* [Filtered-dump import](./docs/wikidata_filtered_dump_import.md)
* [Batch import using SPARQL queries results](./docs/wikidata_batch_import_using_sparql_queries_results.md)
* [Per-entity import](./docs/wikidata_and_inventaire_per_entity_import.md)

##### Inventaire entities
* [Batch import using CouchDB views](./docs/inventaire_batch_import_using_couch_db_views.md)
* [Per-entity import](./docs/wikidata_and_inventaire_per_entity_import.md)

#### update
To update any entity, simply re-add it, typically by posting its URI (ex: 'wd:Q180736' for a Wikidata entity, or 'inv:9cf5fbb9affab552cd4fb77712970141' for an Inventaire one) to the [server](./docs/wikidata_and_inventaire_per_entity_import.md)

#### remove
To un-index entities that were mistakenly added, pass the path of a results json file, supposedly made of an array of ids. All those ids' documents will be deleted
```sh
index=wikidata
type=humans
ids_json_array=./queries/results/mistakenly_added_wikidata_humans_ids.json
npm run delete-from-results $index $type $ids_json_array

index=entities-prod
type=works
ids_json_array=./queries/results/mistakenly_added_inventaire_works_ids.json
npm run delete-from-results $index $type $ids_json_array
```

### importing dumps
You can import dumps from inventaire.io prod elasticsearch instance:
```sh
# Download Wikidata dump
wget -c https://dumps.inventaire.io/wd/elasticsearch/wikidata_data.json.gz
gzip -d wikidata_data.json.gz
# elasticdump should have been installed when running `npm install`
# --limit: increasing batches size
./node_modules/.bin/elasticdump --input=./wikidata_data.json --output=http://localhost:9200/wikidata --limit 2000

# Same for Inventaire
wget -c https://dumps.inventaire.io/inv/elasticsearch/entities_data.json.gz
gzip -d entities_data.json.gz
./node_modules/.bin/elasticdump --input=./entities_data.json --output=http://localhost:9200/entities --limit 2000
```

## Query ElasticSearch
```sh
curl "http://localhost:9200/wikidata/humans/_search?q=Victor%20Hugo"
```

## References
* [ElasticSearch Search API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)

## Donate

We are developing and maintaining tools to work with Wikidata from NodeJS, the browser, or simply the command line, with quality and ease of use at heart. Any donation will be interpreted as a "please keep going, your work is very much needed and awesome. PS: love". [Donate](https://liberapay.com/WikidataJS)

## See Also
* [wikidata-sdk](https://github.com/maxlath/wikidata-sdk): a javascript tool suite to query and work with wikidata data, heavily used by wikidata-cli
* [wikidata-edit](https://www.npmjs.com/package/wikidata-edit): Edit Wikidata from NodeJS
* [wikidata-cli](https://www.npmjs.com/package/wikidata-cli): The command-line interface to Wikidata
* [wikidata-filter](https://npmjs.com/package/wikidata-filter): A command-line tool to filter a Wikidata dump by claim
* [wikidata-taxonomy](https://github.com/nichtich/wikidata-taxonomy): Command-line tool to extract taxonomies from Wikidata
* [Other Wikidata external tools](https://www.wikidata.org/wiki/Wikidata:Tools/External_tools):

## You may also like

[![inventaire banner](https://inventaire.io/public/images/inventaire-brittanystevens-13947832357-CC-BY-lighter-blue-4-banner-500px.png)](https://inventaire.io)

Do you know [inventaire.io](https://inventaire.io/)? It's a web app to share books with your friends, built on top of Wikidata! And its [libre software](http://github.com/inventaire/inventaire) too.

## License
AGPL-3.0
