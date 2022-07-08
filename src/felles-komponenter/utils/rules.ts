import { ASTNode, LinkRule as OriginalLinkRule, ReactElementDescription, Rule } from '@navikt/textparser';
import { getText } from '@navikt/textparser/dist/utils';

import ForkortetLenke from '../../moduler/aktivitet/visning/hjelpekomponenter/ForkortetLenke';

export const ShortenedLinkRule: Rule = {
    ...OriginalLinkRule,
    react(node: ASTNode): ReactElementDescription {
        const text = getText(node);
        const href = this.startsWithHttp.test(text) ? text : `https://${text}`;

        return {
            type: ForkortetLenke,
            props: { lenke: href, target: '_blank' },
        };
    },
};
