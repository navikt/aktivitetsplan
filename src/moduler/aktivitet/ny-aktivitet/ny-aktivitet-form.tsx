import PT from 'prop-types';
import React, {EventHandler, MouseEventHandler, useRef} from 'react';
import {connect} from 'react-redux';
import {Route, RouteComponentProps, Switch} from 'react-router-dom';

import {STATUS_PLANLAGT,} from '../../../constant';
import {CONFIRM, useConfirmOnBeforeUnload} from '../../../felles-komponenter/hooks/useConfirmOnBeforeUnload';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import {aktivitetRoute} from '../../../routes';
import {removeEmptyKeysFromObject} from '../../../utils/object';
import {selectErUnderOppfolging} from '../../oppfolging-status/oppfolging-selector';
import {lagNyAktivitet} from '../aktivitet-actions';
import MedisinskBehandlingForm from '../aktivitet-forms/behandling/MedisinskBehandlingForm';
import EgenAktivitetForm from '../aktivitet-forms/egen/AktivitetEgenForm';
import IJobbAktivitetForm from '../aktivitet-forms/ijobb/AktivitetIjobbForm';
import MoteAktivitetForm from '../aktivitet-forms/mote/MoteAktivitetForm';
import SamtalereferatForm from '../aktivitet-forms/samtalereferat/SamtalereferatForm';
import SokeAvtaleAktivitetForm from '../aktivitet-forms/sokeavtale/AktivitetSokeavtaleForm';
import StillingAktivitetForm from '../aktivitet-forms/stilling/AktivitetStillingForm';
import {selectAktivitetFeilmeldinger} from '../aktivitet-selector';
import {VeilarbAktivitet, VeilarbAktivitetType} from "../../../datatypes/internAktivitetTypes";
import {AnyAction} from "redux";
import {ReduxDispatch} from "../../../felles-komponenter/hooks/useReduxDispatch";

type Props = ReturnType<typeof mapDispatchToProps>
    & ReturnType<typeof mapStateToProps>
    & RouteComponentProps

type OnSubmit = (type: VeilarbAktivitet) => Promise<void>

function NyAktivitetForm(props: Props) {
    const { onLagreNyAktivitet, history, match, aktivitetFeilmeldinger, underOppfolging } = props;

    const isDirty = useRef(false);
    useConfirmOnBeforeUnload(isDirty);

    function onSubmitFactory(aktivitetsType: VeilarbAktivitetType): OnSubmit {
        return (aktivitet: Partial<VeilarbAktivitet>) => {
            const filteredAktivitet = removeEmptyKeysFromObject(aktivitet);
            const nyAktivitet = {
                ...filteredAktivitet,
                status: STATUS_PLANLAGT,
                type: aktivitetsType,
            } as Partial<VeilarbAktivitet>;
            return onLagreNyAktivitet(nyAktivitet)
                .then((action: AnyAction) => history.push(aktivitetRoute(action.data.id)));
        };
    };

    function onRequestClose() {
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.push('/');
        }
    }

    const onReqBack: MouseEventHandler = (e) => {
        e.preventDefault();
        const isItReallyDirty = isDirty.current;
        if (!isItReallyDirty || window.confirm(CONFIRM)) {
            history.push('/aktivitet/ny');
        }
    };

    const header = <ModalHeader tilbakeTekst="Tilbake til kategorier" onTilbakeClick={onReqBack} />;

    if (!underOppfolging) {
        return null;
    }

    return (
        <Modal
            header={header}
            onRequestClose={onRequestClose}
            contentLabel="ny-aktivitet-modal"
            feilmeldinger={aktivitetFeilmeldinger}
        >
            <article>
                <ModalContainer>
                    <Switch>
                        <Route path={`${match.path}/mote`}>
                            <MoteAktivitetForm onSubmit={onSubmitFactory(VeilarbAktivitetType.MOTE_TYPE)} isDirtyRef={isDirty} />
                        </Route>
                        <Route path={`${match.path}/samtalereferat`}>
                            <SamtalereferatForm onSubmit={onSubmitFactory(VeilarbAktivitetType.SAMTALEREFERAT_TYPE)} isDirtyRef={isDirty} />
                        </Route>
                        <Route path={`${match.path}/stilling`}>
                            <StillingAktivitetForm
                                onSubmit={onSubmitFactory(VeilarbAktivitetType.STILLING_AKTIVITET_TYPE)}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/sokeavtale`}>
                            <SokeAvtaleAktivitetForm
                                onSubmit={onSubmitFactory(VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE)}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/behandling`}>
                            <MedisinskBehandlingForm
                                onSubmit={onSubmitFactory(VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE)}
                                isDirtyRef={isDirty}
                            />
                        </Route>
                        <Route path={`${match.path}/egen`}>
                            <EgenAktivitetForm onSubmit={onSubmitFactory(VeilarbAktivitetType.EGEN_AKTIVITET_TYPE)} isDirtyRef={isDirty} />
                        </Route>
                        <Route path={`${match.path}/ijobb`}>
                            <IJobbAktivitetForm onSubmit={onSubmitFactory(VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE)} isDirtyRef={isDirty} />
                        </Route>
                    </Switch>
                </ModalContainer>
            </article>
        </Modal>
    );
}

(NyAktivitetForm as any).propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    history: PT.object.isRequired,
    match: PT.object.isRequired,
    aktivitetFeilmeldinger: PT.array.isRequired,
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onLagreNyAktivitet: (aktivitet: Partial<VeilarbAktivitet>) => dispatch(lagNyAktivitet(aktivitet)),
});

const mapStateToProps = (state: any) => ({
    aktivitetFeilmeldinger: selectAktivitetFeilmeldinger(state),
    underOppfolging: selectErUnderOppfolging(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NyAktivitetForm);
