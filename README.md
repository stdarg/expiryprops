# expireProps
This module manages an object, allows you to set keys and optional values on
that object and, after a timeout expires, removes that property from the object.

## Installation

    $ npm install expireProps

## Example

```javascript
var assert = require('assert');
var expireProps = require('expireProps');
expireProps.defaultTimer(100);      // set timer to 100ms
expireProps.addKey('test');
assert.ok(expireProps.obj.hasOwnProperty('test'));

// ensure the property is removed after 100ms

function checkPropRemoved() {
    if (expireProps.obj.hasOwnProperty('test'))
        console.error('The property was not removed.');
    else
        console.log('The property was removed.');
}

setTimeout(checkPropRemoved, 125);
```

## API

The following are exported from the expireProps module:

- obj
- defaultTimer()
- addKey()
- addKeyValue()
- rmKey()
- resetTimer()

### obj
The object containing the keys and optional values.

### defaultTimer([timeoutMs])
Returns the current timeout in millisseconds. If a number is supplied, that
number is set to the new timeout, which is then returned.

### addKey(key [, timeoutMs] [, callback])
The string key is set on the object with a value of undefined. If an optional
timeout in miliseconds is supplied, that timeout is used instead of the default.
Also, if an optional callback is given, the callback is called after the
property is deleted with a single argument, the key.

### addKeyValue(key, value [, timeoutMs] [, callback])
The string key is set on the object with a value of undefined. The value is then
set to be the value on the object property.  If an optional timeout in
miliseconds is supplied, that timeout is used instead of the default.  Also, if
an optional callback is given, the callback is called after the property is
deleted with a single argument, the key.

### rmKey(key)
Removes the key from the object and clears the timeout.

### resetTimer(key [, timeoutMs])
Resets the timeout associated with the key to be timeoutMs, if provided. If no
timeout is provided, the timeout is the default.

## LICENSE
Released under the [MIT License](http://opensource.org/licenses/MIT).
