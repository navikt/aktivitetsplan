import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { formValueSelector } from 'redux-form';
import { HjelpetekstHoyre } from 'nav-frontend-hjelpetekst';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import {
    begrensetForhandsorienteringLengde,
    pakrevdForhandsorienteringLengde,
} from '../avtalt-container/avtalt-form';
import { selectDialogStatus } from '../../../dialog/dialog-selector';
import Checkbox from '../../../../felles-komponenter/skjema/input/checkbox';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../../proptypes';
import visibleIfHOC from '../../../../hocs/visible-if';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import { STATUS } from '../../../../ducks/utils';
import { apneDialog } from '../underelement-for-aktivitet/underelementer-view-reducer';
import { loggForhandsorienteringTiltak } from '../../../../felles-komponenter/utils/logging';

function ForhandsorieteringsForm({
    handleSubmit,
    dialogStatus,
    skalSendeForhandsorientering,
    forhandsorienteringSendt,
}) {
    const lasterData = dialogStatus !== STATUS.OK;
    const oppdaterer = dialogStatus === STATUS.RELOADING;

    return (
        <form
            onSubmit={formdata => {
                handleSubmit(formdata);
                forhandsorienteringSendt();
                loggForhandsorienteringTiltak();
            }}
        >
            <Undertittel>
                <FormattedMessage id="forhandsorientering.arenaaktivitet.tittel" />
            </Undertittel>

            <Checkbox
                labelId="forhandsorientering.arenaaktivitet.checkbox"
                name="forhandsorientering"
                feltNavn="forhandsorienteringArenaAktivitetCheckbox"
                disabled={lasterData}
            />
            <VisibleIfDiv visible={skalSendeForhandsorientering}>
                <div className="forhandsorientering-arena-aktivitet">
                    <EtikettLiten className="avtalt-tekst-etikett">
                        <FormattedMessage id="sett-avltalt-tekst-som-sendes" />
                    </EtikettLiten>
                    <HjelpetekstHoyre>
                        <FormattedMessage id="sett-avtalt-teskt-som-sendes-hjelpetekst" />
                    </HjelpetekstHoyre>
                </div>
                <Textarea feltNavn="avtaltText119" maxLength={500} />
                <Knapp spinner={oppdaterer} disabled={lasterData}>
                    <FormattedMessage id="forhandsorientering.arenaaktivitet.bekreft-og-send" />
                </Knapp>
            </VisibleIfDiv>
        </form>
    );
}

ForhandsorieteringsForm.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    dialogStatus: AppPT.status.isRequired,
    handleSubmit: PT.func.isRequired,
    forhandsorienteringSendt: PT.func.isRequired,
    skalSendeForhandsorientering: PT.bool,
};

ForhandsorieteringsForm.defaultProps = {
    skalSendeForhandsorientering: false,
};

const formNavn = 'send-forhandsorientering-arena-aktivitet-form';
const ForhandsorienteringArenaAktivitetForm = validForm({
    form: formNavn,
    enableReinitialize: false,
    validate: {
        avtaltText119: [
            begrensetForhandsorienteringLengde,
            pakrevdForhandsorienteringLengde,
        ],
    },
})(ForhandsorieteringsForm);

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(formNavn);
    return {
        initialValues: {
            avtaltText119: props.intl.formatMessage({
                id: 'sett-forhandsorienterings-tekst-arena-aktivitet',
            }),
        },
        dialogStatus: selectDialogStatus(state),
        skalSendeForhandsorientering: selector(
            state,
            'forhandsorienteringArenaAktivitetCheckbox'
        ),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: formData => {
        sendForhandsorientering({
            aktivitetId: props.valgtAktivitet.id,
            tekst: formData.avtaltText119,
            overskrift: props.valgtAktivitet.tittel,
        })(dispatch).then(() => {
            dispatch(apneDialog());
            document.querySelector('.aktivitet-modal').focus();
        });
    },
});

export default visibleIfHOC(
    injectIntl(
        connect(mapStateToProps, mapDispatchToProps)(
            ForhandsorienteringArenaAktivitetForm
        )
    )
);
