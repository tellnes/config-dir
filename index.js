
var nconf = require('nconf')
  , fs = require('fs')
  , path = require('path')
  , traceback = require('traceback')
  , argv = require('optimist').argv
  , ini = require('ini')

var configs = {}

module.exports = function (name) {
  var conf = configs[name]
    , file

  if (!conf) {
    conf = configs[name] = new (nconf.Provider)()

    var configDir = process.env.CONFIG_DIR
    if (!configDir)
      throw new Error('You must specify the `CONFIG_DIR` enviroment variable')

    configDir = path.resolve(process.env.CONFIG_DIR || '')
    try {
      if (!fs.statSync(configDir).isDirectory())
        throw 'not dir'
    } catch(err) {
      throw new Error('Dir specified in `CONFIG_DIR` enviroment variable not found')
    }

    file = path.join(configDir, name + '.ini')
    conf.file(file, { file: file, format: nconf.formats.ini })

    file = path.join(configDir, name + '.json')
    conf.file(file, { file: file, format: nconf.formats.json })

    file = path.join(configDir, 'global.ini')
    conf.file(file, { file: file, format: nconf.formats.ini })

    file = path.join(configDir, 'global.json')
    conf.file(file, { file: file, format: nconf.formats.json })

    conf.argv = argv
  }

  var parentDir = path.dirname(traceback()[1].path)

  file = path.join(parentDir, 'config.ini')
  if (!conf.stores[file]) {
    conf.file(file, file)
  }

  file = path.join(parentDir, 'defaults.ini')
  if (!conf.stores[file]) {
    conf.file(file, file)
  }

  if (argv['show-config']) {
    if (argv['show-config'] === 'json') {
      process.stdout.write(JSON.stringify(conf.get(), null, '  '))
    } else {
      process.stdout.write(ini.stringify(conf.get()))
    }
    process.exit()
  }

  return conf
}
