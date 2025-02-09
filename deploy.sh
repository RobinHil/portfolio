docker compose -p portfolio down
docker image prune -f
docker compose -p portfolio up -d --build

cp ./nginx.portfolio.conf /var/local/proxy/conf.d/portfolio.conf
docker exec -it nginx_proxy nginx -s reload