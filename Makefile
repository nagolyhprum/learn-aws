docker-clean:
	docker stop $(docker ps -qa)
	docker rm $(docker ps -qa)
	docker rmi -f $(docker images -qa)
	docker volume prune

dev-fe:
  npm run parcel -- watch client/index.html --out-dir clientBuild --hmr-port 6873
dev-be:
  npm run parcel -- watch server/index.js --out-dir serverBuild --target node
dev-forever:
  node wait
  npm run forever -- -fwa serverBuild/index.js
dev:
	docker-compose build
	docker-compose up

prod-fe:
  npm run parcel -- build client/index.html --out-dir clientBuild
prod-be:
  npm run parcel -- build server/index.js --out-dir serverBuild --target node  
prod-forever:
  npm run forever -- stopall
  npm run forever -- -l forever.log -o out.log -e err.log -a start serverBuild/index.js
prod: prod-fe prod-be prod-forever

test:
  docker-compose build
  docker-compose up -d
  docker-compose exec dev-forever node wait
  docker-compose exec dev-forever npm test
  docker-compose down -v