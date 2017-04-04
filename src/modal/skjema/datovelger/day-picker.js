/* eslint-env browser*/
import React, { Component, PropTypes as PT } from 'react';
import DayPicker, { DateUtils, LocaleUtils } from 'react-day-picker';
import { erGyldigDato, erGyldigDatoformat } from '../../../utils';
import './day-picker.less';

export const MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
export const WEEKDAYS_LONG = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
export const WEEKDAYS_SHORT = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];

export const formatDay = (date) =>
    // aria-label på dager
     `${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()}. ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const localeUtils = Object.assign({}, LocaleUtils, {
    formatDay
});

const pad = (nr) => {
    if (nr > 9 || nr.length > 1) {
        return nr;
    }
    return `0${nr}`;
};

export const Caption = ({ date }) => (<div className="DayPicker-Caption" role="heading" aria-live="assertive" aria-atomic="true">
    {`${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
</div>);

Caption.propTypes = {
    date: PT.instanceOf(Date)
};

export const NavBar = ({ onNextClick, onPreviousClick, showPreviousButton, showNextButton }) => {
    const className = 'DayPicker-NavButton';
    return (<div role="toolbar">
        <button
            tabIndex="-1"
            aria-label="Forrige måned"
            className={`${className} DayPicker-NavButton--prev`}
            disabled={!showPreviousButton}
            type="button" onClick={(e) => {
                e.preventDefault();
                onPreviousClick();
            }}
        />
        <button
            tabIndex="-1"
            aria-label="Neste måned"
            className={`${className} DayPicker-NavButton--next`}
            disabled={!showNextButton}
            type="button"
            onClick={(e) => {
                e.preventDefault();
                onNextClick();
            }}
        />
    </div>);
};

NavBar.propTypes = {
    onNextClick: PT.func,
    onPreviousClick: PT.func,
    showPreviousButton: PT.bool,
    showNextButton: PT.bool
};

class DayPickerComponent extends Component {
    componentDidMount() {
        const lukk = this.lukk = () => {
            this.props.lukk();
        };

        document.body.click(); // fjern andre datepickere
        document.addEventListener('click', lukk);
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

    dateLessOrEqual(date1, date2) {
        const year1 = date1.getFullYear();
        const year2 = date2.getFullYear();

        const mon1 = date1.getMonth();
        const mon2 = date2.getMonth();

        const day1 = date1.getDate();
        const day2 = date2.getDate();

        if (year1 < year2) return true;
        else if (year1 === year2 && mon1 < mon2) return true;
        else return year1 === year2 && mon1 === mon2 && day1 < day2;
    }

    dateGreaterOrEqual(date1, date2) {
        const year1 = date1.getFullYear();
        const year2 = date2.getFullYear();

        const mon1 = date1.getMonth();
        const mon2 = date2.getMonth();

        const day1 = date1.getDate();
        const day2 = date2.getDate();

        if (year1 > year2) return true;
        else if (year1 === year2 && mon1 > mon2) return true;
        else return year1 === year2 && mon1 === mon2 && day1 > day2;
    }

    erDeaktivertDag(day) {
        const { tidligsteFom, senesteTom } = this.props;
        const tempDay = new Date(`${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`);

        return tidligsteFom && this.dateGreaterOrEqual(tidligsteFom, tempDay) ||
            senesteTom && this.dateLessOrEqual(senesteTom, tempDay);
    }

    render() {
        const { ariaControlledBy, onKeyUp } = this.props;
        return (<div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className="datovelger__DayPicker"
            aria-controlledby={ariaControlledBy} // eslint-disable-line jsx-a11y/aria-props
            onKeyUp={(e) => {
                onKeyUp(e);
            }}
        >
            <DayPicker
                locale="no"
                months={MONTHS}
                weekdaysLong={WEEKDAYS_LONG}
                weekdaysShort={WEEKDAYS_SHORT}
                initialMonth={this.getInitialMonth()}
                localeUtils={localeUtils}
                firstDayOfWeek={1}
                captionElement={<Caption />}
                navbarElement={<NavBar />}
                disabledDays={(day) => this.erDeaktivertDag(day)}
                selectedDays={(day) => this.selectedDays(day)}
                onDayClick={(event, jsDato) => {
                    if (!this.erDeaktivertDag(event)) {
                        this.props.onDayClick(event, jsDato);
                    }
                }}
            />
        </div>);
    }
}

DayPickerComponent.propTypes = {
    input: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    onKeyUp: PT.func.isRequired,
    lukk: PT.func.isRequired,
    ariaControlledBy: PT.string,
    onDayClick: PT.func.isRequired,
    senesteTom: PT.instanceOf(Date),
    tidligsteFom: PT.instanceOf(Date)
};

export default DayPickerComponent;
