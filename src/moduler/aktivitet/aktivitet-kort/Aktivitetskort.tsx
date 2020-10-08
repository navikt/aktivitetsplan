import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { aktivitetRoute } from '../../../routes';
import { selectAktiviteterSomHarBlittVist, settAktivitetSomVist } from '../aktivitetview-reducer';
import AktivitetType from './AktivitetType';
import Aktivitetskorttittel from './AktivitetKortTitel';
import Arbeidsgiver from './Stilling';
import AktiviteskortPeriodeVisning from './aktivitetskort-periode';
import SokeAvtaleAntall from './SokeAvtaleAntall';
import AktivitetskortTillegg from './aktivitetskort-tillegg';
import { Aktivitet } from '../../../types';
import { selectLestAktivitetsplan, selectLestStatus } from '../../lest/lest-reducer';
import { selectIdentitetData } from '../../identitet/identitet-selector';
import { STATUS } from '../../../ducks/utils';
import { erNyEndringIAktivitet } from '../aktivitet-util';
import LinkAsDiv from '../../../felles-komponenter/LinkAsDiv';

interface Props {
    aktivitet: Aktivitet;
    className: string;
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

    const ariaLabel = `aktivitetskort__header__${id} aktivitetskort__dato__${id}`;

    return (
        <LinkAsDiv
            id={`aktivitetskort-${aktivitet.id}`}
            className={classNames('aktivitetskort', className)}
            to={aktivitetRoute(id)}
            onClick={() => dispatch(settAktivitetSomVist(aktivitet))}
        >
            <article aria-labelledby={ariaLabel}>
                <AktivitetType type={type} />
                <Aktivitetskorttittel aktivitet={aktivitet} harEndringerIAktivitet={harEndringerIAktivitet} />
                <Arbeidsgiver aktivitet={aktivitet} />
                <AktiviteskortPeriodeVisning aktivitet={aktivitet} />
                <SokeAvtaleAntall aktivitet={aktivitet} />
                <AktivitetskortTillegg aktivitet={aktivitet} />
            </article>
        </LinkAsDiv>
    );
}

export default Aktivitetskort;
