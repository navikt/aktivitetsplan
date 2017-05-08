import React, { PropTypes as PT } from 'react';
import AktivitetEtikett from '../../felles-komponenter/aktivitet-etiketter';
import * as AppPT from '../../proptypes';
import { AVTALT_MED_NAV } from '../../constant';

function AktivitetskortIkoner({ kommentarer }) {
    return (
        <div className="aktivitetskort__ikoner">
            <span><i className="komentar-ikon">X</i>{kommentarer && kommentarer.length}</span>
            <i className="vedlegg-ikon">O</i>
        </div>
    );
}

function AktivitetskortTillegg({ aktivitet }) {
    const kommentarer = aktivitet.kommentarer;
    const harKommentarer = kommentarer && kommentarer.length;
    const harEtikett = aktivitet.etikett || aktivitet.avtalt;
    const harVedlegg = false;

    return (
        harEtikett || harKommentarer || harVedlegg
        ? (
            <div>
                <hr className="aktivitetskort__delelinje" />
                <div className="aktivitetskort__ikon-blokk">
                    <div className="aktivitetskort__etiketter">
                        { aktivitet.etikett &&
                            <AktivitetEtikett etikett={aktivitet.etikett} id={`etikett.${aktivitet.etikett}`} />
                        }
                        { aktivitet.avtalt &&
                            <AktivitetEtikett etikett={AVTALT_MED_NAV} id={AVTALT_MED_NAV} />
                        }
                    </div>
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

AktivitetskortIkoner.defaultProps = {
    kommentarer: undefined
};

export default AktivitetskortTillegg;
