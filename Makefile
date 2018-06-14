dev-fe:
  npm run parcel -- watch client/index.html --out-dir clientBuild --hmr-port 6873
dev-be:
  npm run parcel -- watch server/index.ts --out-dir serverBuild --target node
dev-forever:
  npm run forever -- -fwa serverBuild/index.js
dev:
	docker-compose down -v
	docker-compose build
	docker-compose up
prod-fe:
  npm run parcel -- build client/index.html --out-dir clientBuild
prod-be:
  npm run parcel -- build server/index.ts --out-dir serverBuild --target node  
prod-forever:
  npm run forever -- stopall
  npm run forever -- -l forever.log -o out.log -e err.log -a start serverBuild/index.js
prod: prod-fe prod-be prod-forever
  
