import PodcastStore from './podcastStore'
import PlayerStore from './playerStore'
import CurrentStore from './currentStore'

export default {
  podcastStore: new PodcastStore(),
  playerStore: new PlayerStore(),
  currentStore: new CurrentStore()
}
