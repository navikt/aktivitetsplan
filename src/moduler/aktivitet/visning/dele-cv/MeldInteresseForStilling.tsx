import { Alert, BodyShort, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import { formaterDatoManed } from '../../../../utils';
import { dagerSiden, todayIsoString } from '../../../../utils/dateUtils';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import { oppdaterCVSvar } from '../../aktivitet-actions';
import { Ingress } from './DeleCvContainer';
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
        before: new Date(syvDagerFoerOpprettet),
        after: new Date(todayIsoString()),
    };

    return (
        <form
            className={'bg-surface-subtle rounded-md border-border-default border p-4 space-y-8'}
            onSubmit={state.onSubmit(onSubmit)}
            noValidate
        >
            <div className="flex flex-col">
                <Heading size="medium" level="2">
                    {overskrift}
                </Heading>
                <Ingress className="mt-1" />
                <BodyShort className="mt-1">Svar før: {formaterDatoManed(svarfrist)}</BodyShort>
            </div>
            <SvarPaaVegneAvBruker datoBegrensninger={datobegrensninger} formhandler={state.fields.avtaltDato} />
            <RadioGroup
                legend={overskrift}
                hideLegend
                onChange={onChange}
                role="radiogroup"
                error={state.submittoken && state.fields.kanDeles.error}
            >
                <Radio id="kanDeles" value={SvarType.JA.toString()}>
                    {JaSvarTekst}
                </Radio>
                <Radio value={SvarType.NEI.toString()}>{NeiSvarTekst}</Radio>
            </RadioGroup>

            {erVeileder && state.submittoken && <FormErrorSummary errors={state.errors} />}
            <div className="flex gap-4 items-center mt-8">
                <Button disabled={state.submitting}>Send svar</Button>
                {infoTekst && (
                    <Alert variant="info" inline>
                        {infoTekst}
                    </Alert>
                )}
            </div>
        </form>
    );
};
