import React from 'react';
import * as dateFns from "date-fns";
import ru from "date-fns/locale/ru";

const Search = ({changed,list,value,choosed}) => {

  const formattedList = Object.entries(list).map((item, index) => {
    return (
      <li key={index} onClick={() => {choosed(item[0])}}>
        <p>{item[1].title}</p>
        <p>{dateFns.format(item[0], "MMMM D",{ locale: ru })}</p>
      </li>
    )
  });



  return (
    <div className="search">
      <div className="icon search__icon">search</div>
      <input type="text" onChange={changed} value={value}/>
      {formattedList.length > 0 ? <div className="search__list__pointer"> </div> : null}
      {formattedList.length > 0 ? <div className="search__list__overflow"> </div> : null}
      {formattedList.length > 0 ? <ul className="search__list">
        {formattedList}
        </ul> : null}
    </div>
  );
};

export default Search;
