export default function(queryParams) {
    const { fnr } = queryParams;
    return {
        fnr: fnr,
        veilederId: null,
        reservasjonKRR: false,
        manuell: false,
        underOppfolging: true,
        underKvp: false,
        vilkarMaBesvares: false,
        oppfolgingUtgang: null,
        gjeldendeEskaleringsvarsel: null,
        kanStarteOppfolging: false,
        avslutningStatus: null,
        oppfolgingsPerioder: [
            {
                aktorId: '1234567988888',
                veileder: null,
                startDato: '2018-01-31T10:46:10.971+01:00',
                sluttDato: null,
                begrunnelse: null,
            },
        ],
        harSkriveTilgang: true,
    };
}
