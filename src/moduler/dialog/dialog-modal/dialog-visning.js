import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import { withRouter } from 'react-router-dom';
import * as AppPT from '../../../proptypes';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import {
    DIALOG_ESKALERING,
    DIALOG_IKKE_FERDIGBEHANDLET,
    DIALOG_MA_BESVARES,
} from '../../../constant';
import visibleIfHOC from '../../../hocs/visible-if';
import Dato from '../../../felles-komponenter/dato';
import Lenkepanel from '../../../felles-komponenter/lenkepanel';
import Etikett from '../../../felles-komponenter/aktivitet-etikett/aktivitet-etikett';
import { erEskaleringsDialog, erParagraf8Dialog } from '../dialog-utils';

const Markering = visibleIfHOC(props =>
    <div className="dialoger__markering" {...props} />
);
const Info = visibleIfHOC(({ slash, className, children }) =>
    <span>
        {slash &&
            <Undertekst className="dialoger__slash">
                <span />
            </Undertekst>}
        <Undertekst className={className} tag="span">
            {children}
        </Undertekst>
    </span>
);

/* eslint-disable jsx-a11y/no-static-element-interactions */

// eslint-disable-next-line react/prefer-stateless-function
class DialogVisning extends React.PureComponent {
    render() {
        const { dialog, erValgt, aktiviteter, erTabBar, history } = this.props;

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

        const erViktigMelding =
            erEskaleringsDialog(dialog) || erParagraf8Dialog(dialog);

        const handleOnFocus = () => {
            if (!erValgt) {
                history.push(`/dialog/${dialog.id}`);
            }
        };

        return (
            <Lenkepanel
                tabIndex={erTabBar ? '0' : '-1'}
                onFocus={handleOnFocus}
                className={dialogCls(erValgt, !dialog.lest)}
                href={`/dialog/${dialog.id}`}
                aria-expanded={erValgt}
            >
                <Markering visible={!dialog.lest} />
                <div className="dialoger__dialog--smuler">
                    <Info>
                        <Dato>
                            {dialog.sisteDato}
                        </Dato>
                    </Info>
                    <Info visible={harAktivitetType} slash>
                        <FormattedMessage
                            id={`aktivitet.type.${aktivitetType}`.toLowerCase()}
                        />
                    </Info>
                    <Info
                        visible={
                            dialog.erLestAvBruker && harHenvendelseFraVeileder
                        }
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
                <HiddenIfDiv
                    hidden={
                        !venterPaSvar && ferdigBehandlet && !erViktigMelding
                    }
                    className="dialoger__dialog-etiketter"
                >
                    <Etikett
                        hidden={!venterPaSvar}
                        id="dialog.venter-pa-svar-etikett"
                        etikett={DIALOG_MA_BESVARES}
                    />
                    <Etikett
                        hidden={ferdigBehandlet}
                        id="dialog.ikke-ferdigbehandlet"
                        etikett={DIALOG_IKKE_FERDIGBEHANDLET}
                    />
                    <Etikett
                        hidden={!erViktigMelding}
                        id="dialog.eskalert-melding"
                        etikett={DIALOG_ESKALERING}
                    />
                </HiddenIfDiv>
                <div className="dialoger__dialog-henvendelser">
                    {henvendelser.length}
                </div>
            </Lenkepanel>
        );
    }
}

DialogVisning.propTypes = {
    dialog: AppPT.dialog.isRequired,
    erValgt: PT.bool.isRequired,
    erTabBar: PT.bool.isRequired,
    aktiviteter: PT.arrayOf(AppPT.aktivitet).isRequired,
    history: AppPT.history.isRequired,
};

export default withRouter(DialogVisning);
