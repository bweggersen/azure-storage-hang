# Downloading concurrent Azure Blobs hangs

This is a repro of how downloading multiple, large Azure blobs concurrently, hangs.

## Instructions

```
yarn install
yarn build
```

Find a large Azure Storage Blob (I tested with a blob which contained lots of files and totalled 170 MB), and run the scripts below to start 50 concurrent downloads of the same blob. It times out after 10 minutes, so if your network connection is a little slower, you might want to increase that.

### To test using @azure/storage-blob:

```
AZURE_STORAGE_CONTAINER="..." AZURE_STORAGE_CONNECTION_STRING="..." AZURE_BLOB_NAME="..." node lib/azureBlobSDK.js
```

### To test using axios:

```
AZURE_STORAGE_ACCOUNT="..." AZURE_STORAGE_CONTAINER="..." AZURE_STORAGE_KEY="...." AZURE_BLOB_NAME="..." node lib/httpRequest.js
```

## Results

I ran the scripts above five times for each method. On average, 10 download streams would hang with @azure/storage-blob, and 7 would hang with axios.

See raw data in the `logs/` folder.

### @azure/storage-blob

| Started | Completed |
| ------- | --------- |
| 50      | 44        |
| 50      | 39        |
| 50      | 39        |
| 50      | 35        |
| 50      | 44        |

### axios

| Started | Completed |
| ------- | --------- |
| 50      | 43        |
| 50      | 47        |
| 50      | 45        |
| 50      | 41        |
| 50      | 40        |
