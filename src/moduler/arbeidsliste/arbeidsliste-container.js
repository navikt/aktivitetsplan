import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { hentMotpart, hentNavnPaMotpart } from '../motpart/motpart-selectors';
import StandardModal from '../../felles-komponenter/modal/modal-standard';

function ArbeidslisteContainer({ motpart, children }) {
    // const fnr = getFodselsnummer();

    return (
        <StandardModal>
            <article className="arbeidsliste__container">
                <Innholdslaster
                    avhengigheter={[motpart]}
                    className="arbeidsliste__spinner"
                >
                    {children}
                </Innholdslaster>
            </article>
        </StandardModal>
    );
}

/*
                <Innholdstittel className="arbeidsliste__overskrift">
                    <FormattedMessage id="arbeidsliste.modal.legg.til.overskrift" />
                </Innholdstittel>
                <Normaltekst>
                    <FormattedMessage id="arbeidsliste.modal.legg.til.infotekst" />
                </Normaltekst>

                    <Undertittel>
                        <FormattedMessage
                            id="arbeidsliste.modal.personalia"
                            values={{ navnPaMotpart, fnr }}
                        />
                    </Undertittel>
                </Innholdslaster>
 */

ArbeidslisteContainer.defaultProps = {
    navnPaMotpart: undefined,
};

ArbeidslisteContainer.propTypes = {
    // navnPaMotpart: PT.string,
    motpart: AppPT.reducer.isRequired,
    children: PT.node.isRequired,
};

const mapStateToProps = state => ({
    motpart: hentMotpart(state),
    navnPaMotpart: hentNavnPaMotpart(state),
});

export default connect(mapStateToProps)(ArbeidslisteContainer);
