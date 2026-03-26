export type LLMResponse = {
    content: string;
    svar: string;
    vurdering: string;
    tryggTekstReferatId: string;
};
interface OpplysningsAdvarsel {
    trigger: string;
    kategori: string;
}
interface OpplysningSjekkContent {
    kategorier: OpplysningsAdvarsel[];
}

async function postRequest(referatTekst: string, tryggTekstReferatId?: string): Promise<LLMResponse> {
    return await fetch(`/tryggtekst/proxy/completion`, {
        method: 'POST',
        body: JSON.stringify({
            payload: referatTekst,
            ...(tryggTekstReferatId && { trackingID: tryggTekstReferatId })
        }),
        headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' },
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then((data) => {
            const { referatId, ...rest } = data;
            return { ...rest, tryggTekstReferatId: referatId };
        })
        .catch((e) => {
            console.log(e);
            return e;
        });
}

export const postSjekkForPersonopplysninger = async (verdi: string, tryggTekstReferatId?: string) => {
    if (!verdi) {
        return { kategorier: [], feilmedling: '', tryggTekstReferatId: undefined };
    }
    const response: LLMResponse = await postRequest(verdi, tryggTekstReferatId);
    const containsSensitive: OpplysningSjekkContent = JSON.parse(response.content);
    console.log('containsSensitive', containsSensitive);

    let feil = '';
    let kategorier: { kategori: string; trigger: string }[] = [];

    if (containsSensitive.kategorier && containsSensitive.kategorier.length > 0) {
        kategorier = containsSensitive.kategorier.map((item) => ({
            kategori: item.kategori,
            trigger: item.trigger,
        }));
        feil = `⚠️ Det ser ut som du har skrevet inn personopplysninger om ${kategorier.map((k) => k.kategori).join(', ')} i skjemaet.`;
    } else {
        feil = '👌✅';
    }

    return { kategorier, feilmedling: feil, tryggTekstReferatId: response.tryggTekstReferatId };
};

export default postSjekkForPersonopplysninger;
