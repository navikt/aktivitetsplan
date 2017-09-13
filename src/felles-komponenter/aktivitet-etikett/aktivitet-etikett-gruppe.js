import React from 'react';
import PT from 'prop-types';
import AktivitetEtikett from './aktivitet-etikett';
import { AVTALT_MED_NAV } from '../../constant';
import * as AppPT from '../../proptypes';
import HiddenIfDiv from '../../felles-komponenter/hidden-if/hidden-if';

function AktivitetEtikettGruppe({ avtalt, etikett, className }) {
    return (
        <HiddenIfDiv hidden={!avtalt && !etikett} className={className}>
            <AktivitetEtikett
                hidden={!avtalt}
                etikett={AVTALT_MED_NAV}
                id={AVTALT_MED_NAV}
            />

            <AktivitetEtikett
                hidden={!etikett}
                etikett={etikett}
                id={`etikett.${etikett}`}
            />
        </HiddenIfDiv>
    );
}

AktivitetEtikettGruppe.propTypes = {
    avtalt: PT.bool.isRequired,
    etikett: AppPT.etikett,
    className: PT.string,
};

AktivitetEtikettGruppe.defaultProps = {
    etikett: null,
    className: '',
};

export default AktivitetEtikettGruppe;
