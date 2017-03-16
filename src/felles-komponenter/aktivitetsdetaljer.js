import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, EtikettLiten } from 'nav-react-design/dist/typografi';
import { Link } from 'react-router';
import * as AppPT from '../proptypes';
import { formaterDato } from '../utils';
import { EGEN_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE } from '../constant';

function RedigerLink({ id, felt }) {
    return (
        <Link to={`/aktiviter/aktivitet/${id}/endre`}>
            <FormattedMessage id="aktivitetsdetaljer.legg-til-felt" values={{ felt }} />
        </Link>
    );
}

RedigerLink.propTypes = {
    id: PT.string.isRequired,
    felt: PT.string.isRequired
};

function DetaljFelt({ tittel, children }) {
    return (
        <div className="aktivitetsdetaljer__felt detaljfelt">
            <EtikettLiten className="detaljfelt__tittel">{tittel}</EtikettLiten>
            {children}
        </div>
    );
}

function Informasjonsfelt({ tittel, innhold, id }) {
    return (
        <DetaljFelt tittel={tittel}>
            {innhold ?
                <Normaltekst className="detaljfelt__tekst">{innhold}</Normaltekst>
                : <RedigerLink id={id} felt={tittel} />
            }
        </DetaljFelt>
    );
}

function Aktivitetsdetaljer({ valgtAktivitet, className }) {
    const { type: aktivitetstype, lenke, arbeidsgiver, arbeidssted, kontaktperson, hensikt, id } = valgtAktivitet;

    const fraDato = formaterDato(valgtAktivitet.fraDato);
    const tilDato = formaterDato(valgtAktivitet.tilDato);

    const fraDatoTekst = (aktivitet) => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return 'fra dato';
            case STILLING_AKTIVITET_TYPE:
                return 'startdato';
            default:
                return 'fra dato';
        }
    };

    const tilDatoTekst = (aktivitet) => {
        switch (aktivitet) {
            case EGEN_AKTIVITET_TYPE:
                return 'til dato';
            case STILLING_AKTIVITET_TYPE:
                return 'søknadsfrist';
            default:
                return 'til dato';
        }
    };

    const lenkeKomponent = () => (
        <DetaljFelt key="lenke" tittel="Lenke">
            <Link to={lenke} className="detaljfelt__lenke">
                {lenke || 'Legg til lenke'}
            </Link>
        </DetaljFelt>
    );

    const ledigStillingFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} id={id} />,
            <Informasjonsfelt key="arbeidsgiver" tittel="arbeidsgiver" innhold={arbeidsgiver} id={id} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} id={id} />,
            <Informasjonsfelt key="arbeidssted" tittel="arbeidssted" innhold={arbeidssted} id={id} />,
            lenkeKomponent(),
            <Informasjonsfelt key="kontaktperson" tittel="kontaktperson" innhold={kontaktperson} id={id} />
        ]
    );

    const egenStillingFelter = () => (
        [
            <Informasjonsfelt key="fradato" tittel={fraDatoTekst(aktivitetstype)} innhold={fraDato} id={id} />,
            <Informasjonsfelt key="tildato" tittel={tilDatoTekst(aktivitetstype)} innhold={tilDato} id={id} />,
            lenkeKomponent(),
            <Informasjonsfelt key="hensikt" tittel="hensikt" innhold={hensikt} id={id} />
        ]
    );

    const cls = (clsName) => classNames(clsName, 'aktivitetsdetaljer');
    return (
        <section className={cls(className)}>
            {aktivitetstype === EGEN_AKTIVITET_TYPE ? egenStillingFelter() : ledigStillingFelter()}
        </section>
    );
}

DetaljFelt.propTypes = {
    children: PT.node.isRequired,
    tittel: PT.string.isRequired
};

Informasjonsfelt.propTypes = {
    tittel: PT.string,
    innhold: PT.string,
    id: PT.string
};

Aktivitetsdetaljer.propTypes = {
    className: PT.string,
    valgtAktivitet: AppPT.aktivitet.isRequired
};

export default Aktivitetsdetaljer;
