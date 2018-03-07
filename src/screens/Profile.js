import React from 'react'
import { Profile } from '../components/Profile'
import { PageComposer } from '../containers/Page'

const UserProfile = ({ navigationKey, ...rest }) => (
  <Profile userId={navigationKey} {...rest} />
)

export const ProfileScreen = PageComposer(UserProfile)
