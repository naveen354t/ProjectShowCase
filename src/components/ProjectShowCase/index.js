import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const websiteLogo =
  'https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  loading: 'LOADING',
}

class ProjectShowCase extends Component {
  state = {
    apiStatus: apiConstants.initial,
    data: [],
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getDataWithApiCall()
  }

  onChangeActiveCategory = event => {
    this.setState({category: event.target.value}, this.getDataWithApiCall)
  }

  onRetry = () => {
    this.getDataWithApiCall()
  }

  getDataWithApiCall = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {category} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`

    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      this.setState({data: updatedData, apiStatus: apiConstants.success})
    } else {
      console.log('Hii')
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <ul className="projects-list">
        {data.map(eachItem => (
          <li key={eachItem.id} className="project-items">
            <img
              src={eachItem.imageUrl}
              alt={eachItem.name}
              className="image"
            />
            <p className="name">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-info">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div testid="loader" className="loader">
      <Loader type="ThreeDots" />
    </div>
  )

  renderWithSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailure()
      case apiConstants.loading:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <nav className="header">
          <img src={websiteLogo} alt="website logo" className="website-logo" />
        </nav>

        <div className="display-container">
          <select
            onChange={this.onChangeActiveCategory}
            className="category-list"
          >
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderWithSwitch()}
      </div>
    )
  }
}

export default ProjectShowCase
