import React from 'react'
import {
  Platform,
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity
} from 'react-native'
import { observer, inject } from 'mobx-react'
import { MaterialIcons } from '@expo/vector-icons'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  NavigationActions
} from 'react-navigation'

import { ProfileScreen } from '../screens/Profile'
import History from '../screens/History'
import Playlists from '../screens/Playlists'
import { Podcast } from '../screens/Podcast'
import Playlist from '../screens/Playlist'
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

const ScreenComposer = Screen => {
  return class EnhancedEpisode extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        const { route, focused, index } = scene
        if (focused) {
          if (route.index !== 0) {
            navigation.dispatch(NavigationActions.back())
          }
        } else {
          jumpToIndex(index)
        }
      }
    })
    render() {
      console.log('✨this.props', this.props)
      return <Screen {...this.props} />
    }
  }
}

const ComposedPodcastScreen = ScreenComposer(Podcast)
const ComposedPlaylistScreen = ScreenComposer(Playlist)

const AppNavigator = StackNavigator(
  {
    Home: { screen: History },
    podcast: { screen: ComposedPodcastScreen }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

const PlaylistNavigator = StackNavigator(
  {
    Playlists: { screen: Playlists },
    podcast: { screen: ComposedPodcastScreen },
    playlist: { screen: ComposedPlaylistScreen }
  },
  {
    initialRouteName: 'Playlists',
    headerMode: 'none'
  }
)

const SearchNavigator = StackNavigator(
  {
    Index: { screen: Search },
    podcast: { screen: ComposedPodcastScreen }
  },
  {
    initialRouteName: 'Index',
    headerMode: 'none'
  }
)

const RootNavOptions = {
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
      return (
        <MaterialIcons
          name={iconName}
          size={28}
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

export const RootNavigationScreens = TabNavigator(
  {
    App: { screen: AppNavigator },
    Playlists: { screen: PlaylistNavigator },
    Search: { screen: SearchNavigator },
    Profile: { screen: ProfileScreen }
  },
  {
    ...RootNavOptions
  }
)

export const MainTabNavigator = StackNavigator(
  {
    MainCardNavigator: { screen: RootNavigationScreens },
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
