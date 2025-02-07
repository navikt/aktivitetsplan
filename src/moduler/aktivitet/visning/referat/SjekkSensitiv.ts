import {Dispatch, SetStateAction, useState} from 'react';
import axios from 'axios';

type UseSensitive = (
    verdi: string | null | undefined,
    feilmelding?: string
) => [string | undefined, Dispatch<SetStateAction<string | undefined>>, () => boolean];

type LLMResponse = {
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

const api = axios.create({
    // baseURL: 'http://0.0.0.0:8007',
    baseURL: 'http://34.34.85.30:8007',
    withCredentials: false,
    headers: {Pragma: 'no-cache', 'Cache-Control': 'no-cache', 'Content-Type': 'application/json'}
});

async function postRequest(inp: string): Promise<LLMResponse> {
    const data = {
        stream: false,
        n_predict: 2048,
        temperature: 0,
        dry_allowed_length: 10,
        dry_base: 3,
        dry_multiplier: 5,
        dry_penalty_last_n: 50,
        stop: [
            '</s>',
            'user:',
            'assistant:'
        ],
        penalize_nl: false,
        repeat_last_n: 256,
        repeat_penalty: 1,
        top_k: 1,
        top_p: 1,
        min_p: 0,
        tfs_z: 1,
        min_keep: 0,
        typical_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        mirostat: 0,
        mirostat_tau: 5,
        mirostat_eta: 0.1,
        grammar:
            'root ::= "{" space kategori-kv space "}" space nl\n' +
            '\n' +
            'kategori-kv ::= "\\"kategorier\\"" space ":" space "[" space kategori-list space "]" space\n' +
            '\n' +
            'kategori-list ::= kategori-multiple\n' +
            '\n' +
            'kategori-ingen ::= "\\"ingen\\"" space\n' +
            '\n' +
            'kategori-multiple ::= kategori-obj ("," space kategori-obj)*\n' +
            '\n' +
            'kategori-obj ::= "{" space "\\"kategori\\"" space ":" space kategori-gyldig space "," space "\\"grunn\\"" space ":" space json-string space "}" space\n' +
            '\n' +
            'kategori-gyldig ::= ("\\"etnisk opprinnelse\\""\n' +
            '                     | "\\"politisk oppfatning\\""\n' +
            '                     | "\\"religion\\""\n' +
            '                     | "\\"filosofisk overbevisning\\""\n' +
            '                     | "\\"fagforeningsmedlemskap\\""\n' +
            '                     | "\\"genetiske opplysninger\\""\n' +
            '                     | "\\"biometriske opplysninger\\""\n' +
            '                     | "\\"helseopplysninger\\""\n' +
            '                     | "\\"seksuelle forhold\\""\n' +
            '                     | "\\"seksuell legning\\"") space\n' +
            '\n' +
            'json-string ::= "\\"" str-characters "\\"" space\n' +
            'str-characters ::= | str-character str-characters\n' +
            'str-character ::= [^"\\\\] | "\\\\" escape\n' +
            'escape ::= ["\\\\/bfnrt] | "u" hex hex hex hex\n' +
            '\n' +
            'hex ::= [0-9A-Fa-f]\n' +
            '\n' +
            'space ::= | " " {0,1}\n' +
            'nl ::= | "\\n" [ \\t]{0,1}\n',
        n_probs: 9,
        image_data: [],
        cache_prompt: false,
        api_key: '',
        slot_id: 0,
        prompt: `<|start_header_id|>system<|end_header_id|>\\n\\nDu er en klassifiseringsbot. Du skal vurdere om teksten inneholder særlige kategorier av personopplysninger, og hvis ja hvilke opplysningstype som best beskriver innholdet i teksten. Velg blant følgende 11 kategorier av opplysninger:
* politisk oppfatning
* religion
* etnisk opprinnelse
* filosofisk overbevisning
* fagforeningsmedlemskap
* genetiske opplysninger
* biometriske opplysninger
* helseopplysninger
* seksuelle forhold
* seksuell legning
* ingen særlige kategorier av personopplysninger
kan innholde flere kategorier eller ingen. Returnere med kategori og settningen som triggret kategorien uten å endre den eller sammenfatte den.<|start_header_id|>user<|end_header_id|>
${inp}\\n<|eot_id|>assistant`
    };
    return await api
        .post('/completion', data)
        .then(r => {
            console.log(r.data);
            return r.data;
        })
        .catch(e => {
            console.log(e);
            return e;
        });
}

const checkSensitive = async (verdi: string) => {
    let feil = '';
    let sensitiv = false;
    let kategorier = [];
    console.log('useSensitive', verdi);

    if (!verdi) {
        console.log('ingen verdi', verdi);
        return {kategorier: [], sensitiv: sensitiv, feilmedling: feil};
    } else {
        console.log('verdi som ska til llm', verdi);
        const b = await postRequest(verdi).then(async (c: LLMResponse) => {
            console.log(c);
            const containsSensitive = JSON.parse(c.content);
            console.log('containsSensitive', containsSensitive);

            if (containsSensitive.kategorier && containsSensitive.kategorier.length > 0) {
                kategorier = containsSensitive.kategorier.map((item: LLMContent) => ({
                    kategori: item.kategori,
                    grunn: item.grunn
                }));
                feil = `⚠️ Det ser ut som du har skrevet inn personopplysninger om ${kategorier.map(k => k.kategori).join(', ')} i skjemaet.`;
                sensitiv = true;
            } else {
                feil = '👌✅';
                sensitiv = false;
            }
            return {kategorier: kategorier, sensitiv: sensitiv, feilmedling: feil};
        });
    }
    return {kategorier: kategorier, sensitiv: sensitiv, feilmedling: feil};
};

export default checkSensitive;
