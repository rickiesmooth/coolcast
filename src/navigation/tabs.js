import React from 'react'
import {
  Platform,
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  NavigationActions
} from 'react-navigation'

import Profile from '../screens/Profile'
import Home from '../screens/Home'
import Podcast from '../screens/Podcast'
import Search from '../screens/Search'
import MiniRemote from '../components/MiniRemote'

import ExpandedMiniRemote from '../screens/Modals/ExpandedMiniRemote'

const Colors = {
  tintColor: '#2f95dc',
  tabIconDefault: '#ccc',
  tabIconSelected: '#2f95dc'
}

class TabBarWithMiniRemote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bounceValue: new Animated.Value(0)
    }
  }
  render() {
    return (
      <View>
        <MiniRemote navigation={this.props.navigation} />
        <TabBarBottom {...this.props} style={[styles.tabBar]} />
      </View>
    )
  }
}

const AppNavigator = StackNavigator(
  {
    Index: { screen: Home },
    podcast: { screen: Podcast }
  },
  {
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params && navigation.state.params.title,
      tabBarOnPress: (tab, jumpToIndex) => {
        if (tab.focused) {
          if (tab.route.index !== 0) {
            navigation.dispatch(
              NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: tab.route.routes[0].routeName
                  })
                ]
              })
            )
          }
        } else {
          jumpToIndex(tab.index)
        }
      }
    }),
    headerMode: 'none'
  }
)

const RootNavigation = TabNavigator(
  {
    App: { screen: AppNavigator },
    Search: { screen: Search },
    Profile: { screen: Profile }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        let iconName
        switch (routeName) {
          case 'App':
            iconName =
              Platform.OS === 'ios'
                ? `ios-home${focused ? '' : '-outline'}`
                : 'md-home'
            break
          case 'Search':
            iconName =
              Platform.OS === 'ios'
                ? `ios-search${focused ? '' : '-outline'}`
                : 'md-search'
            break
          case 'Profile':
            iconName =
              Platform.OS === 'ios'
                ? `ios-person${focused ? '' : '-outline'}`
                : 'md-person'
            break
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        )
      }
    }),
    tabBarComponent: TabBarWithMiniRemote,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    headerMode: 'none',
    swipeEnabled: false,
    tabBarOptions: {
      style: {
        opacity: 1,
        bottom: -50
      }
    }
  }
)

export default StackNavigator(
  {
    MainCardNavigator: { screen: RootNavigation },
    ExpandedMiniRemote: { screen: ExpandedMiniRemote }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

var styles = StyleSheet.create({
  tabBar: {
    marginBottom: 0
  }
})
