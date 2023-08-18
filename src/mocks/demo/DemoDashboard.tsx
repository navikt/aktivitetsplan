import { Checkbox, CheckboxGroup, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';

import Hurtigfilter from './Hurtigfilter';
import {
    LocalStorageElement,
    aktivitetFeilet,
    arenaFeilet,
    dialogFeilet,
    erEksternBruker,
    erEskalertBruker,
    erEskalertBrukerGammel,
    erKRRBruker,
    erManuellBruker,
    erPrivatBruker,
    ikkeLoggetInnNivaa4,
    ingenMal,
    ingenOppfPerioder,
    maalFeilet,
    nivaa4Feilet,
    oppdateringKunFeiler,
    oppfFeilet,
    settLocalStorage,
    ulesteDialoger,
    visArenaAktiviteter,
    visAutomatiskeAktiviteter,
    visEksterneAktiviteter,
    visTestAktiviteter,
} from './localStorage';

const brukertype = {
    ekstern: 'eksternbruker',
    veileder: 'veilederbruker',
};

interface Checkable {
    label: string;
    id: string;
    checked: boolean;
}

const getChecked = (values: Checkable[]): string[] => {
    return values.filter((it) => it.checked).map((it) => it.id);
};

const DemoDashboard = () => {
    const radios = [
        {
            label: 'Veileder',
            id: brukertype.veileder,
            value: brukertype.veileder,
        },
        {
            label: 'Eksternbruker',
            id: brukertype.ekstern,
            value: brukertype.ekstern,
        },
    ];
    const features = [
        {
            label: 'Ikke under oppfølging',
            id: LocalStorageElement.PRIVAT_BRUKER,
            checked: erPrivatBruker(),
        },
        {
            label: 'Manuell',
            id: LocalStorageElement.MANUELL_BRUKER,
            checked: erManuellBruker(),
        },
        {
            label: 'KRR',
            id: LocalStorageElement.KRR_BRUKER,
            checked: erKRRBruker(),
        },
        {
            label: 'Ikke innlogget med nivå 4',
            id: LocalStorageElement.INNLOGGET_NIVAA4,
            checked: ikkeLoggetInnNivaa4(),
        },
        {
            label: 'Ingen oppfølgingsperioder',
            id: LocalStorageElement.INGEN_OPPF_PERIODER,
            checked: ingenOppfPerioder(),
        },
        {
            label: 'Gammel eskaleringsvarsel',
            id: LocalStorageElement.GAMMEL_ESKALERT_BRUKER,
            checked: erEskalertBrukerGammel(),
        },
        {
            label: 'Eskaleringsvarsel',
            id: LocalStorageElement.ESKALERT_BRUKER,
            checked: erEskalertBruker(),
        },
        {
            label: 'Uleste dialoger',
            id: LocalStorageElement.ULESTE_DIALOGER,
            checked: ulesteDialoger(),
        },
    ];
    const aktivitetTilstand = [
        {
            label: 'Automatiske aktiviteter',
            id: LocalStorageElement.AUTOMATISKE_AKTIVITETER,
            checked: visAutomatiskeAktiviteter(),
        },
        {
            label: 'Arenaaktiviteter',
            id: LocalStorageElement.ARENA_AKTIVITETER,
            checked: visArenaAktiviteter(),
        },
        {
            label: 'Testaktiviteter',
            id: LocalStorageElement.TEST_AKTIVITETER,
            checked: visTestAktiviteter(),
        },
        {
            label: 'Eksterne aktiviteter',
            id: LocalStorageElement.EKSTERNE_AKTIVITETER,
            checked: visEksterneAktiviteter(),
        },
    ];
    const feiltilstander = [
        {
            label: 'Oppfølging feiler',
            id: LocalStorageElement.OPPF_FEILET,
            checked: oppfFeilet(),
        },
        {
            label: 'Dialog feiler',
            id: LocalStorageElement.DIALOG_FEILET,
            checked: dialogFeilet(),
        },
        {
            label: 'Aktivitet feiler',
            id: LocalStorageElement.AKTIVITET_FEILET,
            checked: aktivitetFeilet(),
        },
        {
            label: 'Arena feiler',
            id: LocalStorageElement.ARENA_FEILET,
            checked: arenaFeilet(),
        },
        {
            label: 'Mål feiler',
            id: LocalStorageElement.MAAL_FEILET,
            checked: maalFeilet(),
        },
        {
            label: 'Kun oppdatering feiler',
            id: LocalStorageElement.OPPDATERING_KUN_FEILER,
            checked: oppdateringKunFeiler(),
        },
        {
            label: 'Nivå 4 feiler',
            id: LocalStorageElement.NIVAA4_FEILET,
            checked: nivaa4Feilet(),
        },
    ];

    const endreTilstand = (e: React.MouseEvent<HTMLInputElement>) => {
        const checkbox = e.currentTarget;
        settLocalStorage(checkbox.id, checkbox.checked);
        window.location.reload();
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
