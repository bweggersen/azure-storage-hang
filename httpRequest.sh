echo "Attempt 1"
node lib/httpRequest.js || true
cd testFolder/httpRequest/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 2"
node lib/httpRequest.js || true
cd testFolder/httpRequest/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 3"
node lib/httpRequest.js || true
cd testFolder/httpRequest/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 4"
node lib/httpRequest.js || true
cd testFolder/httpRequest/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 5"
node lib/httpRequest.js || true
cd testFolder/httpRequest/
echo "Folder size"
du -d 1
rm -rf *
cd ../../