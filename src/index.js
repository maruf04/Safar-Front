import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Global styles to ensure full viewport coverage

document.body.style.margin = '0';
document.body.style.padding = '0';

ReactDOM.render(<App />, document.getElementById("root"));