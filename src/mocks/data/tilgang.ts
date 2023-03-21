import { RestRequest } from 'msw';

import { ikkeLoggetInnNivaa4 } from '../demo/sessionstorage';

export default function getNivaa4(req: RestRequest) {
    return {
        harbruktnivaa4: !ikkeLoggetInnNivaa4(),
        personidentifikator: req.params.fnr,
    };
}
