'use strict';
var debug = require('debug')('expiry');

var is = require('is2');

// holds the keyes and optional values
// if no value is desired, the value is undefined
var GlobalObj = {};

// holds the timers
var GlobalTimers = {};

// holds the calbacks
var GlobalCallbacks = {};

var defaultTimeoutMs = 30000;   // 30 second default
var errStr = ' requires string for argument "key", received: ';


/**
 * Set the default timeout. If no timeout is provided, this time is used.
 * Returns the new, or current default timeout, if no new timeout is given.
 */
function defaultTimer(timeInMs) {
    debug('defaultTimer: '+timeInMs);
    debug('defaultTimer: '+typeof timeInMs);
    if (is.positiveInt(timeInMs))
        defaultTimeoutMs = timeInMs;
    return defaultTimeoutMs;
}

// 'key'
// 'key', timeOutMs
// 'key', timeOutMs, timeOutCb
function addKey(key) {
    if (!is.nonEmptyStr(key))
        throw new Error('addKey' + errStr + key);
    var args = Array.prototype.slice.call(arguments);
    args = _handleAddArgs(args);
    debug('args',args);
}

// 'key', 'val'
// 'key', 'val', timeOutMs
// 'key', 'val', timeOutMs, timeoutCb
function addKeyValue(key, val) {
    if (!is.nonEmptyStr(key))
        throw new Error('addKeyValue' + errStr + key);
    var errValStr = ' requires string for argument "val", received: ';
    if (!is.nonEmptyStr(key))
        throw new Error(arguments.callee.name + errValStr + key);
    var args = Array.prototype.slice.call(arguments);
    args = _handleAddArgs(args, val);
    //debug('GlobalObj['+key+'] = ', GlobalObj[key]);
    debug('args',args);
}

function rmKey(key) {
    if (!is.nonEmptyStr(key))
        throw new Error('rmKey' + errStr + key);
    if (!GlobalObj[key])
        throw new Error('rmKey: no such key "'+key+' exists.');
    // remove the old timer, if it exists
    if (GlobalTimers[key])
        clearTimeout(GlobalTimers[key]);
    // remove the key and optional value from the object
    if (GlobalObj[key])
        delete GlobalObj[key];
    if (GlobalCallbacks[key])
        delete GlobalCallbacks[key];
}

// 'key'
// 'key', timeoutMs
function resetTimer(key) {
    if (!is.nonEmptyStr(key))
        throw new Error('resetTimer' + errStr + key);
    if (!GlobalObj[key])
        throw new Error('resetTimer: no such key "'+key+' exists.');
    if (!GlobalCallbacks[key])
        throw new Error('resetTimer: no callback for key "'+key+'" exists.');
    var timeoutMs = defaultTimeoutMs;
    if (arguments.length > 1 && typeof arguments[1] === 'number')
        timeoutMs = Math.floor(arguments[1]);
    if (GlobalTimers[key]) {
        clearTimeout(GlobalTimers[key]);
        GlobalTimers[key] = setTimeout(GlobalCallbacks[key], timeoutMs);
    }
}


module.exports = {
    obj: GlobalObj,
    defaultTimer: defaultTimer,
    addKey: addKey,
    addKeyValue: addKeyValue,
    rmKey: rmKey,
    resetTimer: resetTimer
};



/*
expiryProp.defaultTimer(timeOutMs, defaultTimeOutCb);
expiryProp.addKey('key', timeOutMs, timeOutCb);
expiryProp.addKeyValue('key', 'value', timeOutMs, timeOutCb);
expiryProp.rmKey('key');
expiryProp.resetTimer('key', timeOutMs);
*/




function _handleAddArgs(args, value) {
    var argObj = {
        timeoutMs: defaultTimeoutMs,
        timeoutCb: function() {
            delete GlobalObj[args[0]];
            delete GlobalTimers[args[0]];
        }
    };

    //debug('arguments', arguments);
    debug('arguments.length', arguments.length);

    if (args.length > 1) {
        if (is.positiveInt(args[1])) {
            debug('ooo');
            debug(args[1]);
            argObj.timeoutMs = Math.floor(args[1]);
            debug('Set argObj.timeoutMs '+argObj.timeoutMs);
        }
        if (is.func(args[1]))
            argObj.timeoutCb = args[1];
    }
    if (args.length > 2) {
        if (is.func(args[2])) {
            debug('Setting timeout cb!');
            argObj.timeoutCb = function() {
                delete GlobalObj[args[0]];
                delete GlobalTimers[args[0]];
                args[2]();
            };
        }
        if (is.positiveInt(args[2])) {
            argObj.timeoutMs = Math.floor(args[2]);
            debug('Set argObj.timeoutMs '+argObj.timeoutMs);
        }
    }
    if (args.length > 3) {
        if (is.func(args[3])) {
            debug('Setting timeout cb!');
            argObj.timeoutCb = function() {
                delete GlobalObj[args[0]];
                delete GlobalTimers[args[0]];
                args[3]();
            };
        }
    }

    // remove the old timer, if it exists
    if (GlobalTimers[args[0]])
        clearTimeout(GlobalTimers[args[0]]);

    // create property with value 'undefined'
    if (typeof value === 'undefined') {
        debug('Value was undefined');
        GlobalObj[args[0]] = undefined;
    } else {
        debug('Value was DEFINED');
        GlobalObj[args[0]] = value;
    }
    // set timeout on GlobalTimers
    GlobalTimers[args[0]] = setTimeout(argObj.timeoutCb, argObj.timeoutMs);
    debug('Set timeout in: '+argObj.timeoutMs);
    // save CB for resets
    GlobalCallbacks[args[0]] = argObj.timeoutCb;
    return argObj;
}
