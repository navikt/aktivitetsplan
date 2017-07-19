/* eslint-env browser*/
import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedDate, injectIntl, intlShape } from 'react-intl';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import { erGyldigDato, erGyldigDatoformat } from '../../../utils';

const localeUtils = {
    ...MomentLocaleUtils,
    formatWeekdayShort: (i, locale) =>
        MomentLocaleUtils.formatWeekdayLong(i, locale).substring(0, 3),
};

export const Caption = ({ date }) =>
    <div
        className="DayPicker-Caption"
        role="heading"
        aria-live="assertive"
        aria-atomic="true"
    >
        <FormattedDate month="long" year="numeric" value={date} />
    </div>;

Caption.propTypes = {
    date: PT.instanceOf(Date),
};

Caption.defaultProps = {
    date: undefined,
};

export const NavBar = ({
    onNextClick,
    onPreviousClick,
    showPreviousButton,
    showNextButton,
    intl,
}) => {
    const className = 'DayPicker-NavButton';
    return (
        <div role="toolbar">
            <button
                tabIndex="-1"
                aria-label={intl.formatMessage({
                    id: 'datepicker.forrige-maaned',
                })}
                className={`${className} DayPicker-NavButton--prev`}
                disabled={!showPreviousButton}
                type="button"
                onClick={e => {
                    e.preventDefault();
                    onPreviousClick();
                }}
            />
            <button
                tabIndex="-1"
                aria-label={intl.formatMessage({
                    id: 'datepicker.neste-maaned',
                })}
                className={`${className} DayPicker-NavButton--next`}
                disabled={!showNextButton}
                type="button"
                onClick={e => {
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
    intl: intlShape.isRequired,
};

NavBar.defaultProps = {
    onNextClick: undefined,
    onPreviousClick: undefined,
    showPreviousButton: false,
    showNextButton: false,
};

class DayPickerComponent extends Component {
    componentDidMount() {
        this.lukk = () => {
            this.props.lukk();
        };

        document.body.click(); // fjern andre datepickere
        document.addEventListener('click', this.lukk);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.lukk);
    }

    getDateFromValue() {
        const { input } = this.props;
        const v = input.value;
        if (!erGyldigDatoformat(v) || !erGyldigDato(v)) {
            return undefined;
        }
        const d = input.value.split('.');
        return new Date(`${d[2]}-${d[1]}-${d[0]}`);
    }

    getInitialMonth() {
        const s = this.getDateFromValue();
        if (s) {
            return s;
        }
        return this.props.senesteTom || new Date();
    }

    selectedDays(day) {
        if (!this.getDateFromValue()) {
            return false;
        }
        return DateUtils.isSameDay(this.getDateFromValue(), day);
    }

    render() {
        const { ariaControlledBy, onKeyUp } = this.props;
        return (
            <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className="datovelger__DayPicker"
                aria-controlledby={ariaControlledBy} // eslint-disable-line jsx-a11y/aria-props
                onKeyUp={e => {
                    onKeyUp(e);
                }}
            >
                <DayPicker
                    locale="no"
                    initialMonth={this.getInitialMonth()}
                    localeUtils={localeUtils}
                    firstDayOfWeek={1}
                    captionElement={<Caption />}
                    navbarElement={<NavBar intl={this.props.intl} />}
                    selectedDays={day => this.selectedDays(day)}
                    onDayClick={(event, jsDato) =>
                        this.props.onDayClick(event, jsDato)}
                />
            </div>
        );
    }
}

DayPickerComponent.propTypes = {
    input: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onKeyUp: PT.func.isRequired,
    lukk: PT.func.isRequired,
    ariaControlledBy: PT.string,
    onDayClick: PT.func.isRequired,
    senesteTom: PT.instanceOf(Date),
    intl: intlShape.isRequired,
};

DayPickerComponent.defaultProps = {
    ariaControlledBy: undefined,
    senesteTom: undefined,
};

export default injectIntl(DayPickerComponent);
