import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import * as AppPT from '../proptypes';
import { DIALOG_FERDIGBEHANDLET, DIALOG_MA_BESVARES } from '../constant';
import visibleIfHOC from '../hocs/visible-if';
import Dato from '../felles-komponenter/dato';
import Lenkepanel from '../felles-komponenter/lenkepanel';
import Etikett from '../felles-komponenter/aktivitet-etikett';
import Innholdslaster from '../felles-komponenter/utils/innholdslaster';
import { dialogFilter } from '../moduler/filter/filter-utils';

const Prikk = visibleIfHOC(props => (
    <div className="dialoger__prikk" {...props} />
));
const Info = visibleIfHOC(({ slash, className, children }) => (
    <span>
        {slash && <Undertekst className="dialoger__slash" />}
        <Undertekst className={className} tag="span">{children}</Undertekst>
    </span>
));

function DialogVisning({ dialog, erValgt, aktiviteter }) {
    const venterPaSvar = dialog.venterPaSvar;
    const ferdigBehandlet = dialog.ferdigBehandlet;

    const dialogCls = (valgt, ulest) =>
        classNames('dialoger__dialog', {
            'dialoger__dialog--valgt': valgt,
            'dialoger__dialog--ulest': ulest,
            'dialoger__dialog--venter-pa-svar': venterPaSvar,
            'dialoger__dialog--ferdigbehandlet': ferdigBehandlet,
        });

    const aktivitetId = dialog && dialog.aktivitetId;
    const aktivitet = aktiviteter.find(a => a.id === aktivitetId);
    const aktivitetType = aktivitet && aktivitet.type;
    const harAktivitetType = !!aktivitetType;

    const henvendelser = dialog.henvendelser;
    const harHenvendelseFraVeileder = !!henvendelser.find(
        a => a.avsender === 'VEILEDER'
    );
    return (
        <Lenkepanel
            className={dialogCls(erValgt, !dialog.lest)}
            href={`/dialog/${dialog.id}`}
        >
            <Prikk visible={!dialog.lest} />
            <div>
                <Info><Dato>{dialog.sisteDato}</Dato></Info>
                <Info visible={harAktivitetType} slash>
                    <FormattedMessage
                        id={`aktivitet.type.${aktivitetType}`.toLowerCase()}
                    />
                </Info>
                <Info
                    visible={dialog.erLestAvBruker && harHenvendelseFraVeileder}
                    className="venter-pa-svar"
                    slash
                >
                    <FormattedMessage id="dialog.lest-av-bruker" />
                </Info>
            </div>
            <Element>
                {aktivitet ? aktivitet.tittel : dialog.overskrift}
            </Element>
            <Normaltekst className="dialoger__dialog-tekst">
                {dialog.sisteTekst}
            </Normaltekst>
            <div className="dialoger__dialog-etiketter">
                <Etikett
                    visible={venterPaSvar}
                    id="dialog.venter-pa-svar"
                    etikett={DIALOG_MA_BESVARES}
                />
                <Etikett
                    visible={ferdigBehandlet}
                    id="dialog.ferdigbehandlet"
                    etikett={DIALOG_FERDIGBEHANDLET}
                />
            </div>
            <div className="dialoger__dialog-henvendelser">
                {henvendelser.length}
            </div>
        </Lenkepanel>
    );
}

DialogVisning.propTypes = {
    dialog: AppPT.dialog.isRequired,
    erValgt: PT.bool.isRequired,
    aktiviteter: PT.arrayOf(AppPT.aktivitet).isRequired,
};

function Dialoger({ dialog, dialoger, valgtDialog, className, aktiviteter }) {
    return (
        <Innholdslaster avhengigheter={[dialog]}>
            <div className={className}>
                {dialoger.map(d => (
                    <DialogVisning
                        key={d.id}
                        dialog={d}
                        erValgt={d === valgtDialog}
                        aktiviteter={aktiviteter}
                    />
                ))}
            </div>
        </Innholdslaster>
    );
}

Dialoger.propTypes = {
    className: PT.string,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    aktiviteter: PT.arrayOf(AppPT.aktivitet).isRequired,
    dialog: AppPT.reducer.isRequired,
    valgtDialog: AppPT.dialog,
};

Dialoger.defaultProps = {
    className: undefined,
    valgtDialog: undefined,
};

const mapStateToProps = state => {
    const dialog = state.data.dialog;
    const dialoger = dialog.data.filter(d => dialogFilter(d, state));
    return {
        dialog,
        dialoger,
        aktiviteter: state.data.aktiviteter.data,
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Dialoger);
