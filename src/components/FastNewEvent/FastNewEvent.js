import React from 'react';
import Button from '../UI/Button/Button'
const FastNewEvent = ({toggle,show,send}) => {

  let info = '';
  function prepareToSend() {
    send(info.value);
  }

  return (
    <div className="fastNewEvent">

      <button onClick={toggle} className="fastNewEvent__addButton">Добавить</button>
      {show ?  <div className="fastNewEvent__modal">
        <span className="close" onClick={toggle}> </span>
        <input type="text" ref={(input)=>{info = input}} placeholder="14.04.18, описание, заголовок"/>
        <Button clicked={prepareToSend}>Create</Button>
      </div>: null}
    </div>
  );
};

export default FastNewEvent;
