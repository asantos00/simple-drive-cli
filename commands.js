'use strict'
const utility = require('./utility');

const showFileList = files => {
    files.map((file, idx) => console.log(file.name.replace(/ /g, '_')))
    console.log('\n');
}
// Lists files
exports.ls = (params) => {
  let options = {};

  if(params.options.f)
    options.q = "mimeType = 'application/vnd.google-apps.folder'"
   
  params.drive.list(options)
    .then((resp) => {
      files = resp;
      showFileList(files)
      params.cb();
    })
    .catch(err => console.log(err))
}

exports.search = (params) => {
  params.drive.fastSearch(params.options._[1])
    .then((resp) => {
      files = resp;
      showFileList(files)
      params.cb();
    })
    .catch(err => console.log(err))
}

// Download a file
exports.dl = (params) => {
  
  let filesToDL = params.options._.slice(1, params.options._.length)

  let promises = filesToDL.map((fileName) => {
  
    let file = files.filter(
      utility.byName([fileName])
    )[0]

    console.log('Starting download', file.name)
    return params.drive.download(file, params.options.p)
  })

  Promise.all(promises)
    .then(() => {
      console.log('Files downloaded!') 
      params.cb()
    })

}
