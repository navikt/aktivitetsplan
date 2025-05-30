export type LLMResponse = {
    content: string;
    svar: string;
    vurdering: string;
};
interface OpplysningsAdvarsel {
    trigger: string;
    kategori: string;
}
interface OpplysningSjekkContent {
    kategorier: OpplysningsAdvarsel[];
}

async function postRequest(referatTekst: string): Promise<LLMResponse> {
    return await fetch(`/tryggtekst/proxy/completion`, {
        method: 'POST',
        body: JSON.stringify({ payload: referatTekst }),
        headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' },
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch((e) => {
            console.log(e);
            return e;
        });
}

const postSjekkForPersonopplysninger = async (verdi: string) => {
    let feil = '';
    let kategorier: { kategori: string; trigger: string }[] = [];
    console.log('useSensitive', verdi);

    if (!verdi) {
        return { kategorier: [] };
    } else {
        console.log('verdi som ska til llm', verdi);
        await postRequest(verdi).then(async (response: LLMResponse) => {
            const containsSensitive: OpplysningSjekkContent = JSON.parse(response.content);
            console.log('containsSensitive', containsSensitive);

            if (containsSensitive.kategorier && containsSensitive.kategorier.length > 0) {
                kategorier = containsSensitive.kategorier.map((item) => ({
                    kategori: item.kategori,
                    trigger: item.trigger,
                }));
                feil = `⚠️ Det ser ut som du har skrevet inn personopplysninger om ${kategorier.map((k) => k.kategori).join(', ')} i skjemaet.`;
            } else {
                feil = '👌✅';
            }
            return { kategorier: kategorier, feilmedling: feil };
        });
    }
    return { kategorier: kategorier, feilmedling: feil };
};

export default postSjekkForPersonopplysninger;
