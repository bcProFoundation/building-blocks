rm -r node_modules;
rm yarn.lock;
lerna clean --yes;
find . -name "yarn.lock" -delete

yarn
lerna bootstrap
