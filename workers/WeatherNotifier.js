/**
 * @project mecha_ssanjun_bot
 * Created by ssanjun on 2016. 7. 14..
 */

require('../config');

const USER_ID = process.env.USER_ID;

const WeatherController = require('../controllers/WeatherController');
const wc = new WeatherController();

if (!process.env.USER_ID) {
    console.error('USER_ID is not defined');
    console.error('export USER_ID=xxx');
    process.exit(0);
}


class WeatherNotifier {
    constructor(tg) {
        this.tg = tg;
    }
    
    send() {
        Promise.all([
            // wc.getWeatherMessage(),
            wc.getNaverWather(),
            wc.getFineDustMessage(),
            wc.getUltraFindDustMessage()
        ]).then((message) => {
            // this.tg.api.sendMessage(USER_ID, message[0], { parse_mode: 'Markdown' });
            this.tg.api.sendPhoto(USER_ID, {path: message[0].filepath});
            
            this.tg.api.sendMessage(USER_ID, message[1], { parse_mode: 'Markdown' });
            this.tg.api.sendMessage(USER_ID, message[2], { parse_mode: 'Markdown' });
        });
    }
}

module.exports = WeatherNotifier;