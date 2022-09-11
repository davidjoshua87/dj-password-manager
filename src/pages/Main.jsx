import React, { Component } from 'react';
import moment from 'moment'
import jwt from 'jsonwebtoken';
import swal from 'sweetalert';
import Navbar from '../components/Navbar';
import PasswordValidator from '../components/PasswordValidator';
import PasswordList from '../components/PasswordList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getPassAsync,
  addPassAsync,
  updatePassAsync,
  searchPass
} from '../stores/passwords/passwords.action';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      username: '',
      password: '',
      passId: '',
      currentYears: '',
      isEdit: false
    };
  }

  componentDidMount() {
    this.resetForm()
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (!token) {
      this.props.history.push('/');
    } else {
      const user = jwt.verify(token, 'shhhhh');
      this.setState({
        userId: user.userId
      })
      this.props.getPassAsync(userId)
    }
  }

  getYearNow = () => {
    const dateNow = Date.now()
    this.currentYears = moment(dateNow).format('YYYY')
    return this.currentYears
}

  handleInput = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    const { url, username, password } = this.state
    const { addPassAsync, getPassAsync } = this.props
    const showPass = false
    addPassAsync({
      username,
      password,
      url,
      userId,
      showPass
    })
    this.resetForm()
    setTimeout(function () { getPassAsync(userId) }, 2000);
  }

  handleEdit = () => {
    const { url, username, password, passId } = this.props.pass.passDetail
    this.setState({
      url,
      username,
      password,
      passId,
      isEdit: true
    })
  }

  handleUpdate = (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    const { username, password, url, passId } = this.state
    this.props.updatePassAsync(passId, {
      username,
      password,
      url,
      userId
    })
    this.props.getPassAsync(userId);
    swal({
      title: "NICE!",
      text: "Successfully Update Password",
      icon: "success",
    });
    this.resetForm()
  }

  resetForm = () => {
    this.setState({
      url: '',
      username: '',
      password: '',
      isEdit: false,

    })
  }

  conditionalBtn = () => {
    const { handleSubmit, resetForm, handleUpdate } = this
    const { url, username, password, isEdit } = this.state;
    const isPwdValid = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#$!%*?&])[A-Za-z\d$@#$!%*?&]{6,}/)
    if (!isEdit) {
      return (
        <button className="btn btn-dark" onClick={handleSubmit} disabled={!isPwdValid | !url | !username | !password} >Submit</button>
      )
    } else {
      return (
        <div className="btn-group" role="group">
          <button className="btn btn-dark" disabled={!isPwdValid | !url | !username | !password} onClick={handleUpdate}>Update</button>
          <button className="btn btn-default" onClick={resetForm}>Cancel</button>
        </div>
      )
    }
  }

  conditionTable = () => {
    const { pass } = this.props
    if (!pass.notFound) {
      return (
        <table className="table table-sm table-light">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Domain</th>
              <th scope="col">Username</th>
              <th scope="col">Password</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pass.listPassSearch.length === 0 ? pass.listPass.map((item, index) => (
              <PasswordList item={item} key={Object.getOwnPropertyNames(item)} index={index}
                handleEdit={this.handleEdit} />)) : pass.listPassSearch.map((item, index) => (
                  <PasswordList item={item} key={Object.getOwnPropertyNames(item)} index={index}
                    handleEdit={this.handleEdit} />))}
          </tbody>
        </table>
      )
    } else {
      return (
        <h3 className="text-center">NOT FOUND </h3>
      )
    }

  }

  handleSearch = (e) => {
    const { value } = e.target
    this.props.searchPass(value)
  }

  handleLoading = () => {
    const { loading } = this.props.pass
    if (!loading) {
      return (
        <div className="listPass password-list-table table-responsive">
          {this.conditionTable()}
        </div>
      )
    } else {
      return (
        <div className='wrap-loader'>
          <div className="loader"></div>
        </div>
      )
    }
  }

  render() {
    const {
      handleInput,
      conditionalBtn,
      handleSearch,
      handleLoading,
      getYearNow
    } = this;
    const { url, username, password } = this.state;

    return (
      <div>
        <Navbar props={{ ...this.props }} />
        <div className="container">
          <div className="content">
            <hr />
            <h2>Password Form</h2>
            <hr />
            <form className="password-form">
              <div className="form-group">
                <label htmlFor="url">Domain</label>
                <input type="url" className="form-control" name="url" placeholder="Enter domain" onChange={handleInput} value={url} />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" name="username" placeholder="Enter username" onChange={handleInput} value={username} />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" name="password" placeholder="Password" onChange={handleInput} value={password} />
              </div>
              <PasswordValidator password={password} url={url} username={username}/>
              {conditionalBtn()}
            </form>
            <hr />
            <h2>Pasword List</h2>
            <hr />
            <form className="password-list">
              <input className="form-control" type="search" placeholder="Search" onChange={(e) => handleSearch(e)} />
            </form>
            <hr />
            {handleLoading()}
          </div>
        </div>
        <footer className="sticky-footer-navbar">
          <span>Copyright &copy; 2018 -  {getYearNow()}. JDs Web Developer.</span>
        </footer>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pass: state.pass
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getPassAsync, addPassAsync, updatePassAsync, searchPass
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
