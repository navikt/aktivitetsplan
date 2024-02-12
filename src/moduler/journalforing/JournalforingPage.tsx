import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import React from 'react';
import { hentPdfTilForhaandsvisning, selectArkivStatus, selectPdf } from '../verktoylinje/arkivering/arkivering-slice';
import { Button } from '@navikt/ds-react';
import { Status } from '../../createGenericSlice';
import { useSelector } from 'react-redux';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { Document } from 'react-pdf';
import { PDFViewer } from '@react-pdf/renderer';

const createBlobUrl = (pdf: string) => {
    const blob = new Blob([pdf], { type: 'application/pdf' });
    console.log('blob' + blob);
    const url = URL.createObjectURL(blob);
    console.log('url' + url);
    console.log('pdf' + pdf);
    return url;
};

export const JournalforingPage = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(useSelector(selectArkivStatus));
    const pdf = useSelector(selectPdf);

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
                    <div className="border">
                        <Document file={createBlobUrl(pdf)} />
                    </div>
                </Innholdslaster>
            </div>
        </section>
    );
};
