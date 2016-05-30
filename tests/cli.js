'use strict';

const test = require('tape')

const authenticate = require('../index.js').authenticate

const utility = require('../index.js').utility;

test('should return true if obj.kind equals drive#file', (t) => {
  t.true(utility.isFile({kind: 'drive#file'}), 'True for file') 
  t.false(utility.isFile({kind: 'drive#folder'}), 'False for folder')
  t.end();
})

test('should return accumulator with files and folders', t => {

  let isFile = true;

  let withFiles = utility.separateFilesNFolders(() => isFile)({
    files:  [], folders: []
  }, ['hello', 'world'])

  t.equal(withFiles.files[0].length, 2, 'File is in files prop')

  t.end();
})
