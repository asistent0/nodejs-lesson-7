/**
 * Created by asistent on 14.05.2016.
 */

var nconf = require('nconf');

nconf.argv().env().file({file: './config/config.json'});

module.exports = nconf;