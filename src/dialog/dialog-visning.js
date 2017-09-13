import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';
import * as AppPT from '../proptypes';
import VisibleIfDiv from '../felles-komponenter/utils/visible-if-div';
import history from '../history';
import {
    DIALOG_ESKALERING,
    DIALOG_IKKE_FERDIGBEHANDLET,
    DIALOG_MA_BESVARES,
} from '../constant';
import visibleIfHOC from '../hocs/visible-if';
import Dato from '../felles-komponenter/dato';
import Lenkepanel from '../felles-komponenter/lenkepanel';
import Etikett from '../felles-komponenter/aktivitet-etikett';
import { erEskaleringsDialog } from './dialog-utils';

const Markering = visibleIfHOC(props =>
    <div className="dialoger__markering" {...props} />
);
const Info = visibleIfHOC(({ slash, className, children }) =>
    <span>
        {slash && <Undertekst className="dialoger__slash" />}
        <Undertekst className={className} tag="span">
            {children}
        </Undertekst>
    </span>
);

/* eslint-disable jsx-a11y/no-static-element-interactions */

// eslint-disable-next-line react/prefer-stateless-function
class DialogVisning extends React.Component {
    render() {
        const { dialog, erValgt, aktiviteter, erTabBar } = this.props;

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

        const erEskalering = erEskaleringsDialog(dialog);

        const handleOnFocus = () => {
            if (!erValgt) {
                history.push(`/dialog/${dialog.id}`);
            }
        };

        function Test({ children }) {
            return (
                <div style={{ display: 'inline-block' }}>
                    {children}
                </div>
            );
        }

        const ikkeFerdigbehandlet = !ferdigBehandlet;

        return (
            <Lenkepanel
                tabIndex={erTabBar ? '0' : '-1'}
                onFocus={handleOnFocus}
                className={dialogCls(erValgt, !dialog.lest)}
                customComponent={Test}
                href={`/dialog/${dialog.id}`}
            >
                <Markering visible={!dialog.lest} />
                <div>
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
                <VisibleIfDiv
                    visible={
                        venterPaSvar || ikkeFerdigbehandlet || erEskalering
                    }
                    className="dialoger__dialog-etiketter"
                >
                    <Etikett
                        visible={venterPaSvar}
                        id="dialog.venter-pa-svar"
                        etikett={DIALOG_MA_BESVARES}
                    />
                    <Etikett
                        visible={ikkeFerdigbehandlet}
                        id="dialog.ikke-ferdigbehandlet"
                        etikett={DIALOG_IKKE_FERDIGBEHANDLET}
                    />
                    <Etikett
                        visible={erEskalering}
                        id="dialog.eskalert-melding"
                        etikett={DIALOG_ESKALERING}
                    />
                </VisibleIfDiv>
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
};

export default DialogVisning;
