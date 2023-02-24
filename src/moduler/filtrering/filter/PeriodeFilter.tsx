import { Historic } from '@navikt/ds-icons';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import { HistoriskOppfolgingsPeriode, OppfolgingsPeriode } from '../../../datatypes/oppfolgingTypes';
import Dato from '../../../felles-komponenter/Dato';
import { ReduxDispatch } from '../../../felles-komponenter/hooks/useReduxDispatch';
import loggEvent, { LIST_HISTORISK_PERIODE, VIS_HISTORISK_PERIODE } from '../../../felles-komponenter/utils/logging';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../proptypes';
import {
    VistOppfolgingsPeriode,
    selectSorterteHistoriskeOppfolgingsPerioder,
} from '../../oppfolging-status/oppfolging-selector';
import { velgHistoriskPeriode } from './filter-reducer';
import { selectHistoriskPeriode } from './filter-selector';

export function PeriodeLabel({ historiskPeriode }: { historiskPeriode: VistOppfolgingsPeriode }) {
    return (
        <div>
            <Dato>{historiskPeriode.vistFra}</Dato>
            <span> - </span>
            <Dato>{historiskPeriode.til}</Dato>
        </div>
    );
}

PeriodeLabel.defaultProps = {
    historiskPeriode: null,
};

PeriodeLabel.propTypes = {
    historiskPeriode: AppPT.oppfolgingsPeriode,
};

interface Props {
    harHistoriskePerioder: boolean;
    historiskePerioder: VistOppfolgingsPeriode[];
    historiskPeriode?: OppfolgingsPeriode;
    doVelgHistoriskPeriode: (periode: null | HistoriskOppfolgingsPeriode) => void;
    skjulInneverende: boolean;
}

const PeriodeFilter = ({
    harHistoriskePerioder,
    historiskPeriode,
    historiskePerioder,
    doVelgHistoriskPeriode,
    skjulInneverende,
}: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <VisibleIfDiv visible={harHistoriskePerioder}>
            <Button
                icon={<Historic />}
                variant="tertiary"
                onClick={() => {
                    setOpen(!open);
                    loggEvent(LIST_HISTORISK_PERIODE);
                }}
            >
                Tidligere planer
            </Button>
            {open ? (
                <div className="rounded-md absolute p-4 bg-white border z-10">
                    <RadioGroup
                        value={!historiskPeriode ? 'inneverende' : historiskPeriode.uuid}
                        legend={'Velg periode'}
                    >
                        {skjulInneverende ? null : (
                            <Radio
                                value="inneverende"
                                className="filter__radio--periode"
                                name="inneverende"
                                onChange={() => doVelgHistoriskPeriode(null)}
                            >
                                Nåværende periode
                            </Radio>
                        )}
                        {historiskePerioder.map((oppfolgingsPeriode, index) => {
                            return (
                                <Radio
                                    value={oppfolgingsPeriode.uuid}
                                    key={index}
                                    className="filter__radio--periode"
                                    name={oppfolgingsPeriode.uuid}
                                    onChange={() => {
                                        doVelgHistoriskPeriode(oppfolgingsPeriode);
                                        loggEvent(VIS_HISTORISK_PERIODE);
                                    }}
                                >
                                    <PeriodeLabel historiskPeriode={oppfolgingsPeriode} />
                                </Radio>
                            );
                        })}
                    </RadioGroup>
                </div>
            ) : null}
        </VisibleIfDiv>
    );
};

(PeriodeFilter as any).defaultProps = {
    historiskPeriode: null,
};

const mapStateToProps = (state: any) => {
    const historiskePerioder = selectSorterteHistoriskeOppfolgingsPerioder(state);
    return {
        historiskePerioder,
        historiskPeriode: selectHistoriskPeriode(state),
        harHistoriskePerioder: historiskePerioder.length > 0,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    doVelgHistoriskPeriode: (aktivitetsType: null | HistoriskOppfolgingsPeriode) =>
        dispatch(velgHistoriskPeriode(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodeFilter);
