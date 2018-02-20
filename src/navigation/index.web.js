import React from 'react'
import { View, Text, TextInput, Button, Animated } from 'react-native'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { observer } from 'mobx-react'

import Profile from '../screens/Profile'
import Home from '../screens/Home'
import { Podcast, PodcastHistory } from '../screens/Podcast'
import Playlist from '../screens/Playlist'

import MiniRemote from '../components/MiniRemote'
import Header from '../components/Header'

import { ModalRoute } from './modals'

export const RootNavigation = () => (
  <Router>
    <Route component={RootSwitch} />
  </Router>
)
export { Link } from 'react-router-dom'

class RootSwitch extends React.Component {
  previousLocation = this.props.location

  componentWillUpdate(nextProps) {
    const { location } = this.props
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location
    }
  }

  render() {
    const { location } = this.props
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ) // not initial render
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/podcast/:id" component={Podcast} />
          <Route path="/playlist/:id" component={Playlist} />
          <Route path="/history/:id" component={PodcastHistory} />
        </Switch>
        <ModalRoute isModal={isModal} path={`/modal/:id`} />
        <MiniRemote />
      </View>
    )
  }
}
