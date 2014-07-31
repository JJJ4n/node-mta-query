# node-mta-query

Simplified Query API for MTA

```
npm install mta-query
```

#### Usage

**Available options**

* host
* port - default: 22003
* timeout - default: 1000

```
var query = require('mta-query')

var options = {
    host: '94.23.247.90'
}

query(options, function (error, response) {
    if(error)
        console.log(error)
    else 
        console.log(response)
})
```

#### Sample output
```
{ 
    address: '94.23.247.90',
    port: 22003,
    gamename: 'mta',
    hostname: 'eXo Reallife 2.2 - German MTA Roleplay - Miami Reallife',
    gamemode: 'eXo RL',
    mapname: 'Los Santos + SanFierro',
    version: '1.3',
    passworded: false,
    maxplayers: 350,
    online: 32,
    players: [ List of Players ] 
}
```



