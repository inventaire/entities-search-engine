#### install nodejs
* the official way: [NodeJs](http://nodejs.org/)
* what I would recommand, use the awesome version manager [NVM](https://github.com/creationix/nvm):
```sh
# download nvm (I trust this script, but you might want to read it as *one should never pipe a script to shell*  :p)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# close and reopen terminal
# install the lastest LTS version
nvm install 4
```

#### install wikidata-subset-search-engine
```sh
git clone https://github.com/inventaire/wikidata-subset-search-engine.git
cd wikidata-subset-search-engine
npm install
```

<hr>

#### install java (elasticsearch dependency)
* Ubuntu
```sh
sudo add-apt-repository ppa:webupd8team/java -y
sudo apt-get update
# not libre, but recommanded by ElasticSearch :/
sudo apt-get install oracle-java8-installer -y
```

<hr>

#### install elasticsearch
see [official documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-repositories.html)
```sh
# Add ElasticSearch repositories and install
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
sudo apt-get update && sudo apt-get install elasticsearch
# Start ElasticSearch
sudo service elasticsearch start
# Lets wait a little while ElasticSearch starts
sleep 5
# Make sure service is running
curl http://localhost:9200
# Create the `wikidata` index
curl -XPUT http://localhost:9200/wikidata
```
##### references
* https://gist.github.com/ricardo-rossi/8265589463915837429d
* https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-repositories.html

<hr>

#### install nginx
```sh
sudo apt-get install nginx
sudo cp ./nginx/init-config /etc/nginx/sites-enabled/default
sudo nginx -s reload
# install letsencrypt
# Doc:
# * http://letsencrypt.readthedocs.org/en/latest/using.html#webroot
# * https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04
sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
/opt/letsencrypt/letsencrypt-auto certonly --webroot -w /var/www/html -d data.inventaire.io
# generating a dhparam as required later in config.nginx
sudo openssl dhparam -out /etc/letsencrypt/live/data.inventaire.io/dhparams.pem 2048
# now if everything went well and we got the cert, load the real nginx config
sudo cp ./nginx/config /etc/nginx/sites-enabled/default
sudo cp ./nginx/index.html /var/www/html
sudo nginx -s reload
```