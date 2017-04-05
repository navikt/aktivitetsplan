import React, {PropTypes as PT} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Hovedknapp} from "nav-frontend-knapper";
import {reduxForm} from "redux-form";
import Textarea from "../../../modal/skjema/textarea/textarea";
import * as AppPT from "../../../proptypes";
import "../../../modal/skjema/skjema.less";


function AktivitetsmalForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <div className="skjema-innlogget aktivitetskjema">
                <Textarea
                    feltNavn="mal"
                    labelId="todo.mal.label.id" //TODO
                    maxLength={500}
                />
            </div>
            <div className="aktivitetskjema__lagre-knapp">
                <Hovedknapp><FormattedMessage id="aktivitetsmal-form.lagre"/></Hovedknapp>
            </div>
        </form>
    );
}

AktivitetsmalForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    mal: AppPT.mal
};

const AktivitetsmalReduxForm = reduxForm({
    form: "aktivitetsmal-form"
})(AktivitetsmalForm);

const mapStateToProps = (state, props) => ({
    initialValues: {mal: props.mal.mal}
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsmalReduxForm);
