const utility = require('./utility');
// Lists files
exports.ls = (params) => {
  params.drive.list()
    .then((resp) => {
      files = resp;
      files.map((file, idx) => console.log(file.name))
      console.log('\n');
      params.cb();
    })
    .catch(err => console.log(err))
}


// Download a file
exports.dl = (params) => {
  let file = files.filter(utility.byName(params.fileName))[0]
  console.log('Starting download', file.name)
  params.drive.download(file)
    .then((path) => {
      console.log('Done! Saved at', path)
      params.cb();
    })

}
