import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../api/utils';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import LinkAsDiv from '../../../felles-komponenter/LinkAsDiv';
import { aktivitetRoute } from '../../../routes';
import { aktivitetTypeMap } from '../../../utils/textMappers';
import { selectIdentitetData } from '../../identitet/identitet-selector';
import { selectLestAktivitetsplan, selectLestStatus } from '../../lest/lest-reducer';
import { erNyEndringIAktivitet } from '../aktivitet-util';
import { selectAktiviteterSomHarBlittVist, settAktivitetSomVist } from '../aktivitetview-reducer';
import styles from './Aktivitetskort.module.less';
import AktiviteskortPeriodeVisning from './AktivitetskortPeriode';
import AktivitetskortTillegg from './AktivitetskortTillegg';
import Aktivitetskorttittel from './AktivitetskortTittel';
import Aktivitetstype from './Aktivitetstype';
import Arbeidsgiver from './Arbeidsgiver';
import SokeAvtaleAntall from './SokeAvtaleAntall';

interface Props {
    aktivitet: Aktivitet;
    className: string;
}

export const genererAktivtetskortId = (aktivitet: Aktivitet) => `aktivitetskort-${aktivitet.id}`;

const Aktivitetskort = (props: Props) => {
    const { aktivitet, className } = props;
    const { id, type } = aktivitet;
    const dispatch = useDispatch();

    const lest = useSelector(selectLestAktivitetsplan, shallowEqual);
    const lestStatus = useSelector(selectLestStatus, shallowEqual);
    const aktiviteterSomHarBlittVist = useSelector(selectAktiviteterSomHarBlittVist, shallowEqual);

    const aktivitetHarIkkeBlittVist = !aktiviteterSomHarBlittVist.find(
        (vistAktivitet: Aktivitet) => aktivitet.id === vistAktivitet.id
    );

    const aktivitetBleVistSist: boolean =
        aktivitet.id === aktiviteterSomHarBlittVist?.reduce((a: Aktivitet | null, b: Aktivitet) => b, null)?.id;

    if (aktivitetBleVistSist) console.log(`Rendrer Aktivitetskort med ${{ props }}`);

    const me = useSelector(selectIdentitetData, shallowEqual);

    const harEndringerIAktivitet =
        lestStatus === STATUS.OK && erNyEndringIAktivitet(aktivitet, lest, me) && aktivitetHarIkkeBlittVist;

    const headerId = `aktivitetskort__header__${id}`;
    const datoId = `aktivitetskort__dato__${id}`;
    const ariaLabel = `${aktivitetTypeMap[type]}: ${aktivitet.tittel}`;

    return (
        <LinkAsDiv
            id={genererAktivtetskortId(aktivitet)}
            className={
                aktivitetBleVistSist
                    ? classNames(styles.aktivitetskort, styles.sistVist, className)
                    : classNames(styles.aktivitetskort, className)
            }
            to={aktivitetRoute(id)}
            ariaLabel={ariaLabel}
            onClick={() => dispatch(settAktivitetSomVist(aktivitet))}
        >
            <article>
                <Aktivitetstype type={type} />
                <Aktivitetskorttittel id={headerId} aktivitet={aktivitet} harEndring={harEndringerIAktivitet} />
                <Arbeidsgiver aktivitet={aktivitet} />
                <AktiviteskortPeriodeVisning id={datoId} aktivitet={aktivitet} />
                <SokeAvtaleAntall aktivitet={aktivitet} />
                <AktivitetskortTillegg aktivitet={aktivitet} />
            </article>
        </LinkAsDiv>
    );
};

export default Aktivitetskort;
