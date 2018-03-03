import React from 'react'
import { Profile } from '../components/Profile'
import { PageComposer } from '../containers/Page'

const UserProfile = props => <Profile userId={props.navigationKey} />

export const ProfileScreen = PageComposer(UserProfile)
