import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { useErVeileder, useFnr } from '../../../../Provider';
import { useRoutes } from '../../../../routes';
import { selectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import { byttTilDialogFlate, getDialogLenke } from '../../../dialog/DialogFlateUtils';

interface Props {
    aktivitet: AlleAktiviteter;
}

const SendEnMeldingKnapp = (props: Props) => {
    const { aktivitet } = props;
    const fnr = useFnr();
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
            byttTilDialogFlate(event, aktivitet.id, dialog?.id);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="secondary"
                as="a"
                href={getDialogLenke(erVeileder, fnr, aktivitet.id, dialog?.id)}
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
