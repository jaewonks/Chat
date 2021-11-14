import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';

const App = () => {
  return (
    <Switch>
      <Redirect exact path='/' to='/signin' />
      <Route path='/signin' component={SignIn} />
      <Route path='/signup' component={SignUp} />
    </Switch>
  );
};

export default App;
