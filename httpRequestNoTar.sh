echo "Attempt 1"
node lib/httpRequestNoTar.js || true
cd testFolder/httpRequestNoTar/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 2"
node lib/httpRequestNoTar.js || true
cd testFolder/httpRequestNoTar/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 3"
node lib/httpRequestNoTar.js || true
cd testFolder/httpRequestNoTar/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 4"
node lib/httpRequestNoTar.js || true
cd testFolder/httpRequestNoTar/
echo "Folder size"
du -d 1
rm -rf *
cd ../../


echo "Attempt 5"
node lib/httpRequestNoTar.js || true
cd testFolder/httpRequestNoTar/
echo "Folder size"
du -d 1
rm -rf *
cd ../../