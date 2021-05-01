import React from "react"
import ReactDOM from 'react-dom';
import Checkout from './components/Checkout'
import Amplify from "aws-amplify";
import config from './config';

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "streamlabs",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

class App extends React.Component {
  constructor(props) {
    super(props)
    this.unlockHandler = this.unlockHandler.bind(this)
    this.checkout = this.checkout.bind(this)
    this.state = {
      locked: "pending" // there are 3 state: pending, locked and unlocked
    }
  }

  /**
   * When the component mounts, listen to events from unlockProtocol
   */
  componentDidMount() {
    window.addEventListener("unlockProtocol", this.unlockHandler)
  }

  /**
   * Make sure we clean things up before unmounting
   */
  componentWillUnmount() {
    window.removeEventListener("unlockProtocol", this.unlockHandler)
  }

  /**
   * Invoked to show the checkout modal provided by Unlock (optional... but convenient!)
   */
  checkout() {
    window.unlockProtocol && window.unlockProtocol.loadCheckoutModal()

  } 
  
  /**
   * event handler
   * @param {*} e
   */
  unlockHandler(e) {
    this.setState(state => {
      //console.log(e.currentTarget.localStorage.userInfo.address)
      return {
        ...state,
        locked: e.detail,
        address: e.currentTarget.localStorage.userInfo
      }
    })
  }

  render() {
    const { locked } = this.state
    const { address } = this.state
    return (
      <div className="App">
        <header className="App-header">
          {locked === "locked" && (
            <div onClick={this.checkout} style={{ cursor: "pointer" }}>
              Unlock me!{" "}
              <span aria-label="locked" role="img">
                🔒
              </span>
            </div>
          )}
          {locked === "unlocked" && (
            <div>
                <Checkout props={ address }/>
            </div>
          )}
        </header>
      </div>
    )
  }
}

export default App;


ReactDOM.render(<App/>, document.getElementById('root'))