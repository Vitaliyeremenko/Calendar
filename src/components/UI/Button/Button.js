import React from 'react';

const Button = ({clicked, children}) => (<button className="button" onClick={clicked}>{children}</button>);

export default Button;
