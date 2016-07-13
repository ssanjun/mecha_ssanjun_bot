/**
 * @project Mecha_ssanjun_bot
 * Created by ssanjun on 2016. 7. 13..
 */

'use strict';

require('./config');

const Telegram = require('telegram-node-bot');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const tg = new Telegram.Telegram(TELEGRAM_BOT_TOKEN);
const WeatherController = require('./controllers/WeatherController');

tg.router
    .when(['/미세먼지'], new WeatherController())
    .when(['/날씨'], new WeatherController());

const http = require('http');
const PORT = 3001;

const server = http.createServer((req, res) => {
    const worker = req.url.slice(1);
    try {
        const WeatherNotifier = require('./workers/' + worker);
        const wn = new WeatherNotifier(tg);
        wn.send();
        res.end('OK');
    } catch(e) {
        res.end(e.message);
    }
});

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
    console.info('Start @mecha_ssanjun_bot');
});

