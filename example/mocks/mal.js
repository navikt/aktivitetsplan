export const maler = [
    {
        mal: 'Jeg vil bli sjørøver',
        endretAv: '12345678912',
        dato: new Date(),
    },
];

export function malListe() {
    return maler;
}

export function sisteMal() {
    if (maler.length === 0) return maler;
    return maler[maler.length - 1];
}

export function opprettMal(update, erVeileder) {
    let nyMal = {
        mal: update.mal,
        endretAv: erVeileder ? 'VEILEDER' : '12345678912',
        dato: new Date(),
    };
    maler.push(nyMal);
    return nyMal;
}
