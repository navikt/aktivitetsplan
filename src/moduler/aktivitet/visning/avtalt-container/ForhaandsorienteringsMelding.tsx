import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { EtikettLiten, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import Select from '../../../../felles-komponenter/skjema/input/select';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import InternLenke from '../../../../felles-komponenter/utils/InternLenke';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { IKKE_SEND_FORHANDSORIENTERING, SEND_FORHANDSORIENTERING, SEND_PARAGRAF_11_9 } from './AvtaltForm';
import styles from './ForhaandsorientringsMelding.module.less';

function InfoHeader() {
    return (
        <div>
            <EtikettLiten className={styles.avtaltTekstEtikett}>Tekst til brukeren</EtikettLiten>
            <Hjelpetekst>
                <div className="max-width-300">
                    Brukeren får en SMS eller e-post via kontaktinformasjon som brukeren selv har registrert i det
                    offentlige kontaktregisteret. Brukeren får beskjed om en viktig oppgave og det lenkes til dialog.
                    Beskjeden sendes gjennom Altinn etter en halv time. Sender du flere forhåndsorienteringer innen en
                    halv time så blir det kun sendt én SMS eller e-post.
                </div>
            </Hjelpetekst>
        </div>
    );
}

interface Props {
    hidden: boolean;
    oppdaterer: boolean;
    state: any;
    aktivitetId: string;
}

function ForhaandsorienteringMelding(props: Props) {
    const { hidden, oppdaterer, state, aktivitetId } = props;
    const avtaltSelect = state.fields.avtaltSelect.input.value;

    if (hidden) {
        return null;
    }

    return (
        <div>
            <Select
                label="Velg type forhåndsorientering"
                disabled={oppdaterer}
                noBlankOption
                {...state.fields.avtaltSelect}
            >
                <option value={SEND_FORHANDSORIENTERING}>Send forhåndsorientering (standard melding)</option>
                <option value={SEND_PARAGRAF_11_9}>Send forhåndsorientering for §11-9 (AAP)</option>
                <option value={IKKE_SEND_FORHANDSORIENTERING}>Ikke send forhåndsorientering</option>
            </Select>
            <VisibleIfDiv visible={avtaltSelect !== IKKE_SEND_FORHANDSORIENTERING}>
                <VisibleIfDiv visible={avtaltSelect === SEND_FORHANDSORIENTERING}>
                    <InfoHeader />
                    <Normaltekst className="blokk-xs">
                        Det er viktig at du gjennomfører{' '}
                        <InternLenke href={`/aktivitet/vis/${aktivitetId}`}>denne aktiviteten</InternLenke> med NAV.
                        Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller
                        stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så
                        snart som mulig.
                    </Normaltekst>
                </VisibleIfDiv>
                <VisibleIfDiv visible={avtaltSelect === SEND_PARAGRAF_11_9}>
                    <Textarea label={<InfoHeader />} maxLength={500} {...state.fields.avtaltText119} />
                </VisibleIfDiv>
            </VisibleIfDiv>
        </div>
    );
}

export default ForhaandsorienteringMelding;
