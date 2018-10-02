import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './App.css';
import AddPost from './components/Explore/AddPost';
import EditPost from './components/Explore/EditPost';
import Explore from './components/Explore/Explore';
import Header from './components/Layout/Header';
import Join from './components/Auth/Join';
import Landing from './components/Landing';
import Login from './components/Auth/Login';
import NotFound from './components/NotFound';
import PostPage from './components/Post/PostPage';
import UserPage from './components/User/UserPage';
import Home from './components/User/Home';
import PrivateRoute from './components/Routes/PrivateRoute';
import PublicRoute from './components/Routes/PublicRoute';



class App extends Component {
  render() {
    return (
      <div className="App">
      <BrowserRouter>
      <div>
      <Header />
      <Switch>
      <Route path="/" component={Landing} exact />
      <Route path="/explore" component={Explore} />
      <Route path="/posts/:id" component={PostPage} />
      <PrivateRoute path="/post/add" component={AddPost} />
      <PrivateRoute path="/post/edit/:id" component={EditPost} />
      <PrivateRoute path="/home" component={Home} />
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/join" component={Join} />
      <Route path="/user/:id" component={UserPage} />
      <Route component={NotFound} />
      </Switch>
      </div>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
