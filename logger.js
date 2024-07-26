const log4js = require("log4js");


log4js.configure({
    appenders: {
        out: { type: "console" },
        // app: { type: "file", filename: "application.log" },
    },
    categories: { default: { appenders: ["out"], level: "debug" } },
});

const cauldronAuthLogger = log4js.getLogger('Cauldron Authenticator')


module.exports = { cauldronAuthLogger }