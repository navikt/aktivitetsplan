import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    Innholdstittel,
    Normaltekst,
    Undertittel,
} from 'nav-frontend-typografi';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import ArbeidslisteModal from './arbeidsliste-modal';

function RedigerArbeidsliste({ motpart, navnPaMotpart }) {
    const fnr = getFodselsnummer();
    return (
        <ArbeidslisteModal>
            <article className="arbeidsliste__container">
                <Innholdstittel className="arbeidsliste__overskrift">
                    <FormattedMessage id="arbeidsliste.modal.rediger.overskrift" />
                </Innholdstittel>
                <Normaltekst>
                    <FormattedMessage id="arbeidsliste.modal.rediger.infotekst" />
                </Normaltekst>
                <Innholdslaster
                    avhengigheter={[motpart]}
                    className="arbeidsliste__spinner"
                >
                    <Undertittel>
                        <FormattedMessage
                            id="arbeidsliste.modal.personalia"
                            values={{ navnPaMotpart, fnr }}
                        />
                    </Undertittel>
                </Innholdslaster>
            </article>
        </ArbeidslisteModal>
    );
}

RedigerArbeidsliste.defaultProps = {
    navnPaMotpart: undefined,
};

RedigerArbeidsliste.propTypes = {
    navnPaMotpart: PT.string,
    motpart: AppPT.reducer.isRequired,
};

const mapStateToProps = state => {
    const motpart = state.data.motpart;
    return {
        motpart,
        navnPaMotpart: motpart.data.navn,
    };
};

export default connect(mapStateToProps)(RedigerArbeidsliste);
