import { DialogDots } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import { createSelectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import { byttTilDialogFlate, getDialogLenke } from '../../../dialog/DialogFlateUtils';
import { selectErVeileder } from '../../../identitet/identitet-selector';

interface Props {
    aktivitet: AlleAktiviteter;
}

const SendEnMeldingKnapp = (props: Props) => {
    const { aktivitet } = props;
    const erVeileder = useSelector(selectErVeileder);
    const dialog: Dialog | undefined = useSelector(createSelectDialogForAktivitetId(aktivitet));

    const history = useHistory();

    const veilederOnClick = (event: React.MouseEvent) => {
        if (erVeileder) {
            history.replace('/');
            byttTilDialogFlate(event, aktivitet.id, dialog?.id);
        }
    };

    return (
        <Button
            variant="secondary"
            as="a"
            href={getDialogLenke(erVeileder, aktivitet.id, dialog?.id)}
            icon={<DialogDots aria-hidden />}
            onClick={veilederOnClick}
        >
            Send en melding
        </Button>
    );
};

export default SendEnMeldingKnapp;
