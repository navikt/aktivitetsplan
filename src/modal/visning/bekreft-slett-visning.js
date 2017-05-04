import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import Bilde from 'nav-react-design/dist/bilde';
import { Systemtittel } from 'nav-frontend-typografi';
import { Knapp, Fareknapp } from 'nav-frontend-knapper';
import stopSvg from './stop.svg';
import './bekreft-slett-visning.less';


function BekreftSlettVisning({ slettAction, avbrytAction }) {
    return (
        <div className="bekreft-slett-container">
            <header className="modal-header" />

            <Bilde className="bekreft-slett-container__stop-svg" src={stopSvg} alt="stop icon" />
            <Systemtittel tag="h1" className="bekreft-slett-container__stop-tekst">
                <FormattedMessage id="aktivitetvisning.bekreft-sletting.tittel" />
            </Systemtittel>
            <div className="bekreft-slett-container__button-row">
                <Fareknapp onClick={slettAction} autoFocus className="knapp-liten">
                    <FormattedMessage id="aktivitetvisning.bekreft-sletting.slettknapp" />
                </Fareknapp>
                <Knapp onClick={avbrytAction} className="knapp-liten">
                    <FormattedMessage id="aktivitetvisning.bekreft-sletting.avbrytknapp" />
                </Knapp>
            </div>
        </div>
    );
}

BekreftSlettVisning.propTypes = {
    slettAction: PT.func,
    avbrytAction: PT.func
};

export default BekreftSlettVisning;
