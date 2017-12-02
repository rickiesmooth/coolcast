import { action, extendObservable, observable } from 'mobx'
import client from '../../apollo'

const queryToObservable = (query, { onError, onFetch }) => {
  const observableQuery = observable(query.currentResult())
  console.log('✨query', query)
  observableQuery.ref = query

  query.subscribe({
    next: action(value => {
      const keys = Object.keys(value.data)
      const data = keys.length === 1 ? value.data[keys[0]] : value.data

      observableQuery.loading = value.loading
      observableQuery.data = data

      if (onFetch) onFetch(data)
    }),
    error: action(error => {
      observableQuery.loading = false
      observableQuery.error = error

      if (onError) onError(error)
    })
  })

  return observableQuery
}

export const query = (obj, prop, descriptor) => {
  const { onError, onFetch, ...options } = descriptor.initializer
    ? descriptor.initializer()
    : descriptor

  return extendObservable(obj, {
    [prop]: queryToObservable(client.watchQuery(options), {
      onError,
      onFetch
    })
  })
}
