import { Checkbox, CheckboxGroup, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useState } from 'react';

import Hurtigfilter from './Hurtigfilter';
import { LocalStorageElement, erEksternBruker, ingenMal, settLocalStorage } from './localStorage';
import { aktivitetTilstand, brukertype, features, feiltilstander, radios } from './demoToggles';

interface Checkable {
    label: string;
    id: string;
    checked: () => boolean;
}

const getChecked = (values: Checkable[]): string[] => {
    return values.filter((it) => it.checked()).map((it) => it.id);
};

const DemoDashboard = () => {
    const [render, setRender] = useState(0);

    const endreTilstand = (e: React.MouseEvent<HTMLInputElement>) => {
        const checkbox = e.currentTarget;
        settLocalStorage(checkbox.id, checkbox.checked);
        setRender(render + 1);
        // window.location.reload();
    };

    const endreBrukerType = (value: 'eksternbruker' | 'veilederbruker') => {
        const erVeileder = value === brukertype.veileder;
        settLocalStorage(LocalStorageElement.EKSTERN_BRUKER, !erVeileder);
        window.location.reload();
    };

    const getBrukerType = () => {
        if (erEksternBruker()) {
            return brukertype.ekstern;
        } else return brukertype.veileder;
    };

    return (
        <div className="flex flex-col justify-center items-center p-4 gap-4">
            <Heading level="1" size="large">
                Demo innstillinger
            </Heading>
            <section className="flex flex-wrap gap-4">
                <RadioGroup
                    legend="Brukertype"
                    name="brukertype-rdio-panel"
                    value={getBrukerType()}
                    onChange={endreBrukerType}
                >
                    {radios.map(({ id, label }) => (
                        <Radio key={id} id={id} value={id}>
                            {label}
                        </Radio>
                    ))}
                </RadioGroup>
                <CheckboxGroup value={getChecked(features)} legend={'Brukers tilstand'}>
                    {features.map(({ id, label }) => (
                        <Checkbox key={id} value={id} id={id} onClick={endreTilstand}>
                            {label}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
                <CheckboxGroup value={getChecked(aktivitetTilstand)} legend={'Aktivitet tilstand'}>
                    {aktivitetTilstand.map(({ id, label }) => (
                        <Checkbox key={id} value={id} id={id} onClick={endreTilstand}>
                            {label}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
                <CheckboxGroup value={[ingenMal()]} legend={'Ingen mål'}>
                    {[
                        {
                            label: 'Ingen mål',
                            id: LocalStorageElement.INGEN_MAL,
                            checked: ingenMal(),
                        },
                    ].map(({ id, label }) => (
                        <Checkbox key={id} value={id} id={id} onClick={endreTilstand}>
                            {label}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
                <CheckboxGroup value={getChecked(feiltilstander)} legend="Feiltilstander">
                    {feiltilstander.map(({ id, label }) => (
                        <Checkbox key={id} value={id} id={id} onClick={endreTilstand}>
                            {label}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
                <Hurtigfilter />
            </section>
        </div>
    );
};

export default DemoDashboard;
