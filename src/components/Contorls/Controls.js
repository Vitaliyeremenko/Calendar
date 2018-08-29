import React from 'react';

const Controls = ({prevMonth,currentMonth,nextMonth,chooseToday}) => (
      <div className="controls row flex-middle">
        <div className="icon controls-prev button" onClick={prevMonth}>chevron_left</div>
        <span className="controls-current">{currentMonth}</span>
        <div className="icon controls-next button" onClick={nextMonth}>chevron_right</div>
        <button className="controls-today button" onClick={chooseToday}>Сегодня</button>
      </div>
  );


export default Controls;
