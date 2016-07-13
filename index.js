/**
 * @project Mecha_ssanjun_bot
 * Created by ssanjun on 2016. 7. 13..
 */

'use strict';

require('./config');

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const tg = new Telegram.Telegram(TELEGRAM_BOT_TOKEN);
const WeatherController = require('./controllers/WeatherController');

tg.router
    .when(['/미세먼지'], new WeatherController())
    .when(['/날씨'], new WeatherController());

console.info('Start @mecha_ssanjun_bot');