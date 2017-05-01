# Wikidata Subset Search Engine

Tools to setup an ElasticSearch instance fed with subsets of Wikidata, to answer questions like *"give me all the humans with a name starting by xxx"* in a super snappy way, typically for the needs of an autocomplete field.

Powering [data.inventaire.io](https://data.inventaire.io), and tailored for [inventaire](http://github.com/inventaire/inventaire)'s needs, but could probably be adapted to other use cases

## Summary
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Setup](#setup)
  - [Dependencies](#dependencies)
  - [Data imports](#data-imports)
    - [add](#add)
    - [remove](#remove)
- [Query ElasticSearch](#query-elasticsearch)
- [data.inventaire.io](#datainventaireio)
- [References](#references)
- [Donate](#donate)
- [See Also](#see-also)
- [You may also like](#you-may-also-like)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

### Dependencies
see [setup](./SETUP.md) to install dependencies:
* [NodeJs](https://en.wikipedia.org/wiki/Nodejs)
* [ElasticSearch](https://en.wikipedia.org/wiki/Elasticsearch)
* [Nginx](https://en.wikipedia.org/wiki/Nginx)
* [Let's Encrypt](https://en.wikipedia.org/wiki/Let's_Encrypt)
* already installed in any good **nix* system: curl, gzip

### Data imports

#### add
2 ways to import entities data into your ElasticSearch instance
* [Wikidata filtered-dump import](./docs/wikidata_filtered_dump_import.md)
* [Wikidata per-entity import](./docs/wikidata_per_entity_import.md)

#### remove
To un-index entities that were mistakenly added, pass the path of a results json file, supposedly made of an array of ids. All those ids' documents will be deleted
```sh
npm run delete-from-results ./queries/results/mistakenly_added_ids.json
```

## Query ElasticSearch

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
[MIT](LICENSE.md)
