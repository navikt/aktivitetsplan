import React from 'react';
import PT from 'prop-types';
import KolonneFunction from './kolonnefunction';
import {
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
} from '../../../constant';
import { sorterAktiviteter } from '../../../moduler/aktivitet/aktivitet-util';
import { erMerEnnToManederSiden } from '../../../utils';
import SkjulEldreAktiviteter from './skjul-eldre-aktiviteter-fra-kolonne';
import AktivitetsKort from '../../../moduler/aktivitet/aktivitet-kort/aktivitetskort';

function lagAktivitetsListe(aktiviteter) {
    return aktiviteter.map(aktivitet =>
        <AktivitetsKort key={aktivitet.id} aktivitet={aktivitet} />
    );
}

function renderFullfortAvbrytStatus(aktiviteter, harSkjuleAktiviteterFeature) {
    // TODO KJULELDREAKTIVITETER ALLT INNANFØR IFSATSEN SKA RETURNERAS NÅR FEATURETOGGLEN ER PÅ
    // RESTEN KAN FJERNES
    if (harSkjuleAktiviteterFeature) {
        return (
            <div>
                {lagAktivitetsListe(
                    aktiviteter.filter(
                        aktivitet => !erMerEnnToManederSiden(aktivitet)
                    )
                )}
                <SkjulEldreAktiviteter
                    aktivitetTilDatoMerEnnToManederSiden={aktiviteter.filter(
                        erMerEnnToManederSiden
                    )}
                />
            </div>
        );
    }
    return lagAktivitetsListe(aktiviteter);
}

function ForslagKolonne({ aktiviteter }) {
    const sorterteAktiviter = sorterAktiviteter(aktiviteter, STATUS_PLANLAGT);
    return (
        <KolonneFunction status={STATUS_PLANLAGT}>
            {lagAktivitetsListe(sorterteAktiviter)}
        </KolonneFunction>
    );
}

ForslagKolonne.propTypes = {
    aktiviteter: PT.arrayOf(PT.object).isRequired,
};

function PlanleggerKolonne({ aktiviteter }) {
    const sorterteAktiviter = sorterAktiviteter(
        aktiviteter,
        STATUS_BRUKER_ER_INTRESSERT
    );
    return (
        <KolonneFunction status={STATUS_BRUKER_ER_INTRESSERT}>
            {lagAktivitetsListe(sorterteAktiviter)}
        </KolonneFunction>
    );
}

PlanleggerKolonne.propTypes = {
    aktiviteter: PT.arrayOf(PT.object).isRequired,
};

function GjennomforerKolonne({ aktiviteter }) {
    const sorterteAktiviter = sorterAktiviteter(
        aktiviteter,
        STATUS_GJENNOMFOERT
    );
    return (
        <KolonneFunction status={STATUS_GJENNOMFOERT}>
            {lagAktivitetsListe(sorterteAktiviter)}
        </KolonneFunction>
    );
}

GjennomforerKolonne.propTypes = {
    aktiviteter: PT.arrayOf(PT.object).isRequired,
};

function FullfortKolonne({ aktiviteter, harSkjuleAktiviteterFeature }) {
    const sorterteAktiviter = sorterAktiviteter(aktiviteter, STATUS_FULLFOERT);
    return (
        <KolonneFunction status={STATUS_FULLFOERT}>
            {renderFullfortAvbrytStatus(
                sorterteAktiviter,
                harSkjuleAktiviteterFeature
            )}
        </KolonneFunction>
    );
}

FullfortKolonne.propTypes = {
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    harSkjuleAktiviteterFeature: PT.bool.isRequired,
};

function AvbruttKolonne({ aktiviteter, harSkjuleAktiviteterFeature }) {
    const sorterteAktiviter = sorterAktiviteter(aktiviteter, STATUS_AVBRUTT);
    return (
        <KolonneFunction status={STATUS_AVBRUTT}>
            {renderFullfortAvbrytStatus(
                sorterteAktiviter,
                harSkjuleAktiviteterFeature
            )}
        </KolonneFunction>
    );
}

AvbruttKolonne.propTypes = {
    aktiviteter: PT.arrayOf(PT.object).isRequired,
    harSkjuleAktiviteterFeature: PT.bool.isRequired,
};

export {
    lagAktivitetsListe,
    ForslagKolonne,
    PlanleggerKolonne,
    GjennomforerKolonne,
    FullfortKolonne,
    AvbruttKolonne,
};
