import { delay, HttpResponse } from 'msw';
import { LLMResponse } from '../../api/tryggTekstAPI';

const jsonContent = {
    "vurdering": "We need to analyze the text: \"Dukker denne opp i DB? Hilsen F_994201 E_994201\". This is a short message. It includes \"F_994201\" and \"E_994201\". These look like identifiers, maybe user IDs. They are not categories. There's no mention of race, ethnicity, politics, religion, etc. So likely no sensitive categories. According to instructions, if no category, respond with \"ingen\". But note the example: \"Han er norsk statsborger.\" (ingen sensitiv kategori) → svar: {\"kategori\":\"ingen\"}. Wait the exam… earlier they said if no category, respond with the word `ingen` (without quotes). There's a conflict. Let's re-read: In instruction 3: \"Hvis ingen kategori gjelder: ... skal du svare med **`ingen`**.\" Then in example they show `{\"kategori\":\"ingen\"}`. That seems contradictory. But the instruction 5 says: \"Svar må følge dette formatet strengt: enten ordet `ingen` (uten anførselstegn) dersom ingen kategori passer, **eller** en JSON-liste...\" So we should output just the word ingen. So answer: ingen.",
    "svar": "{\"kategorier\": [{\"kategori\":\"ingen\", \"trigger\":\"ingen\"}]}",
    "content": "{\"kategorier\":[{\"kategori\":\"ingen\",\"trigger\":\"ingen\"}]}",
    "referatId": "8ea22aeb-25a2-496d-9de3-562246f6b5af"
};

const response = {
    data: {
        content: JSON.stringify(jsonContent),
    } as LLMResponse,
};

export const sjekkTryggTekst = async () => {
    await delay(2000);
    return HttpResponse.json(jsonContent);
};

