import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectApi, fetchPostsIfNeeded, invalidateApi } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import Chart from 'chart.js'

class App extends Component {
  static propTypes = {
    selectedApi: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, selectedApi } = this.props
    dispatch(fetchPostsIfNeeded(selectedApi))
    //testfn(this.props.posts)
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedApi !== this.props.selectedApi) {
      const { dispatch, selectedApi } = nextProps
      dispatch(fetchPostsIfNeeded(selectedApi))
    }
    //this.testfn(this.props.posts)
  }

  handleChange = nextApi => {
    this.props.dispatch(selectApi(nextApi))
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { dispatch, selectedApi } = this.props
    dispatch(invalidateApi(selectedApi))
    dispatch(fetchPostsIfNeeded(selectedApi))
  }

  render() {
    const { selectedApi, posts, isFetching, lastUpdated } = this.props
    var timeseries = posts.slice(1,20);
    var labels = timeseries.map((post, i) => post[0]);
    var dataClose = timeseries.map((post, i) => post[5]);
    var dataOpen = timeseries.map((post, i) => post[1]);
    var ctx = document.getElementById("chart1").getContext("2d");
		ctx.canvas.width = 1000;
		ctx.canvas.height = 300;
    var color = Chart.helpers.color;
    var red = 'rgb(255, 99, 132)';
    var blue = 'rgb(54, 162, 235)';
		var cfg = {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
        {
					label: "Closing price",
					data: dataClose,
					type: 'bar',
					pointRadius: 0,
					fill: false,
					lineTension: 0,
          backgroundColor: color(red).alpha(0.5).rgbString(),
          borderColor: red,
          borderWidth: 2
				},
        {
          label: "Opening price",
          data: dataOpen,
          type: 'bar',
          pointRadius: 0,
          fill: false,
          lineTension: 0,
          backgroundColor: color(blue).alpha(0.5).rgbString(),
          borderColor: blue,
          borderWidth: 2
        }
      ]
			}
		};
		var chart = new Chart(ctx, cfg);
    const isEmpty = posts.length === 0
    return (
      <div style={{margin: "20px 20px 20px 20px"}}>
        <Picker value={selectedApi}
                onChange={this.handleChange}
                options={[ 'BSLGOLDETF', 'BSLNIFTY' ]} />
        <br />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button className="btn" onClick={this.handleRefreshClick}>
              Refresh
            </button>
          }
        </p>
        <br />
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={posts} />
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedApi, postsByApi } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByApi[selectedApi] || {
    isFetching: true,
    items: []
  }

  return {
    selectedApi,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
