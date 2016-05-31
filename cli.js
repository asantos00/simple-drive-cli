'use strict'
const fs = require('fs');
const driveLite = require('./index'); 
const utility = require('./utility')
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const readline = require('readline');
const authorize = require('./authentication.js').authorize;
const defaultCommands = require('./commands.js')

const startShell = (params) => {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer: params.completer
  });

  rl.setPrompt(params.prompt);
  rl.prompt();
  rl.on('line', (line) => params.lineHandler(line, rl))
  rl.on('close', (line) =>  params.closeHandler(line, rl))
  return rl;
}

const completer = line => {
  const splittedLine = line.split(' ');
  const arg = minimist(splittedLine.slice(1))._.pop()

  var hits = files.filter(utility.byName([arg]))
  // show all completions if none found
  return [hits.length ? hits.map(file => file.name.replace(/ /g, '_')) : [], arg]
}


const getAvailableCommands = name => {
  let commands = {
    ls: defaultCommands.ls,
    dl: defaultCommands.dl,
    find: defaultCommands.search,
    exit: () => process.exit(0)
  }

  return commands[name]
}


const lineHandler = (driveClient) => (line, rl) => {

  let args = minimist(line.trim().split(' ')),
      command = args._[0],
      defaultCb = () => { rl.prompt() }
  ;

  let commandToExecute = getAvailableCommands(command)

  if(commandToExecute){
    commandToExecute({
      cmd: command, 
      cb: defaultCb,
      options: args,
      drive: driveClient
    })
  } else {
    console.log(`Oooops, command '${command}' not found :(`)
    defaultCb()
  }

}

const initCLI = (params) => {
  let drive = params.drive;
  startShell({
    prompt: 'gdrive → ',
    lineHandler: lineHandler(drive),
    closeHandler: () => process.exit(0),
    completer: completer,
    customCommands: params.customCommands
  })

}


const clientIdPath = argv.clientId || './client_id.json';

authorize({
  credentials: JSON.parse(fs.readFileSync(clientIdPath, 'utf8')),
  cb: (oauth2Client) => {

    let gdrive = driveLite.getAuthenticatedInstance(oauth2Client)
    
    initCLI({ drive: gdrive })
    
  }
})


