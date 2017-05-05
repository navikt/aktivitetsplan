import React, { PropTypes as PT } from 'react';
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';
import * as AppPT from '../../proptypes';

function AktivitetskortIkoner({ kommentarer }) {
    return (
        <div className="aktivitetskort__ikoner">
            <span><i className="komentar-ikon">X</i>{kommentarer && kommentarer.length}</span>
            <i className="vedlegg-ikon">O</i>
        </div>
    );
}

function AktivitetskortTillegg({ aktivitet }) {
    // const etiketter = aktivitet.avtalt ?
    //     { tag: 'Avtalt med NAV', type: 'avtalt' }.concat({ tag: aktivitet.etikett, type: aktivitet.etikett }) :
    //     aktivitet.tagger;
    const kommentarer = aktivitet.kommentarer;
    const harKommentarer = kommentarer && kommentarer.length;
    // const harEtiketter = etiketter && etiketter.length;
    const harVedlegg = false;

    return (
        /* harEtiketter || */ harKommentarer || harVedlegg
        ? (
            <div>
                <hr className="aktivitetskort__delelinje" />
                <div className="aktivitetskort__ikon-blokk">
                    <AktivitetEtiketter etiketter={[]} className="aktivitetskort__etiketter" />
                    <AktivitetskortIkoner kommentarer={kommentarer} />
                </div>
            </div>
        )
        : null
    );
}

AktivitetskortTillegg.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired
};

AktivitetskortIkoner.propTypes = {
    kommentarer: PT.arrayOf(PT.object)
};

export default AktivitetskortTillegg;
