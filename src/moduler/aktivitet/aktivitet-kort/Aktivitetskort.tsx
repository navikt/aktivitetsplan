import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RootStateOrAny, shallowEqual, useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../api/utils';
import { TabId } from '../../../constant';
import { AlleAktiviteter, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { TabChangeEvent } from '../../../datatypes/types';
import { useEventListener } from '../../../felles-komponenter/hooks/useEventListner';
import LinkAsDiv from '../../../felles-komponenter/LinkAsDiv';
import { aktivitetRoute } from '../../../routes';
import { aktivitetTypeMap } from '../../../utils/textMappers';
import useIsVisible from '../../../utils/useIsVisible';
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

const Aktivitetskort = (props: Props) => {
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
    const sistVisteAktivitetId: string = useSelector<RootStateOrAny, string>(
        (state) => `aktivitetskort-` + selectSistVisteAktivitet(state)?.id
    );

    const me = useSelector(selectIdentitetData, shallowEqual);

    const harEndringerIAktivitet =
        lestStatus === STATUS.OK &&
        isVeilarbAktivitet(aktivitet) &&
        erNyEndringIAktivitet(aktivitet, lest, me) &&
        aktivitetHarIkkeBlittVist;

    const headerId = `aktivitetskort__header__${id}`;
    const datoId = `aktivitetskort__dato__${id}`;
    const ariaLabel = `${aktivitetTypeMap[type]}: ${aktivitet.tittel}`;

    const element = document.getElementById(sistVisteAktivitetId);

    const elementIsVisible = useIsVisible(element);
    const [skalScrolle, setSkalScrolle] = useState(false);

    useEventListener<TabChangeEvent>('veilarbpersonflatefs.tab-clicked', (event) => {
        if (TabId.AKTIVITETSPLAN !== event.detail?.tabId) return;
        setSkalScrolle(true);
    });

    useEffect(() => {
        if (element && skalScrolle && elementIsVisible) {
            element.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center',
            });
            setSkalScrolle(false);
        }
    }, [element, skalScrolle, elementIsVisible]);

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
        </LinkAsDiv>
    );
};

export default Aktivitetskort;
