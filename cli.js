const fs = require('fs');
const driveLite = require('./index'); 
const utility = require('./utility')
const argv = require('minimist')(process.argv.slice(2));
const readline = require('readline');

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
  const arg = splittedLine.length == 1 ? splittedLine[0] : splittedLine[splittedLine.length - 1];

  var hits = files.filter(utility.byName(arg))
  // show all completions if none found
  return [hits.length ? hits.map(file => file.name) : [], arg]
}


const getAvailableCommands = name => {
  let commands = {
    ls: defaultCommands.ls,
    dl: defaultCommands.dl,
    exit: () => process.exit(0)
  }

  return commands[name]
}


const lineHandler = (driveClient) => (line, rl) => {
  let args = line.trim().split(' '),
      command = args[0],
      fileName = args.reduce(utility.concatAllButFirst, []).join(' '),
      defaultCb = () => { rl.prompt() }

  let commandToExecute = getAvailableCommands(command)

  if(commandToExecute)
    commandToExecute({
      cmd: command, 
      fileName: fileName, 
      cb: defaultCb,
      drive: driveClient
    })
  else {
    console.log(`Oooops, command '${command}' not found :(`)
    defaultCb()
  }

}

function init(params) {
  let drive = params.drive;
  let files = [];
  startShell({
    prompt: 'gdrive → ',
    lineHandler: lineHandler(drive),
    closeHandler: () => process.exit(0),
    completer: completer,
    customCommands: params.customCommands
  })

}

// Test auth
const googleAuth = require('google-auth-library')
const auth = new googleAuth();

const clientId = JSON.parse(fs.readFileSync('./client_id.json', 'utf8'))
const oauth2Client = new auth.OAuth2(
  clientId.installed.client_id, 
  clientId.installed.client_secret, 
  clientId.installed.redirect_uris[0]
); 
oauth2Client.credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'))
//

let gdrive = driveLite.init(oauth2Client)

let driveCLI = init({
  drive: gdrive
})

