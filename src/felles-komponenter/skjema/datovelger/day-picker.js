/* eslint-env browser */
import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedDate } from 'react-intl';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

const localeUtils = {
    ...MomentLocaleUtils,
    formatWeekdayShort: (i, locale) => MomentLocaleUtils.formatWeekdayLong(i, locale).substring(0, 3),
};

export const Caption = ({ date }) => (
    <div className="DayPicker-Caption" role="heading" aria-live="assertive" aria-atomic="true">
        <FormattedDate month="long" year="numeric" value={date} />
    </div>
);

Caption.propTypes = {
    date: PT.instanceOf(Date),
};

Caption.defaultProps = {
    date: undefined,
};

export const NavBar = ({ onNextClick, onPreviousClick, showPreviousButton, showNextButton }) => {
    const className = 'DayPicker-NavButton';
    return (
        <div role="toolbar">
            <button
                tabIndex="0"
                aria-label="Forrige måned"
                className={`${className} DayPicker-NavButton--prev`}
                disabled={!showPreviousButton}
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onPreviousClick();
                }}
            />
            <button
                tabIndex="0"
                aria-label="Neste måned"
                className={`${className} DayPicker-NavButton--next`}
                disabled={!showNextButton}
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onNextClick();
                }}
            />
        </div>
    );
};

NavBar.propTypes = {
    onNextClick: PT.func,
    onPreviousClick: PT.func,
    showPreviousButton: PT.bool,
    showNextButton: PT.bool,
};

NavBar.defaultProps = {
    onNextClick: undefined,
    onPreviousClick: undefined,
    showPreviousButton: false,
    showNextButton: false,
};

class DayPickerComponent extends Component {
    componentDidMount() {
        const { lukk } = this.props;
        this.lukk = () => {
            lukk();
        };

        document.body.click(); // fjern andre datepickere
        document.addEventListener('click', this.lukk);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.lukk);
    }

    getDateFromValue() {
        const { input } = this.props;
        const dato = moment(input.value);
        return dato.isValid() ? dato.toDate() : null;
    }

    getInitialMonth() {
        const { tidligsteFom } = this.props;
        return this.getDateFromValue() || tidligsteFom || new Date();
    }

    selectedDays(day) {
        return DateUtils.isSameDay(this.getDateFromValue() || new Date(), day);
    }

    render() {
        const { ariaControls, onKeyUp, onDayClick } = this.props;
        return (
            <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className="datovelger__DayPicker"
                aria-controls={ariaControls} // eslint-disable-line jsx-a11y/aria-props
                onKeyUp={(e) => {
                    onKeyUp(e);
                }}
            >
                <DayPicker
                    locale="no"
                    initialMonth={this.getInitialMonth()}
                    localeUtils={localeUtils}
                    firstDayOfWeek={1}
                    captionElement={<Caption />}
                    navbarElement={<NavBar />}
                    selectedDays={(day) => this.selectedDays(day)}
                    onDayClick={(event, jsDato) => onDayClick(event, jsDato)}
                />
            </div>
        );
    }
}

DayPickerComponent.propTypes = {
    input: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onKeyUp: PT.func.isRequired,
    lukk: PT.func.isRequired,
    ariaControls: PT.string,
    onDayClick: PT.func.isRequired,
    tidligsteFom: PT.instanceOf(Date),
};

DayPickerComponent.defaultProps = {
    ariaControls: undefined,
    tidligsteFom: undefined,
};

export default DayPickerComponent;
