const { default: WASocket, useSingleFileAuthState, fetchLatestBaileysVersion, DisconnectReason, jidDecode } = require('@adiwajshing/baileys')
const Pino = require('pino')
const { sessionName } = require('./config.json')
const { Boom } = require('@hapi/boom')
const { existsSync } = require('fs')
const path = require('path')
const fs = require('fs')
const { state, saveState } = useSingleFileAuthState(path.resolve(`${sessionName}.json`), Pino({ level: 'silent' }))
const { getBuffer, serialize } = require("./utils/myfunc")
const messageHandler = require('./handler/message')
let welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let left = JSON.parse(fs.readFileSync('./database/left.json'));
let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
const { isSetWelcome, getTextSetWelcome } = require('./utils/setwelcome');
const { isSetLeft, getTextSetLeft } = require('./utils/setleft');

const connect = async () => {
    let { version, isLatest } = await fetchLatestBaileysVersion()

    console.log(`Using: ${version}, newer: ${isLatest}`)
    const sock = WASocket({
        printQRInTerminal: true,
        auth: state,
        logger: Pino({ level: 'silent' }),
        version,
    })

    sock.ev.on('creds.update', saveState)
    sock.ev.on('connection.update', async (up) => {
        const { lastDisconnect, connection } = up
        if (connection) {
            console.log('Connection Status: ', connection)
        }

        if (connection === 'close') {
            let reason = new Boom(lastDisconnect.error).output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Please Delete ${sessionName}-session.json and Scan Again`)
                sock.logout()
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log('Connection closed, reconnecting....')
                connect()
            } else if (reason === DisconnectReason.connectionLost) {
                console.log('Connection Lost from Server, reconnecting...')
                connect()
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log('Connection Replaced, Another New Session Opened, Please Close Current Session First')
                sock.logout()
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Delete ${sessionName}-session.json and Scan Again.`)
                sock.logout()
            } else if (reason === DisconnectReason.restartRequired) {
                console.log('Restart Required, Restarting...')
                connect()
            } else if (reason === DisconnectReason.timedOut) {
                console.log('Connection TimedOut, Reconnecting...')
                connect()
            } else {
                sock.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`)
            }
        }
    })

    // messages.upsert
    sock.ev.on('messages.upsert', ({ messages, type }) => {
        if (type !== 'notify') return
        messageHandler(sock, messages[0], welcome, left, set_welcome_db, set_left_db)
    })

    sock.ev.on('group-participants.update', async (data) => {
        const isWelcome = welcome.includes(data.id) ? true : false
        const isLeft = left.includes(data.id) ? true : false
        const metadata = await sock.groupMetadata(data.id)
        const groupName = metadata.subject
        const groupDesc = metadata.desc
        const groupMem = metadata.participants.length
        try {
            for (let i of data.participants) {
                if (data.action == "add" && isWelcome) {
                    try {
                        var pp_user = await sock.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetWelcome(data.id, set_welcome_db)) {
                        var get_teks_welcome = getTextSetWelcome(data.id, set_welcome_db)
                        var replace_pesan = (get_teks_welcome.replace(/@nama/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@grup/gi, groupName).replace(/@desc/gi, groupDesc))
                        sock.sendMessage(data.id, { caption: `${full_pesan}`, image: await getBuffer(pp_user), mentions: [i] })
                    } else {
                        sock.sendMessage(data.id, { caption: `Welcome @${i.split("@")[0]} to the group ${groupName}`, image: await getBuffer(pp_user), mentions: [i] })
                    }
                } else if (data.action == "remove" && isLeft) {
                    try {
                        var pp_user = await sock.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetLeft(data.id, set_left_db)) {
                        var get_teks_left = getTextSetLeft(data.id, set_left_db)
                        var replace_pesan = (get_teks_left.replace(/@nama/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@grup/gi, groupName).replace(/@desc/gi, groupDesc))
                        sock.sendMessage(data.id, { caption: `${full_pesan}`, image: await getBuffer(pp_user), mentions: [i] })
                    } else {
                        sock.sendMessage(data.id, { caption: `Sayonara @${i.split("@")[0]}`, image: await getBuffer(pp_user), mentions: [i] })
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    })
    sock.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }    

}
connect()
