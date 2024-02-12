import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React from 'react';
import { hentPdfTilForhaandsvisning, selectArkivStatus } from '../verktoylinje/arkivering/arkivering-slice';
import { Button } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';

export const JournalforingPage = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(useSelector(selectArkivStatus));
    return (
        <section className="flex flex-col justify-center items-center p-8">
            <div className="aktivitetsplanprint flex justify-center items-center">
                <Innholdslaster avhengigheter={[]}>
                    <div className="px-12 print:border-none space-x-4">
                        <Button
                            disabled={arkiverer}
                            variant="secondary"
                            onClick={() => dispatch(hentPdfTilForhaandsvisning(vistOppfolgingsperiode!!.uuid))}
                        >
                            Journalfør
                        </Button>
                        <Button
                            disabled={arkiverer}
                            variant="secondary"
                            onClick={() => dispatch(hentPdfTilForhaandsvisning(vistOppfolgingsperiode!!.uuid))}
                        >
                            Forhåndsvisning
                        </Button>
                    </div>
                </Innholdslaster>
            </div>
        </section>
    );
};
