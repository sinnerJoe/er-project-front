import React, {useState} from 'react';
import logo from './logo.svg';
import { 
  BrowserRouter as Router, 
  Switch, 
  Route, 
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';

import routes from 'routes';

import 'antd/dist/antd.css';
import './App.scss';
import Header from 'components/header/Header';
import UniversalRoute from 'components/secure-route/UniversalRoute';
import paths from 'paths';
import ModalManager from 'app/modal-manager/ModalManager';


function createRoutes() {
  return routes.map(({path, secure, component}) => ( 
    <UniversalRoute secure={secure} path={path} component={component} /> 
  ));
}

function App() {
  return (
    <div className="no-scroll window-height">
      <Router>
      <Header/>
      <ModalManager />
        <Switch>
          {createRoutes()}
          <Route render={() => <Redirect to={paths.NOT_FOUND} />} />
        </Switch>
      </Router>
    </div>
      
  );
}

export default App;
