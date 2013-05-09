# config-dir

config-dir

## Usage

app.js:
```js
var config = require('config-dir')('example')
console.log(config.get())
```

/home/me/configs/example.ini
```ini
[foo]
bar=Hello
```

/home/me/configs/global.ini
```ini
[foo]
baz=World
```

run:

    CONFIG_DIR=/home/me/configs/ node app.js

output:

```json
{"foo":{"bar":"Hello","baz":"World"}}
```

## Install

    $ npm install config-dir

## License

MIT
