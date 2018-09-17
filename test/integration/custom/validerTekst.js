var util = require('util');
var events = require('events');

function validerTekst() {
    events.EventEmitter.call(this);
}

util.inherits(validerTekst, events.EventEmitter);

validerTekst.prototype.command = function(selector, expected, text, cb) {
    var self = this;

    this.api.getText(selector, result => {
        this.api.assert.equal(result.status, 0, text);
        this.api.verify.equal(result.value, expected, text);
        self.emit('complete');
    });

    return this;
};

module.exports = validerTekst;
