import { Dispatch, SetStateAction } from 'react';

type UseSensitive = (
    verdi: string | null | undefined,
    feilmelding?: string,
) => [string | undefined, Dispatch<SetStateAction<string | undefined>>, () => boolean];

export type LLMResponse = {
    content: string;
};

interface LLMContent {
    grunn: string;
    kategori: string;
}

interface IsSensitive {
    kategori: string;
    sensitiv: boolean;
    feilmedling: string | null;
}

const baseUrl = 'http://34.34.85.30:8007';

async function postRequest(referatTekst: string): Promise<LLMResponse> {
    return await fetch(`/tryggtekst/proxy`, {
        method: 'POST',
        body: referatTekst,
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
    let sensitiv = false;
    let kategorier: { kategori: string; grunn: string }[] = [];
    console.log('useSensitive', verdi);

    if (!verdi) {
        console.log('ingen verdi', verdi);
        return { kategorier: [], sensitiv: sensitiv, feilmedling: feil };
    } else {
        console.log('verdi som ska til llm', verdi);
        const b = await postRequest(verdi).then(async (c: LLMResponse) => {
            const containsSensitive = JSON.parse(c.content);
            console.log('containsSensitive', containsSensitive);

            if (containsSensitive.kategorier && containsSensitive.kategorier.length > 0) {
                kategorier = containsSensitive.kategorier.map((item: LLMContent) => ({
                    kategori: item.kategori,
                    grunn: item.grunn,
                }));
                feil = `⚠️ Det ser ut som du har skrevet inn personopplysninger om ${kategorier.map((k) => k.kategori).join(', ')} i skjemaet.`;
                sensitiv = true;
            } else {
                feil = '👌✅';
                sensitiv = false;
            }
            return { kategorier: kategorier, sensitiv: sensitiv, feilmedling: feil };
        });
    }
    return { kategorier: kategorier, sensitiv: sensitiv, feilmedling: feil };
};

export default postSjekkForPersonopplysninger;
