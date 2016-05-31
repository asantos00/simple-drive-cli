'use strict';



// Curried function with the drive injected
const list = (service) => (options) => {
  return new Promise((resolve, reject) => {

    service.files.list(Object.assign({
      fields: 'files',
    }, options), (err, res) => {
      
      if(err) return reject(err)
      resolve(res.files)

    })

  })
}

// Curried function with the list function injected
const fastSearch = list => (word, options = {}) => {
  let mergedOptions = Object.assign(options, {q: `fullText contains '${word}' or name contains '${word}'`})
  return list(mergedOptions) 
}


// Drive injected
const download = params => (file, path = '.') => {
  let fullPath = path + '/' + file.name.replace(/ /g, '_')
  var dest = params.fs.createWriteStream(fullPath);

  return new Promise((resolve, reject) => {
    params.service.files.get({
      fileId: file.id,
      alt: 'media' 
    })
    .on('end', function() {
      resolve(fullPath)
    })
    .on('error', function(err) {
      reject()
    })
    .pipe(dest);
  })
}


// Receives an authenticated oAuth2 Client
const google = require('googleapis')
const fs = require('fs');

exports.getAuthenticatedInstance = (auth) => {
  let service = google.drive({auth: auth, version: 'v3'})
  let listConfigured = list(service)
  return {
    list: listConfigured,
    fastSearch: fastSearch(listConfigured),
    download: download({service: service, fs: fs})
  };
}

