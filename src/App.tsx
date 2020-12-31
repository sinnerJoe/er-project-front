import React, {useState} from 'react';
import { 
  Router, 
  Switch, 
  Route, 
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';

import routes from 'routes';

import 'antd/dist/antd.css';
import './App.scss';
import EmptyPage from 'pages/empty-page/EmptyPage';
import Header from 'components/header/Header';
import UniversalRoute from 'components/secure-route/UniversalRoute';
import paths from 'paths';
import ModalManager from 'app/modal-manager/ModalManager';
import withRequestedUser from 'utils/withRequestedUser';
import RouteNotifier from 'components/header/RouteNotifier';
import browserHistory from 'shared/history';


function createRoutes() {
  return routes.map(({path, secure = true, component}, index) => {
    let Component = component;
    if(secure) {
      Component = withRequestedUser(EmptyPage, component);
    }

    return (
      <Route path={path}>
        <RouteNotifier routeIndex={index} />
        <Component />
      </Route>
    )
  })
    // <UniversalRoute secure={secure} path={path} component={component} /> 
}

function App() {
  return (
    <div className="no-scroll window-height">
      <Router history={browserHistory}>
      <Header/>
      <ModalManager />
        <Switch>
          {createRoutes()}
          <Route path="/" exact={true} >
            <EmptyPage />
          </Route>
          <Route render={() => <Redirect to={paths.NOT_FOUND} />} />
        </Switch>
      </Router>
    </div>
      
  );
}

export default App;
