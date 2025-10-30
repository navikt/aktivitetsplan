import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { useErVeileder } from '../../../../Provider';
import { useRoutes } from '../../../../routing/useRoutes';
import { selectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import { byttTilDialogFlate, getDialogLenke } from '../../../dialog/DialogFlateUtils';
import { logKlikkKnapp } from '../../../../amplitude/umami.client';

interface Props {
    aktivitet: AlleAktiviteter;
}

const SendEnMeldingKnapp = (props: Props) => {
    const { aktivitet } = props;
    const erVeileder = useErVeileder();
    const dialog = useSelector(selectDialogForAktivitetId(aktivitet.id));

    const ulestMeldinger =
        dialog?.henvendelser?.reduce((totaltUleste, melding) => (melding.lest ? totaltUleste : totaltUleste + 1), 0) ||
        0;

    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();

    const veilederOnClick = (event: React.MouseEvent) => {
        if (erVeileder) {
            navigate(hovedsideRoute(), { replace: true });
            byttTilDialogFlate({ event, aktivitetId: aktivitet?.id, dialogId: dialog?.id });
        }
        logKlikkKnapp('send melding (i aktivitetskort)');
    };

    return (
        <div className="relative">
            <Button
                variant="secondary"
                as="a"
                href={getDialogLenke({ erVeileder, aktivitetId: aktivitet.id, dialogId: dialog?.id })}
                icon={<ChatElipsisIcon aria-hidden fontSize="1.5rem" />}
                onClick={veilederOnClick}
            >
                {ulestMeldinger > 0
                    ? `Du har ${ulestMeldinger} ${ulestMeldinger === 1 ? 'ulest melding' : 'uleste meldinger'}`
                    : 'Send en melding'}
            </Button>
            {ulestMeldinger ? (
                <div className="absolute bg-red-500 rounded-full flex justify-center items-center w-3 h-3 text-white left-8 top-6"></div>
            ) : null}
        </div>
    );
};

export default SendEnMeldingKnapp;
