import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { aktivitetRoute } from '../../../routes';
import { selectAktiviteterSomHarBlittVist, settAktivitetSomVist } from '../aktivitetview-reducer';
import Aktivitetstype from './Aktivitetstype';
import Aktivitetskorttittel from './AktivitetskortTittel';
import Arbeidsgiver from './Arbeidsgiver';
import AktiviteskortPeriodeVisning from './AktivitetskortPeriode';
import SokeAvtaleAntall from './SokeAvtaleAntall';
import AktivitetskortTillegg from './aktivitetskort-tillegg';
import { Aktivitet } from '../../../types';
import { selectLestAktivitetsplan, selectLestStatus } from '../../lest/lest-reducer';
import { selectIdentitetData } from '../../identitet/identitet-selector';
import { STATUS } from '../../../ducks/utils';
import { erNyEndringIAktivitet } from '../aktivitet-util';
import LinkAsDiv from '../../../felles-komponenter/LinkAsDiv';
import styles from './Aktivitetskort.module.less';

interface Props {
    aktivitet: Aktivitet;
    className: string;
}

export function genererAktivtetskortId(aktivitet: Aktivitet) {
    return `aktivitetskort-${aktivitet.id}`;
}

function Aktivitetskort(props: Props) {
    const { aktivitet, className } = props;
    const { id, type } = aktivitet;

    const dispatch = useDispatch();

    const lest = useSelector(selectLestAktivitetsplan, shallowEqual);
    const lestStatus = useSelector(selectLestStatus, shallowEqual);
    const aktiviteterSomHarBlittVist = useSelector(selectAktiviteterSomHarBlittVist, shallowEqual);

    const aktivitetHarIkkeBlittVist = !aktiviteterSomHarBlittVist.find(
        (vistAktivitet: Aktivitet) => aktivitet.id === vistAktivitet.id
    );

    const me = useSelector(selectIdentitetData, shallowEqual);

    const harEndringerIAktivitet =
        lestStatus === STATUS.OK && erNyEndringIAktivitet(aktivitet, lest, me) && aktivitetHarIkkeBlittVist;

    const headerId = `aktivitetskort__header__${id}`;
    const datoId = `aktivitetskort__dato__${id}`;
    const ariaLabel = `${headerId} ${datoId}`;

    return (
        <LinkAsDiv
            id={genererAktivtetskortId(aktivitet)}
            className={classNames(styles.aktivitetskort, className)}
            to={aktivitetRoute(id)}
            onClick={() => dispatch(settAktivitetSomVist(aktivitet))}
        >
            <article aria-labelledby={ariaLabel}>
                <Aktivitetstype type={type} />
                <Aktivitetskorttittel id={headerId} aktivitet={aktivitet} harEndring={harEndringerIAktivitet} />
                <Arbeidsgiver aktivitet={aktivitet} />
                <AktiviteskortPeriodeVisning id={datoId} aktivitet={aktivitet} />
                <SokeAvtaleAntall aktivitet={aktivitet} />
                <AktivitetskortTillegg aktivitet={aktivitet} />
            </article>
        </LinkAsDiv>
    );
}

export default Aktivitetskort;
