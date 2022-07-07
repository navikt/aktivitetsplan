import { ASTNode, LinkRule as OriginalLinkRule, ReactElementDescription, Rule } from '@navikt/textparser';
import { getText } from '@navikt/textparser/dist/utils';

import DetaljvisningLenke from '../../moduler/aktivitet/visning/hjelpekomponenter/detaljvisning-lenke';

export const ShortenedLinkRule: Rule = {
    ...OriginalLinkRule,
    react(node: ASTNode): ReactElementDescription {
        const text = getText(node);
        const href = this.startsWithHttp.test(text) ? text : `https://${text}`;

        return {
            type: DetaljvisningLenke,
            props: { lenke: href, target: '_blank' },
        };
    },
};
