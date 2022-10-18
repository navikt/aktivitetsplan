import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../api/utils';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import LinkAsDiv from '../../../felles-komponenter/LinkAsDiv';
import { aktivitetRoute } from '../../../routes';
import { aktivitetTypeMap } from '../../../utils/textMappers';
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
    aktivitet: Aktivitet;
    className: string;
}

const ALIGN_TO_BOTTOM: ScrollIntoViewOptions = { block: 'end', inline: 'nearest' };

export const genererAktivtetskortId = (aktivitet: Aktivitet) => `aktivitetskort-${aktivitet.id}`;

const Aktivitetskort = (props: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [firstTime, setFirstTime] = useState<boolean>(true);

    const { aktivitet, className } = props;
    const { id, type } = aktivitet;
    const dispatch = useDispatch();

    const lest = useSelector(selectLestAktivitetsplan, shallowEqual);
    const lestStatus = useSelector(selectLestStatus, shallowEqual);
    const aktiviteterSomHarBlittVist = useSelector(selectAktiviteterSomHarBlittVist, shallowEqual);

    const aktivitetHarIkkeBlittVist = !aktiviteterSomHarBlittVist.find(
        (vistAktivitet: Aktivitet) => aktivitet.id === vistAktivitet.id
    );

    const aktivitetBleVistSist: boolean = aktivitet.id === useSelector((state) => selectSistVisteAktivitet(state))?.id;

    const me = useSelector(selectIdentitetData, shallowEqual);

    const harEndringerIAktivitet =
        lestStatus === STATUS.OK && erNyEndringIAktivitet(aktivitet, lest, me) && aktivitetHarIkkeBlittVist;

    const headerId = `aktivitetskort__header__${id}`;
    const datoId = `aktivitetskort__dato__${id}`;
    const ariaLabel = `${aktivitetTypeMap[type]}: ${aktivitet.tittel}`;

    useEffect(() => {
        const dialogElement: HTMLElement | null | undefined = ref?.current?.parentElement;
        if (aktivitetBleVistSist)
            console.log(`Sist vist, scroll til?(${firstTime} ${!!dialogElement} ${aktivitetBleVistSist})`);
        if (firstTime && dialogElement && aktivitetBleVistSist) {
            dialogElement.scrollIntoView(ALIGN_TO_BOTTOM);
            setFirstTime(false);
            console.log('I did it');
        }
    }, [ref, aktivitetBleVistSist, firstTime]);

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
            <div ref={ref}></div>
        </LinkAsDiv>
    );
};

export default Aktivitetskort;
