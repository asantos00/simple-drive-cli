'use strict'
const concatAllButFirst = (acc, val, idx) => {
  if(!idx) return acc;
  acc.push(val)
  return acc;
}

const separateFilesNFolders = (checkFunction) => (acc, file) => { 
  acc[checkFunction(file) ? 'files' : 'folders'].push(file)
  return acc;
}


const addTokenToFileLinks = (token) => (acc, file) => { 
  acc.push(Object.assign(
    file,
    {
      webContent: file.webContent ? file.webContent += `&access_token=${token}` : '',
      webView: file.webView += `&access_token=${token}`
    }
  ))
  return acc;
}

const isFile = (file = {}) => file.kind == 'drive#file' 


// Not used, too many side effects and things
const formatFileList = (resolve, reject, token) => (err, resp = {}) => {

  if(err) return reject(err)

  let formatted = resp.files
    .map( file => ({name: file.name, webContent: file.webContentLink, webView: file.webViewLink, kind: file.kind}) ) 
    .reduce(addTokenToFileLinks(token), [])
    .reduce(separateFilesNFolders(isFile), {files: [], folders: []})
  
  resolve(formatted)
}


const byName = (names) => file => {
  return names.reduce((acc, name, idx) => {
    if(file.name.replace(/ /g, '_').indexOf(name) == 0 || file.name.replace(/ /g,'_').includes(name))
      acc = true 

    return acc;
  }, false)
}

module.exports = {
  addTokenToFileLinks,
  isFile,
  byName,
  concatAllButFirst,
  //formatFileList,
  separateFilesNFolders
}
