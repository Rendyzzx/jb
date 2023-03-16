const { WASocket, proto, getContentType, downloadContentFromMessage } = require('@adiwajshing/baileys')
const axios = require('axios').default
const moment = require('moment-timezone')
const FormData = require('form-data')
const { PassThrough } = require('stream')
const ffmpeg = require('fluent-ffmpeg')
const chalk = require('chalk')
const fs = require('fs')
const qs = require('qs')
const speed = require("performance-now");
const ms = require('parse-ms')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const crypto = require('crypto')
const toMS = require("ms");
const Math_js = require('mathjs');
const { addBalance, kurangBalance, getBalance } = require("../lib/money");
const { addPlayGame, getJawabanGame, isPlayGame, cekWaktuGame, getGamePosi } = require("../lib/game");
const { menuowner } = require('../utils/menuowner')
const { addResponList, delResponList, resetListAll, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('../utils/respon-list')
const { getBuffer, serialize, getRandom, fetchJson, runtime, reSize, sleep } = require("../utils/myfunc");
const _sewa = require("../utils/sewa");
let db_respon_list = JSON.parse(fs.readFileSync('./database/list-message.json'))
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
const { isSetWelcome, addSetWelcome, changeSetWelcome, removeSetWelcome } = require('../utils/setwelcome');
const { isSetLeft, addSetLeft, removeSetLeft, changeSetLeft } = require('../utils/setleft');
const { isSetProses, addSetProses, removeSetProses, changeSetProses, getTextSetProses } = require('../utils/setproses');
const { isSetDone, addSetDone, removeSetDone, changeSetDone, getTextSetDone } = require('../utils/setdone');
const { isSetOpen, addSetOpen, removeSetOpen, changeSetOpen, getTextSetOpen } = require("../utils/setopen");
const { isSetClose, addSetClose, removeSetClose, changeSetClose, getTextSetClose } = require("../utils/setclose");
const { isSetBot, addSetBot, removeSetBot, changeSetBot, getTextSetBot } = require('../utils/setbot');
const afkg = require("../utils/afk");
const _premium = require("../utils/premium");
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let pricelist = JSON.parse(fs.readFileSync('./database/pricelist.json'));
let opengc = JSON.parse(fs.readFileSync('./database/opengc.json'));
let set_open = JSON.parse(fs.readFileSync('./database/set_open.json'));
let set_close = JSON.parse(fs.readFileSync('./database/set_close.json'));
let _afks = JSON.parse(fs.readFileSync('./database/afg.json'));
let premium = JSON.parse(fs.readFileSync('./database/premium.json'));
let _money = JSON.parse(fs.readFileSync('./database/balance.json'));
let set_bot = JSON.parse(fs.readFileSync('./database/set_bot.json'));
let mess = JSON.parse(fs.readFileSync('./utils/mess.json'))
const db_user = JSON.parse(fs.readFileSync('./database/user.json'));
    /////CHNGE
    
/**
 *
 * @param { string } text
 * @param { string } color
 */
const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}

let caklontong = []
let susunkata = []
let siapakahaku = []
let tebakkalimat = []
let tebakkata = []
let tebakkimia = []
let tebaktebakan = []
let tekateki = []
let tebakgambar = []
let tebakgame = []

let idml1 = {}
let idml2 = {}

moment.tz.setDefault("Asia/Jakarta").locale("id");

/**
 * @param {WASocket} sock
 * @param {proto.IWebMessageInfo} msg
 */
module.exports = async (sock, msg, m, welcome,left, set_welcome_db,set_left_db) => {
    const { ownerNumber, ownerName, botName, apikey, footer, gamewaktu, apiid, apikei } = require('../config.json')
    const { isQuotedMsg, quotedMsg, now, fromMe, isBaileys } = msg

    const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return
    if (!msg.message) return

    m = serialize(sock, msg)
    const type = getContentType(msg.message)
    const quotedType = getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) || null
    const botId = sock.user.id.includes(':') ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : sock.user.id
    const numbernye = `0`;
    const from = msg.key.remoteJid
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage" && msg.message.templateButtonReplyMessage.selectedId) ? msg.message.templateButtonReplyMessage.selectedId : (type == "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == "messageContextInfo") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
    const body = type == 'conversation' ? msg.message?.conversation : msg.message[type]?.caption || msg.message[type]?.text || ''
    const responseMessage = type == 'listResponseMessage' ? msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '' : type == 'buttonsResponseMessage' ? msg.message?.buttonsResponseMessage?.selectedButtonId || '' : ''
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
    const isSewa = _sewa.checkSewaGroup(from, sewa)
    const isWelcome = isGroup ? welcome.includes(sender) ? true : false : false
    const isLeft = isGroup ? left.includes(sender) ? true : false : false
    const isPricelist = pricelist.includes(from) ? true : false
    const gy = '```'
    const isAfkOn = afkg.checkAfkUser(sender, _afks)
    const tanggal = moment().tz("Asia/Jakarta").format("dddd, ll")
    const jam = moment().format("HH:mm:ss z")
    let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
    const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
    
    const pushname = msg.pushName

    const groupMetadata = isGroup ? await sock.groupMetadata(from) : null
    const groupName = groupMetadata?.subject || ''
    const groupMembers = groupMetadata?.participants || []
    const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
    var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
		
	const isUrl = (url) => {
        	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
			     
    const command = chats.toLowerCase().split(' ')[0] || ''
    const isCmd = command.startsWith(prefix)
   
    const isGroupAdmins = groupAdmins.includes(sender)
    const isBotGroupAdmins = groupMetadata && groupAdmins.includes(botId)
    const isOwner = ownerNumber.includes(sender)
    const argus = chats.split(' ')
    const isAntiLink = antilink.includes(from) ? true : false
    const isAntiWame = antiwame.includes(from) ? true : false
    const isPremium = isOwner ? true : _premium.checkPremiumUser(sender, premium)
    const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
    let responseId = msg?.message?.listResponseMessage?.singleSelectReply?.selectedRowId || msg?.message?.buttonsResponseMessage?.selectedButtonId || null
    let args = body.trim().split(' ').slice(1)
    let full_args = body.replace(command, '').slice(1).trim()
    let q = args.join(" ")
    
    let randomString = 'WSG'
		charSet = "123456789"
		for (let i = 0; i < 7; i++) {
		let randomPoz = Math.floor(Math.random() * charSet.length)
		randomString += charSet.substring(randomPoz, randomPoz + 1)
	    }
	let sku = `${args[0]}`;
	let cekstatus = crypto.createHash('md5').update(`${apiid}${apikei}${sku}${args[1]}`).digest("hex")
    let signprofile = crypto.createHash('md5').update(apiid+apikei).digest("hex")
    let signorder = crypto.createHash('md5').update(`${apiid}${apikei}${randomString}`).digest("hex")
    
    const isImage = type == 'imageMessage'
    const isVideo = type == 'videoMessage'
    const isAudio = type == 'audioMessage'
    const isSticker = type == 'stickerMessage'
    const isContact = type == 'contactMessage'
    const isLocation = type == 'locationMessage'

   const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
    const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
    const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
    mention != undefined ? mention.push(mentionByReply) : []
    const mentionUser = mention != undefined ? mention.filter(n => n) : []
    let mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
   

    const isQuoted = type == 'extendedTextMessage'
    const isQuotedImage = isQuoted && quotedType == 'imageMessage'
    const isQuotedVideo = isQuoted && quotedType == 'videoMessage'
    const isQuotedAudio = isQuoted && quotedType == 'audioMessage'
    const isQuotedSticker = isQuoted && quotedType == 'stickerMessage'
    const isQuotedContact = isQuoted && quotedType == 'contactMessage'
    const isQuotedLocation = isQuoted && quotedType == 'locationMessage'
    let timestamp = speed(); 
    let latensi = speed() - timestamp
    var mediaType = type
    var stream
    if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedSticker) {
        mediaType = quotedType
        msg.message[mediaType] = msg.message.extendedTextMessage.contextInfo.quotedMessage[mediaType]
        stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', '')).catch(console.error)
    }

    if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(sender, 'yellow'))
    if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(sender, 'yellow'), 'in', color(groupName, 'yellow'))
    if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(sender, 'yellow'))
    if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(sender, 'yellow'), 'in', color(groupName, 'yellow'))

    const reply = async (text) => {
        return sock.sendMessage(from, { text: text.trim() }, { quoted: msg })
    }
    const fkon = {key: {fromMe: false, participant: `${numbernye}@s.whatsapp.net`, ...(from ? {remoteJid: "status@broadcast" } : {}) }, message: {contactMessage: {displayName: `${pushname}`, vcard: 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'N:Bot;Xrell;Ganz;;\n' + 'FN:Xrutz-Bot\n' + 'item1.TEL;waid=6283871990243:+62 838-719-90243\n' + 'item1.X-ABLabel:Telepon\n' + 'END:VCARD'}}}
    const replyk = async (text) => {
        return sock.sendMessage(from, { text: text.trim() }, { quoted: fkon })
    }
    
    
    
var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var date = new Date();
    var thisDay = date.getDay(),
    thisDay = myDays[thisDay];

    function mentions(teks, mems = [], id) {
        if (id == null || id == undefined || id == false) {
            let res = sock.sendMessage(from, { text: teks, mentions: mems })
            return res
        } else {
            let res = sock.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
            return res
        }
    }    

function hitungmundur(bulan, tanggal) {
          let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
          let now = Date.now();
          let distance = from - now;
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          return days + "Hari " + hours + "Jam " + minutes + "Menit " + seconds + "Detik"
        }

        async function downloadAndSaveMediaMessage (type_file, path_file) {
            if (type_file === 'image') {
                var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            } else if (type_file === 'video') {
                var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            } else if (type_file === 'audio') {
                var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            }
        }

//AntiLink
if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
    if (budy.match(/(https:\/\/chat.whatsapp.com)/gi)) {
    if (!isBotGroupAdmins) return reply(`*Selama Bot Bukan Admin Kirim Lah Link Sesuka Mu*`)
    reply(`*「 LINKGROUP DETECTOR 」*\n\n karena kamu melanggar aturan group, yaitu menggirim link group kamu akan di kick dari group! bye bye:)`)
    sock.groupParticipantsUpdate(from, [sender], "remove")
    }
    }
    if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
    if (budy.match('chat.whatsapp.com/')) {
    if (!isBotGroupAdmins) return reply(`*Selama Bot Bukan Admin Kirim Lah Link Sesuka Mu*`)
    reply(`*「 LINKGROUP DETECTOR 」*\n\n karena kamu melanggar aturan group, yaitu menggirim link group kamu akan di kick dari group! bye bye:)`)
    sock.groupParticipantsUpdate(from, [sender], "remove")
    }
    }
        
//Antilinkwame
if (isGroup && isAntiWame && !isOwner && !isGroupAdmins && isBotGroupAdmins){
    if (chats.match(/(wa.me)/gi)) {
    if (!isBotGroupAdmins) return reply(`*Selama Bot Bukan Admin Kirim Lah Link Sesuka Mu*`)
    reply(`*「  LINK WA.ME DETECTOR 」*\n\nSepertinya kamu mengirimkan link wa.me, maaf kamu akan di kick`)
    sock.groupParticipantsUpdate(from, [sender], "remove")
    }
    }
    if (isGroup && isAntiWame && !isOwner && !isGroupAdmins && isBotGroupAdmins){
    if (budy.match(/(https:\/\/wa.me)/gi)) {
    if (!isBotGroupAdmins) return reply(`*Selama Bot Bukan Admin Kirim Lah Link Sesuka Mu*`)
    reply(`*「 LINKGROUP DETECTOR 」*\n\nSepertinya kamu mengirimkan link wa.me, maaf kamu akan di kick`)
    sock.groupParticipantsUpdate(from, [sender], "remove")
    }
    }

//MULAI AFK
if (isGroup) {
    for (let x of mentionUser) {
        if (afkg.checkAfkUser(x, _afks)) {
        const getId = afkg.getAfkId(x, _afks)
        const getReason = afkg.getAfkReason(getId, _afks)
        const getTime = afkg.getAfkTime(getId, _afks)
        //if (riz.message.extendedTextMessage != undefined){ 
        try {
        var afpk = await sock.profilePictureUrl(mentionUser[0], 'image')
        } catch {
        var afpk = 'https://i.ibb.co/Twkhgy9/images-4.jpg'
        }
        var thumeb = await getBuffer(afpk)
        const cptl = `Saat ini @${mentionUser[0].split("@")[0]} Sedang afk dengan alasan ${getReason}

*Afk sejak* : ${getTime}`
  sock.sendMessage(from, { text: cptl }, { quoted: m });
  //sendMess(x, `Assalamualaikum\n\n_Ada Yg Mencari Kamu Saat Kamu Offline/Afk_\n\nNama : ${pushname}\nNomor : wa.me/${sender.split("@")[0]}\nDi Group : ${groupName}\nPesan : ${chats}`)
  }}
  //KEMBALI DARI AFK
  if (afkg.checkAfkUser(sender, _afks)) {
  const getTime = afkg.getAfkTime(sender, _afks)
  const getReason = afkg.getAfkReason(sender, _afks)
  const ittung = ms(await Date.now() - getTime)
  try {
  var afpkk = await sock.profilePictureUrl(mentionUser[0], 'image')
  } catch {
  var afpkk = 'https://i.ibb.co/Twkhgy9/images-4.jpg'
  }
  var thumbw = await getBuffer(afpkk)
  const pep = `*${pushname}* Telah Kembali Dari Afknya!`
  sock.sendMessage(from, { text: pep }, { quoted: m });
  _afks.splice(afkg.getAfkPosition(sender, _afks), 1)
  fs.writeFileSync('./database/afkg.json', JSON.stringify(_afks))
  }
  }


 //jeda time
 setInterval(() => {
    for (let i of Object.values(opengc)) {
        if (Date.now() >= i.time) {
            sock.groupSettingUpdate(i.id, "not_announcement")
            .then((res) =>
            sock.sendMessage(i.id, { text: `Waktu Jeda Telah Selesai` }))
            .catch((err) =>
            sock.sendMessage(i.id, { text: 'Error' }))
            delete opengc[i.id]
            fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
        }
    }
}, 1000)

// DATAGAMES
cekWaktuGame(sock, caklontong)
if (isPlayGame(from, caklontong) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, caklontong)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, caklontong)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}caklontong*`)
    caklontong.splice(getGamePosi(from, caklontong), 1)
  }
}

cekWaktuGame(sock, susunkata)
if (isPlayGame(from, susunkata) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, susunkata)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, susunkata)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}susunkata*`)
    susunkata.splice(getGamePosi(from, susunkata), 1)
  }
}

cekWaktuGame(sock, siapakahaku)
if (isPlayGame(from, siapakahaku) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, siapakahaku)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, siapakahaku)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}siapakahaku*`)
    siapakahaku.splice(getGamePosi(from, siapakahaku), 1)
  }
}

cekWaktuGame(sock, tebakkalimat)
if (isPlayGame(from, tebakkalimat) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, tebakkalimat)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebakkalimat)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}tebakkalimat*`)
    tebakkalimat.splice(getGamePosi(from, siapakahaku), 1)
  }
}

cekWaktuGame(sock, tebakkata)
if (isPlayGame(from, tebakkata) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, tebakkata)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebakkata)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}tebakkata*`)
    tebakkata.splice(getGamePosi(from, tebakkata), 1)
  }
}

cekWaktuGame(sock, tebakkimia)
if (isPlayGame(from, tebakkimia) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, tebakkimia)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebakkimia)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}tebaklirik*`)
    tebakkimia.splice(getGamePosi(from, tebakkimia), 1)
  }
}

cekWaktuGame(sock, tebaktebakan)
if (isPlayGame(from, tebaktebakan) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, tebaktebakan)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebaktebakan)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}tebaktebakan*`)
    tebaktebakan.splice(getGamePosi(from, tebaktebakan), 1)
  }
}
cekWaktuGame(sock, tekateki)
if (isPlayGame(from, tekateki) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, tekateki)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tekateki)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}tekateki*`)
    tekateki.splice(getGamePosi(from, tekateki), 1)
  }
}

cekWaktuGame(sock, tebakgambar)
if (isPlayGame(from, tebakgambar) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, tebakgambar)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebakgambar)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}tebakgambar*`)
    tebakgambar.splice(getGamePosi(from, tebakgambar), 1)
  }
}	

cekWaktuGame(sock, tebakgame)
if (isPlayGame(from, tebakgame) && sender) {
  if (chats.toLowerCase() == getJawabanGame(from, tebakgame)) {
    var htgm = randomNomor(100, 150)
    addBalance(sender, htgm, _money)
    reply(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebakgame)}\nHadiah : Balance $${htgm}\n\nIngin bermain lagi? ketik *${prefix}tebakgame*`)
    tebakgame.splice(getGamePosi(from, tebakgame), 1)
  }
}


          //SEWA WAKTU
          _sewa.expiredCheck(sock, sewa)
          _premium.expiredCheck(sock, premium)
          async function getGcName(groupID) {
            try {
                let data_name = await sock.groupMetadata(groupID)
                return data_name.subject
            } catch (err) {
                return '*Group Tidak Ada*'
            }
        }

        function randomNomor(min, max = null) {
            if (max !== null) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
                return Math.floor(Math.random() * min) + 1
            }
        }

        const pickRandom = (arr) => {
            return arr[Math.floor(Math.random() * arr.length)]
        }

        // Store Respon
        if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
        var get_data_respon = getDataResponList(from, chats, db_respon_list)
        if (get_data_respon.isImage === false) {
        sock.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
        quoted: msg
        })
        } else {
        sock.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
        quoted: msg
        })
        }
        }
        let runmek = runtime(process.uptime())

    // Auto Read & Presence Online
       
    await sock.readMessages([msg.key])
    await sock.sendPresenceUpdate('available', from) 
    switch (command) {
    	
    
    

        case prefix+'runtime':
            reply(runtime(process.uptime()))
            break

case prefix+'speed': case prefix+'ping':
    reply(`${latensi.toFixed(4)} Second`)
    break

case prefix+'delete': case prefix+'del':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!m.isQuotedMsg) return reply(`Balas chat dari bot yang ingin dihapus`)
if (!m.quotedMsg.fromMe) return reply(`Hanya bisa menghapus chat dari bot`)
sock.sendMessage(from, { delete: { fromMe: true, id: m.quotedMsg.id, remoteJid: from }})
break 

case prefix+'jeda': {
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
    if (!args[0]) return reply(`kirim ${command} waktu\nContoh: ${command} 30m\n\nlist waktu:\ns = detik\nm = menit\nh = jam\nd = hari`)
    opengc[from] = { id: from, time: Date.now() + toMS(args[0]) }
    fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
    sock.groupSettingUpdate(from, "announcement")
    .then((res) => reply(`Jeda Dulu Ya Group Akan Di Buka Dalam ${args[0]} Lagi`))
    .catch((err) => reply('Error'))
    }
    break
 
case prefix+'menustore':

reply(`╒══《*MENU STORE*》
├≽${prefix}menu
├≽${prefix}addlist
├≽${prefix}dellist
├≽${prefix}update
├≽${prefix}jeda
├≽${prefix}kalkulator
├≽${prefix}p < reply orderan >
├≽${prefix}d < reply orderan >
├≽${prefix}setp
├≽${prefix}updatep
├≽${prefix}delsetp
├≽${prefix}setd
├≽${prefix}updated
├≽${prefix}delsetd
├≽${prefix}nickff 
├≽${prefix}nickml 
├≽${prefix}nickpubg 
└≽${prefix}nickdomino`)

break

case prefix+'menugroup': case prefix+'menugrup':

reply(`╒══《*MENU GROUP*》
├≽${prefix}antiwame <1/0>
├≽${prefix}antilink <1/0>
├≽${prefix}buka/tutup
├≽${prefix}hidetag <text>
├≽${prefix}linkgc
├≽${prefix}afk
├≽${prefix}tagall
├≽${prefix}demote @tagmember
├≽${prefix}promote @tagmember
├≽${prefix}delete <reply chat bot>
├≽p = _Proses_
├≽d = _Done_
├≽${prefix}kalkulator
├≽${prefix}nickml id(server)
├≽${prefix}nickff id
├≽${prefix}nickpubg id
├≽${prefix}setp
└≽${prefix}setd
`)

break

case prefix+'menudownload':

reply(`╒══《*MENU DOWNLOAD*》
├≽${prefix}ytplay
├≽${prefix}ytmp3
├≽${prefix}igdl
├≽${prefix}tiktok
├≽${prefix}spotify
├≽${prefix}twtdl
├≽${prefix}fbdl
└≽${prefix}pinterestdl`)

break

case prefix+'menugabut':

reply(`╒══《*MENU GABUT*》
├≽${prefix}darkjokes
├≽${prefix}memeindo
└≽${prefix}meme`)

break
case prefix+'menugame':

reply(`╒══《*MENU GAME*》
├≽${prefix}caklontong
├≽${prefix}tekateki
├≽${prefix}susunkata
├≽${prefix}siapahaku
├≽${prefix}tebaklirik
├≽${prefix}tebaktebakan
├≽${prefix}tebakkata
├≽${prefix}tebakkalimat
├≽${prefix}tebakgambar
└≽${prefix}tebakgame`)

break

case prefix+'kalkulator':
            case 'hitung':
            case 'total':
            case 'hasil':
            if (!isGroup) return reply(`Bot Hanya Respon Di Dalam Group`)
            if (!q) return reply(`( + ) = Untuk Tambah-Tambahan\n( - ) = Untuk Kurang-Kurangan\n( * ) = Untuk Kali-Kalian\n( / ) = Untuk Bagi-Bagian\n\nContoh\n/kalkulator 40+20`)
            var tteks = `Hasil : ${Math_js.evaluate(q)}`
            reply(tteks)
            break 

        case prefix+'owner':
            const vcard =
                'BEGIN:VCARD\n' + // metadata of the contact card
                'VERSION:3.0\n' +
                `FN:${ownerName}\n` + // full name
                `ORG:${botName};\n` + // the organization of the contact
                `TEL;type=MSG;type=CELL;type=VOICE;waid=${ownerNumber[ownerNumber.length - 1].split('@')[0]}:+${ownerNumber[ownerNumber.length - 1].split('@')[0]}\n` + // WhatsApp ID + phone number
                'END:VCARD'

            sock.sendMessage(from, {
                contacts: {
                    displayName: ownerName,
                    contacts: [{ vcard }],
                },
            })
            break
            
            // Store Menu
        case '/menu': case prefix+'list':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini\n\n*Untuk Melihat Fitur Bot Ketik* ${prefix}help`)
            var arr_rows = [];
            for (let x of db_respon_list) {
                if (x.id === from) {
                    arr_rows.push({
                        title: x.key,
                        rowId: x.key
                    })
                }
            }
            var listMsg = {
                text: `List menu`,
                buttonText: 'Click here!',
                mentions: [sender],
                sections: [{
                    title: groupName, rows: arr_rows
                }]
            }
           sock.sendMessage(from, listMsg, {quoted: fkon})
            //sendOrder(from, listMsg, "3836", thum, 2022, "MENU PRICELIST", `${owncek}@s.whatsapp.net`, "AR6ebQf7wTuyXrVneA0kUMMbQe67ikT6LZrwT2uge7wIEw==", "9783")
            break
            case prefix+'addlist':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]                
            if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage('image', `./temp/stickers/${sender}`)
                const fd = new FormData();
                fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
                fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: fd
                }).then(res => res.json())
                    .then((json) => {
                        addResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
                        reply(`Sukses menambah List menu`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
                    })
            } else {
                addResponList(from, args1, args2, false, '-', db_respon_list)
                reply(`Sukses menambah List menu`)
            }
            break    
                  
            
            case prefix+'dellist':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
            if (!q) return reply(`Gunakan dengan cara ${command} *key*\n\n_Contoh_\n\n${command} hello`)
            if (!isAlreadyResponList(from, q, db_respon_list)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
            delResponList(from, q, db_respon_list)
            reply(`Sukses menghapus List menu`)
            break
            
            
            
            case prefix+'updatelist': case prefix+'update':        
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]
            if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Maaf, untuk key *${args1}* belum terdaftar di group ini`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage('image', `./temp/stickers/${sender}`)
                const fd = new FormData();
                fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
                fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: fd
                }).then(res => res.json())
                    .then((json) => {
                        updateResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
                        reply(`Sukses update List menu`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
                    })
            } else {
                updateResponList(from, args1, args2, false, '-', db_respon_list)
                reply(`Sukses update List menu`)
            }
            break
            case prefix+'hidetag':
            if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            let mem = [];
            groupMembers.map( i => mem.push(i.id) )
            sock.sendMessage(from, { text: q ? q : m.quotedMsg.chats, mentions: mem })
            break
       case prefix+'group': case prefix+'grup':
		if (!isGroup) return reply(mess.OnlyGrup)
		if (!isGroupAdmins) return reply(mess.GrupAdmin)
		if (!isBotGroupAdmins) return reply(mess.BotAdmin)
		if (argus.length < 2) return reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
		if (argus[1] == "close") {
		sock.groupSettingUpdate(from, 'announcement')
		reply(`Sukses Menutup Grup`)
		} else if (argus[1] == "open") {
		sock.groupSettingUpdate(from, 'not_announcement')
		reply(`Sukses Membuka Grup`)
		} else {
		reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
		}
		break
		
        case prefix+'add':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins) return reply(mess.GrupAdmin)
            if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            if (groupMembers.length == 257) return reply(`Anda tidak dapat menambah peserta, karena Grup sudah penuh!`)
            var mems = []
            groupMembers.map( i => mems.push(i.id) )
            var number;
            if (args.length > 0) {
                number = q.replace(/[^0-9]/gi, '')+"@s.whatsapp.net"
                var cek = await sock.onWhatsApp(number)
                if (cek.length == 0) return reply(`Masukkan nomer yang valid dan terdaftar di WhatsApp`)
                if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
                ////addCountCmd(`${prefix}add`, sender, _cmd)
                sock.groupParticipantsUpdate(from, [number], "add")
                .then( res => reply(`Sukses`))
                .catch((err) => reply(`Eror`))
            } else if (m.isQuoted) {
                number = m.quotedMsg.sender
                var cek = await sock.onWhatsApp(number)
                if (cek.length == 0) return reply(`Peserta tersebut sudah tidak terdaftar di WhatsApp`)
                if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
                ////addCountCmd(`${prefix}add`, sender, _cmd)
                sock.groupParticipantsUpdate(from, [number], "add")
                .then( res => reply(`Sukses`))
                .catch((err) => reply(`Eror`))
            } else {
                reply(`Kirim perintah ${command} nomer atau balas pesan orang yang ingin dimasukkan`)
            }
            break

		case prefix+'kick':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins) return reply(mess.GrupAdmin)
            if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            var number;
            if (mentionUser.length !== 0) {
                number = mentionUser[0]
                sock.groupParticipantsUpdate(from, [number], "remove")
                .then( res => reply(`Success kick @${number.split('@')[0]}`))
                .catch((err) => reply(`Error`))
            } else if (isQuoted) {
                number = quotedMsg.sender
                sock.groupParticipantsUpdate(from, [number], "remove")
                .then( res => reply(`Success kick @${number.split('@')[0]}`))
                .catch((err) => reply(`Error`))
            } else {
                reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
            }
            break 
                  case 'p': case 'proses':
if (!isGroup) return ('Hanya Dapat Digunakan Gi Group')
if (!isOwner && !isGroupAdmins) return ('Hanya Bisa Digunakan Oleh Admin')
let proses = `*[ STATUS PESANAN ]*

*› Tanggal* : ${tanggal}
*› Jam* : ${jam}
*› Status* : On Proses
_Mohon Di Tunggu_

Pesanan : 
${m.quotedMsg.chats}

*› Pesanan* @${m.quotedMsg.sender.split("@")[0]} *Processing*

*_${botName}_*`
            const getTextP = getTextSetProses(from, set_proses);
            if (getTextP !== undefined) {
                mentions(getTextP.replace('@pesanan', msg.quotedMsg.chats).replace('user', m.quotedMsg.sender.split("@")[0]).replace('@jam', jam).replace('@tanggal', tanggal), [m.quotedMsg.sender], true);
            } else {
                mentions(proses, [m.quotedMsg.sender], true)
            }
            break

        case 'd': case 'done':
            if ((budy) && ["d", "Done", "D"].includes(budy) && !isCmd) {
            if (!isGroup) return ('Hanya Dapat Digunakan Gi Group')
            if (!isOwner && !isGroupAdmins) return ('Hanya Bisa Digunakan Oleh Admin')
            let sukses = `*[ STATUS PESANAN ]*

*› Tanggal* : ${tanggal}
*› Jam* : ${jam}
*› Status* : Berhasil
_Terimakasih🙏_

*› Pesanan* @${m.quotedMsg.sender.split("@")[0]} *Succes*

*_${botName}_*`
            const getTextD = getTextSetDone(from, set_done);
            if (getTextD !== undefined) {
                mentions(getTextD.replace('@pesanan', msg.quotedMsg.chats).replace('user', m.quotedMsg.sender.split("@")[0]).replace('@jam', jam).replace('@tanggal', tanggal), [m.quotedMsg.sender], true);
            } else {
                mentions(sukses, [m.quotedMsg.sender], true)
            }
        }
            break 

case prefix+'setproses': case prefix+'setp':
        if (isPricelist) return reply(`Fitur Pricelist Disable Untuk Melihat Fitur Ketik ${prefix}help`)
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`*Ini Hanya Contoh*\n${prefix}setp Pesanan Proses\n@jam\n@tanggal\n\nPesanan @user Sedang Di Proses `)
            if (isSetProses(from, set_proses)) return reply(`Sudah Ada Setp Sebelumnya`)
            //addCountCmd(`${prefix}setproses`, sender, _cmd)
            addSetProses(q, from, set_proses)
            reply(`Sukses Set Proses!`)
            break
        case prefix+'changeproses': case prefix+'updatep':
        if (isPricelist) return reply(`Fitur Pricelist Disable Untuk Melihat Fitur Ketik ${prefix}help`)
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`*Ini Hanya Contoh*\n${prefix}updatep Pesanan Proses\n@jam\n@tanggal\n\nPesanan @user Sedang Di Proses`)
            //addCountCmd(`${prefix}changeproses`, sender, _cmd)
            if (isSetProses(from, set_proses)) {
                changeSetProses(q, from, set_proses)
                reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            } else {
                addSetProses(q, from, set_proses)
                reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            }
            break
        case prefix+'delsetproses': case prefix+'delsetp':
        if (isPricelist) return reply(`Fitur Pricelist Disable Untuk Melihat Fitur Ketik ${prefix}help`)
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!isSetProses(from, set_proses)) return reply(`Belum ada set proses di sini..`)
            //addCountCmd(`${prefix}delsetproses`, sender, _cmd)
            removeSetProses(from, set_proses)
            reply(`Sukses Delete Set Proses`)
            break
        case prefix+'setdone': case prefix+'setd':
        if (isPricelist) return reply(`Fitur Pricelist Disable Untuk Melihat Fitur Ketik ${prefix}help`)
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`*Ini Hanya Contoh*\n${prefix}setd Pesanan Sukses\n@jam\n@tanggal\n\nPesanan @user Sukses`)
            if (isSetDone(from, set_done)) return reply(`Sudah Ada Setd Sebelumnya`)
            //addCountCmd(`${prefix}setdone`, sender, _cmd)
            addSetDone(q, from, set_done)
            reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            break
        case prefix+'changedone': case prefix+'updated':
        if (isPricelist) return reply(`Fitur Pricelist Disable Untuk Melihat Fitur Ketik ${prefix}help`)
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`*Ini Hanya Contoh*\n${prefix}updated Pesanan Sukses\n@jam\n@tanggal\n\nPesanan @user Sukses`)
            //addCountCmd(`${prefix}changedone`, sender, _cmd)
            if (isSetDone(from, set_done)) {
                changeSetDone(q, from, set_done)
                reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            } else {
                addSetDone(q, from, set_done)
                reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            }
            break
        case prefix+'delsetdone': case prefix+'delsetd':
        if (isPricelist) return reply(`Fitur Pricelist Disable Untuk Melihat Fitur Ketik ${prefix}help`)
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!isSetDone(from, set_done)) return reply(`Belum ada set done di sini..`)
            //addCountCmd(`${prefix}delsetdone`, sender, _cmd)
            removeSetDone(from, set_done)
            reply(`Sukses Delete Setd`)
            break

case prefix+'sticker':
        case prefix+'s':
        if (!isGroup) return reply(mess.OnlyGrup)
            if (!isImage && !isQuotedImage && !isVideo && !isQuotedVideo) return reply(`Kirim media dengan caption ${prefix + command} atau tag media yang sudah dikirim`)
            var stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', ''))
            let stickerStream = new PassThrough()
            if (isImage || isQuotedImage) {
                ffmpeg(stream)
                    .on('start', function (cmd) {
                        console.log(`Started : ${cmd}`)
                    })
                    .on('error', function (err) {
                        console.log(`Error : ${err}`)
                    })
                    .on('end', function () {
                        console.log('Finish')
                    })
                    .addOutputOptions([
                        `-vcodec`,
                        `libwebp`,
                        `-vf`,
                        `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
                    ])
                    .toFormat('webp')
                    .writeToStream(stickerStream)
                sock.sendMessage(from, { sticker: { stream: stickerStream } })
            } else if (isVideo || isQuotedVideo) {
                ffmpeg(stream)
                    .on('start', function (cmd) {
                        console.log(`Started : ${cmd}`)
                    })
                    .on('error', function (err) {
                        console.log(`Error : ${err}`)
                    })
                    .on('end', async () => {
                        sock.sendMessage(from, { sticker: { url: `./temp/stickers/${sender}.webp` } }).then(() => {
                            fs.unlinkSync(`./temp/stickers/${sender}.webp`)
                            console.log('Finish')
                        })
                    })
                    .addOutputOptions([
                        `-vcodec`,
                        `libwebp`,
                        `-vf`,
                        `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
                    ])
                    .toFormat('webp')
                    .save(`./temp/stickers/${sender}.webp`)
            }
            
break

case prefix+'sewabot':
    if (!isOwner) return reply(`Command ${command} Hanya Khusus Owner`)
    if (args.length < 1) return reply(`Penggunaan :\n*${prefix}sewa 15k 30d*/n*Ini Hanya Contoh*`)
    _sewa.addSewaGroup(from, args[1], sewa)
    reply(`Success Add Sewa`)
    break
    
///sewa
case 'addsewa':
            if (!isOwner) return reply(`Command ${command} Hanya Khusus Owner`)
            if (args.length < 1) return 
            if (!isUrl(args[0])) return reply(mess.error.Iv)
            var url = args[0]
            url = url.split('https://chat.whatsapp.com/')[1]
            if (!args[1]) return reply(`Waktunya?`)
            var kuntul = await sock.groupAcceptInvite(url)
            if (_sewa.checkSewaGroup(kuntul, sewa)) return reply(`Bot sudah disewa oleh grup tersebut!`)
            _sewa.addSewaGroup(kuntul, args[1], sewa)
            reply(`Success Add Sewa Group!`)
            break

case prefix+'delsewa':
      if (!isOwner) return reply(mess.OnlyOwner)
      if (!isGroup) return reply(`Perintah ini hanya bisa dilakukan di Grup yang menyewa bot`)
      if (!isSewa) return reply(`Bot tidak disewa di Grup ini`)
      sewa.splice(_sewa.getSewaPosition(from, sewa), 1)
      fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa))
      reply(`Sukses`)
      break    

case prefix+'checksewa': case prefix+'ceksewa':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isSewa) return reply(`Bot tidak di sewa group ini!`)
    let ceksewa = ms(_sewa.getSewaExpired(from, sewa) - Date.now())
    let sewanya = `*Expire :* ${ceksewa.days} Hari ${ceksewa.hours} Jam ${ceksewa.minutes} Menit`
    reply(sewanya)
    break
    
case prefix+'listsewa':
if (!isOwner) return reply(mess.OnlyOwner)
    let list_sewa_list = `*LIST-SEWA-GROUP*\n\n*Total:* ${sewa.length}\n\n`
    let data_array = [];
    for (let x of sewa) {
        ////addCountCmd(`${prefix}listsewa`, sender, _cmd)
        list_sewa_list += `*Name:* ${await getGcName(x.id)}\n*ID :* ${x.id}\n`
        if (x.expired === 'PERMANENT') {
            let ceksewa = 'PERMANENT'
            list_sewa_list += `*Expire :* PERMANENT\n\n`
        } else {
            let ceksewa = ms(x.expired - Date.now())
            list_sewa_list += `*Expire :* ${ceksewa.days} Hari ${ceksewa.hours} Jam ${ceksewa.minutes} Menit ${ceksewa.seconds} Detik\n\n`
        }
    }
    sock.sendMessage(from, { text: list_sewa_list }, { quoted: msg })
    break    

//antiwame
case prefix+'antiwame':
                                if (!isGroup) return reply(`Bot Hanya Respon Di Dalam Group`)
                                if (!isOwner && !fromMe && !isGroupAdmins) return reply(`Command ${command} Hanya Khusus Admin`)
                                if (!isBotGroupAdmins) return reply(`*Jadi Kan Bot Admin Sebelum Menggunakan Fitur Antilink*`)
                                if (args.length < 1) return reply(`Untuk Mengaktifkan Ketik 1\nContoh : ${prefix}antiwame 1\n\nUntuk Nonaktifkan Antiwame Ketik 0\nContoh : ${prefix}antiwame 0`)
                                if (Number(args[0]) === 1) {
                                if (isAntiWame) return reply('antiwame group sudah aktif')
                                antiwame.push(from)
                                fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
                                reply('Done Mengaktifkan antiwame Group✅')
                                sock.sendMessage(from, { text: `Perhatian kepada seluruh member antiwame aktif apabila anda mengirim link antiwame anda akan di kick dari group` })
                                } else if (Number(args[0]) === 0) {
                                if (!isAntiWame) return reply('Mode antiwame group sudah disable')
                                let anu1 = antiwame.indexOf(from)
                                antiwame.splice(anu1, 1)
                                fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
                                reply('Sukes menonaktifkan antiwame group di group ini ✔️')
                                } else {
                                reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
                                }
                                break

case prefix+'antilink':
                            if (!isGroup) return reply(`Bot Hanya Respon Di Dalam Group`)
                            if (!isOwner && !fromMe && !isGroupAdmins) return reply(`Command ${command} Hanya Khusus Admin`)
                            if (!isBotGroupAdmins) return reply(`*Jadi Kan Bot Admin Sebelum Menggunakan Fitur Antilink*`)
                            if (args.length < 1) return reply(`Untuk Mengaktifkan Ketik 1\nContoh : ${prefix}antilink 1\n\nUntuk Nonaktifkan Antilink Ketik 0\nContoh : ${prefix}antilink 0`)
                            if (Number(args[0]) === 1) {
                            if (isAntiLink) return reply('anti link group sudah aktif')
                            antilink.push(from)
                            fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
                            reply('Done Mengaktifkan Antilink Group✅')
                            sock.sendMessage(from, { text: `Perhatian kepada seluruh member anti link group aktif apabila anda mengirim link group anda akan di kick dari group` })
                            } else if (Number(args[0]) === 0) {
                            if (!isAntiLink) return reply('Mode anti link group sudah disable')
                            let anu1 = antilink.indexOf(from)
                            antilink.splice(anu1, 1)
                            fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
                            reply('Sukes menonaktifkan anti link group di group ini ✔️')
                            } else {
                            reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
                            }
                            break                                
//welcome left
case prefix+'welcome':
                if (!isGroup) return reply(mess.OnlyGrup)
			if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
			if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih 1 atau 0\n*Example :* #welcome tes 1`)
                if (args[1].toLowerCase() === '1'){
                    if (!isWelcome) return reply(`Udah aktif`)
                    welcome.push(from)
					fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
					reply('「 SUKSES 」Welcome Aktif')
                } else if (args[1].toLowerCase() === '0'){
                    let anu = welcome.indexOf(from)
                    welcome.splice(anu, 1)
                    fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
                    reply('「 SUKSES 」Welcome Nonaktif')
                } else {
                    reply(`Pilih 1 atau 0\n*Example :* #welcome 1`)
                }
                break
                case prefix+'left':
                    if (!isGroup) return reply(mess.OnlyGrup)
			if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
			if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih 1 atau 0\n*Example :* #left tes 1`)
                if (args[1].toLowerCase() === '1'){
                    if (!isLeft) return reply(`Udah aktif`)
                    left.push(from)
					fs.writeFileSync('./database/left.json', JSON.stringify(left))
					reply('「 SUKSES 」Left Aktif')
                } else if (args[1].toLowerCase() === '0'){
                    let anu = left.indexOf(from)
                    left.splice(anu, 1)
                    fs.writeFileSync('./database/left.json', JSON.stringify(left))
                    reply('「 SUKSES 」Left Nonaktif')
                } else {
                    reply(`Pilih 1 atau 0\n*Example :* #left 1`)
                }
                break
                case prefix+'setwelcome':
                    if (!isGroup) return reply(mess.OnlyGrup)
                    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                    if (!q) return reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @nama, Selamat datang di @grup`)
                    if (isSetWelcome(chats, from, set_welcome_db)) return reply(`Sudah Ada Setwelcone Sebelumnya`)
                    addSetWelcome(q, from, set_welcome_db)
                    //addCountCmd(`${prefix}setwelcome`, sender, _cmd)
                    reply(`Sukses Setwelcome!`)
                    break
         case prefix+'setleft':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`Gunakan dengan cara ${command} *teks_left*\n\n_Contoh_\n\n${command} Halo @nama, Selamat tinggal dari @grup`)
            if (isSetLeft(from, set_left_db)) return reply(`Sudah Ada Setleave Sebelumnya`)
            //addCountCmd(`${prefix}setleft`, sender, _cmd)
            addSetLeft(q, from, set_left_db)
            reply(`Sukses Setleave`)
            break
         
            case prefix+'updatewelcome':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!q) return reply(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @nama, Selamat datang di @grup`)
                if (isSetWelcome(from, set_welcome_db)) {
                    //addCountCmd(`${prefix}changewelcome`, sender, _cmd)
                    changeSetWelcome(q, from, set_welcome_db)
                    reply(`Sukses change set welcome teks!`)
                } else {
                    //addCountCmd(`${prefix}changewelcome`, sender, _cmd)
                    addSetWelcome(q, from, set_welcome_db)
                    reply(`Sukses Update Setwelcome`)
                }
                break
                case prefix+'updateleave':
                    case 'updateleft':
                        if (!isGroup) return reply(mess.OnlyGrup)
                        if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                        if (!q) return reply(`Gunakan dengan cara ${command} *teks_left*\n\n_Contoh_\n\n${command} Halo @nama, Selamat tinggal dari @grup`)
                        if (isSetLeft(from, set_left_db)) {
                            //addCountCmd(`${prefix}updateleft`, sender, _cmd)
                            changeSetLeft(q, from, set_left_db)
                            reply(`Sukses Update Setleave`)
                        } else {
                            //addCountCmd(`${prefix}updateleft`, sender, _cmd)
                            addSetLeft(q, from, set_left_db)
                            reply(`Sukses Update Setleave`)
                        }
                        break

// Search Menu
case prefix+'nickff':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!q) return reply(`Gunakan dengan cara ${prefix + command} *id*\n\n_Contoh_\n\n${command} 646675175`)
            axios.get(`https://api.lolhuman.xyz/api/freefire/${q}?apikey=${apikey}`)
            .then(({data}) => {
            let epep = `${data.result}`
            reply(epep)
            })
            .catch((err) => {
            console.log(color('[ ERROR ]', 'red'), err)
            reply(mess.error.api)
            sock.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
            })
            break
case prefix+'nickml':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!q) return reply(`Gunakan dengan cara ${prefix + command} *id*\n\n_Contoh_\n\n${command} 95716788 2504`)
    let data = qs.stringify({
        'user_id': args[0],
        'zone_id': args[1] 
      });
      let config = {
        method: 'post',
        url: 'https://www.smile.one/merchant/mobilelegends/checkrole/',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        data : data
      };
      
      axios(config)
      .then(({data}) => {
      let epep = `${data.username}
      `;
      reply(epep)
      })
      .catch((err) => {
      console.log(err);
      });
  break
        case prefix+'nickpubg':
        if (!isGroup) return reply(mess.OnlyGrup)
            if (!q) return reply(`Gunakan dengan cara ${prefix + command} *id*\n\n_Contoh_\n\n${command} 5217933016`)
            axios.get(`https://api.lolhuman.xyz/api/pubg/${q}?apikey=${apikey}`)
            .then(({data}) => {
            let pubg = `${data.result}`
            reply(pubg)
            })
            .catch((err) => {
                console.log(color('[ ERROR ]', 'red'), err)
                reply(mess.error.api)
                sock.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
            })
            break
        case prefix+'nickdomino':
        if (!isGroup) return reply(mess.OnlyGrup)
            if (!q) return reply(`Gunakan dengan cara ${prefix + command} *id*\n\n_Contoh_\n\n${command} 291756557`)
            axios.get(`https://api.lolhuman.xyz/api/higghdomino/${q}?apikey=${apikey}`)
            .then(({data}) => {
            let domino = `${data.result}`
            reply(domino)
            })
            .catch((err) => {
                console.log(color('[ ERROR ]', 'red'), err)
                reply(mess.error.api)
                sock.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
            })
            break                        

//open & close
case prefix+'open': case prefix+'buka':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
    sock.groupSettingUpdate(from, 'not_announcement')
    .then((res) => {
    let opengc = `Mari berdoa bersama
"Ya Tuhan, sesungguhnya aku memohon kepada-Mu agar melimpahkan rezeki kepadaku berupa rezeki yang halal, luas, dan tanpa susah payah, tanpa memberatkan, tanpa membahayakan, dan tanpa rasa lelah dalam memperolehnya. Sesungguhnya Engkau berkuasa atas segala sesuatu."
Aamiin`
    const tettOpen = getTextSetOpen(from, set_open);
    if (tettOpen !== undefined) {
    mentions(tettOpen.replace('admin', sender.split("@")[0]).replace('@jam', jam).replace('@tanggal', tanggal), [sender], true);
    } else {
    mentions(opengc, [sender], true)
    }
    })
    break

case prefix+'close': case prefix+'tutup':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
    sock.groupSettingUpdate(from, 'announcement')
    .then((res) => {
    let closegc = `Terimakasih kepada teman teman semuanya,kalian adalah orang orang hebat, mari berdoa bersama 
"Segala Puji Bagi Tuhan yang telah memberi rezeki kepadaku dengan tidak ada daya dan kekuatan bagiku, Ya Tuhan, semoga Engkau senantiasa memberi berkah pada rezekiku."  aamiin sampai jumpa esok`
    const textClose = getTextSetClose(from, set_close);
    if (textClose !== undefined) {
    mentions(textClose.replace('admin', sender.split("@")[0]).replace('@jam', jam).replace('@tanggal', tanggal), [sender], true);
    } else {
    mentions(closegc, [sender], true)
    }
    })
    .catch((err) => reply('Error'))
    break

case prefix+'setopen':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_open*\n\n_Contoh_\n\n${command} Group telah di buka`)
    if (isSetOpen(from, set_open)) return reply(`Set Open already active`)
    addSetOpen(q, from, set_open)
    reply(`Successfully set Open!`)
    break
case prefix+'updateopen':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_open*\n\n_Contoh_\n\n${command} Group telah di buka`)
    if (isSetOpen(from, set_open)) {
        changeSetOpen(q, from, set_open)
        reply(`Sukses change set Open teks!`)
    } else {
        addSetOpen(q, from, set_open)
        reply(`Sukses change set Open teks!`)
    }
    break
case prefix+'delsetopen':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isSetOpen(from, set_open)) return reply(`Belum ada set Open di sini..`)
    removeSetOpen(from, set_open)
    reply(`Sukses delete set Open`)
    break
case prefix+'setclose':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_close*\n\n_Contoh_\n\n${command} Group telah di tutup`)
    if (isSetClose(from, set_close)) return reply(`Set Close already active`)
    addSetClose(q, from, set_close)
    reply(`Successfully set Close!`)
    break
case prefix+'updateclose':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!q) return reply(`Gunakan dengan cara ${command} *teks_close*\n\n_Contoh_\n\n${command} Group telah di tutup`)
    if (isSetClose(from, set_close)) {
        changeSetClose(q, from, set_close)
        reply(`Sukses change set Close teks!`)
    } else {
        addSetClose(q, from, set_close)
        reply(`Sukses change set Close teks!`)
    }
    break
case prefix+'delsetclose':
    if (!isGroup) return reply(mess.OnlyGrup)
    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
    if (!isSetClose(from, set_close)) return reply(`Belum ada set Close di sini..`)
    removeSetClose(from, set_close)
    reply(`Sukses delete set Close`)
    break

//linkgc dll
case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                var url = await sock.groupInviteCode(from).catch(() => reply(mess.error.api))
                url = 'https://chat.whatsapp.com/'+url
                reply(url)
                break

                case prefix+'setppgrup': case prefix+'setppgc':
                    if (!isGroup) return reply(mess.OnlyGrup)
                    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                    if (isImage || isQuotedImage) {
                    //addCountCmd(`${prefix}setppgrup`, sender, _cmd)
                    var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
                    if (args[0] == '\'panjang\'') {
                        var { img } = await generateProfilePicture(media)
                        await sock.query({
                            tag: 'iq',
                            attrs: {
                                to: from,
                                type:'set',
                                xmlns: 'w:profile:picture'
                            },
                            content: [
                            {
                                tag: 'picture',
                                attrs: { type: 'image' },
                                content: img
                            } 
                            ]
                        })
                        fs.unlinkSync(media)
                        reply(`Sukses`)
                    } else {
                        await sock.updateProfilePicture(from, { url: media })
                        .then( res => {
                            reply(`Sukses`)
                            fs.unlinkSync(media)
                        }).catch(() => reply(mess.error.api))
                    }
                    } else {
                        reply(`Kirim/balas gambar dengan caption ${command}`)
                    }
                    break
                case prefix+'setnamegrup': case prefix+'setnamegc': case prefix+'setname':
                    if (!isGroup) return reply(mess.OnlyGrup)
                    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                    if (args.length < 0) return reply(`Gunakan dengan cara ${command} *text*\n\n_Contoh_\n\n${command} Support ${ownerName}`)
                    //addCountCmd(`${prefix}setnamegc`, sender, _cmd)
                    await sock.groupUpdateSubject(from, q)
                    .then( res => {
                        reply(`Sukses`)
                    }).catch(() => reply(mess.error.api))
                    break
                case prefix+'setdesc': case prefix+'setdescription':
                    if (!isGroup) return reply(mess.OnlyGrup)
                    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                    if (args.length < 0) return reply(`Gunakan dengan cara ${command} *text*\n\n_Contoh_\n\n${command} New Description by ${ownerName}`)
                    //addCountCmd(`${prefix}setdesc`, sender, _cmd)
                    await sock.groupUpdateDescription(from, q)
                    .then( res => {
                        reply(`Sukses`)
                    }).catch(() => reply(mess.error.api))
                    break

case prefix+'afk': 
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
              if (!isGroup) return 
              if (isAfkOn) return reply('Kalo Mau Afk Jangan Nimbrung di sini')
              const reason = q ? q : '*No Pesan*'
              afkg.addAfkUser(sender, time, reason, _afks)
              const aluty = `${pushname} afk dengan alasan ${reason}`
              //sock.sendMessage(from, aluty, text)
              sock.sendMessage(from, { text: aluty }, { quoted: m });
              break

case prefix+'promote':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isGroupAdmins) return reply(mess.GrupAdmin)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (mentionUser.length !== 0) {
            ////addCountCmd(`${prefix}promote`, sender, _cmd)
            sock.groupParticipantsUpdate(from, [mentionUser[0]], "promote")
            .then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`, [mentionUser[0]], true) })
            .catch(() => reply(mess.error.api))
        } else if (m.isQuotedMsg) {
            ////addCountCmd(`${prefix}promote`, sender, _cmd)
            sock.groupParticipantsUpdate(from, [m.quotedMsg.sender], "promote")
            .then( res => { mentions(`Sukses menjadikan @${m.quotedMsg.sender.split("@")[0]} sebagai admin`, [m.quotedMsg.sender], true) })
            .catch(() => reply(mess.error.api))
        } else {
            reply(`Tag atau balas pesan member yang ingin dijadikan admin`)
        }
        break
    case prefix+'demote':
        if (!isGroup) return reply(mess.OnlyGrup)
        if (!isGroupAdmins) return reply(mess.GrupAdmin)
        if (!isBotGroupAdmins) return reply(mess.BotAdmin)
        if (mentionUser.length !== 0) {
            ////addCountCmd(`${prefix}demote`, sender, _cmd)
            sock.groupParticipantsUpdate(from, [mentionUser[0]], "demote")
            .then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`, [mentionUser[0]], true) })
            .catch(() => reply(mess.error.api))
        } else if (m.isQuotedMsg) {
            ////addCountCmd(`${prefix}demote`, sender, _cmd)
            sock.groupParticipantsUpdate(from, [m.quotedMsg.sender], "demote")
            .then( res => { mentions(`Sukses menjadikan @${m.quotedMsg.sender.split("@")[0]} sebagai member biasa`, [m.quotedMsg.sender], true) })
            .catch(() => reply(mess.error.api))
        } else {
            reply(`Tag atau balas pesan admin yang ingin dijadikan member biasa`)
        }
        break

//menudownload
//menudownload

case prefix+'ytplay':
    if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
    if (args.length == 0) return await reply(`Example: ${prefix + command} melukis senja`)
    axios
        .get(`https://zenzapis.xyz/downloader/ytplay?apikey=2ee5342399&query=${full_args}`)
        .then(({ data }) => {
            
                var caption = `❖ Title    : *${data.result.title}*\n`
                caption += `❖ Size     : *${data.result.sizeAudio}*`
                sock.sendMessage(from, { image: { url: data.result.thumb }, caption }).then(() => {
                    sock.sendMessage(from, { audio: { url: data.result.getAudio }, mimetype: 'audio/mp4', fileName: `${data.result.title}.mp3`, ptt: true })
                })
            })
        .catch(console.error)
    break
case prefix+'ytmp3':
    if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
        if (args.length == 0) return reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
        axios
            .get(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${apikey}&url=${args[0]}`)
            .then(({ data }) => {
                var caption = `❖ Title    : *${data.result.title}*\n`
                caption += `❖ Size     : *${data.result.size}*`
                sock.sendMessage(from, { image: { url: data.result.thumbnail }, caption }).then(() => {
                    sock.sendMessage(from, { audio: { url: data.result.link }, mimetype: 'audio/mp4', fileName: `${data.result.title}.mp3`, ptt: true })
                })
            })
            .catch(console.error)
    break
 case prefix+'tiktok':
    if (!isPremium) return reply(`Fitur ini hanya untuk premium user.Jika ingin daftar user premium ketik ${prefix}daftarprem`)
    if (args.length == 0) return reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`)
    axios.get(`https://api.lolhuman.xyz/api/tiktok?apikey=${apikey}&url=${args[0]}`).then(({ data }) => {
        sock.sendMessage(from, { video: { url: data.result.link }, mimetype: 'video/mp4' })
    })
    break
case prefix+'igdl':
    if (!isPremium) return reply(`Fitur ini hanya untuk premium user.Jika ingin daftar user premium ketik ${prefix}daftarprem`)
    if (args.length == 0) return reply(`Example: ${prefix + command} https://www.instagram.com/p/CJ8XKFmJ4al/?igshid=1acpcqo44kgkn`)
    axios.get(`https://zenzapis.xyz/downloader/instagram?apikey=2ee5342399&url=${args[0]}`).then(({ data }) => {
        sock.sendMessage(from, { video: { url: data.result }, mimetype: 'video/mp4' })
    })
    break
case prefix+'spotify':
    if (!isPremium) return reply(`Fitur ini hanya untuk premium user.Jika ingin daftar user premium ketik ${prefix}daftarprem`)
            if (args.length == 0) return reply(`Example: ${prefix + command} https://open.spotify.com/track/0ZEYRVISCaqz5yamWZWzaA`)
            axios.get(`https://api.lolhuman.xyz/api/spotify?apikey=${apikey}&url=${args[0]}`).then(({ data }) => {
                var caption = `Title : ${data.result.title}\n`
                caption += `Artists : ${data.result.artists}\n`
                caption += `Duration : ${data.result.duration}\n`
                caption += `Popularity : ${data.result.popularity}\n`
                caption += `Preview : ${data.result.preview_url}\n`
                sock.sendMessage(from, { image: { url: data.result.thumbnail }, caption }).then(() => {
                    sock.sendMessage(from, { audio: { url: data.result.link }, mimetype: 'audio/mp4', fileName: `${data.result.title}.mp3`, ptt: true })
                })
            })
            break
case prefix+'twtdl':
    if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
            if (args.length == 0) return reply(`Example: ${prefix + command} https://twitter.com/gofoodindonesia/status/1229369819511709697`)
            axios.get(`https://api.lolhuman.xyz/api/twitter?apikey=${apikey}&url=${args[0]}`).then(({ data }) => {
                sock.sendMessage(from, { video: { url: data.result.link[data.result.link.length - 1].link }, mimetype: 'video/mp4' })
            })
            break
case prefix+'fbdl':
            if (args.length == 0) return reply(`Example: ${prefix + command} https://id-id.facebook.com/SamsungGulf/videos/video-bokeh/561108457758458/`)
            axios.get(`https://api.lolhuman.xyz/api/facebook?apikey=${apikey}&url=${args[0]}`).then(({ data }) => {
                sock.sendMessage(from, { video: { url: data.result }, mimetype: 'video/mp4' })
            })
            break
  
case prefix+'pinterestdl':
            if (args.length == 0) return reply(`Example: ${prefix + command} https://id.pinterest.com/pin/696580267364426905/`)
            axios.get(`https://api.lolhuman.xyz/api/pinterestdl?apikey=${apikey}&url=${args[0]}`).then(({ data }) => {
                sock.sendMessage(from, { image: { url: data.result[0] } })
            })
            break

//addprem dll
case prefix+'addprem':
if (!isOwner) return reply('only owner')
                if (args.length < 2) return reply(`Penggunaan :\n*${command}* @tag waktu\n*${command}* nomor waktu\n\nContoh:\n*${command}* @tag 30d\n*{command}* 628953xxx 30d`)
                if (mentioned.length !== 0) {
                    _premium.addPremiumUser(mentioned[0], args[2], premium)
                    reply('Sukses')
                } else {
                    _premium.addPremiumUser(args[1] + '@s.whatsapp.net', args[2], premium)
                    reply('Sukses')
                }
                break

case prefix+'cekpremium':
    if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
    let cekExp = ms(_premium.getPremiumExpired(sender, premium) - Date.now())
    let premm = `*「 PREMIUM EXPIRE 」*\n\n➸ *ID*: ${sender}\n➸ *Premium left*: ${cekExp.days} day(s) ${cekExp.hours} hour(s) ${cekExp.minutes} minute(s)`
    reply(premm)
    break

             case prefix+'listprem':
                if (!isPremium) return reply('only owner')
                let txt = `List Premium User\nJumlah : ${premium.length}\n\n`
                let men = [];
                for (let i of premium) {
                    men.push(i.id)
                    let cekvippp = ms(i.expired - Date.now())
                    txt += `ID : @${i.id.split("@")[0]}\n*Expired :* ${cekvippp.days} day(s) ${cekvippp.hours} hour(s) ${cekvippp.minutes} minute(s) ${cekvippp.seconds} second(s)\n\n`
                }
                mentions(txt, men, true)
                break
case prefix+'delprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${command}* @tag\n*${command}* nomor\n\nContoh:\n*${command}* @tag\n*${command}* 62855xxx`)
                if (mentioned.length !== 0) {
                    for (let i = 0; i < mentioned.length; i++) {
                        premium.splice(_premium.getPremiumPosition(mentioned[i], premium), 1)
                        fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    }
                    reply('Sukses')
                } else {
                    premium.splice(_premium.getPremiumPosition(args[1] + '@s.whatsapp.net', premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                }
                break
case prefix+'cekprem': 
if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
                let cekpr = [];
                for (let i of premium) {
                    cekpr.push(i.id)
                    let cekvippp = ms(i.expired - Date.now())
                    txt += `ID : @${i.id.split("@")[0]}\n*Expired :* ${cekvippp.days} day(s) ${cekvippp.hours} hour(s) ${cekvippp.minutes} minute(s) ${cekvippp.seconds} second(s)\n\n`
                }
                mentions(txt, men, true)
                break   

//menu gabut
case prefix+'memeindo':

        if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
            sock.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/meme/memeindo?apikey=${apikey}` } })
            break
        case prefix+'darkjokes':
        
        if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
            sock.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/meme/darkjoke?apikey=${apikey}` } })
            break
        case prefix+'meme':
        
        if (!isPremium) return reply(`Fitur ini hanya untuk premium user. Jika ingin daftar user premium ketik ${prefix}daftarprem`)
            sock.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/random/meme?apikey=${apikey}` } })
            break                

//game 
case prefix+'caklontong':

if (isPlayGame(from, caklontong)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/caklontong.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*CAK LONTONG*\n`+monospace(`Soal : ${kukus.soal}\nWaktu : ${gamewaktu}s`)
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Cak Lontong', jawab, gamewaktu, res, caklontong)
let ane = Number(parseInt(args[1]) * 1)
})

break
case prefix+'susunkata':

if (isPlayGame(from, susunkata)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/susunkata.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*SUSUN KATA*\nSoal : ${kukus.soal}\nTipe : ${kukus.tipe}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Susun Kata', jawab, gamewaktu, res, susunkata)

})

break
case prefix+'siapakahaku':

if (isPlayGame(from, siapakahaku)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/siapakahaku.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*SUSUN KATA*\nSoal : ${kukus.soal}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Siapakah Aku', jawab, gamewaktu, res, siapakahaku)

})

break
case prefix+'tebakkalimat':

if (isPlayGame(from, tebakkalimat)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/tebakkalimat.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*TEBAK KALIMAT*\nSoal : ${kukus.soal}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Tebak Kalimat', jawab, gamewaktu, res, tebakkalimat)

})

break
case prefix+'tebakkata':

if (isPlayGame(from, tebakkata)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/tebakkata.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*TEBAK KATA*\nSoal : ${kukus.soal}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Tebak Kalimat', jawab, gamewaktu, res, tebakkata)

})

break
case prefix+'tebaklirik':

if (isPlayGame(from, tebakkimia)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/tebaklirik.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*TEBAK LIRIK*\nSoal : ${kukus.soal}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Tebak Kimia', jawab, gamewaktu, res, tebakkimia)

})

break
case prefix+'tebaktebakan':

if (isPlayGame(from, tebaktebakan)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/tebaktebakan.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*TEBAK TEBAKAN*\nSoal : ${kukus.soal}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Tebak Kimia', jawab, gamewaktu, res, tebaktebakan)

})

break
case prefix+'tekateki':

if (isPlayGame(from, tekateki)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/tekateki.json'))
var kukus = pickRandom(soal)
kukus.jawaban = kukus.jawaban.split('Jawaban ').join('')
var teks = `*TEBAK TEBAKAN*\nSoal : ${kukus.soal}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, {text: teks}, {quoted: msg })
.then( res => {
var jawab = kukus.jawaban.toLowerCase()
addPlayGame(from, 'Teka Teki', jawab, gamewaktu, res, tekateki)

})

break
case prefix+'tebakgambar':

if (isPlayGame(from, tebakgambar)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/tebakgambar.json'))
var dataa = pickRandom(soal)
dataa.jawaban = dataa.jawaban.split('Jawaban ').join('')
var teks = `*TEBAK GAMBAR*\nPetunjuk : ${dataa.deskripsi}\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, { image: { url: dataa.img }, caption: teks }, { quoted: msg })
.then( res => {
var jawab = dataa.jawaban.toLowerCase()
addPlayGame(from, 'Tebak Gambar', jawab, gamewaktu, res, tebakgambar)

})

break
case prefix+'tebakgame':

if (isPlayGame(from, tebakgame)) return reply(`Masih ada game yang belum diselesaikan`)
var soal = JSON.parse(fs.readFileSync('./media/GAMES/tebakgame.json'))
var dataa = pickRandom(soal)
dataa.jawaban = dataa.jawaban.split('Jawaban ').join('')
var teks = `*TEBAK GAME*\nWaktu : ${gamewaktu}s`
sock.sendMessage(from, { image: { url: dataa.img }, caption: teks }, { quoted: msg })
.then( res => {
var jawab = dataa.jawaban.toLowerCase()
addPlayGame(from, 'Tebak Game', jawab, gamewaktu, res, tebakgame)

})

break

//SETBOT
case prefix+'setbot':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`*Ini Hanya Contoh*\n${prefix}setbot Halo Silahkan Ketik #menu Untuk Melihat List Di Group Ini`)
            if (isSetBot(from, set_bot)) return reply(`Sudah Ada Setbot Sebelumnya`)
            //addCountCmd(`${prefix}setbot`, sender, _cmd)
            addSetBot(q, from, set_bot)
            reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            break
        case prefix+'changebot': case prefix+'updatesetbot': case prefix+'upsetbot':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!q) return reply(`*Ini Hanya Contoh*\n${prefix}updatesetbot Hai Kak Silahkan Ketik #menu Untuk Melihat List`)
            //addCountCmd(`${prefix}changebot`, sender, _cmd)
            if (isSetBot(from, set_bot)) {
                changeSetBot(q, from, set_bot)
                reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            } else {
                addSetBot(q, from, set_bot)
                reply(`「 SUKSES 」 Contoh keluaran : ${q}`)
            }
            break
        case prefix+'delsetbot': case prefix+'delsetb':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!isSetBot(from, set_bot)) return reply(`Belum ada setbot di sini..`)
            //addCountCmd(`${prefix}delsetbot`, sender, _cmd)
            removeSetBot(from, set_bot)
            reply(`Sukses Delete Respon Bot`)
            break

case 'bot' : {
if (!isGroup) return 
const getTextBot = getTextSetBot(from, set_bot);
if (getTextBot !== undefined) {
sock.sendMessage(from, { text: getTextBot })
} else {
sock.sendMessage(from, { text: `Oh Iya Kak Ada Apa Memanggil Saya Silahkan Ketik *.list* Untuk Melihat List Grup` })
}
}
break


 case prefix+'menu': case prefix+'help':
 
// send a list message!
const sections = [
    {
	title: `Hallo ${pushname}`,
	rows: [
	    {title: "𝗠𝗘𝗡𝗨 𝗦𝗧𝗢𝗥𝗘", rowId: "#menustore", description: "ᴍᴇɴᴀᴍᴘɪʟᴋᴀɴ ᴍᴇɴᴜ sᴛᴏʀᴇ"},
	    {title: "𝗠𝗘𝗡𝗨 𝗚𝗥𝗢𝗨𝗣", rowId: "#menugroup", description: "ᴍᴇɴᴀᴍᴘɪʟᴋᴀɴ ᴍᴇɴᴜ ɢʀᴏᴜᴘ"},
	    {title: "𝗠𝗘𝗡𝗨 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗", rowId: "#menudownload", description: "ᴍᴇɴᴀᴍᴘɪʟᴋᴀɴ ᴍᴇɴᴜ ᴅᴏᴡɴʟᴏᴀᴅ"},
	    {title: "𝗠𝗘𝗡𝗨 𝗚𝗔𝗕𝗨𝗧", rowId: "#menugabut", description: "ᴍᴇɴᴀᴍᴘɪʟᴋᴀɴ ᴍᴇɴᴜ ɢᴀʙᴜᴛ"},
	    {title: "𝗠𝗘𝗡𝗨 𝗚𝗔𝗠𝗘", rowId: "#menugame", description: "ᴍᴇɴᴀᴍᴘɪʟᴋᴀɴ ᴍᴇɴᴜ ɢᴀᴍᴇ"}
	]
    },
]

const listMessage = {
  text: `${runmek}`,
  buttonText: "Click here!",
  sections
}

const tah = await sock.sendMessage(from, listMessage, {quoted : fkon})
break

case prefix+'database':
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var listdata = await fs.readFileSync('./database/list-message.json')
sock.sendMessage(from, { document: listdata, mimetype: 'document/application', fileName: 'list-message.json'}, {quoted:msg})
break

///// cek owner /////// cek sewa owner////


////////// CHANGE APIGAMES ///////// | YANG NYOLONG SC KEK KONTOL | NEXTSTORE 


}
}
