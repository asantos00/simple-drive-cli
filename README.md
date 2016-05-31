# Simple Drive CLI

This is a pretty basic Google Drive Client. It uses Google Drive API v3.

It needs a **client_id.json** file (that needs to be created in the developer's console) in order to let you access your files.



At the moment this is a first draft, there is still ugly code and things.

___



# Install

```
git clone https://github.com/asantos00/simple-drive-cli
npm i
```

# Usage

```
# It is possible to pass the clientId location through --clientId parameter

node cli

```


___




# Available commands


## ls

Lists all the files in the drive

**Note**: This command should run in order to download and autocomplete to work


## find [fileName]

Searches drive with the provided fileName


## dl [...filesToDownload] [-p pathToDownloadTo]

Downloads the files to the directory provided, if no directory is provided, downloads to current folder

*Tab completion available*

## exit

Exits the shell
