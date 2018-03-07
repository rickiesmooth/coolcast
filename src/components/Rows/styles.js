import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    width: '100%'
  },
  horizontal: {
    height: 250,
    flexDirection: 'column'
  },
  horizontalItem: {
    width: 250,
    marginRight: 20
  },
  verticalItem: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 20,
    marginHorizontal: 20
  },
  firstRowItem: {
    marginLeft: 20
  },
  vertical: {
    flexDirection: 'row'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listView: {
    backgroundColor: '#f9f9f9'
  }
})
