var dgram = require('dgram')

var query = function (options, callback) {

    var self = this

    if(typeof options === 'string') options.host = options
    options.port = options.port + 123 || 22126
    options.timeout = options.timeout || 1000

    if(!options.host)
        return callback.apply(options, [ 'Invalid host' ])

    if(!isFinite(options.port) || options.port < 1 || options.port > 65535)
        return callback.apply(options, [ 'Invalid port' ])

    var response = {}

    request.call(self, options, function(error, information) {
        if(error) return callback.apply(options, [ error ])

        response.address = options.host
        response.port = parseInt(information.port)
        response.gamename = information.gamename
        response.hostname = information.hostname
        response.gamemode = information.gamemode
        response.mapname = information.mapname
        response.version = information.version
        response.passworded = information.passworded === 1
        response.maxplayers = parseInt(information.maxplayers)
        response.online = parseInt(information.online)
        response.players = information.players

        return callback.apply(options, [ false, response ])

    })
}

var request = function(options, callback) {

    var socket = dgram.createSocket("udp4")
    var packet = new Buffer(1)

    packet.write('s')

    try {
        socket.send(packet, 0, packet.length, options.port, options.host, function(error, bytes) {
            if(error) return callback.apply(options, [ error ])
        })
    } catch(error) {
        return callback.apply(options, [ error ])
    }

    var controller = undefined

    var onTimeOut = function() {
        socket.close()
        return callback.apply(options, [ 'Host unavailable' ])
    }

    controller = setTimeout(onTimeOut, options.timeout)

    socket.on('message', function (message) {

        if(controller)
            clearTimeout(controller)

        if(decode(message.slice(0, 4)) == 'EYE1') {

            socket.close()

            message = message.slice(4)

            var object = {}
            var offset = 0
            var array = []

            for(var i = 0; i < 9; i++) {
                offset = message.readUInt8(0)
                array[i] = decode(message.slice(1, offset))
                message = message.slice(offset)
            }

            object.gamename = array[0]
            object.port = array[1]
            object.hostname = array[2]
            object.gamemode = array[3]
            object.mapname = array[4]
            object.version = array[5]
            object.passworded = array[6]
            object.online = array[7]
            object.maxplayers = array[8]
            object.players = []

            if (object.online > 0) {
                while(message.length != 0) {

                    if(decode(message.slice(0, 2)) == String.fromCharCode(1) + '?') message = message.slice(2)

                    var player = {}

                    offset = message.readUInt8(0)

                    if(offset && 1) {
                        offset = message.readUInt8(0)
                        player.name = decode(message.slice(1, offset))
                        message = message.slice(offset)
                    }
                    if(offset && 2) {
                        offset = message.readUInt8(0)
                        player.team = decode(message.slice(1, offset))
                        message = message.slice(offset)
                    }
                    if(offset && 4) {
                        offset = message.readUInt8(0)
                        player.skin = decode(message.slice(1, offset))
                        message = message.slice(offset)
                    }
                    if(offset && 8) {
                        offset = message.readUInt8(0)
                        player.score = parseInt(decode(message.slice(1, offset))) || 0
                        message = message.slice(offset)
                    }
                    if(offset && 16) {
                        offset = message.readUInt8(0)
                        player.ping = parseInt(decode(message.slice(1, offset))) || 0
                        message = message.slice(offset)
                    }
                    if(offset && 32) {
                        offset = message.readUInt8(0)
                        player.time = parseInt(decode(message.slice(1, offset))) || 0
                        message = message.slice(offset)
                    }

                    message = message.slice(offset)

                    object.players.push(player)
                }
            }

            return callback.apply(options, [ false, object ])
        }
    })
}

var decode = function(buffer) {
    var charset = ''
    for (var i = 0; i < 128; i++) charset += String.fromCharCode(i)
    charset += '€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�'
    var charsetBuffer = new Buffer(charset, 'ucs2')
    var decodeBuffer = new Buffer(buffer.length * 2)
    for(var i = 0; i < buffer.length; i++) {
        decodeBuffer[i * 2] = charsetBuffer[buffer[i] * 2]
        decodeBuffer[i * 2 + 1] = charsetBuffer[buffer[i] * 2 + 1]
    }
    return decodeBuffer.toString('ucs2')
}

module.exports = query
