import React from 'react'
import {
  Platform,
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  NavigationActions
} from 'react-navigation'

import Profile from '../screens/Profile'
import History from '../screens/History'
import Playlists from '../screens/Playlists'
import Podcast from '../screens/Podcast'
import Search from '../screens/Search'
import MiniRemote from '../components/MiniRemote'
import {
  CreatePlaylistContent,
  AddToPlaylistContent
} from '../screens/Modals/Playlists'
import ExpandedMiniRemote from '../screens/Modals/ExpandedMiniRemote'

const Colors = {
  tintColor: '#2f95dc',
  tabIconDefault: '#ccc',
  tabIconSelected: '#2f95dc'
}

class TabBarWithMiniRemote extends React.Component {
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
    Home: { screen: History },
    podcast: { screen: Podcast }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

const PlaylistNavigator = StackNavigator(
  {
    Playlists: { screen: Playlists },
    podcast: { screen: Podcast }
  },
  {
    initialRouteName: 'Playlists',
    headerMode: 'none'
  }
)

const SearchNavigator = StackNavigator(
  {
    Index: { screen: Search },
    podcast: { screen: Podcast }
  },
  {
    initialRouteName: 'Index',
    headerMode: 'none'
  }
)

const RootNavigation = TabNavigator(
  {
    App: { screen: AppNavigator },
    Playlists: { screen: PlaylistNavigator },
    Search: { screen: SearchNavigator },
    Profile: { screen: Profile }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        let iconName
        switch (routeName) {
          case 'App':
            iconName = 'history'
            break
          case 'Playlists':
            iconName = 'list'
            break
          case 'Search':
            iconName = 'search'
            break
          case 'Profile':
            iconName = 'person'
            break
        }
        console.log('✨iconName', iconName)
        return (
          <MaterialIcons
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

export default StackNavigator(
  {
    MainCardNavigator: { screen: RootNavigation },
    ExpandedMiniRemote: { screen: ExpandedMiniRemote },
    CreatePlaylist: { screen: CreatePlaylistContent },
    AddToPlaylist: { screen: AddToPlaylistContent }
  },
  {
    screenBackgroundColor: 'transparent',
    modalPresentationStyle: 'overFullScreen',
    cardStyle: {
      opacity: 1
    },
    navigationOptions: {
      header: null
    },
    mode: 'modal'
  }
)

var styles = StyleSheet.create({
  tabBar: {
    marginBottom: 0
  }
})
