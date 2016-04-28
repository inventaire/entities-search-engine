# inv-elasticsearch

tools to setup an ElasticSearch instance tailored for [inventaire](http://github.com/inventaire/inventaire)'s needs, that is, mainly searching on subsets of wikidata dumps

Powering [data.inventaire.io](https://data.inventaire.io)

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

**Whitelisted endpoints:**
* `/wikidata/humans/_search`

**References:**
* [ElasticSearch Search API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)
