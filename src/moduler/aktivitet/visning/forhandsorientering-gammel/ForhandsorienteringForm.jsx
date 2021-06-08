import useFormstate from '@nutgaard/use-formstate';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Knapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel, Undertekst } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { STATUS } from '../../../../api/utils';
import Checkbox from '../../../../felles-komponenter/skjema/input/Checkbox';
import Select from '../../../../felles-komponenter/skjema/input/Select';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import { loggForhandsorienteringTiltak } from '../../../../felles-komponenter/utils/logging';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../../proptypes';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import { selectDialogStatus } from '../../../dialog/dialog-selector';

export const SEND_FORHANDSORIENTERING = 'send_forhandsorientering';
export const SEND_PARAGRAF_11_9 = 'send_paragraf_11_9';

const label = (
    <div className="forhandsorientering-arena-aktivitet">
        <Undertekst>Tekst til brukeren</Undertekst>
        <Hjelpetekst>
            <div className="max-width-300">
                Brukeren får en SMS eller e-post via kontaktinformasjon som brukeren selv har registrert i det
                offentlige kontaktregisteret. Brukeren får beskjed om en viktig oppgave og det lenkes til dialog.
                Beskjeden sendes gjennom Altinn etter en halv time. Sender du flere forhåndsorienteringer innen en halv
                time så blir det kun sendt én SMS eller e-post.
            </div>
        </Hjelpetekst>
    </div>
);

const avtaltTekst =
    'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at ' +
    'stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ' +
    'ber vi deg ta kontakt med veilederen din så snart som mulig.';

const avtaltTekst119 =
    'Du kan få redusert utbetaling av arbeidsavklaringspenger med én stønadsdag hvis du lar være å ' +
    '[komme på møtet vi har innkalt deg til [dato]/ møte på … /levere ... innen [dato]] uten rimelig grunn. Dette går ' +
    'fram av folketrygdloven § 11-9.';

function validate(val) {
    if (val.trim().length === 0) {
        return 'Du må fylle ut teksten';
    }
    if (val.length > 500) {
        return 'Du må korte ned teksten til 500 tegn';
    }
}

const ForhandsorieteringsForm = (props) => {
    const { visible, dialogStatus, onSubmit } = props;

    const validator = useFormstate({
        text: validate,
        checked: () => undefined,
        avtaltSelect: () => undefined,
    });

    const state = validator({
        text: avtaltTekst119,
        avtaltSelect: SEND_FORHANDSORIENTERING,
        checked: '',
    });

    if (!visible) {
        return null;
    }

    const lasterData = dialogStatus !== STATUS.OK;
    const avtaltSelect = state.fields.avtaltSelect.input.value;

    return (
        <form onSubmit={state.onSubmit(onSubmit)} noValidate>
            <Undertittel>Tiltaket er automatisk merket "Avtalt med NAV"</Undertittel>

            <SkjemaGruppe>
                <Checkbox label="Send forhåndsorientering" disabled={lasterData} {...state.fields.checked} />

                <VisibleIfDiv
                    visible={state.fields.checked.input.value === 'true'}
                    className="forhandsorientering-arena-innhold"
                >
                    <Select
                        label="Velg type forhåndsorientering"
                        disabled={lasterData}
                        noBlankOption
                        {...state.fields.avtaltSelect}
                    >
                        <option value={SEND_FORHANDSORIENTERING}>Send forhåndsorientering (standard melding)</option>
                        <option value={SEND_PARAGRAF_11_9}>Send forhåndsorientering for §11-9 (AAP)</option>
                    </Select>
                    <VisibleIfDiv visible={avtaltSelect === SEND_FORHANDSORIENTERING}>
                        <Normaltekst className="blokk-xs">{avtaltTekst}</Normaltekst>
                    </VisibleIfDiv>

                    <VisibleIfDiv visible={avtaltSelect === SEND_PARAGRAF_11_9}>
                        <Textarea label={label} maxLength={500} {...state.fields.text} />
                    </VisibleIfDiv>

                    <Knapp spinner={lasterData} autoDisableVedSpinner>
                        Bekreft og send
                    </Knapp>
                </VisibleIfDiv>
            </SkjemaGruppe>
        </form>
    );
};

ForhandsorieteringsForm.propTypes = {
    visible: PT.bool.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    dialogStatus: AppPT.status.isRequired,
    onSubmit: PT.func.isRequired,
    forhandsorienteringSendt: PT.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        dialogStatus: selectDialogStatus(state),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: (data) => {
        const text = data.avtaltSelect === SEND_FORHANDSORIENTERING ? avtaltTekst : data.text;
        return sendForhandsorientering({
            aktivitetId: props.valgtAktivitet.id,
            tekst: text,
            overskrift: props.valgtAktivitet.tittel,
        })(dispatch).then(() => {
            props.forhandsorienteringSendt();
            loggForhandsorienteringTiltak();
            document.querySelector('.aktivitet-modal').focus();
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForhandsorieteringsForm);
