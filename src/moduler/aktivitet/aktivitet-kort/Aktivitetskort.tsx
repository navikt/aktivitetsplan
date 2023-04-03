import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Status } from '../../../createGenericSlice';
import { AlleAktiviteter, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import LinkAsDiv from '../../../felles-komponenter/LinkAsDiv';
import { aktivitetRoute } from '../../../routes';
import { getAktivitetType } from '../../../utils/textMappers';
import { selectIdentitetData } from '../../identitet/identitet-selector';
import { selectLestAktivitetsplan, selectLestStatus } from '../../lest/lest-reducer';
import { erNyEndringIAktivitet } from '../aktivitet-util';
import {
    selectAktiviteterSomHarBlittVist,
    selectSistVisteAktivitet,
    settAktivitetSomVist,
} from '../aktivitetview-reducer';
import styles from './Aktivitetskort.module.less';
import AktiviteskortPeriodeVisning from './AktivitetskortPeriode';
import AktivitetskortTillegg from './AktivitetskortTillegg';
import Aktivitetskorttittel from './AktivitetskortTittel';
import Aktivitetstype from './Aktivitetstype';
import Arbeidsgiver from './Arbeidsgiver';
import SokeAvtaleAntall from './SokeAvtaleAntall';

interface Props {
    aktivitet: AlleAktiviteter;
    className: string;
}

export const prefixAktivtetskortId = (aktivitet: AlleAktiviteter) => `aktivitetskort-${aktivitet.id}`;

const Aktivitetskort = (props: Props) => {
    const { aktivitet, className } = props;
    const { id, type } = aktivitet;
    const dispatch = useAppDispatch();

    const lest = useSelector(selectLestAktivitetsplan, shallowEqual);
    const lestStatus = useSelector(selectLestStatus, shallowEqual);
    const aktiviteterSomHarBlittVist = useSelector(selectAktiviteterSomHarBlittVist, shallowEqual);

    const aktivitetHarIkkeBlittVist = !aktiviteterSomHarBlittVist.find(
        (vistAktivitet: VeilarbAktivitet) => aktivitet.id === vistAktivitet.id
    );

    const aktivitetBleVistSist: boolean = aktivitet.id === useSelector((state) => selectSistVisteAktivitet(state))?.id;

    const me = useSelector(selectIdentitetData, shallowEqual);

    const harEndringerIAktivitet =
        lestStatus === Status.OK &&
        isVeilarbAktivitet(aktivitet) &&
        erNyEndringIAktivitet(aktivitet, lest, me) &&
        aktivitetHarIkkeBlittVist;

    const headerId = `aktivitetskort__header__${id}`;
    const datoId = `aktivitetskort__dato__${id}`;
    const ariaLabel = `${getAktivitetType(aktivitet)}: ${aktivitet.tittel}`;

    return (
        <LinkAsDiv
            id={prefixAktivtetskortId(aktivitet)}
            className={classNames('rounded-md', styles.aktivitetskort, className, {
                [styles.sistVist]: aktivitetBleVistSist,
                ['border-gray-400 border']: !aktivitetBleVistSist,
            })}
            to={aktivitetRoute(id)}
            ariaLabel={ariaLabel}
            onClick={() => dispatch(settAktivitetSomVist(aktivitet))}
        >
            <article>
                <Aktivitetstype aktivitet={aktivitet} />
                <Aktivitetskorttittel id={headerId} aktivitet={aktivitet} harEndring={harEndringerIAktivitet} />
                {type === VeilarbAktivitetType.STILLING_AKTIVITET_TYPE ? <Arbeidsgiver aktivitet={aktivitet} /> : null}
                <AktiviteskortPeriodeVisning id={datoId} aktivitet={aktivitet} />
                {type === VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE ? (
                    <SokeAvtaleAntall aktivitet={aktivitet} />
                ) : null}
                <AktivitetskortTillegg aktivitet={aktivitet} />
            </article>
        </LinkAsDiv>
    );
};

export default Aktivitetskort;
