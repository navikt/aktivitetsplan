import { loggetInnNivaa4 } from './demo/sessionstorage';

export default function (fnr) {
    return {
        harbruktnivaa4: loggetInnNivaa4(),
        personidentifikator: fnr,
    };
}
