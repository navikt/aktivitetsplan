import { Element } from 'nav-frontend-typografi';
import React from 'react';
import PT from 'prop-types';
import * as AppPT from '../../../proptypes';
import NotifikasjonMarkering from '../../../felles-komponenter/utils/notifikasjon-markering';

export default function Aktivitetskorttittel({ aktivitet, harEndringerIAktivitet }) {
    return (
        <div className="aktivitetskort__header">
            <NotifikasjonMarkering visible={harEndringerIAktivitet} />
            <Element
                tag="h1"
                id={`aktivitetskort__header__${aktivitet.id}`}
                className="aktivitetskort__tittel softbreak"
            >
                {aktivitet.tittel}
            </Element>
        </div>
    );
}

Aktivitetskorttittel.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    harEndringerIAktivitet: PT.bool.isRequired,
};
