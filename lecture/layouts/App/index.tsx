import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import loadable from '@loadable/component';
// code-splitting
const SignIn = loadable(() => import('@pages/SignIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path='/' to='/signin' />
      <Route path='/signin' component={SignIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/workspace' component={Workspace} />
    </Switch>
  );
};

export default App;
