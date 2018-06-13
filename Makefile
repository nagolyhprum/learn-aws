start:
  npm run parcel -- build client/index.html --out-dir clientBuild
  npm run parcel -- build server/index.ts --out-dir serverBuild --target node
  npm run forever -- stop serverBuild/index.js
  npm run forever -- -l forever.log -o out.log -e err.log -a start serverBuild/index.js