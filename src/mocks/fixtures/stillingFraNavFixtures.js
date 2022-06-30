let id = 1000;
let versjon = 5000000;
Date.prototype.addYears = function (years) {
    let date = new Date(this.valueOf());
    date.setFullYear(date.getFullYear() + years);
    return date;
};
export const etTidspunkt = (arstall) => (arstall ? arstall + '-01-31T10:46:25.801+01:00' : null);

export const oddFellow = {
    navn: 'Odd Fellow',
    tittel: 'Daglig leder',
    mobil: '99999999',
};
export const navAnsatt1 = {
    navn: 'Harry Potter',
    tittel: 'NAV-ansatt',
    mobil: '+47 99009900',
};
export const navAnsatt2 = {
    navn: 'Sykfest Strutle',
    tittel: 'NAV-ansatt',
    mobil: null,
};

export const enStillingFraNavAktivitet = ({ tittel, arstall }) => ({
    versjon: (versjon += 1000),
    id: (id += 1000),
    tittel,
    type: 'STILLING_FRA_NAV',
    lenke: null,
    status: 'GJENNOMFORES',
    fraDato: etTidspunkt(arstall),
    opprettetDato: etTidspunkt(arstall),
    endretDato: arstall ? etTidspunkt(new Date(etTidspunkt(arstall)).addYears(2).toISOString()) : null,
    endretAv: 'z990207',
    historisk: true,
    kontaktperson: 'Vidar Vidarsen,\n NAV-ansatt, 99 99 99 99,vidar.vidarsen@nav.no',
    lagtInnAv: 'NAV',
    transaksjonsType: 'STATUS_ENDRET',
    stillingFraNavData: { ...enStillingFraNavData, soknadsstatus: null },
});
export const jaCvKanDeles = {
    kanDeles: true,
    endretTidspunkt: new Date(),
    endretAv: 'V123',
    endretAvType: 'BRUKER',
};
export const enStillingFraNavData = {
    cvKanDelesData: null,
    arbeidsgiver: 'Havsalt AS',
    arbeidssted: 'Kristiansand',
    lenke: 'www.nav.no',
    kontaktpersonData: oddFellow,
    soknadsstatus: 'VENTER',
};
