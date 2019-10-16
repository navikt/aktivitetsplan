import React from 'react';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';
import Aktivitetsdetaljer from '../aktivitet/visning/hjelpekomponenter/aktivitetsdetaljer';
import Informasjonsfelt from '../aktivitet/visning/hjelpekomponenter/Informasjonsfelt';
import * as AppPT from '../../proptypes';
import { compareAktivitet } from '../aktivitet/aktivitet-util';
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';
import DialogPrint from './dialog-print';
import SokeStatusEtikett from '../aktivitet/etikett/sokeStatusEtikett';
import AvtaltMarkering from '../aktivitet/avtalt-markering/avtalt-markering';

function AktivitetReferat({ aktivitet }) {
    const { referat, erReferatPublisert } = aktivitet;
    const harReferat = !!referat;
    const visReferat = erReferatPublisert && (harReferat || !aktivitet.historisk);

    return (
        <HiddenIfDiv hidden={!visReferat} className="printmodal-body__aktivitetreferat">
            <Informasjonsfelt key="referat" tittel={<FormattedMessage id="referat.header" />} innhold={referat} />
        </HiddenIfDiv>
    );
}

AktivitetReferat.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired
};

function AktivitetPrint({ aktivitet, dialog, intl }) {
    const { id, type, tittel } = aktivitet;
    const aktivitetType = intl.formatMessage({
        id: `aktivitetskort.type.${type}`.toLowerCase()
    });
    return (
        <div key={id} className="printmodal-body__statusgruppe">
            <p className="printmodal-body__statusgruppe--type">{aktivitetType}</p>

            <Element tag="h2" className="printmodal-body__statusgruppe--overskrift">
                {tittel}
            </Element>

            <Aktivitetsdetaljer valgtAktivitet={aktivitet} key={id} />
            <AktivitetReferat aktivitet={aktivitet} />
            <AvtaltMarkering visible={aktivitet.avtalt} className="etikett-print" />
            <SokeStatusEtikett hidden={!aktivitet.etikett} etikett={aktivitet.etikett} className="etikett-print" />
            <DialogPrint dialog={dialog} />
        </div>
    );
}

AktivitetPrint.defaultProps = {
    dialog: null
};

AktivitetPrint.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    dialog: AppPT.dialog,
    intl: intlShape.isRequired
};

function StatusGruppe({ gruppe, intl }) {
    const { status, aktiviteter, dialoger } = gruppe;
    return (
        <section className="printmodal-body__statusgrupper">
            <Undertittel tag="h1" className="printmodal-body__statusgruppe--overskrift">
                <FormattedMessage id={`aktivitetstavle.print.${status.toLowerCase()}`} />
            </Undertittel>
            {aktiviteter.sort(compareAktivitet).map(aktivitet => {
                const dialogForAktivitet = dialoger.find(d => d.aktivitetId === aktivitet.id);
                return (
                    <AktivitetPrint aktivitet={aktivitet} key={aktivitet.id} intl={intl} dialog={dialogForAktivitet} />
                );
            })}
        </section>
    );
}

StatusGruppe.propTypes = {
    gruppe: PT.shape({
        status: PT.string.isRequired,
        aktiviteter: AppPT.aktiviteter.isRequired,
        dialoger: PT.arrayOf(AppPT.dialog)
    }),
    intl: intlShape.isRequired
};

StatusGruppe.defaultProps = {
    gruppe: null
};

export default injectIntl(StatusGruppe);
