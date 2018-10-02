import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import './index.css';
import App from './App';
import setAuthToken from './utilities/setAuthToken';
import jwt_decode from 'jwt-decode';
import { setAuth, logoutUser } from '../src/actions/auth';
import registerServiceWorker from './registerServiceWorker';

const token = localStorage.getItem('jwtToken');
if (token) {
    setAuthToken(token);
    let decoded = jwt_decode(token);
    store.dispatch(setAuth(decoded));

    //check if token is expired
    const currentTime = (Date.now() / 1000);  
    if (decoded.exp < currentTime) {   
    store.dispatch(logoutUser());
    window.location.href = '/login';
}
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
