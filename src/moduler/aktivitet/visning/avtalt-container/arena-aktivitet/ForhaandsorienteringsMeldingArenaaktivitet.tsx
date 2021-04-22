import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { ForhaandsorienteringType } from '../../../../../datatypes/aktivitetTypes';
import Select from '../../../../../felles-komponenter/skjema/input/Select';
import Textarea from '../../../../../felles-komponenter/skjema/input/Textarea';
import VisibleIfDiv from '../../../../../felles-komponenter/utils/visible-if-div';
import VarslingInfo from '../VarslingInfo';
import styles from './ForhaandsorienteringsMeldingArenaaktivitet.module.less';

interface Props {
    visible: boolean;
    lasterData: boolean;
    state: any;
}

const ForhaandsorienteringsMeldingArenaaktivitet = (props: Props) => {
    const { visible, lasterData, state } = props;
    const valgtForhaandsorienteringType = state.fields.forhaandsorienteringType.input.value;

    if (!visible) {
        return null;
    }

    return (
        <div className={styles.forhandsorienteringArenaInnhold}>
            <Select
                label="Velg type forhåndsorientering"
                disabled={lasterData}
                noBlankOption
                {...state.fields.forhaandsorienteringType}
            >
                <option value={ForhaandsorienteringType.SEND_STANDARD}>Forhåndsorientering (standard melding)</option>
                <option value={ForhaandsorienteringType.SEND_PARAGRAF_11_9}>Forhåndsorientering for §11-9 (AAP)</option>
            </Select>
            <VisibleIfDiv visible={valgtForhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD}>
                <VarslingInfo />
                <Normaltekst className="blokk-xs">
                    Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at
                    stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre
                    aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.
                </Normaltekst>
            </VisibleIfDiv>

            <VisibleIfDiv visible={valgtForhaandsorienteringType === ForhaandsorienteringType.SEND_PARAGRAF_11_9}>
                <Textarea label={<VarslingInfo />} maxLength={500} {...state.fields.tekst} />
            </VisibleIfDiv>

            <Hovedknapp spinner={lasterData} autoDisableVedSpinner>
                Bekreft
            </Hovedknapp>
        </div>
    );
};

export default ForhaandsorienteringsMeldingArenaaktivitet;
