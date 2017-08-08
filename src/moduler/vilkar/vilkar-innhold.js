import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Bilde from 'nav-react-design/dist/bilde';
import { Element, Innholdstittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import * as AppPT from '../../proptypes';
import UnsafeHtml from '../../felles-komponenter/utils/unsafe-html';
import vilkarSvg from './vilkar-illustrasjon.svg';
import VisibleIfHOC from '../../hocs/visible-if';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import { formaterDatoKortManed } from '../../utils';
import {
    selectErPrivatModus,
    selectPrivatModusReducer,
} from '../privat-modus/privat-modus-selector';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';

const VisibleIfElementFormattedMessage = VisibleIfHOC(props =>
    <Element className="vilkar__metaData">
        <FormattedMessage {...props} />
    </Element>
);

function VilkarInnhold({ vilkar, privatModus, privatModusReducer }) {
    const formattertDato = formaterDatoKortManed(vilkar.dato);
    const tittelTekst = privatModus
        ? 'vilkar.modal.gjeldende.privat-tittel'
        : 'vilkar.modal.gjeldende.samarbeid-tittel';
    return (
        <Innholdslaster avhengigheter={[privatModusReducer]}>
            <div className="vilkar__innhold">
                <Bilde src={vilkarSvg} alt="Dekorativ illustrajon" />
                <Innholdstittel className="vilkar__tittel">
                    <FormattedMessage id={tittelTekst} />
                </Innholdstittel>
                <UnsafeHtml className="vilkar__tekst">
                    {vilkar.tekst}
                </UnsafeHtml>
                <VisibleIfElementFormattedMessage
                    visible={!!vilkar.vilkarstatus && !!vilkar.dato}
                    id="vilkar.modal.gjeldende-status-dato"
                    values={{
                        status: vilkar.vilkarstatus,
                        dato: formattertDato,
                    }}
                />
            </div>
        </Innholdslaster>
    );
}

VilkarInnhold.propTypes = {
    vilkar: AppPT.vilkar.isRequired,
    privatModus: PT.bool.isRequired,
    privatModusReducer: AppPT.reducer.isRequired,
};

VisibleIfElementFormattedMessage.propTypes = {
    privatModus: PT.bool.isRequired,
    privatModusReducer: AppPT.reducer.isRequired,
};

const mapStateToProps = state => {
    const privatModus = selectErPrivatModus(state);
    const privatModusReducer = selectPrivatModusReducer(state);
    return {
        privatModus,
        privatModusReducer,
    };
};

export default hiddenIf(connect(mapStateToProps)(VilkarInnhold));
