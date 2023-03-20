import { Link } from '@navikt/ds-react';
import React from 'react';

import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/HiddenIfHovedknapp';
import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/Innholdslaster';
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
                <div className="printmodal-header flex gap-x-4">
                    {tilbake ? (
                        <Link className="hover:cursor-pointer" onClick={tilbake ? tilbake : () => {}} tabIndex={0}>
                            Tilbake
                        </Link>
                    ) : null}
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
