#### install nodejs
* the official way: [NodeJs](http://nodejs.org/)
* but I would rather recommand to use the awesome Node Version Manager [NVM](https://github.com/creationix/nvm):
```sh
./install_node
```

#### install wikidata-subset-search-engine
```sh
git clone https://github.com/inventaire/wikidata-subset-search-engine.git
cd wikidata-subset-search-engine
npm install
```

#### install elasticsearch
see [official documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-repositories.html)
* Ubuntu
```sh
# from the wikidata-subset-search-engine folder
./install_elasticsearch
```

#### install nginx
```sh
# from the wikidata-subset-search-engine folder
cd nginx && ./install
```

#### renew letsencrypt cert
[There should be an automated way using certbot](http://letsencrypt.readthedocs.io/en/latest/using.html#renewal) but this would require some more investigation and it doesn't look very stable so we would have to re-investigate periodically... Let's keep it dumb for now (as long as it works):
```sh
sudo cp ./nginx/init-config /etc/nginx/sites-enabled/default
sudo nginx -s reload
/opt/letsencrypt/letsencrypt-auto certonly --webroot -w /var/www/html -d data.inventaire.io
sudo cp ./nginx/config /etc/nginx/sites-enabled/default
sudo cp ./nginx/index.html /var/www/html
sudo nginx -s reload
```
