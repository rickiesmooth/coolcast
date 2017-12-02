import React from 'react'
import {
  Platform,
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { observer } from 'mobx-react'

import Profile from '../screens/Profile'
import Home from '../screens/Home'
import Podcast from '../screens/Podcast'

import MiniRemote from '../components/MiniRemote'
import Header from '../components/Header'

class App extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <Header />
        {this.props.children}
        <MiniRemote />
      </View>
    )
  }
}

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/profile" component={Profile} />
    <Route path="/podcast/:id" component={Podcast} />
  </Switch>
)

@observer
export class RootNavigation extends React.Component {
  render() {
    return (
      <Router>
        <App>
          <Main />
        </App>
      </Router>
    )
  }
}

export { Link } from 'react-router-dom'
