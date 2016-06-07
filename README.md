# Wikidata Subset Search Engine

Tools to setup an ElasticSearch instance fed with subsets of Wikidata, to answer questions like *"give me all the humans with a name starting by xxx"* in a super snappy way, typically for the needs of an autocomplete field.

Powering [data.inventaire.io](https://data.inventaire.io), and tailored for [inventaire](http://github.com/inventaire/inventaire)'s needs, but could probably be adapted to other use cases

## Setup

### Dependencies
see [setup](./SETUP.md) to install dependencies:
* [NodeJs](https://en.wikipedia.org/wiki/Nodejs)
* [ElasticSearch](https://en.wikipedia.org/wiki/Elasticsearch)
* [Nginx](https://en.wikipedia.org/wiki/Nginx)
* [Let's Encrypt](https://en.wikipedia.org/wiki/Let's_Encrypt)
* already installed in any good **nix* system: curl, gzip

### Data imports
2 ways to import entities data into your ElasticSearch instance
* [Wikidata filtered-dump import](./wikidata_filtered_dump_import.md)
* [Wikidata per-entity import](./wikidata_per_entity_import.md)

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
* [`/wikidata/humans/_search`](https://data.inventaire.io/wikidata/humans/_search?q=Victor)
* [`/wikidata/genres/_search`](https://data.inventaire.io/wikidata/genres/_search?q=Biographie)

## References
* [ElasticSearch Search API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)
