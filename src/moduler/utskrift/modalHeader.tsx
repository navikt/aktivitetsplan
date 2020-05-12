import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/innholdslaster';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import loggEvent, { TRYK_PRINT } from '../../felles-komponenter/utils/logging';
import React from 'react';

interface Props {
    avhengigheter: InnholdslasterProps['avhengigheter'];
    tilbake?: () => void;
    kanSkriveUt: boolean;
}

function ModalHeader(props: Props) {
    const { avhengigheter, tilbake, kanSkriveUt } = props;
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <header className="modal-header">
                <div className="printmodal-header">
                    <Knappelenke
                        className="tilbakeknapp printmodal-header__tilbakeknapp"
                        onClick={!!tilbake ? tilbake : () => {}}
                        role="link"
                        tabIndex="0"
                        hidden={!tilbake}
                    >
                        <div className="tilbakeknapp-innhold">
                            <i className="nav-frontend-chevron chevronboks chevron--venstre" />
                            Tilbake
                        </div>
                    </Knappelenke>
                    <HiddenIfHovedknapp
                        hidden={!kanSkriveUt}
                        className="printmodal-header__printknapp"
                        onClick={() => {
                            window.print();
                            loggEvent(TRYK_PRINT);
                        }}
                    >
                        Skriv ut
                    </HiddenIfHovedknapp>
                </div>
            </header>
        </Innholdslaster>
    );
}

export default ModalHeader;
