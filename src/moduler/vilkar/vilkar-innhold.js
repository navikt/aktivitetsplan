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
    selectErUnderOppfolging,
    selectPrivatModusStatus,
} from '../privat-modus/privat-modus-selector';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';

const VisibleIfElementFormattedMessage = VisibleIfHOC(props =>
    <Element className="vilkar__metaData">
        <FormattedMessage {...props} />
    </Element>
);

function VilkarInnhold({ vilkar, underOppfolging, privatModusStatus }) {
    const formattertDato = formaterDatoKortManed(vilkar.dato);
    const tittelTekst = underOppfolging
        ? 'vilkar.modal.gjeldende.privat-tittel'
        : 'vilkar.modal.gjeldende.samarbeid-tittel';
    return (
        <Innholdslaster avhengigheter={[privatModusStatus]}>
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
    underOppfolging: PT.bool.isRequired,
    privatModusStatus: AppPT.status.isRequired,
};

VisibleIfElementFormattedMessage.propTypes = {
    underOppfolging: PT.bool.isRequired,
    privatModusReducer: AppPT.reducer.isRequired,
};

const mapStateToProps = state => {
    const underOppfolging = selectErUnderOppfolging(state);
    const privatModusStatus = selectPrivatModusStatus(state);
    return {
        underOppfolging,
        privatModusStatus,
    };
};

export default hiddenIf(connect(mapStateToProps)(VilkarInnhold));
