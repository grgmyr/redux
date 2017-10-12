import { combineReducers } from 'redux'
import {
  SELECT_API, INVALIDATE_API,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

const selectedApi = (state = 'BSLGOLDETF', action) => {
  switch (action.type) {
    case SELECT_API:
      return action.api
    default:
      return state
  }
}

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_API:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const postsByApi = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_API:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.api]: posts(state[action.api], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsByApi,
  selectedApi
})

export default rootReducer
