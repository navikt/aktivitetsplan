var util = require('util');
var events = require('events');

function validerLenke() {
    events.EventEmitter.call(this);
}

util.inherits(validerLenke, events.EventEmitter);

validerLenke.prototype.command = function(selector, expected, text) {
    var self = this;

    this.api.getText(selector, result => {
        this.api.assert.equal(result.status, 0, text);
        this.api.verify.equal(result.value, expected, text);
    });

    this.api.getAttribute(selector, 'href', href => {
        this.api.assert.equal(href.status, 0, text);
        this.api.verify.equal(href.value, expected, text);
        self.emit('complete');

    });

    return this;
};

module.exports = validerLenke;
