import React from 'react'
import { Platform, View, TouchableOpacity } from 'react-native'

import {
  addNavigationHelpers,
  TabNavigator,
  TabBarBottom,
  withNavigation,
  NavigationActions
} from 'react-navigation'

import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { MainTabNavigator } from './tabs'

export const RootNavigation = () => <MainTabNavigator />

class LinkComponent extends React.Component {
  onNavigate() {
    const { to, navigation } = this.props
    if (to.state && to.state.modal) {
      const { modal, ...rest } = to.state
      const route = to.pathname.split('/')
      navigation.navigate({ routeName: route[2], params: rest })
    } else {
      const route = to.split('/')
      navigation.navigate({ routeName: route[1], params: route[2] })
    }
  }

  press = () => {
    this.onNavigate()
    this.props.onClick && this.props.onClick()
    this.props.onMouseDown && this.props.onMouseDown()
  }

  render() {
    return (
      <TouchableOpacity onPress={this.press} style={this.props.style}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

export const Link = withNavigation(LinkComponent)
