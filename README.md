# inv-elasticsearch

tools to setup an elasticsearch instance tailored for [inventaire](http://github.com/inventaire/inventaire)'s needs, that is, mainly searching on subsets of wikidata dumps

## setup
see [setup](./SETUP.md)

## get a filtered Wikidata dump
```sh
./dump_wikidata_humans_subset
```

## load the dump subset into elasticsearch
```sh
./import.coffee humans humans.ndjson
```
