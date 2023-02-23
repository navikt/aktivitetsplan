import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import { AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import Innholdslaster, { Avhengighet } from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { OPNE_AKTIVITETFILTER } from '../../felles-komponenter/utils/logging';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import { selectAktiviterForAktuellePerioden, selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import AktivitetStatusFilter from './filter/AktivitetStatusFilter';
import AktivitetTypeFilter from './filter/AktivitetTypeFilter';
import ArenaEtikettFilter from './filter/ArenaEtikettFilter';
import AvtaltMedNavFilter from './filter/AvtaltFilter';
import EtikettFilter from './filter/EtikettFilter';

function sjekkAttFinnesFilteringsAlternativ(aktivitetsListe: AlleAktiviteter[]) {
    const muligeFilterKombinasjoner = aktivitetsListe.reduce(
        (res, aktivitet) => {
            const { status, type, etikett, avtalt } = aktivitet;
            res.muligeStatus.add(status);
            res.muligeTyper.add(type);
            if (etikett) {
                if (isArenaAktivitet(aktivitet)) {
                    res.muligeArenaEtiketter.add(etikett);
                } else {
                    res.muligeEtiketter.add(etikett);
                }
            }
            res.muligeAvtalt.add(avtalt);
            return res;
        },
        {
            muligeStatus: new Set(),
            muligeTyper: new Set(),
            muligeEtiketter: new Set(),
            muligeArenaEtiketter: new Set(),
            muligeAvtalt: new Set(),
        }
    );

    return Object.keys(muligeFilterKombinasjoner).reduce(
        (acc, key) => muligeFilterKombinasjoner[key as keyof typeof muligeFilterKombinasjoner].size > 1 || acc,
        false
    );
}

interface Props {
    avhengigheter: Avhengighet[];
    harAktivitet: boolean;
    className: string;
}

function Filter({ avhengigheter, harAktivitet, className }: Props) {
    const [open, setOpen] = useState(false);
    /*
    const resolvedClassNames = classNames(className, 'filter', {
        skjult: !harAktivitet,
    });*/
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <VisibleIfDiv className="relative">
                <Button
                    variant="secondary"
                    name="filter"
                    className="relative"
                    onClick={() => {
                        setOpen(!open);
                        loggEvent(OPNE_AKTIVITETFILTER);
                    }}
                >
                    Filtrer
                </Button>
                {open ? (
                    <div className="rounded-md absolute p-4 bg-white border z-10 w-96 max-h-screen-h-1/2 overflow-auto">
                        <AvtaltMedNavFilter />
                        <EtikettFilter />
                        <ArenaEtikettFilter />
                        <AktivitetStatusFilter />
                        <AktivitetTypeFilter />
                    </div>
                ) : null}
            </VisibleIfDiv>
        </Innholdslaster>
    );
}

Filter.defaultProps = {
    harAktivitet: true,
    className: '',
};

const mapStateToProps = (state: any) => {
    const aktiviteter = selectAktiviterForAktuellePerioden(state);
    const harAktivitet = aktiviteter.length > 1 && sjekkAttFinnesFilteringsAlternativ(aktiviteter);
    return {
        avhengigheter: [selectAktivitetListeStatus(state)],
        harAktivitet,
    };
};

export default connect(mapStateToProps)(Filter);
