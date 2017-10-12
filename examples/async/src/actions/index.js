export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_API = 'SELECT_API'
export const INVALIDATE_API = 'INVALIDATE_API'

export const selectApi = api => ({
  type: SELECT_API,
  api
})

export const invalidateApi = api => ({
  type: INVALIDATE_API,
  api
})

export const requestPosts = api => ({
  type: REQUEST_POSTS,
  api
})

export const receivePosts = (api, json) => ({
  type: RECEIVE_POSTS,
  api,
  posts: json,
  receivedAt: Date.now()
})

const processCSV = allText => {
    var allTextLines = allText.split(/\r\n|\n/)
    var lines = []

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',')
        lines.push(data)
    }
    return lines
}

const fetchPosts = api => dispatch => {
  dispatch(requestPosts(api))
  return fetch(`https://www.quandl.com/api/v3/datasets/NSE/${api}/data.csv?api_key=jn6HeF8s_ZJgY3yUYE8j`)
    .then(response => response.blob())
    .then(blob => {
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        dispatch(receivePosts(api, processCSV(reader.result)))
      });
      reader.readAsText(blob);
      })
}

const shouldFetchPosts = (state, api) => {
  const posts = state.postsByApi[api]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = api => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), api)) {
    return dispatch(fetchPosts(api))
  }
}
