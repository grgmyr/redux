import React from 'react'
import PropTypes from 'prop-types'

const Posts = ({posts}) => (
  <table className="table">
    <thead>
    <tr>
      {posts[0].map((post, i) =>
        <th key={i}>{post}</th>
      )}
    </tr>
    </thead>
    <tbody>
    {posts.map((post, i) =>
      (i > 0) ? (
        <tr key={i}>
          {post.map((val, j) =>
            <td key={j}>{val}</td>
          )}
        </tr>
      ) : null
    )}
    </tbody>
  </table>
)

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}

export default Posts
