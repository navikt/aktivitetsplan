import React from 'react';
import PT from 'prop-types';
import { Element, EtikettLiten, Normaltekst } from 'nav-frontend-typografi';
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';
import { datoComparator, formaterDatoKortManed } from '../../utils';

function DialogPrint({ dialog }) {
    if (!dialog) {
        return <div />;
    }

    const henvendelser = dialog.henvendelser;
    const henvendelserSynkende =
        henvendelser &&
        [...henvendelser].sort((a, b) => datoComparator(b.sendt, a.sendt));

    const overskrift =
        dialog.aktivitetId === null ? dialog.overskrift : 'Dialog';

    return (
        <HiddenIfDiv
            hidden={!henvendelserSynkende}
            className="printmodal-body__dialog"
        >
            <Element
                tag="h2"
                className="printmodal-body__statusgruppe--overskrift"
            >
                {overskrift}
            </Element>
            {henvendelserSynkende &&
                henvendelserSynkende.map(h =>
                    <div className="henvendelse" key={h.id}>
                        <EtikettLiten className="detaljfelt__tittel" tag="h2">
                            {`${h.avsender === 'VEILEDER'
                                ? h.avsenderId
                                : 'BRUKER'} - ${formaterDatoKortManed(
                                h.sendt
                            )}`}
                        </EtikettLiten>
                        <Normaltekst>
                            {h.tekst}
                        </Normaltekst>
                    </div>
                )}
        </HiddenIfDiv>
    );
}

DialogPrint.propTypes = {
    dialog: PT.object,
};

DialogPrint.defaultProps = {
    dialog: undefined,
};

export default DialogPrint;
