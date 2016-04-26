# inv-elasticsearch

tools to setup an ElasticSearch instance tailored for [inventaire](http://github.com/inventaire/inventaire)'s needs, that is, mainly searching on subsets of wikidata dumps

Powering [data.inventaire.io](https://data.inventaire.io)

## Setup
see [setup](./SETUP.md) for ElasticSearch and Nginx installation

**get a filtered Wikidata dump**
```sh
./dump_wikidata_humans_subset
```

**load the dump subset into ElasticSearch**
```sh
./import.coffee humans humans.ndjson
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
