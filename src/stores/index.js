import PodcastStore from './podcastStore'
import PlayerStore from './playerStore'
import CurrentStore from './currentStore'
import UserStore from './userStore'

export default {
  podcastStore: new PodcastStore(),
  playerStore: new PlayerStore(),
  currentStore: new CurrentStore(),
  userStore: new UserStore()
}
