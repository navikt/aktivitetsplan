import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { HjelpetekstHoyre } from 'nav-frontend-hjelpetekst';
import useFormstate from '@nutgaard/use-formstate';
import { selectDialogStatus } from '../../../dialog/dialog-selector';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../../proptypes';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import { STATUS } from '../../../../ducks/utils';
import { apneDialog } from '../underelement-for-aktivitet/underelementer-view-reducer';
import { loggForhandsorienteringTiltak } from '../../../../felles-komponenter/utils/logging';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';
import Checkbox from '../../../../felles-komponenter/skjema/input/checkbox';

const label = (
    <div className="forhandsorientering-arena-aktivitet">
        <EtikettLiten className="avtalt-tekst-etikett">
            Tekst til brukeren
        </EtikettLiten>
        <HjelpetekstHoyre>
            Brukeren får en SMS eller e-post via kontaktinformasjon som brukeren
            selv har registrert i det offentlige kontaktregisteret. Brukeren får
            beskjed om en viktig oppgave og det lenkes til dialog. Beskjeden
            sendes gjennom Altinn etter en halv time. Sender du flere
            forhåndsorienteringer innen en halv time så blir det kun sendt én
            SMS eller e-post.
        </HjelpetekstHoyre>
    </div>
);

const initalValue =
    'Du kan få redusert utbetaling av arbeidsavklaringspenger med én stønadsdag hvis du lar være å ' +
    '[komme på møtet vi har innkalt deg til [dato]/ møte på … /levere ... innen [dato]] uten rimelig grunn. ' +
    'Dette går fram av folketrygdloven § 11-9.';

function validate(val) {
    if (val.trim().length === 0) {
        return 'Du må fylle ut teksten';
    }
    if (val.length > 500) {
        return 'Du må korte ned teksten til 500 tegn';
    }

    return null;
}

const validator = useFormstate({
    text: validate,
    checked: () => null,
});

function ForhandsorieteringsForm(props) {
    const { visible, dialogStatus, onSubmit } = props;

    const state = validator({
        text: initalValue,
        checked: '',
    });

    if (!visible) {
        return null;
    }

    const lasterData = dialogStatus !== STATUS.OK;

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <Undertittel>
                {'Tiltaket er automatisk merket "Avtalt med NAV"'}
            </Undertittel>

            <Checkbox
                label="Send forhåndsorientering for §11-9 (AAP)"
                disabled={lasterData}
                {...state.fields.checked}
            />
            <VisibleIfDiv visible={state.fields.checked.input.value === 'true'}>
                <Textarea
                    label={label}
                    maxLength={500}
                    {...state.fields.text}
                />
                <Knapp spinner={lasterData} autoDisableVedSpinner>
                    Bekreft og send
                </Knapp>
            </VisibleIfDiv>
        </form>
    );
}

ForhandsorieteringsForm.propTypes = {
    visible: PT.bool.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    dialogStatus: AppPT.status.isRequired,
    onSubmit: PT.func.isRequired,
    forhandsorienteringSendt: PT.func.isRequired,
    skalSendeForhandsorientering: PT.bool,
};

ForhandsorieteringsForm.defaultProps = {
    skalSendeForhandsorientering: false,
};

const mapStateToProps = state => {
    return {
        dialogStatus: selectDialogStatus(state),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: data => {
        console.log(data);
        return sendForhandsorientering({
            aktivitetId: props.valgtAktivitet.id,
            tekst: data.text,
            overskrift: props.valgtAktivitet.tittel,
        })(dispatch).then(() => {
            dispatch(apneDialog());
            props.forhandsorienteringSendt();
            loggForhandsorienteringTiltak();
            document.querySelector('.aktivitet-modal').focus();
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    ForhandsorieteringsForm
);
