import { delay, HttpResponse, ResponseComposition, RestContext, RestRequest } from 'msw';
import { LLMResponse } from '../../api/tryggTekstAPI';

const jsonContent = {
    kategorier: [
        {
            kategori: 'helseopplysninger',
            grunn: 'Du er i gang med behandling hos   fysioterapeut, men det er antatt at det vil ta noe tid å bli kvitt plagene. Trykkbølgebehandling og nåler prøves først.',
        },
        {
            kategori: 'religion',
            grunn: 'Du ...',
        },
    ],
};

const response = {
    data: {
        content: JSON.stringify(jsonContent),
    } as LLMResponse,
};

export const sjekkTryggTekst = async () => {
    await delay(2000);
    return HttpResponse.json(response);
};
