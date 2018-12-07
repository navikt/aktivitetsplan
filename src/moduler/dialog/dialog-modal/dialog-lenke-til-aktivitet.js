import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { HoyreChevron } from 'nav-frontend-chevron';
import Knappelenke from '../../../felles-komponenter/utils/knappelenke';
import { aktivitetRoute } from '../../../routing';
import * as AppPT from '../../../proptypes';

function DialogLenkeTilAktivitet({ aktivitet, history }) {
    return (
        <Knappelenke onClick={() => history.push(aktivitetRoute(aktivitet.id))}>
            <FormattedMessage
                id="dialog.modal.til-aktiviteten"
                values={{ tittel: aktivitet.tittel }}
            />
            <HoyreChevron />
        </Knappelenke>
    );
}

DialogLenkeTilAktivitet.propTypes = {
    history: AppPT.history.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
};

export default withRouter(DialogLenkeTilAktivitet);
