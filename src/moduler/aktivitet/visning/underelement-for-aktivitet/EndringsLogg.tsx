import React from 'react';
import InvertedLestMer from '../../../../hovedside/tavle/kolonne/InvertedLesmer';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';
import { Aktivitet } from '../../../../types';

interface Props {
    hidden?: boolean;
    aktivitet: Aktivitet;
}

export default function EndringsLogg(props: Props) {
    const { aktivitet, hidden } = props;

    // @ts-ignore
    if (hidden || aktivitet.arenaAktivitet) {
        return null;
    }

    return (
        <section className="aktivitetvisning__underseksjon">
            <InvertedLestMer apneTekst="Vis historikk" lukkTekst="Skjul historikk">
                <VersjonerForAktivitet
                    visible={true}
                    aktivitet={aktivitet}
                    className="underelementer-aktivitet__historikkvisning"
                />
            </InvertedLestMer>
        </section>
    );
}
