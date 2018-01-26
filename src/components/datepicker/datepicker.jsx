import React from 'react';
import moment from 'moment';
moment.locale('RU');
class DatePickerSelector extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tempValue: moment()
        };
        this.clickDay = this.clickDay.bind(this);
        this.clickNextMonth = this.clickNextMonth.bind(this);
        this.clickPreviousMonth = this.clickPreviousMonth.bind(this);
    }

    clickPreviousMonth() {
        this.setState({
            tempValue: moment(this.state.tempValue).subtract(1, 'month').toDate()
        })
    };

    clickNextMonth() {
        this.setState({
            tempValue: moment(this.state.tempValue).add(1, 'month').toDate()
        })
    };

    clickDay(e) {
        let oldDate = this.state.tempValue;
        let dataDate = e.currentTarget.getAttribute('data-day');
        let dataMonth = e.currentTarget.getAttribute('data-month');
        let newDate = moment(oldDate).month(dataMonth).date(dataDate);

        this.setState({
            tempValue: newDate
        });

        if (this.props.onChangeDate)
            this.props.onChangeDate(oldDate, newDate);

        if (this.props.hideSelector)
            this.props.hideSelector();
    };

    renderDaysInMonth() {
        let { value } = this.props;
        let selectedDate = moment(value);
        let selectedTempDate = moment(this.state.tempValue);
        let daysInMonth = moment(this.state.tempValue).daysInMonth();
        let startDate = moment(this.state.tempValue).date(1);

        if (startDate.days() !== 0)
            startDate.subtract(startDate.days(), 'days');

        let rows = [];
        let daysIndex = 0;

        for (var j = 0; j < 6; j++) {
            let row = [];

            for (var i = 0; i < 7; i++) {
                let className = 'datePickerSelectorTableDays';

                if (startDate.month() !== selectedTempDate.month())
                    className += 'NotInMonth';
                else if (startDate.date() === selectedDate.date() && startDate.month() === selectedDate.month())
                    className += 'Selected';

                row.push(<td onClick={this.clickDay} key={i} className={className} data-day={startDate.date()} data-month={startDate.month()}>{startDate.date()}</td>);

                startDate.add(1, 'days');
            }

            rows.push(row);
            daysIndex++;
        }

        return rows.map((row, index) => {
            return (
                <tr key={index}>
                    {row.map((item) => {
                        return item;
                    })}
                </tr>
            );
        });
    }

    render(){
        let datePickerSelectorClassName = 'datePickerSelector';

        if (this.props.isSelectorActive)
            datePickerSelectorClassName += ' active';

        return (
            <div className={datePickerSelectorClassName}>
                <table className="datePickerSelectorTable">
                    <tbody>
                        <tr className="datePickerSelectorTableHeader">
                            <td >
                                <button className="datepicker__btn button_type_circle" onClick={ this.clickPreviousMonth }>
                                    <svg className="icon icon-arrow-left">
                                        <use href="img/icons_sprite.svg#arrow-left"></use>
                                    </svg>
                                </button>
                            </td>
                            <td className="datePickerSelectorTableHeaderCurrentMonth" colSpan="5">{moment(this.state.tempValue).format("MMMM YYYY")}</td>
                            <td >
                                <button className="datepicker__btn button_type_circle" onClick={ this.clickNextMonth }>
                                    <svg className="icon icon-arrow-right">
                                        <use href="img/icons_sprite.svg#arrow-right"></use>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        <tr className="datePickerSelectorTableDaysHeader">
                            <td>Пн</td>
                            <td>Вт</td>
                            <td>Ср</td>
                            <td>Чт</td>
                            <td>Пт</td>
                            <td>Сб</td>
                            <td>Вс</td>
                        </tr>
                        { this.renderDaysInMonth() }
                    </tbody>
                </table>
            </div>
        );
    };
}

class DatePickerLabel extends React.Component {
    constructor(props){
        super(props);
        this.clickPreviousDay = this.clickPreviousDay.bind(this);
        this.clickNextDay = this.clickNextDay.bind(this);
    }

    clickPreviousDay() {
        let newValue = moment(this.props.value).subtract(1, 'day');
        this.props.onChangeDate(this.props.value, newValue);
    };

    clickNextDay() {
        let newValue = moment(this.props.value).add(1, 'day');
        this.props.onChangeDate(this.props.value, newValue);
    };

    render() {
        return (
            <React.Fragment>
                <button className="datepicker__btn button_type_circle" onClick={this.clickPreviousDay}>
                    <svg className="icon icon-arrow-left">
                        <use href="img/icons_sprite.svg#arrow-left"></use>
                    </svg>
                </button>
                <div className="datepicker__text font_medium" onClick={this.props.toggleSelector}>
                    { moment(this.props.value).format('D MMM') }
                </div>
                <button className="datepicker__btn button_type_circle"  onClick={this.clickNextDay}>
                    <svg className="icon icon-arrow-right">
                        <use href="img/icons_sprite.svg#arrow-right"></use>
                    </svg>
                </button>
            </React.Fragment>
        );
    }
}

class DatePicker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: this.props.value,
            isSelectorActive: false
        };
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeShowSelector = this.onChangeShowSelector.bind(this);
        this.toggleSelector = this.toggleSelector.bind(this);
        this.showSelector = this.showSelector.bind(this);
        this.hideSelector = this.hideSelector.bind(this);
    }


    onChangeDate(oldDate, newDate){
        this.setState({
            value: newDate
        });
        this.props.onDateChange(newDate);
    };

    onChangeShowSelector(value){
        this.setState({
            isSelectorActive: value
        });
    };

    toggleSelector(){
        this.onChangeShowSelector(!this.state.isSelectorActive);
    };

    showSelector(){
        this.onChangeShowSelector(true);
    };

    hideSelector(){
        this.onChangeShowSelector(false);
    };


    render() {
        return (
            <div className="datepicker">
                <DatePickerLabel value={this.state.value}
                                 isSelectorActive = {this.state.isSelectorActive}
                                 onChangeDate={this.onChangeDate}
                                 showSelector={this.showSelector}
                                 hideSelector={this.hideSelector}
                                 toggleSelector={this.toggleSelector}/>

                <DatePickerSelector  value={this.state.value}
                                     isSelectorActive = {this.state.isSelectorActive}
                                     onChangeDate={this.onChangeDate}
                                     showSelector={this.showSelector}
                                     hideSelector={this.hideSelector}
                                     toggleSelector={this.toggleSelector} />
            </div>
        );
    }
}

export default DatePicker;