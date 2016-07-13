/**
 * @project mecha_ssanjun_bot
 * Created by ssanjun on 2016. 7. 13..
 */

'use strict';

require('../config');
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const request = require('request');
const parseString = require('xml2js').parseString;

const SEOUL_OPENINF_FINEDUST_TOKEN = process.env.SEOUL_OPENINF_FINEDUST_TOKEN;
const SEOUL_OPENINF_ULTRAFINEDUST_TOKEN = process.env.SEOUL_OPENINF_ULTRAFINEDUST_TOKEN;


class WeatherController extends TelegramBaseController {
    getFineDustMessage() {
        // http://openAPI.seoul.go.kr:8088/(인증키)/xml/ForecastWarningMinuteParticleOfDustService/1/1/
        const url = 'http://openAPI.seoul.go.kr:8088/'+SEOUL_OPENINF_FINEDUST_TOKEN+'/json/ForecastWarningMinuteParticleOfDustService/1/1/';

        return new Promise((resolve, reject) => {
            request(url, (requestError, response, body) => {
                if (requestError) return reject(requestError);
                resolve(JSON.parse(body));
            });
        }).then((result) => {
            const data = result.ForecastWarningMinuteParticleOfDustService.row[0];
            let message = [
                '*미세먼지*',
                '*수치* : ' + data.POLLUTANT,
                '*농도* : ' + data.CAISTEP,
                '*활동* : ' + data.ALARM_CNDT
            ];

            return message.join('\n');
        }).catch((err) => console.log(err));
    }
    
    fineDustHandler($) {
        this.getFineDustMessage().then((message) => {
            this.send($, message);
        });
    }

    getUltraFindDustMessage() {
        // http://openapi.seoul.go.kr:8088/(인증키)/xml/ForecastWarningUltrafineParticleOfDustService/1/5/

        const url = 'http://openAPI.seoul.go.kr:8088/'+SEOUL_OPENINF_ULTRAFINEDUST_TOKEN+'/json/ForecastWarningUltrafineParticleOfDustService/1/5/';

        return new Promise((resolve, reject) => {
            request(url, (requestError, response, body) => {
                if (requestError) return reject(requestError);
                resolve(JSON.parse(body));
            });
        }).then((result) => {
            const data = result.ForecastWarningUltrafineParticleOfDustService.row[0];
            let message = [
                '*초미세먼지*',
                '*수치* : ' + data.POLLUTANT,
                '*농도* : ' + data.CAISTEP,
                '*활동* : ' + data.ALARM_CNDT
            ];

            return message.join('\n');
        }).catch((err) => console.log(err));
    }

    ultraFineDustHandler($) {
        this.getUltraFindDustMessage().then((message) => {
            this.send($, message);
        });
    }

    getWeatherMessage() {
        // http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109
        // const url = 'http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109';
        const url = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1141056500';
        return new Promise((resolve, reject) => {
            request(url, (requestError, response, body) => {
                if (requestError) return reject(requestError);
                parseString(body, (parseError, result) => {
                    if (parseError) return reject(parseError);
                    resolve(result);
                })
            });
        }).then((result) => {
            const channel = result.rss.channel[0];
            const item = channel.item[0];

            const pubDate = channel.pubDate;
            const title = channel.title;

            const data = item.description[0].body[0].data;
            const weatherList = [];
            const weatherInfo = {};
            data.map((w) => {
                const weather = w;
                if (weather.day && weather.day[0] == '1') {
                    if (!weatherInfo.maxTemp) {
                        weatherInfo.maxTemp = parseFloat(weather.tmx[0]);
                    }
                    if (!weatherInfo.minTemp) {
                        weatherInfo.minTemp = parseFloat(weather.tmn[0]);
                    }
                    weatherList.push({
                        day: 1,
                        hour: Number(weather.hour[0]),
                        temp: parseFloat(weather.temp[0]),
                        desc: weather.wfKor[0],
                        rainProbability: Number(weather.pop[0])
                    });
                }
            });

            let message = [
                '*' + title + '*',
            ];
            weatherList.map((w) => {
                message.push(
                    '*' + w.hour + '시* : ' + w.temp + '℃, '+ w.rainProbability + '%, ' + w.desc
                );
            });

            return message.join('\n');
        }).catch((err) => console.log(err));
    }

    weatherHandler($) {
        this.getWeatherMessage().then((message) => {
            this.send($, message);
        });

        this.fineDustHandler($);
        this.ultraFineDustHandler($);
    }
    
    send($, message) {
        $.sendMessage(message, { parse_mode: 'Markdown' });
    }

    get routes() {
        return {
            '/미세먼지': 'fineDustHandler',
            '/초미세먼지': 'fineDustHandler',
            '/날씨': 'weatherHandler'
        }
    }
}

module.exports = WeatherController;