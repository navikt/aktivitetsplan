import { ikkeLoggetInnNivaa4 } from './demo/sessionstorage';

export default function (fnr) {
    return {
        harbruktnivaa4: !ikkeLoggetInnNivaa4(),
        personidentifikator: fnr,
    };
}
