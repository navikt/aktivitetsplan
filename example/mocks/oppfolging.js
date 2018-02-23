export default function(queryParams) {
    const {fnr} = queryParams;
    return {
        fnr : fnr,
        veilederId : null,
        reservasjonKRR : false,
        manuell : false,
        underOppfolging : false,
        underKvp : false,
        vilkarMaBesvares : true,
        oppfolgingUtgang : null,
        gjeldendeEskaleringsvarsel : null,
        kanStarteOppfolging : false,
        avslutningStatus : null,
        oppfolgingsPerioder : [ ],
        harSkriveTilgang : true
    }
}
