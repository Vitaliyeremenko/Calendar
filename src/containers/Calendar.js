import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dateFns from "date-fns";
import ru from 'date-fns/locale/ru';

import axios from '../axios-insance';
import Day from '../components/Day';
import DayModal from '../components/UI/DayModal/DayModal';
import NewEventForm from '../components/Forms/NewEventForm';
import Event from '../components/Event/Event';
import Controls from "../components/Contorls/Controls";
import Search from "../components/Search/Search";
import FastNewEvent from "../components/FastNewEvent/FastNewEvent";


class Calendar extends Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    today: new Date(),
    events: {},
    showModal:  false,
    modalPosition: {},
    modalClasses: "",
    searchString: '',
    searchList: {},
    showFastNewEventInput: false,
    changeMode: false,

  };


  componentDidMount() {
    axios.get('/events.json')
      .then(res => {
        let stateEvents = {};
        let events = Object.entries(res.data);
        events.forEach((item) => {
          stateEvents[item[1].date] = {...item[1], key: item[0]};
        });
        console.log(stateEvents);
        this.setState({events : stateEvents});
      }).catch(err => console.log(err));
  }


  renderCells() {
    const { currentMonth, selectedDate, today,events } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    let needDaysNames = true;
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = needDaysNames ? dateFns.format(day, "dddd, D",{ locale: ru }) : dateFns.format(day, "D",{ locale: ru });
        const cloneDay = day;
        days.push(
          <Day
            monthStart={monthStart}
            day={day}
            today={today}
            formattedDate={formattedDate}
            event={events[dateFns.format(day, "YYYY-MM-DD")] ? events[dateFns.format(day, "YYYY-MM-DD")]: ''}
            clicked={(e) => this.onDateClick(dateFns.parse(cloneDay),e)}
            key={day}
            selectedDay={selectedDate}
          />
        );
        day = dateFns.addDays(day, 1);
      }
      needDaysNames = false;
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  }

  onDateClick = (day,event) => {

    const target = event.currentTarget;
    let classes = "";
    let modalPosition = {
      top: target.offsetTop - 25 + "px"
    };
    const calendarBody = document.querySelector('.calendar .body');
    let calendarBodyBot = calendarBody.offsetTop + calendarBody.offsetHeight;
    if((document.body.clientWidth - target.offsetLeft - target.offsetWidth) < 450){
      modalPosition.left = target.offsetLeft - 420 + "px";
      classes = "right";
    }else{
      modalPosition.left = target.offsetLeft + target.offsetWidth + 20 + "px";
      classes = "left";
    }

    if(calendarBodyBot - 500 - target.offsetTop <= 0){
      modalPosition.top = target.offsetTop - 300 + "px";
      classes = classes + " bot";
    }
    this.setState({
      selectedDate: day,
      showModal: true,
      modalPosition: modalPosition,
      modalClasses : classes
    });
  };
  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1),
      showModal: false,
    });
  };
  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1),
      showModal: false,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      modalPosition: {},
      changeMode: false
    });
  };

  onSaveEventHandler = (data, remove = null) => {
    const events = {...this.state.events};

    let formattedDate = dateFns.format(this.state.selectedDate, "YYYY-MM-DD");
    if(data.date){
      formattedDate = data.date.split(',').reverse().join('-');
    }
    events[formattedDate] = {
      title: data.title,
      participants: data.participants,
      description: data.description
    };
    axios.post('/events.json', {date : formattedDate, ...events[formattedDate]} )
      .then((res) => {
        console.log(res);
        events[formattedDate].key = res.data.name;
        this.setState({
          events: events,
          showModal: false,
          modalPosition: {},
          changeMode: false
        });
        if(remove) this.onDeleteEventHandler(remove);

      }).catch(err => {
        console.log(err);
    });

  };

  onDeleteEventHandler = (removeDate = false) => {
    let events = {...this.state.events};
    const event = events[removeDate ? removeDate : dateFns.format(this.state.selectedDate, "YYYY-MM-DD")];
    console.log(event,removeDate);
    axios.delete('/events/' + event.key + '.json')
      .then(res => {
        delete events[removeDate ? removeDate : dateFns.format(this.state.selectedDate, "YYYY-MM-DD")];

        this.setState({
          events: events,
          showModal: false,
          modalPosition: {},
          changeMode: false
        });

      })
      .catch(err  => {
        console.log(err);
      })
  };

  onChangeEventHandler = (newDesc) => {
    if(!newDesc){
      this.setState({showModal: false});
      return;
    }
    let events = {...this.state.events};
    if(!newDesc.date){
      let date = dateFns.format(this.state.selectedDate, "YYYY-MM-DD");
      let dataToUpdate = {title: newDesc.title,participants: newDesc.participants,description: newDesc.description}
      axios.patch('/events/' + events[date].key + '.json',dataToUpdate)
        .then(res => {
          events[date] = dataToUpdate;
          this.setState({
            events: events,
            showModal: false,
            modalPosition: {},
            changeMode: false
          });
        })

    }else{
      this.onSaveEventHandler(newDesc, dateFns.format(this.state.selectedDate, "YYYY-MM-DD"));
    }

  };

  chooseToday = () =>{
    this.setState({
      currentMonth: this.state.today
    })
  };

  onChooseAfterSearch = (date) => {
   this.setState({currentMonth: new Date(date), searchList: {}, searchString: ""})
  };

  onSearch = (event) => {
    const value = event.target.value;
    const {events} = this.state;
    let searchList = {};
    if(value){
      for(let item in events){
        if(events[item].title.toLowerCase().includes(value.toLowerCase())){
          searchList[item] = {...events[item]}
        }
      }
    }


    this.setState({
      searchList: searchList,
      searchString: value
    })
  };

  toggleFastNewEvent = () => {
    this.setState({showFastNewEventInput: !this.state.showFastNewEventInput});
  };

  createFastEvent = (data) => {
    const parsedData = data.split(',');
    const events = {...this.state.events};
    const eventDate = parsedData[0].split('.').reverse().join('-');
    if(!events[eventDate]){
      events[eventDate] = {
        title: parsedData[2],
        participants: '',
        description: parsedData[1]
      }
    }
    this.setState({
      events: events,
      showFastNewEventInput: false
    })
  };

  startChange = () => {this.setState({changeMode: true})};

  render() {
    const {showModal, modalPosition, events,selectedDate,showFastNewEventInput} = this.state;

    let modalInner = <NewEventForm saved={this.onSaveEventHandler} deleted={this.onDeleteEventHandler}/>;

    if(events[dateFns.format(selectedDate, "YYYY-MM-DD")]){
      modalInner = <Event
        event={events[dateFns.format(selectedDate, "YYYY-MM-DD")]}
        date={dateFns.format(selectedDate, "MMMM D",{ locale: ru })}
        deleted={this.onDeleteEventHandler}
        changed={this.onChangeEventHandler}
        changeMode={this.state.changeMode}
        clicked={this.startChange}
      />;
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <div className="wrapper">
            <FastNewEvent
              show={showFastNewEventInput}
              toggle={this.toggleFastNewEvent}
              send={this.createFastEvent}
            />
            <Search
              value={this.state.searchString}
              changed={this.onSearch}
              list={this.state.searchList}
              choosed={this.onChooseAfterSearch}
            />
          </div>
        </div>
        <Controls
          prevMonth ={this.prevMonth}
          nextMonth={this.nextMonth}
          currentMonth={dateFns.format(this.state.currentMonth, "MMMM YYYY")}
          chooseToday={this.chooseToday}
        />
        {this.renderCells()}
        {showModal ? <DayModal position={modalPosition} close={this.closeModal} classes={this.state.modalClasses}>{modalInner}</ DayModal > : null}
      </div>
    );
  }
}

Calendar.propTypes = {};

export default Calendar;
