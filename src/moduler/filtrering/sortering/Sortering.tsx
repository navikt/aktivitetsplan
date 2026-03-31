import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { preventCloseOnInsideClick, useOutsideClick } from '../../../felles-komponenter/skjema/datovelger/common';
import {
    setSortering,
    Sorteringsfelt,
    Sorteringsrekkefolge,
} from './sortering-slice';
import { selectSortering } from './sortering-selector';

const Sortering = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const sortering = useSelector(selectSortering);

    const handleClickOutside = () => setOpen(false);
    useOutsideClick(open, handleClickOutside);

    const handleFeltChange = (felt: Sorteringsfelt) => {
        dispatch(setSortering({ felt, rekkefolge: sortering.rekkefolge }));
    };

    const handleRekkefolgeChange = (rekkefolge: Sorteringsrekkefolge) => {
        dispatch(setSortering({ felt: sortering.felt, rekkefolge }));
    };

    return (
        <div onClick={preventCloseOnInsideClick} className="self-stretch sm:self-auto">
            <Button
                variant="secondary"
                className="relative w-full"
                onClick={() => setOpen(!open)}
            >
                Sorter
            </Button>
            {open ? (
                <div className="rounded-md absolute p-4 bg-white border border-ax-border-neutral z-10 w-72 flex flex-col gap-y-4">
                    <RadioGroup
                        legend="Sorter etter"
                        size="small"
                        value={sortering.felt}
                        onChange={(val) => handleFeltChange(val as Sorteringsfelt)}
                    >
                        <Radio value={Sorteringsfelt.ENDRET_DATO}>Endret tidspunkt</Radio>
                        <Radio value={Sorteringsfelt.AKTIVITET_DATO}>Dato for aktivitet</Radio>
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
            ) : null}
        </div>
    );
};

export default Sortering;
