import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Home } from './views/home/Home';
import { AddBoard } from './views/create-board/AddBoard';
import { Header } from './components/header/Header';
import { Board } from './views/board/Board';
import SignUp from './views/signUp/SignUp';
import Login from './views/login/Login';
import { AuthProvider } from './context/Auth';
import PrivateRoute from './common/guards/PrivateRoute';
import Main from './views/main/Main';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Main} />
          <PrivateRoute exact path="/app" component={Home} />
          <PrivateRoute path="/createboard" component={AddBoard} />
          <PrivateRoute path="/board/:name" component={Board} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="*" render={() => <Redirect to='/app' />} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
