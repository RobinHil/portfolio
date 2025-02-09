#!/bin/sh

docker compose -p portfolio down
docker image prune -f

rm /var/local/proxy/conf.d/portfolio.conf
docker exec -it nginx_proxy nginx -s reload