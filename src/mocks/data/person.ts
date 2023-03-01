export const getPerson = () => {
    return {
        fornavn: 'Bruce',
        mellomnavn: 'Batty',
        etternavn: 'Wayne',
        forkortetNavn: 'Bruce Batty Wayne',
        fodselsnummer: '10108000398',
        fodselsdato: '1974-09-16',
        dodsdato: null,
        barn: [
            {
                fornavn: 'Bruce',
                mellomnavn: null,
                etternavn: 'Banner',
                forkortetNavn: 'Bruce Banner',
                fodselsnummer: '10108000391',
                fodselsdato: '2016-04-17',
                dodsdato: null,
                harSammeBosted: false,
                gradering: 'FORTROLIG',
                erEgenAnsatt: false,
                harVeilederTilgang: false,
                kjonn: 'M',
            },
            {
                fornavn: 'Harry',
                mellomnavn: null,
                etternavn: 'Bosch',
                forkortetNavn: 'Harry Bosch',
                fodselsnummer: '10108000392',
                fodselsdato: '2014-05-24',
                dodsdato: null,
                harSammeBosted: true,
                gradering: 'UGRADERT',
                erEgenAnsatt: false,
                harVeilederTilgang: false,
                kjonn: 'M',
            },
            {
                fornavn: 'Satoshi',
                mellomnavn: null,
                etternavn: 'Nakamoto',
                forkortetNavn: 'Satoshi Nakamoto',
                fodselsnummer: '10108000398',
                fodselsdato: '2005-10-04',
                dodsdato: null,
                harSammeBosted: false,
                erEgenAnsatt: false,
                harVeilederTilgang: true,
                gradering: 'STRENGT_FORTROLIG',
                kjonn: 'K',
            },
        ],
        kontonummer: '12345678911',
        geografiskEnhet: {
            enhetsnummer: '0106',
            navn: 'NAV Fredrikstad',
        },
        telefon: [
            {
                prioritet: '1',
                telefonNr: '+4746333333',
                registrertDato: '10.07.2008',
                master: 'Freg',
            },
            {
                prioritet: '2',
                telefonNr: '80022222',
                registrertDato: '10.04.2010',
                master: 'KRR',
            },
            {
                prioritet: '3',
                telefonNr: '44222444',
                registrertDato: null,
                master: 'PDL',
            },
        ],
        epost: {
            epostAdresse: 'tester.scrambling@registre.no',
            epostSistOppdatert: '10.04.2010',
            master: 'KRR',
        },
        statsborgerskap: 'NORGE',
        sivilstand: {
            sivilstand: 'Gift',
            fraDato: '2012-08-20',
        },
        partner: {
            fornavn: 'fornavn',
            mellomnavn: null,
            etternavn: 'etternavn',
            forkortetNavn: 'fornavn etternavn',
            fodselsnummer: '12108000391',
            fodselsdato: '1980-12-10',
            dodsdato: null,
            harSammeBosted: true,
            erEgenAnsatt: true,
            harVeilederTilgang: false,
            gradering: 'UGRADERT',
            kjonn: 'M',
        },
        bostedsadresse: {
            coAdressenavn: 'CoAdresseNavn',
            vegadresse: {
                matrikkelId: null,
                postnummer: '0000',
                husnummer: '21',
                husbokstav: 'A',
                kommunenummer: '1111',
                adressenavn: 'Arendalsegate',
                tilleggsnavn: 'Arendal',
                poststed: 'Posted',
                kommune: 'Kommune',
            },
            matrikkeladresse: {
                matrikkelId: null,
                bruksenhetsnummer: 'H0101',
                tilleggsnavn: 'Ja',
                kommunenummer: '8008',
                postnummer: '1337',
                poststed: 'Sandvika',
                kommune: 'Blærum',
            },
            utenlandskAdresse: {
                adressenavnNummer: 'AdressenavnNummer?',
                bygningEtasjeLeilighet: 'H4290',
                postboksNummerNavn: '42',
                postkode: '1337',
                bySted: 'Shanghai',
                regionDistriktOmraade: 'Shanghai',
                landkode: 'CN',
            },
            ukjentBosted: {
                bostedskommune: 'Vinje',
                kommune: 'Kommune',
            },
        },
        oppholdsadresse: null,
        kontaktadresser: [
            {
                type: 'Utland',
                coAdressenavn: null,
                vegadresse: null,
                postboksadresse: null,
                postadresseIFrittFormat: null,
                utenlandskAdresse: null,
                utenlandskAdresseIFrittFormat: {
                    adresselinje1: 'C/O adresse2 Test',
                    adresselinje2: 'Adresselinje 2',
                    adresselinje3: 'Adresselinje 3',
                    byEllerStedsnavn: 'Stedsnavn',
                    postkode: '1234',
                    landkode: 'Landkode',
                },
            },
        ],
        kjonn: 'K',
        malform: 'se',
    };
};

export const getPostadresse = () => {
    return {
        navn: 'Navn Navnesen',
        adresse: {
            type: 'NORSKPOSTADRESSE',
            adresselinje1: 'Adresselinje 1',
            adresselinje2: 'Adresselinje 2',
            postnummer: '0000',
            poststed: 'Sted',
            landkode: 'NO',
            land: 'Norge',
        },
    };
};