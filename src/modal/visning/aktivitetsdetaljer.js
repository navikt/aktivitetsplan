import React from 'react';
import PT from 'prop-types'
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Link } from 'react-router';
import * as AppPT from '../../proptypes';
import { formaterDatoKortManad } from '../../utils';
import { EGEN_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE } from '../../constant';
import DetaljFelt from './detalj-felt';

function RedigerLink({ id, felt }) {
    return (
        <Link to={`/aktivitet/aktivitet/${id}/endre`}>
            <FormattedMessage id="aktivitetsdetaljer.legg-til-felt" values={{ felt }} />
        </Link>
    );
}

RedigerLink.propTypes = {
    id: PT.string.isRequired,
    felt: PT.string.isRequired
};

function Informasjonsfelt({ tittel, innhold }) {
    return (
        <DetaljFelt tittel={tittel} visible={innhold != null}>
            <Normaltekst className="detaljfelt__tekst">{innhold}</Normaltekst>
        </DetaljFelt>
    );
}

Informasjonsfelt.propTypes = {
    tittel: PT.node.isRequired,
    innhold: PT.string
};

Informasjonsfelt.defaultProps = {
    innhold: undefined
};

function Aktivitetsdetaljer({ valgtAktivitet, className }) {
    const { type: aktivitetstype, lenke, arbeidsgiver, arbeidssted, kontaktperson, hensikt } = valgtAktivitet;

    const fraDato = formaterDatoKortManad(valgtAktivitet.fraDato);
    const tilDato = formaterDatoKortManad(valgtAktivitet.tilDato);

    const fraDatoTekst = (aktivitet) => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.egen" />;
            case STILLING_AKTIVITET_TYPE:
                return <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.stilling" />;
            default:
                return <FormattedMessage id="aktivitetdetaljer.fra-dato-tekst.default" />;
        }
    };

    const tilDatoTekst = (aktivitet) => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.egen" />;
            case STILLING_AKTIVITET_TYPE:
                return <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.stilling" />;
            default:
                return <FormattedMessage id="aktivitetdetaljer.til-dato-tekst.default" />;
        }
    };

    const httpRegex = /^(https?):\/\/.*$/;

    const lenkeKomponent = () => (
        <DetaljFelt key="lenke" tittel="Lenke" visible={lenke != null}>
            <Link
                href={lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`}
                className="detaljfelt__lenke"
                target="_blank"
            >
                {lenke}
            </Link>
        </DetaljFelt>
    );

    const ledigStillingFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} />,
            <Informasjonsfelt
                key="arbeidsgiver"
                tittel={<FormattedMessage id="aktivitetdetaljer.arbeidsgiver-label" />}
                innhold={arbeidsgiver}
            />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} />,
            <Informasjonsfelt
                key="arbeidssted"
                tittel={<FormattedMessage id="aktivitetdetaljer.arbeidssted-label" />}
                innhold={arbeidssted}
            />,
            lenkeKomponent(),
            <Informasjonsfelt
                key="kontaktperson"
                tittel={<FormattedMessage id="aktivitetdetaljer.kontaktperson-label" />}
                innhold={kontaktperson}
            />
        ]
    );

    const egenStillingFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} />,
            lenkeKomponent(),
            <Informasjonsfelt
                key="hensikt"
                tittel={<FormattedMessage id="aktivitetdetaljer.hensikt-label" />}
                innhold={hensikt}
            />
        ]
    );

    const cls = (clsName) => classNames(clsName, 'aktivitetsdetaljer');
    return (
        <section className={cls(className)}>
            {aktivitetstype === EGEN_AKTIVITET_TYPE ? egenStillingFelter() : ledigStillingFelter()}
        </section>
    );
}

Aktivitetsdetaljer.propTypes = {
    className: PT.string,
    valgtAktivitet: AppPT.aktivitet.isRequired
};

Aktivitetsdetaljer.defaultProps = {
    className: undefined
};

export default Aktivitetsdetaljer;
