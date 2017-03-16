import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Infotekst } from 'nav-react-design/dist/typografi';
import { Knapp } from 'nav-react-design/dist/knapp';


function KommentarForAktivitet() {
    return (
        <section className="kommentar-for-aktivitet">
            <form className="skjema-innlogget">
                <h1 className="typo-element">Legg til kommentar</h1>
                <Infotekst>
                    <FormattedHTMLMessage id="kommentar.info" />
                </Infotekst>

                <label htmlFor="planlagt-stilling-kommentar">Detaljer</label>
                <textarea rows="5" id="planlagt-stilling-kommentar" name="detaljer" className="input-fullbredde no-resize" placeholder="Detaljer" />
                <div className="knapperad">
                    <Knapp>Lagre</Knapp>
                </div>
                <section className="kommentarer" />
            </form>
        </section>
    );
}


KommentarForAktivitet.propTypes = {};


export default KommentarForAktivitet;
