#!/usr/bin/env bash
set -eu

es_host=$(node -p "require('config').elastic.host")
inv_entities_index=$(node -p "require('config').elastic.indexes.inventaire")
wd_entities_index=$(node -p "require('config').elastic.indexes.wikidata")
dump_folder=./dumps

mkdir -p "$dump_folder"

export_index_base(){
  index=$1
  type=$2
  name="${index}_${type}"
  output="${dump_folder}/${name}.json.gz"

  echo -e "\e[0;30mexporting ${name}\e[0m"

  elasticdump \
    --input="${es_host}/${index}" \
    --output='$' \
    --type="$type" \
    | pigz --best > "$output"

  echo -e "\e[0;32mdone exporting ${name}\e[0m"
}

export_index(){
  index=$1
  export_index_base "$index" 'mapping'
  export_index_base "$index" 'data'
}

export_index "$inv_entities_index"
export_index "$wd_entities_index"
