/* eslint-env mocha */
import { expect } from 'chai';
import { sammenlignDialogerForVeileder } from './dialog-utils';

function knuth(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex]; // eslint-disable-line no-param-reassign
        array[randomIndex] = temporaryValue; // eslint-disable-line no-param-reassign
    }

    return array;
}

function erIdStorreEnForrige(element, index, array) {
    return index > 0 ? element.id > array[index - 1].id : true;
}

describe('dialog sortering på innsiden', () => {
    it('Skal sorteres på dato hvis tags er like', () => {
        const dialoger = [
            {
                id: '1',
                sisteDato: '2017-07-19T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '4',
                sisteDato: '2017-07-16T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '3',
                sisteDato: '2017-07-17T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '2',
                sisteDato: '2017-07-18T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
        ];

        expect(
            dialoger
                .sort(sammenlignDialogerForVeileder)
                .every(erIdStorreEnForrige)
        ).to.equal(true);
    });

    it('Skal sorte ubehandlede dialoger over behandlede', () => {
        const dialoger = [
            {
                id: '4',
                sisteDato: '2017-07-19T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            {
                id: '2',
                sisteDato: '2017-07-16T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '3',
                sisteDato: '2017-07-17T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '1',
                sisteDato: '2017-07-18T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
        ];

        expect(
            dialoger
                .sort(sammenlignDialogerForVeileder)
                .every(erIdStorreEnForrige)
        ).to.equal(true);
    });

    it('Skal sortere uleste dialoger over leste dialoger', () => {
        const dialoger = [
            {
                id: '4',
                sisteDato: '2017-07-16T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '2',
                sisteDato: '2017-07-19T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '1',
                sisteDato: '2017-07-18T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '3',
                sisteDato: '2017-07-17T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
        ];

        expect(
            dialoger
                .sort(sammenlignDialogerForVeileder)
                .every(erIdStorreEnForrige)
        ).to.equal(true);
    });

    it('Skal sortere ubehandlede over venter på svar hvis denne er ferdigbehandlet', () => {
        const dialoger = [
            {
                id: '4',
                sisteDato: '2017-07-16T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '2',
                sisteDato: '2017-07-19T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '1',
                sisteDato: '2017-07-18T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '3',
                sisteDato: '2017-07-17T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
        ];

        expect(
            dialoger
                .sort(sammenlignDialogerForVeileder)
                .every(erIdStorreEnForrige)
        ).to.equal(true);
    });

    it('Skal sortere dialoger riktig for flere permutasjoner av samme dialogsett', () => {
        const dialoger = [
            // false - true - false
            {
                id: '01',
                sisteDato: '2017-08-17T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            {
                id: '02',
                sisteDato: '2017-08-09T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            {
                id: '03',
                sisteDato: '2017-07-17T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            {
                id: '04',
                sisteDato: '2017-07-09T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            // false - false - false
            {
                id: '05',
                sisteDato: '2017-08-19T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '06',
                sisteDato: '2017-08-11T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '07',
                sisteDato: '2017-07-19T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '08',
                sisteDato: '2017-07-11T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            // false - true - true
            {
                id: '09',
                sisteDato: '2017-08-13T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '10',
                sisteDato: '2017-08-05T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '11',
                sisteDato: '2017-07-13T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '12',
                sisteDato: '2017-07-05T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            // false - false - true
            {
                id: '13',
                sisteDato: '2017-08-15T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            {
                id: '14',
                sisteDato: '2017-08-07T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            {
                id: '15',
                sisteDato: '2017-07-15T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            {
                id: '16',
                sisteDato: '2017-07-07T14:09:59.334+02:00',
                lest: false,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            // true - true - false
            {
                id: '17',
                sisteDato: '2017-08-16T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            {
                id: '18',
                sisteDato: '2017-08-08T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            {
                id: '19',
                sisteDato: '2017-07-16T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            {
                id: '20',
                sisteDato: '2017-07-08T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: false,
            },
            // true - false - false
            {
                id: '21',
                sisteDato: '2017-08-18T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '22',
                sisteDato: '2017-08-10T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '23',
                sisteDato: '2017-07-18T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            {
                id: '24',
                sisteDato: '2017-07-10T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: false,
            },
            // true - true - true
            {
                id: '25',
                sisteDato: '2017-08-12T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '26',
                sisteDato: '2017-08-04T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '27',
                sisteDato: '2017-07-12T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            {
                id: '28',
                sisteDato: '2017-07-04T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: true,
                ferdigBehandlet: true,
            },
            // true - false - true
            {
                id: '29',
                sisteDato: '2017-08-14T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            {
                id: '30',
                sisteDato: '2017-08-06T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            {
                id: '31',
                sisteDato: '2017-07-14T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
            {
                id: '32',
                sisteDato: '2017-07-06T14:09:59.334+02:00',
                lest: true,
                venterPaSvar: false,
                ferdigBehandlet: true,
            },
        ];

        for (let i = 0; i <= 100; i += 1) {
            expect(
                knuth(dialoger)
                    .sort(sammenlignDialogerForVeileder)
                    .every(erIdStorreEnForrige)
            ).to.equal(true);
        }
    });
});
