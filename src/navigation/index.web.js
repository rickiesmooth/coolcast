import React from 'react'
import { View } from 'react-native'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { observer } from 'mobx-react'

import Profile from '../screens/Profile'
import Home from '../screens/Home'
import Podcast from '../screens/Podcast'

import MiniRemote from '../components/MiniRemote'
import Header from '../components/Header'

@observer
export class RootNavigation extends React.Component {
  render() {
    return (
      <Router>
        <View style={{ flex: 1 }}>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/podcast/:id" component={Podcast} />
          </Switch>
          <MiniRemote />
        </View>
      </Router>
    )
  }
}

export { Link } from 'react-router-dom'
