import { Dropdown, Button, Radio, RadioGroup } from '@navikt/ds-react';
import { ArrowsUpDownIcon } from '@navikt/aksel-icons';
import React from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import { selectSorteringForKolonne } from './sortering-selector';
import {
    setSorteringForKolonne,
    Sorteringsfelt,
    Sorteringsrekkefolge,
    SorteringState,
} from './sortering-slice';

interface Props {
    status: AktivitetStatus;
}

const KolonneSortering = ({ status }: Props) => {
    const dispatch = useAppDispatch();
    const sortering = useSelector(selectSorteringForKolonne(status)) as SorteringState;

    const handleFeltChange = (felt: Sorteringsfelt) => {
        dispatch(setSorteringForKolonne({ status, sortering: { ...sortering, felt } }));
    };

    const handleRekkefolgeChange = (rekkefolge: Sorteringsrekkefolge) => {
        dispatch(setSorteringForKolonne({ status, sortering: { ...sortering, rekkefolge } }));
    };

    return (
        <Dropdown>
            <Button
                as={Dropdown.Toggle}
                variant="tertiary-neutral"
                size="xsmall"
                icon={<ArrowsUpDownIcon title="Sorteringsvalg" />}
            />
            <Dropdown.Menu>
                <div className="flex flex-col gap-y-4">
                    <RadioGroup
                        legend="Sorter etter"
                        size="small"
                        value={sortering.felt}
                        onChange={(val) => handleFeltChange(val as Sorteringsfelt)}
                    >
                        <Radio value={Sorteringsfelt.AKTIVITET_DATO}>Startdato for aktivitet</Radio>
                        <Radio value={Sorteringsfelt.OPPRETTET_DATO}>Opprettet tidspunkt</Radio>
                        <Radio value={Sorteringsfelt.ENDRET_DATO}>Endret tidspunkt</Radio>
                    </RadioGroup>
                    <RadioGroup
                        legend="Rekkefølge"
                        size="small"
                        value={sortering.rekkefolge}
                        onChange={(val) => handleRekkefolgeChange(val as Sorteringsrekkefolge)}
                    >
                        <Radio value={Sorteringsrekkefolge.DESC}>Nyeste først</Radio>
                        <Radio value={Sorteringsrekkefolge.ASC}>Eldste først</Radio>
                    </RadioGroup>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default KolonneSortering;
