# Wikidata Subset Search Engine

Tools to setup an ElasticSearch instance fed with subsets of Wikidata, to answer questions like *"give me all the humans with a name starting by xxx"* in a super snappy way, typically for the needs of an autocomplete field.

Powering [data.inventaire.io](https://data.inventaire.io), and tailored for [inventaire](http://github.com/inventaire/inventaire)'s needs, but could probably be adapted to other use cases

## Setup
see [setup](./SETUP.md) for ElasticSearch and Nginx installation

**import a filtered Wikidata dump into ElasticSearch**
```sh
# the wikidata claim that entities have to match to be in the subset
claim=P31:Q5
# the type that will be passed to ElasticSearch 'wikidata' index
datatype=humans

./bin/dump_wikidata_subset $claim $datatype
```

## Query ElasticSearch

```sh
curl "http://localhost:9200/wikidata/humans/_search?q=Victor%20Hugo"
```
or try the result on data.inventaire.io
```sh
curl "https://data.inventaire.io/wikidata/humans/_search?q=Victor%20Hugo"
```

## data.inventaire.io
Whitelisted endpoints:
* `/wikidata/humans/_search`

## References
* [ElasticSearch Search API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)
