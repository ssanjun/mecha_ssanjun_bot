/**
 * @project mecha_ssanjun_bot
 * Created by ssanjun on 2016. 7. 14..
 */

process.env.TELEGRAM_BOT_TOKEN = '';
process.env.SEOUL_OPENINF_FINEDUST_TOKEN = '';
process.env.SEOUL_OPENINF_ULTRAFINEDUST_TOKEN = '';

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not defined');
    console.error('export TELEGRAM_BOT_TOKEN=xxx');
    process.exit(0);
}

if (!process.env.SEOUL_OPENINF_FINEDUST_TOKEN) {
    console.error('SEOUL_OPENINF_FINEDUST_TOKEN is not defined');
    console.error('export SEOUL_OPENINF_FINEDUST_TOKEN=xxx');
    process.exit(0);
}

if (!process.env.SEOUL_OPENINF_ULTRAFINEDUST_TOKEN) {
    console.error('SEOUL_OPENINF_ULTRAFINEDUST_TOKEN is not defined');
    console.error('export SEOUL_OPENINF_ULTRAFINEDUST_TOKEN=xxx');
    process.exit(0);
}