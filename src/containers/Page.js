import React from 'react'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'

export const PageComposer = Page =>
  @inject('userStore')
  @observer
  class Enhanced extends React.Component {
    @computed
    get navigationKey() {
      const { match, navigation } = this.props
      return match ? match.params.id : navigation.state.params
    }

    back = () => {
      const { history, navigation } = this.props
      return history ? history.push('/') : navigation.dispatch
    }

    render() {
      return (
        <Page
          {...this.props}
          back={this.back}
          navigationKey={this.navigationKey}
          style={{
            width: 40
          }}
        />
      )
    }
  }
