import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import { validForm } from 'react-redux-form-validation';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { autobind } from '../../../../utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import {
    begrensetForhandsorienteringLengde,
    pakrevdForhandsorienteringLengde,
} from '../avtalt-container/avtalt-form';
import { sendForhandsorientering } from '../../../dialog/dialog-reducer';
import { HiddenIfAlertStripeSuksess } from '../../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../../proptypes';

class ForhandsorienteringArenaAktivitet extends Component {
    constructor() {
        super();
        this.state = {
            skalSendeForhandsorientering: false,
            forhandsorienteringSent: false,
        };
        autobind(this);
    }

    render() {
        return (
            <div>
                <VisibleIfDiv visible={!this.state.forhandsorienteringSent}>
                    <Undertittel>
                        <FormattedMessage id="forhandsorientering.arenaaktivitet.tittel" />
                    </Undertittel>
                    <NavCheckbox
                        label={this.props.intl.formatMessage({
                            id: 'forhandsorientering.arenaaktivitet.checkbox',
                        })}
                        onChange={() =>
                            this.setState({
                                skalSendeForhandsorientering: !this.state
                                    .skalSendeForhandsorientering,
                            })}
                        checked={this.state.skalSendeForhandsorientering}
                    />
                    {this.state.skalSendeForhandsorientering &&
                        <form
                            onSubmit={formData => {
                                this.props.handleSubmit(formData);
                                this.setState({
                                    forhandsorienteringSent: true,
                                });
                            }}
                        >
                            <Textarea
                                feltNavn="avtaltText119"
                                maxLength={500}
                            />
                            <Knapp>
                                <FormattedMessage id="forhandsorientering.arenaaktivitet.bekreft-og-send" />
                            </Knapp>
                        </form>}
                </VisibleIfDiv>
                <HiddenIfAlertStripeSuksess
                    hidden={!this.state.forhandsorienteringSent}
                >
                    {'apabepa'}
                </HiddenIfAlertStripeSuksess>
            </div>
        );
    }
}

ForhandsorienteringArenaAktivitet.propTypes = {
    handleSubmit: PT.func.isRequired,
    valgtAktivitet: AppPT.aktivitet.isRequired,
    intl: intlShape.isRequired,
};

const formNavn = 'send-forhandsorientering-arena-aktivitet-form';
const ForhandsorienteringArenaAktivitetForm = validForm({
    form: formNavn,
    enableReinitialize: false,
    validate: {
        avtaltText119: [
            begrensetForhandsorienteringLengde,
            pakrevdForhandsorienteringLengde,
        ],
    },
})(ForhandsorienteringArenaAktivitet);

const mapStateToProps = (state, props) => ({
    initialValues: {
        avtaltText119: props.intl.formatMessage({
            id: 'sett-avtalt-paragraf-11-9-tekst',
        }),
    },
});

const mapDispatchToProps = (dispatch, props) => ({
    onSubmit: formData => {
        sendForhandsorientering({
            aktivitetId: props.valgtAktivitet.id,
            tekst: formData.avtaltText119,
            overskrift: props.valgtAktivitet.tittel,
        })(dispatch);
    },
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
        ForhandsorienteringArenaAktivitetForm
    )
);
