import { Heading, Link } from '@navikt/ds-react';
import { isAfter } from 'date-fns';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';

import { fetchSistOppdatert } from '../../api/dialogAPI';
import { ARBEIDSRETTET_DIALOG_URL, ER_PROD, MINSIDE_URL } from '../../constant';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import loggEvent, { APNE_OM_TJENESTEN } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import { selectSistOppdatert } from '../dialog/dialog-selector';
import { hentDialoger } from '../dialog/dialog-slice';
import { selectCanPrint } from '../feilmelding/feil-selector';
import { logKlikkKnapp } from '../../amplitude/amplitude';
import { selectValgtPeriodeId } from '../filtrering/filter/valgt-periode-slice';

function Navigasjonslinje() {
    const erVeileder = useErVeileder();
    const sistOppdatert = useSelector(selectSistOppdatert, shallowEqual);
    const vistOppfolgingsperiode = useSelector(selectValgtPeriodeId);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const doHentDialog = () => dispatch(hentDialoger());

        if (!erVeileder) {
            let interval: NodeJS.Timeout;

            const pollForChanges = () =>
                fetchSistOppdatert()
                    .then((data) => {
                        const localSistOppdatert = new Date(sistOppdatert);
                        const remoteSistOppdatert = data.sistOppdatert;
                        if (!!data.sistOppdatert && isAfter(remoteSistOppdatert, localSistOppdatert)) {
                            doHentDialog();
                        }
                    })
                    .catch(() => clearInterval(interval));

            interval = setInterval(pollForChanges, 10000);
            return () => clearInterval(interval);
        }
    }, [dispatch, erVeileder, sistOppdatert]);

    const canPrint = useSelector(selectCanPrint);

    function handleClick() {
        loggEvent(APNE_OM_TJENESTEN);
        logKlikkKnapp('Hva er aktivitetsplanen?');
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex gap-y-2 gap-x-8 flex-col sm:flex-row mt-8 mb-4">
                {!erVeileder ? (
                    <>
                        <Link href={MINSIDE_URL}>Min side</Link>
                        <Link href={ARBEIDSRETTET_DIALOG_URL}>
                            <span>Min dialog med veileder</span>
                        </Link>
                    </>
                ) : null}
                <ReactRouterLink
                    to="informasjon"
                    className="text-text-action underline hover:no-underline"
                    onClick={handleClick}
                >
                    Hva er aktivitetsplanen?
                </ReactRouterLink>
                {canPrint && (
                    <ReactRouterLink to="utskrift" className="text-text-action underline hover:no-underline">
                        Skriv ut
                    </ReactRouterLink>
                )}
                {!ER_PROD
                    ? erVeileder && (
                          <ReactRouterLink
                              to={`journalforing/${vistOppfolgingsperiode}`}
                              className="text-text-action underline hover:no-underline"
                          >
                              Journalføring
                          </ReactRouterLink>
                      )
                    : null}
            </div>
            <Heading level="1" size="xlarge">
                Aktivitetsplan
            </Heading>
        </div>
    );
}

export default Navigasjonslinje;
