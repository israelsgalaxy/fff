const TelegramBot = require("node-telegram-bot-api")
const mongodb = require("mongodb")
const dotenv = require("dotenv")

dotenv.config()

let TOKEN = process.env.TOKEN
let MONGO_URI = process.env.MONGO_URI
let ADMIN = parseInt(process.env.ADMIN)
let APP_URL = process.env.APP_URL

let client = new mongodb.MongoClient(MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

let bot = new TelegramBot(TOKEN, {
  webHook: {
    port: parseInt(process.env.PORT)
  }
})

bot.setWebHook(`${APP_URL}/bot${TOKEN}`)

client.connect((err) => {

  let users = client.db("FFF_unit").collection("Users")

  bot.on("message", (msg) => {

    if (err) {
      console.error(err)
      bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
      return
    }

    if (msg.text === "/start") {
      if (msg.from.id === ADMIN) {
        bot.sendMessage(msg.chat.id, `Hello Admin, what message would you like to broadcast today?`)
      } else {
        users.findOne({
          userId: msg.from.id
        })
          .then((doc) => {
            if (doc === null) {
              users.insertOne({
                userId: msg.from.id,
                chatId: msg.chat.id,
                firstName: msg.from.first_name
              })
            
              bot.sendMessage(msg.chat.id, `Hey ${ msg.from.first_name }\n\nSomeone probably sent you this link and guessss whattt\n\nYou actually started this bot !!!.... wow 😅😂🤣😱\n\nWhoever sent you this bot really LOVES YOU SHAAA\n\nWe literally prayed for you, and here you areeee.......🔥🔥🔥\n\nNow that you have this bot ACTIVATED, trust me your life is about to change.....\n\nJust stay tuned, you'll get super amazing updates from this bot.\n\nIf you ever, and I mean ever need someone to talk to about literally anything, send me a dm @tradewithbolu\n\nAnd, dont forget to share this link with someone using this link t.me/wordstudy_bot\n\nOnce again, welcome ${ msg.from.first_name }`)
            } else {
              bot.sendMessage(msg.chat.id, `Hey ${ doc.firstName }\n\nSomeone probably sent you this link and guessss whattt\n\nYou actually started this bot !!!.... wow 😅😂🤣😱\n\nWhoever sent you this bot really LOVES YOU SHAAA\n\nWe literally prayed for you, and here you areeee.......🔥🔥🔥\n\nNow that you have this bot ACTIVATED, trust me your life is about to change.....\n\nJust stay tuned, you'll get super amazing updates from this bot.\n\nIf you ever, and I mean ever need someone to talk to about literally anything, send me a dm @tradewithbolu\n\nAnd, dont forget to share this link with someone using this link t.me/wordstudy_bot\n\nOnce again, welcome ${ doc.firstName }`)
            }
          })
          .catch((err) => {
            console.error(err)
            bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
          })
      }
    } else {
      if (msg.from.id === ADMIN) {
        users.find()
          .forEach((user, err) => {
            if (err) {
              console.error(err)
              bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
              return
            }


            bot.sendMessage(user.chatId, msg.text.replace(/firstName/g, user.firstName))
          })
          .catch((err) => {
            console.error(err)
            bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
          })
      } else {
        bot.sendMessage(msg.chat.id, "Please no messages allowed.")
      }
    }
  })

  console.log("Bot working")
})