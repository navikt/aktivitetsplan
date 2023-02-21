import { WarningColored } from '@navikt/ds-icons';
import { Alert, Button, Radio, RadioGroup } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import { RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import { formaterDatoManed } from '../../../../utils';
import { dagerSiden, todayIsoString } from '../../../../utils/dateUtils';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import { oppdaterCVSvar } from '../../aktivitet-actions';
import detaljVisningStyles from '../Aktivitetsvisning.module.less';
import { Ingress } from './DeleCvContainer';
import styles from './MeldInteresseForStilling.module.less';
import { SvarPaaVegneAvBruker } from './SvarPaaVegneAvBruker';
import { JaSvarTekst, NeiSvarTekst, overskrift } from './tekster';

enum SvarType {
    JA = 'ja',
    NEI = 'nei',
}

interface PropTypes {
    aktivitet: StillingFraNavAktivitet;
}

type KanDeles = {
    kanDeles: string;
    avtaltDato: string;
};
type ValidatorProps = {
    erVeileder: boolean;
    opprettetDato: string;
};

export const MeldInteresseForStilling = ({ aktivitet }: PropTypes) => {
    const [infoTekst, setInfoTekst] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();

    const erVeileder = useSelector(selectErVeileder);
    const opprettetDato = aktivitet.opprettetDato;

    const syvDagerFoerOpprettet = dagerSiden(opprettetDato, 7) ?? '';

    const validator = useFormstate<KanDeles, ValidatorProps>({
        avtaltDato: (value, values, props) => {
            if (!props.erVeileder) return;
            if (props.erVeileder && !value) return 'Du må fylle ut datoen for når du var i dialog med brukeren';
            if (value < syvDagerFoerOpprettet)
                return 'Dato for dialog kan ikke være mer enn syv dager før kortet ble opprettet';
            if (value > todayIsoString()) return 'Dato for dialog kan ikke være frem i tid';
        },
        kanDeles: (value) => {
            if (!value) return 'Du må svare ja eller nei';
        },
    });

    const state = validator({ kanDeles: '', avtaltDato: '' }, { erVeileder, opprettetDato });

    const onChange = (value: string) => {
        if (value === SvarType.JA) {
            setInfoTekst('Stillingen flyttes til "Gjennomfører"');
        }
        if (value === SvarType.NEI) {
            setInfoTekst('Stillingen flyttes til "Avbrutt"');
        }
        state.setValue('kanDeles', value);
    };

    const onSubmit = (data: KanDeles) => {
        dispatch(
            oppdaterCVSvar(
                aktivitet.id,
                aktivitet.versjon,
                data.kanDeles === SvarType.JA,
                data.avtaltDato
            ) as unknown as AnyAction
        );
        return Promise.resolve();
    };

    const svarfrist = aktivitet.stillingFraNavData?.svarfrist;
    const datobegrensninger = {
        minDate: syvDagerFoerOpprettet,
        maxDate: todayIsoString(),
    };

    return (
        <form className={detaljVisningStyles.underseksjon} onSubmit={state.onSubmit(onSubmit)} noValidate>
            <div className="mt-4" />
            <SvarPaaVegneAvBruker formhandler={state.fields.avtaltDato} />
            <RadioGroup
                legend={
                    <div className="flex">
                        <WarningColored className="mr-2" />
                        {overskrift}
                    </div>
                }
                onChange={onChange}
                aria-label={overskrift}
                role="radiogroup"
                className="inputPanelGruppe"
                error={state.submittoken && state.fields.kanDeles.error}
            >
                <Normaltekst className={styles.svarfrist}>Svar før: {formaterDatoManed(svarfrist)}</Normaltekst>
                <Radio id="kanDeles" value={SvarType.JA.toString()}>
                    {JaSvarTekst}
                </Radio>
                <Radio value={SvarType.NEI.toString()}>{NeiSvarTekst}</Radio>
            </RadioGroup>
            <Ingress />
            {infoTekst && <Alert children={infoTekst} variant="info" inline className="mt-4" />}
            {erVeileder && <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />}
            <Button className={styles.knapp} disabled={state.submitting}>
                Lagre
            </Button>
        </form>
    );
};
