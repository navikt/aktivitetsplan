import { Select } from '@navikt/ds-react';
import { format, parseISO } from 'date-fns';
import React, { ChangeEventHandler, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { selectSorterteOppfolgingsperioder } from '../../oppfolging-status/oppfolging-selector';
import { selectValgtPeriodeId, velgPeriode } from './valgt-periode-slice';
import { OppfolgingsPeriodeId } from '../../../datatypes/brandedTypes';
import { selectAktivitetStatus } from '../../aktivitet/aktivitet-selector';
import { Status } from '../../../store/createGenericSlice';

const PeriodeFilter = () => {
    const perioder = useSelector(selectSorterteOppfolgingsperioder);
    const historiskePerioder = perioder.filter((periode) => !!periode.slutt);
    const harHistoriskePerioder = historiskePerioder.length > 0;

    const dispatch = useAppDispatch();

    const nyestePeriode = perioder.length > 0 ? perioder[0] : null;
    const valgtPeriodeId = useSelector(selectValgtPeriodeId);
    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const perioderErLastet = aktivitetStatus === Status.OK;
    const perioderForSelect = perioderErLastet ? perioder : [];

    useEffect(() => {
        if (!!nyestePeriode && !valgtPeriodeId) {
            dispatch(velgPeriode(nyestePeriode.id));
        }
    }, [perioder]);

    if (!harHistoriskePerioder) return null;
    // 0 periode? - ikke vis dropdown - har ikke hist
    // Kun 1 aktiv periode - IKKE vis dropdown -- har ikke hist
    // Kun 1 historisk periode - vis dropdown
    // Alt annet - vis dropdown

    const onPeriodeChange: ChangeEventHandler<HTMLSelectElement> = (val) => {
        const selectedPeriodeId = val.target.value as OppfolgingsPeriodeId;
        dispatch(velgPeriode(selectedPeriodeId));
    };

    return (
        <div className="flex items-start">
            <Select
                className="w-full sm:w-64"
                hideLabel
                autoComplete="on"
                defaultValue={nyestePeriode?.id}
                label="Periode"
                value={valgtPeriodeId || undefined}
                onChange={onPeriodeChange}
                disabled={!perioderErLastet}
            >
                {perioderForSelect.map(({ start, slutt, id }) => {
                    let fraDato = undefined;
                    try {
                        fraDato = format(parseISO(start), 'dd. MMM yyyy');
                    } catch (error) {
                        throw Error(`Error parsing date: ${start}`, { cause: error });
                    }
                    const navn =
                        slutt === undefined || slutt === null
                            ? 'Nåværende periode'
                            : `${fraDato} - ${format(parseISO(slutt), 'dd. MMM yyyy')}`;
                    return (
                        <option value={id} key={id}>
                            {navn}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default PeriodeFilter;
