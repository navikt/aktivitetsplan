import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../api/utils';
import { AlleAktiviteter, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
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
    aktivitet: AlleAktiviteter;
    className: string;
}

export const genererAktivtetskortId = (aktivitet: AlleAktiviteter) => `aktivitetskort-${aktivitet.id}`;
const ALIGN_TO_BOTTOM: ScrollIntoViewOptions = { block: 'end', inline: 'nearest' };

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
        (vistAktivitet: VeilarbAktivitet) => aktivitet.id === vistAktivitet.id
    );

    const aktivitetBleVistSist: boolean = aktivitet.id === useSelector((state) => selectSistVisteAktivitet(state))?.id;

    const me = useSelector(selectIdentitetData, shallowEqual);

    const harEndringerIAktivitet =
        lestStatus === STATUS.OK &&
        isVeilarbAktivitet(aktivitet) &&
        erNyEndringIAktivitet(aktivitet, lest, me) &&
        aktivitetHarIkkeBlittVist;

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
                {type === VeilarbAktivitetType.STILLING_AKTIVITET_TYPE ? <Arbeidsgiver aktivitet={aktivitet} /> : null}
                <AktiviteskortPeriodeVisning id={datoId} aktivitet={aktivitet} />
                {type === VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE ? (
                    <SokeAvtaleAntall aktivitet={aktivitet} />
                ) : null}
                <AktivitetskortTillegg aktivitet={aktivitet} />
            </article>
            <div ref={ref}></div>
        </LinkAsDiv>
    );
};

export default Aktivitetskort;
