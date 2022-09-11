import React, { Component } from 'react';
import { logOut } from '../stores/passwords/passwords.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }

  handleLogout = () => {
    console.log(this.props)
    this.setState({
      isLoading: true,
    })

    setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userPass')
      this.props.props.history.push("/")
      this.props.logOut();
      this.setState({
        isLoading: false
      });
      }, 2000);
    
  }
  render() {
    const {
      handleLogout
    } = this
    const loading = this.state.isLoading
    return (
      loading ? <div className="loader"></div> :
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <div className="navbar-brand">DJ Password-Manager</div>
            <div id="navbarTogglerDemo03">
              <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              </ul>
              <button className="my-2 my-lg-0 nav-item btn btn-default" onClick={() => {handleLogout()}
              }>
                Log Out
              </button>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) =>{
  return bindActionCreators({ 
    logOut 
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(Navbar);
