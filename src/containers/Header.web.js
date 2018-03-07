import React from 'react'
import { observer, inject } from 'mobx-react'
import { pure, compose, withHandlers, mapProps } from 'recompose'

export default Header =>
  compose(
    inject('userStore'),
    observer,
    mapProps(({ userStore: { currentUser } }) => ({ currentUser })),
    pure
  )(Header)
