import React from 'react'
import { Platform, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  NavigationActions
} from 'react-navigation'

import AudioPlayer from '../components/AudioPlayer'
import HomeScreen from '../containers/Home'
import ProfileScreen from '../containers/Profile'
import PodcastScreen from '../containers/Podcast'
import ExpandedMiniRemote from '../containers/ExpandedMiniRemote'

const Colors = {
  tintColor: '#2f95dc',
  tabIconDefault: '#ccc',
  tabIconSelected: '#2f95dc'
}

class TabBarWithMiniRemote extends React.Component {
  render() {
    return (
      <View>
        <AudioPlayer navigation={this.props.navigation} />
        <TabBarBottom {...this.props} />
      </View>
    )
  }
}

const AppNavigator = StackNavigator(
  {
    Index: {
      screen: HomeScreen,
      tabBarLabel: 'Search'
    },
    Podcast: { screen: PodcastScreen }
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
    Profile: { screen: ProfileScreen }
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
    swipeEnabled: false
  }
)

const ModalStack = StackNavigator(
  {
    Index: {
      screen: ExpandedMiniRemote
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      width: '80%',
      height: '80%',
      backgroundColor: 'blue'
    }
  }
)

export default StackNavigator(
  {
    MainCardNavigator: { screen: RootNavigation },
    ExpandedMiniRemote: { screen: ModalStack }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)
