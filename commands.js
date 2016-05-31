const utility = require('./utility');
// Lists files
exports.ls = (params) => {
  params.drive.list()
    .then((resp) => {
      files = resp;
      files.map((file, idx) => console.log(file.name.replace(/ /g, '_')))
      console.log('\n');
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
