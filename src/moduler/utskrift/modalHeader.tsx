import React from 'react';

import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/HiddenIfKnapper';
import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/Innholdslaster';
import Knappelenke from '../../felles-komponenter/utils/Knappelenke';
import loggEvent, { TRYK_PRINT } from '../../felles-komponenter/utils/logging';

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
                        tabIndex={0}
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
