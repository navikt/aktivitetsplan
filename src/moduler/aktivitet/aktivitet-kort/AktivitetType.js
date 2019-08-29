import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import classNames from 'classnames';
import PT from 'prop-types';
import AktivitetskortEndring from './aktivitetskort-endring';
import * as AppPT from '../../../proptypes';

export const Titel = ({ aktivitet, harEndringerIAktivitet, isDragging }) =>
    <div className="aktivitetskort__header">
        <AktivitetskortEndring
            harEndringerIAktivitet={harEndringerIAktivitet}
        />
        <Element
            tag="h1"
            id={`aktivitetskort__header__${aktivitet.id}`}
            className={classNames('aktivitetskort__tittel softbreak', {
                'aktivitetskort__tittel--drag': isDragging,
            })}
        >
            {aktivitet.tittel}
        </Element>
    </div>;

Titel.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    isDragging: PT.bool.isRequired,
    harEndringerIAktivitet: PT.bool.isRequired,
};

export const AktivitetType = ({ type }) =>
    <Undertekst tag="p" className="aktivitetskort__type" data-testid={type}>
        <FormattedMessage id={`aktivitetskort.type.${type}`.toLowerCase()} />
    </Undertekst>;

AktivitetType.propTypes = {
    type: PT.string.isRequired,
};
