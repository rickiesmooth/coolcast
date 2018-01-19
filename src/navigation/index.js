import React from 'react'
import { Platform, View, TouchableOpacity } from 'react-native'

import {
  addNavigationHelpers,
  TabNavigator,
  TabBarBottom,
  NavigationActions
} from 'react-navigation'

import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Ionicons } from '@expo/vector-icons'
import MainTabNavigator from './tabs'

class NavigationStore {
  @observable.ref
  navigationState = MainTabNavigator.router.getStateForAction(
    NavigationActions.init()
  )

  @action
  dispatch = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null
    return (this.navigationState = MainTabNavigator.router.getStateForAction(
      action,
      previousNavState
    ))
  }
}

const navigationStore = new NavigationStore()

@inject(stores => ({ navigationStore }))
@observer
export class RootNavigation extends React.Component {
  render() {
    return (
      <MainTabNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.navigationStore.dispatch,
          state: this.props.navigationStore.navigationState
        })}
      />
    )
  }
}

export class Link extends React.Component {
  constructor() {
    super()
    this.press = this.press.bind(this)
  }

  onNavigate() {
    const route = this.props.to.split('/')
    navigationStore.dispatch(
      NavigationActions.navigate({ routeName: route[1], params: route[2] })
    )
  }

  press() {
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
