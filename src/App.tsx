import React, {useState} from 'react';
import logo from './logo.svg';
import { 
  BrowserRouter as Router, 
  Switch, 
  Route, 
  Link,
  withRouter
} from 'react-router-dom';

import routes from 'routes';

import 'antd/dist/antd.css';
import './App.scss';
import Header from 'components/header/Header';

function createRoutes() {
  return routes.map(({path, disableHeader, component: Component}) => ( 
    <Route path={path}>
      {!disableHeader && <Header/>}
      <Component/>
    </Route>
  ))
}

function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Router>
        <Switch>
          {createRoutes()}
        </Switch>
      </Router>
    </div>
      
  );
}

export default App;
