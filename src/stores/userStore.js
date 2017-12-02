import { observable, action, reaction, computed } from 'mobx'
import { AsyncStorage } from 'react-native'
import client from '../apollo'
import gql from 'graphql-tag'
export default class UserStore {
  constructor() {
    this.getFromToken()
  }
  @observable history = {}
  @observable
  currentUser = {
    id: null
  }

  async getFromToken(val) {
    const token = await AsyncStorage.getItem('graphcoolToken')
    if (token) {
      console.log('✨we>>')
      const graphcoolResponse = await client.query({
        query: LOGGED_IN_USER,
        fetchPolicy: 'network-only'
      })
      const user = graphcoolResponse.data.user
      this.setCurrentUser(user)
    }
  }

  async setCurrentUser(user) {
    if (user) {
      this.currentUser = {
        facebookUserId: user.facebookUserId,
        id: user.id,
        email: user.email,
        history: user.history
      }
    }
  }
  @computed
  get currentUserHistory() {
    if (this.currentUser.history) {
      return this.currentUser.history.reduce((r, a) => {
        const { id, title, src, show } = a.episode
        r[id] = {
          id,
          title,
          src,
          show: show[0],
          plays: {
            id: a.id,
            progress: a.progress
          }
        }
        return r
      }, {})
    }
  }
}

const LOGGED_IN_USER = gql`
  query {
    user {
      id
      email
      facebookUserId
      history {
        id
        progress
        episode {
          title
          id
          src
          show {
            id
            showId
          }
        }
      }
    }
  }
`
