import React from 'react';
import Button from '../UI/Button/Button'

const NewEventForm = (props) => {

  let refCollection = {
    title: null,
    participants: null,
    description: null,
    date: null
  };

  function collectData() {

    const pattern = /\d{2},\d{2},\d{4}/;
    props.saved({
      title: refCollection.title.value,
      participants: refCollection.participants.value,
      description: refCollection.description.value,
      date: pattern.test(refCollection.date.value.replace(/\s/g, '')) ? refCollection.date.value : false
    });

  }


  return (
    <div>
      <div className="dayModal-header">
        <input type="text" placeholder="Событие" ref={(input) => {refCollection.title = input}}/>
        <input type="text" placeholder="День, месяц, год" ref={(input) => {refCollection.date = input}} />
        <input type="text" placeholder="Имя участников" ref={(input) => {refCollection.participants = input}}/>
      </div>
      <textarea className="dayModal-textarea" ref={(input) => {refCollection.description = input}}></textarea>
      <div className="dayModal-buttons">
        <Button clicked={collectData}>Готово</Button>
        <Button clicked={props.deleted}>Удалить</Button>
      </div>
    </div>
  );

};

export default NewEventForm;
