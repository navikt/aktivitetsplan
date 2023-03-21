import { PrinterSmallIcon } from '@navikt/aksel-icons';
import { Button, Heading, Link } from '@navikt/ds-react';
import React from 'react';

import Innholdslaster, { InnholdslasterProps } from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { TRYK_PRINT } from '../../felles-komponenter/utils/logging';
import Filter from '../filtrering/Filter';
import VisValgtFilter from '../filtrering/VisValgtFilter';

interface Props {
    avhengigheter: InnholdslasterProps['avhengigheter'];
    tilbake?: () => void;
    kanSkriveUt: boolean;
}

function ModalHeader(props: Props) {
    const { avhengigheter, tilbake, kanSkriveUt } = props;
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <Heading className="print:hidden" spacing size={'large'}>
                Skriv ut aktivitetsplanen
            </Heading>
            <div className="print:hidden self-start flex flex-row gap-x-10 mb-8">
                {tilbake ? (
                    <Link className="hover:cursor-pointer" onClick={tilbake} tabIndex={0}>
                        Tilbake
                    </Link>
                ) : null}
                {kanSkriveUt ? (
                    <Button
                        icon={<PrinterSmallIcon />}
                        onClick={() => {
                            window.print();
                            loggEvent(TRYK_PRINT);
                        }}
                    >
                        Skriv ut
                    </Button>
                ) : null}
                <Filter />
            </div>
            <div className="print:hidden mb-8">
                <VisValgtFilter />
            </div>
        </Innholdslaster>
    );
}

export default ModalHeader;
