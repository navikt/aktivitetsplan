import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { VisibleIfLesmerpanel } from '../../felles-komponenter/utils/visible-if-lesmerpanel';
import AktivitetsKort from '../../moduler/aktivitet/aktivitet-kort/aktivitetskort';

function SkjulEldreAktiviteter({ aktivitetTilDatoMerEnnToManederSiden }) {
    return (
        <VisibleIfLesmerpanel
            visible={aktivitetTilDatoMerEnnToManederSiden.length > 0}
            className="aktivitetstavle__kolonne-lesmerpanel"
            // eslint-disable-next-line no-unused-vars
            onOpen={event => {
                const frontendlogger = window.frontendlogger;
                if (frontendlogger) {
                    frontendlogger.event(
                        'aktivitetsplan.viseldreaktiviter',
                        {},
                        {}
                    );
                }
            }}
            // eslint-disable-next-line no-unused-vars
            onClose={event => {
                const frontendlogger = window.frontendlogger;
                if (frontendlogger) {
                    frontendlogger.event(
                        'aktivitetsplan.skjuleldreaktiviter',
                        {},
                        {}
                    );
                }
            }}
            intro={<FormattedMessage id="vis-eldre-aktiviteter-intro" />}
            apneTekst={
                <FormattedMessage id="vis-eldre-aktiviteter-apnetekst" />
            }
            lukkTekst={
                <FormattedMessage id="vis-eldre-aktiviteter-lukktekst" />
            }
        >
            {aktivitetTilDatoMerEnnToManederSiden.map(aktivitet =>
                <AktivitetsKort key={aktivitet.id} aktivitet={aktivitet} />
            )}
        </VisibleIfLesmerpanel>
    );
}

SkjulEldreAktiviteter.propTypes = {
    aktivitetTilDatoMerEnnToManederSiden: PT.arrayOf(PT.object).isRequired,
};

export default SkjulEldreAktiviteter;
