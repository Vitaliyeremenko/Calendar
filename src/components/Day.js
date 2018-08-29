import React from 'react';
import dateFns from 'date-fns';

const Day = (props) => {
  return (
    <div
      className={`col cell ${
        !dateFns.isSameMonth(props.day, props.monthStart)
          ? "disabled"
          : dateFns.isSameDay(props.day, props.today) ? "today" :
            dateFns.isSameDay(props.day, props.selectedDay) ? "selected" :
              props.event.title ? "withEvent" : ''
        }`}
      onClick={props.clicked}
    >
      <span className="number">{props.formattedDate }</span>
      <p className="day-title">{props.event.title}</p>
      <p className="day-participants">{props.event.participants}</p>
    </div>
  );
};

export default Day;
