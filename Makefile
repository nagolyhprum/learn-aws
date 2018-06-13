prod-fe:
  npm run parcel -- build client/index.html --out-dir clientBuild
prod-be:
  npm run parcel -- build server/index.ts --out-dir serverBuild --target node
  npm run forever -- stopall
  npm run forever -- -l forever.log -o out.log -e err.log -a start serverBuild/index.js
prod: prod-fe prod-be