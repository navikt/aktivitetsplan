import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Radio } from 'nav-frontend-skjema';
import * as statuser from '../../constant';
import { oppdaterAktivitetEtikett } from '../../ducks/aktiviteter';
import { aktivitet as aktivitetPT } from '../../proptypes';
import { STATUS } from '../../ducks/utils';

function StillingEtikettForm(props) {
    const { aktivitet, doOppdaterAktivitetEtikett, disabled } = props;
    return (
        <form>
            <div className="row">
                <div className="col col-xs-4">
                    <Radio
                        name="etikettstatus"
                        label={<FormattedMessage id="etikett.INGEN_VALGT" />}
                        value={statuser.INGEN_VALGT}
                        id={`id--${statuser.INGEN_VALGT}`}
                        disabled={disabled}
                        onChange={() =>
                            doOppdaterAktivitetEtikett(
                                aktivitet,
                                statuser.INGEN_VALGT
                            )}
                        checked={
                            aktivitet.etikett === statuser.INGEN_VALGT ||
                                !aktivitet.etikett
                        }
                    />
                    <Radio
                        name="etikettstatus"
                        label={<FormattedMessage id="etikett.SOKNAD_SENDT" />}
                        value={statuser.SOKNAD_SENDT}
                        id={`id--${statuser.SOKNAD_SENDT}`}
                        disabled={disabled}
                        onChange={() =>
                            doOppdaterAktivitetEtikett(
                                aktivitet,
                                statuser.SOKNAD_SENDT
                            )}
                        checked={aktivitet.etikett === statuser.SOKNAD_SENDT}
                    />
                    <Radio
                        name="etikettstatus"
                        label={
                            <FormattedMessage id="etikett.INNKALT_TIL_INTERVJU" />
                        }
                        value={statuser.INNKALT_TIL_INTERVJU}
                        id={`id--${statuser.INNKALT_TIL_INTERVJU}`}
                        disabled={disabled}
                        onChange={() =>
                            doOppdaterAktivitetEtikett(
                                aktivitet,
                                statuser.INNKALT_TIL_INTERVJU
                            )}
                        checked={
                            aktivitet.etikett === statuser.INNKALT_TIL_INTERVJU
                        }
                    />
                </div>
                <div className="col col-xs-4">
                    <Radio
                        name="etikettstatus"
                        label={<FormattedMessage id="etikett.AVSLAG" />}
                        value={statuser.AVSLAG}
                        id={`id--${statuser.AVSLAG}`}
                        disabled={disabled}
                        onChange={() =>
                            doOppdaterAktivitetEtikett(
                                aktivitet,
                                statuser.AVSLAG
                            )}
                        checked={aktivitet.etikett === statuser.AVSLAG}
                    />
                    <Radio
                        name="etikettstatus"
                        label={<FormattedMessage id="etikett.JOBBTILBUD" />}
                        value={statuser.JOBBTILBUD}
                        id={`id--${statuser.JOBBTILBUD}`}
                        disabled={disabled}
                        onChange={() =>
                            doOppdaterAktivitetEtikett(
                                aktivitet,
                                statuser.JOBBTILBUD
                            )}
                        checked={aktivitet.etikett === statuser.JOBBTILBUD}
                    />
                </div>
            </div>
        </form>
    );
}

StillingEtikettForm.propTypes = {
    disableStatusEndring: PT.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
    aktivitet: aktivitetPT.isRequired,
    doOppdaterAktivitetEtikett: PT.func.isRequired,
    disabled: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
    disabled: state.data.aktiviteter.status !== STATUS.OK ||
        props.disableStatusEndring,
});

const mapDispatchToProps = dispatch => ({
    doOppdaterAktivitetEtikett: (aktivitet, etikett) => {
        const nyEtikett = etikett === statuser.INGEN_VALGT ? null : etikett;
        oppdaterAktivitetEtikett({ ...aktivitet, etikett: nyEtikett })(
            dispatch
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    StillingEtikettForm
);
