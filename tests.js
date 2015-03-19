'use strict';
var assert = require('assert');
var expiry = require('./index');


describe('expiry.defaultTimer()', function() {
    it('should return the current timeout in MS when no arg exists', function() {
        assert.ok(expiry.defaultTimer() === 30000);
    });
});

describe('expiry.defaultTimer()', function() {
    it('should set the current timeout in MS to the supplied arguement', function() {
        assert.ok(expiry.defaultTimer() === 30000);
        assert.ok(expiry.defaultTimer(100) === 100);
        assert.ok(expiry.defaultTimer() === 100);
    });
});

describe('expiry.add()', function() {
    it('should throw when no key argument is supplied', function() {
        try {
            expiry.addKey();
            throw new Error('addKey did not throw an error');
        } catch(err) {
        }
    });
});

describe('expiry.add()', function() {
    it('should not throw when a key argument is supplied', function() {
        expiry.addKey('test');
    });
});


function checkPropRemoved(cb) {
    if (expiry.obj.hasOwnProperty('test')) {
        cb(new Error('Property was not removed'));
        return false;
    }
    cb();
    return true;
}

describe('expiry.add()', function() {
    it('should add a key and then remove it after default timeout', function(cb) {
        expiry.addKey('test');
        assert.ok(expiry.obj.hasOwnProperty('test'));
        setTimeout(function() { checkPropRemoved(cb) }, 120);
    });
});


describe('expiry.add()', function() {
    it('should add a key and then remove it after a supplied timeout', function(cb) {
        expiry.addKey('moo', 20);
        assert.ok(expiry.obj.hasOwnProperty('moo'));
        setTimeout(function() { checkPropRemoved(cb) }, 40);
    });
});

describe('expiry.add()', function() {
    it('should add a key and call a supplied callback', function(cb) {
        var exited = false;
        function errorNoCb() {
            exited = true;
            cb(new Error('The supplied callback was not called.'));
        }
        var timeoutId = setTimeout(errorNoCb, 40);
        function suppliedCb() {
            if (exited)
                return;
            clearTimeout(timeoutId);
            checkPropRemoved(cb);
        }

        expiry.addKey('zoo', 20, suppliedCb);
        assert.ok(expiry.obj.hasOwnProperty('zoo'));
    });
});
