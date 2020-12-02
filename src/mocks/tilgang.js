import { ikkeLoggetInnNivaa4 } from './demo/sessionstorage';

export default function getNivaa4(fnr) {
    return {
        harbruktnivaa4: !ikkeLoggetInnNivaa4(),
        personidentifikator: fnr,
    };
}
