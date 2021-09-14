require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const { Client } = require('discord.js');

const YouTubeNotifier = require('youtube-notification');
const client = new Client({intents: []})

const channels = process.env.DISCORD_CHANNELS.split(',')

client.once('ready', () => {
    console.log('Connected to Discord')
})

client.login(process.env.BOT_TOKEN).catch((err) => {
    console.error(err)
})

const port = process.env.port || 3000

const notifier = new YouTubeNotifier({
    hubCallback: process.env.CALLBACK_URL,
    secret: uuidv4(),
    port,
});
notifier.setup()
console.log(`Listening on port: ${port}`)

notifier.on('subscribe', data => {
    console.log(`Subscribed to channel: ${data.channel}`)
})

notifier.on('notified', data => {
    channels.forEach(channel => {
        client.channels.fetch(channel).then(c => {
            if (c.isText()) {
                c.send(data.video.link).catch((err) => console.error(err))
            }
        })
    })
})

notifier.subscribe(process.env.YT_CHANNEL)
