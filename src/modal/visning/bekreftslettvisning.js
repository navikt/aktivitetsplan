import React, { PropTypes as PT } from 'react';
import Bilde from 'nav-react-design/dist/bilde';
import { Systemtittel } from 'nav-frontend-typografi';
import { Knapp, Fareknapp } from 'nav-frontend-knapper';
import stopVG from './stop.svg';
import './bekreftslettvisning.less';


function BekreftSlettVisning({ slettAction, avbrytAction }) {
    return (
        <div className="bekreftSlettContainer">
            <header className="modal-header"/>

            <Bilde className="bekreftSlettContainer__stop-svg" src={stopVG} alt="stop icon" />
            <Systemtittel tag="h1" className="bekreftSlettContainer__stop-tekst">
                Er du sikker på at du vil slette aktiviteten?
            </Systemtittel>
            <div className="bekreftSlettContainer__button-row">
                <Fareknapp onClick={slettAction} className="knapp-liten">Slett</Fareknapp>
                <Knapp onClick={avbrytAction} className="knapp-liten modal-footer__knapp">Avbryt</Knapp>
            </div>
        </div>
    );
}

BekreftSlettVisning.propTypes = {
    slettAction: PT.func,
    avbrytAction: PT.func
};

export default BekreftSlettVisning;
