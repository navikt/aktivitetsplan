import { Element } from 'nav-frontend-typografi';
import React from 'react';
import classNames from 'classnames';
import PT from 'prop-types';
import AktivitetskortEndring from './aktivitetskort-endring';
import * as AppPT from '../../../proptypes';

export default function Aktivitetskorttittel({ aktivitet, harEndringerIAktivitet, isDragging }) {
    return (
        <div className="aktivitetskort__header">
            <AktivitetskortEndring harEndringerIAktivitet={harEndringerIAktivitet} />
            <Element
                tag="h1"
                id={`aktivitetskort__header__${aktivitet.id}`}
                className={classNames('aktivitetskort__tittel softbreak', {
                    'aktivitetskort__tittel--drag': isDragging,
                })}
            >
                {aktivitet.tittel}
            </Element>
        </div>
    );
}

Aktivitetskorttittel.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    isDragging: PT.bool.isRequired,
    harEndringerIAktivitet: PT.bool.isRequired,
};
