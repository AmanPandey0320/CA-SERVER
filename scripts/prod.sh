echo "deleting previous version..."
rm -rf dist
echo "installing new version..."
tsc
echo "copying files"
npm run html
echo "starting server"
npm run serve