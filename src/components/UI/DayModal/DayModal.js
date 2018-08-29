import React from 'react';

const DayModal = (props) =>  (
    <div className={"dayModal " + props.classes } style={props.position}>
      <span className="close" onClick={props.close}> </span>
      {props.children}
    </div>
  );


export default DayModal;
