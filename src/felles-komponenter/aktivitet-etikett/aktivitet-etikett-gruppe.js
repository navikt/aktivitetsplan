import React from 'react';
import PT from 'prop-types';
import AktivitetEtikett from './aktivitet-etikett';
import { AVTALT_MED_NAV } from '../../constant';
import * as AppPT from '../../proptypes';
import { div as HiddenIfDiv } from '../hidden-if/hidden-if';

function AktivitetEtikettGruppe({ aktivitet, className }) {
    const { avtalt, etikett } = aktivitet;
    return (
        <HiddenIfDiv hidden={!avtalt && !etikett} className={className}>
            <AktivitetEtikett hidden={!avtalt} etikett={AVTALT_MED_NAV} />
            <AktivitetEtikett hidden={!etikett} etikett={etikett} />
        </HiddenIfDiv>
    );
}

AktivitetEtikettGruppe.propTypes = {
    aktivitet: PT.object.isRequired,
    avtalt: PT.bool,
    etikett: AppPT.etikett,
    className: PT.string,
};

AktivitetEtikettGruppe.defaultProps = {
    etikett: null,
    avtalt: false,
    className: '',
};

export default AktivitetEtikettGruppe;
