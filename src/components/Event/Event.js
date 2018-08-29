import React from 'react';
import Button from '../UI/Button/Button';

const Event = (props) => {
  const {title, participants , description} = props.event;
  const { date, changeMode, clicked, changed, deleted} = props;
  let refCollection = {
    title: null,
    participants: null,
    description: null,
    date: null
  };
  function changedProps() {
    if(!changeMode){
      changed(false);
      return;
    }
    const pattern = /\d{2},\d{2},\d{4}/;
    let date = refCollection.date.value;
    if(!pattern.test(refCollection.date.value.replace(/\s/g, ''))){
      date = false
    }

   changed( {
     title: refCollection.title.value,
     participants: refCollection.participants.value,
     description: refCollection.description.value,
     date: date
   });
  }
  return (
    <div>
      <div className="dayModal-header flex">
        <div className="dayModal-header-title">
          { !changeMode ? <p onClick={clicked}>{title}</p> :
          <input type="text" placeholder="Событие" ref={(input) => {refCollection.title = input}} defaultValue={title}/>}
        </div>
        <div className="dayModal-header-date">
          { !changeMode ? <p onClick={clicked}>{date}</p> :
          <input type="text" placeholder="День, месяц, год" ref={(input) => {refCollection.date = input}}/>}
        </div>
        <div className="dayModal-header-participants">
          {participants ? <span onClick={clicked}>Участники: </span> : null}
          { !changeMode ? <p onClick={clicked}>{participants}</p> :
          <input type="text" placeholder="Имя участников" ref={(input) => {refCollection.participants = input}} defaultValue={participants}/>}
        </div>
      </div>
      <div className="dayModal-description">
        {!changeMode ? <p onClick={clicked}>{description}</p> :
          <textarea className="dayModal-textarea" defaultValue={description} ref={(input) => {refCollection.description = input}}></textarea>
        }
      </div>

      <div className="dayModal-buttons">
        <Button clicked={changedProps}>Готово</Button>
        <Button clicked={() => deleted()}>Удалить</Button>
      </div>
    </div>
  );
};

export default Event;
