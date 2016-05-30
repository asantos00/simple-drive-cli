'use strict';

const fs = require('fs');
const google = require('googleapis')
// Full access - Be careful
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const list = (service) => (options) => {
  return new Promise((resolve, reject) => {
    const token = service._options.auth.credentials.access_token
    service.files.list(Object.assign({
      fields: 'files',
    }, options), (err, res) => {
      
      if(err) return reject(err)
      resolve(res.files)

    })

  })
}

const fastSearch = list => (word, options = {}) => {
  let mergedOptions = Object.assign(options, {q: `fullText contains '${word}' or name contains '${word}'`})
  return list(mergedOptions) 
}

const download = service => (file, path = '.') => {
  let fullPath = './' + file.name
  var dest = fs.createWriteStream(fullPath);

  return new Promise((resolve, reject) => {
    service.files.get({
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

exports.init = (auth) => {
  let service = google.drive({auth: auth, version: 'v3'})
  let listConfigured = list(service)
  return {
    list: listConfigured,
    fastSearch: fastSearch(listConfigured),
    download: download(service)
  };
}

