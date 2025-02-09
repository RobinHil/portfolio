docker compose -p portfolio up -d --build --force-recreate
docker image prune -f

cp ./nginx.portfolio.conf /var/local/proxy/conf.d/portfolio.conf
docker exec -it nginx_proxy nginx -s reload