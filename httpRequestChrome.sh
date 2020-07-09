echo "Attempt 1"
node lib/httpRequestChrome.js || true
cd testFolder/httpRequestChrome/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 2"
node lib/httpRequestChrome.js || true
cd testFolder/httpRequestChrome/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 3"
node lib/httpRequestChrome.js || true
cd testFolder/httpRequestChrome/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 4"
node lib/httpRequestChrome.js || true
cd testFolder/httpRequestChrome/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 5"
node lib/httpRequestChrome.js || true
cd testFolder/httpRequestChrome/
echo "Folder size"
du -d 1
rm -rf *
cd ../../