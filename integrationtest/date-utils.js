const momentImpl = require('moment');
require('moment-timezone');
require('moment/locale/nb');

momentImpl.locale('nb');
momentImpl.tz.setDefault('Europe/Oslo');

const moment = momentImpl;

moment.updateLocale('nb', {
    monthsShort: [
        'jan',
        'feb',
        'mar',
        'apr',
        'mai',
        'jun',
        'jul',
        'aug',
        'sep',
        'okt',
        'nov',
        'des',
    ],
});

const getRelativeDate = days => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today;
};

function getRelativeDatePrettyPrint(dato) {
    var format = 'Do MMM YYYY';

    if (dato) {
        const datoVerdi = moment(dato);
        return datoVerdi.isValid() ? datoVerdi.format(format) : undefined;
    }
}

const toDatePrettyPrint = _dato => {
    if (typeof _dato === 'undefined' || _dato === null) {
        return null;
    }

    const days =
        _dato.getDate() < 10 ? `0${_dato.getDate()}` : `${_dato.getDate()}`;
    const months =
        _dato.getMonth() + 1 < 10
            ? `0${_dato.getMonth() + 1}`
            : `${_dato.getMonth() + 1}`;
    const years = _dato.getFullYear();

    return `${days}.${months}.${years}`;
};

const toDateTimePrettyPrint = _dato => {
    if (typeof _dato === 'undefined' || _dato === null) {
        return null;
    }

    const days =
        _dato.getDate() < 10 ? `0${_dato.getDate()}` : `${_dato.getDate()}`;
    const months =
        _dato.getMonth() + 1 < 10
            ? `0${_dato.getMonth() + 1}`
            : `${_dato.getMonth() + 1}`;
    const years = _dato.getFullYear();
    const hours = _dato.getHours();
    const min = _dato.getMinutes();

    return `${days}.${months}.${years} ${hours}:${min}`;
};


module.exports = {
    moment,
    getRelativeDate,
    getRelativeDatePrettyPrint,
    toDatePrettyPrint,
    toDateTimePrettyPrint
}
