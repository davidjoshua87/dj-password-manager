import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getPassAsync, removePassAsync, getDetailPass, updatePassAsync } from '../stores/passwords/passwords.action';

class PasswordList extends Component {

  constructor() {
    super();
    this.state = {
      inputPass: '',
      password: '******',
      showModal: false
    };
  }

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  resetForm = () => {
    this.setState({
      inputPass: '',
      password: '******',
      showModal: false
    })
  }

  handleShowPass = (id) => {
    const { item } = this.props
    const passId = Object.getOwnPropertyNames(item)[0]
    if (id === passId) {
      this.setState({
        showModal: true
      })
    }
  }

  showPassword = (params) => {
    const userPass = localStorage.getItem('userPass')
    const userId = localStorage.getItem('userId')

    const {
      getPassAsync,
      updatePassAsync
    } = this.props

    if (this.state.showModal) {
      if (this.state.inputPass !== '') {
        if (this.state.inputPass === userPass) {
          const {
            url,
            username,
            password,
            passId
          } = params
          let showPass = true
          
          setTimeout(() => {
            updatePassAsync(passId, {
              url,
              username,
              password,
              showPass,
              userId,
            })
            this.setState({
              showModal: false
            })
            this.resetForm()
            getPassAsync(userId)
          }, 2000)
        } else {
          alert('Please input correct your password')
          setTimeout(() => {
            this.resetForm()
          }, 2000);
        }
      } else {
        alert('Please input your password')
        setTimeout(() => {
          this.resetForm()
        }, 2000);
      }
    }
  }

  handleHidePass = (params) => {
    const userId = localStorage.getItem('userId')
    const { item } = this.props
    const passId = Object.getOwnPropertyNames(item)[0]
    const {
      getPassAsync,
      updatePassAsync
    } = this.props

    if (params.passId === passId) {
      const { url, username, password, passId } = params
      let showPass = false
      
      setTimeout(() => {
        updatePassAsync(passId, {
          url,
          username,
          password,
          showPass,
          userId,
        })
        this.resetForm()
        getPassAsync(userId)
      }, 2000)
    }
  }

  handleDelete = (passId) => {
    const userId = localStorage.getItem('userId');
    this.props.removePassAsync(passId);
    this.props.getPassAsync(userId);
  }

  handleEdit = (params) => {
    const { getDetailPass, handleEdit } = this.props
    const { url, username, password, passId } = params
    getDetailPass({ url, username, password, passId })
    setTimeout(() => {
      handleEdit()
    }, 1000);
  }

  render() {
    const {
      handleDelete,
      handleEdit,
      handleShowPass,
      handleHidePass,
      showPassword,
      resetForm
    } = this
    const { item, index } = this.props
    const passId = Object.getOwnPropertyNames(item)[0]
    const { url, username, password, showPass } = item[passId]
    const hiddenPass = this.state.password
    console.log(showPass);

    return (
      <tr>
        <th scope="row">{index + 1}</th>
        <td>{url}</td>
        <td>{username}</td>
        <td>
          {showPass === true &&
            <span>{ password }</span>
          }
          {showPass === false &&
            <span>{ hiddenPass }</span>
          }
        </td>
        <td>
          {item[passId] &&
            <div className="btn-group" role="group" aria-label="Basic example">
            {showPass === true &&
              <div>
                <button id={index} type="button" className="btn btn-default btn-outline-dark btn-action"
                  onClick={()=> handleHidePass({ url, username, password, passId, showPass })}>
                  <i className="material-icons">visibility_off</i>
                </button>
                
              </div>
            }
            {showPass === false &&
              <div>
                <button type="button" className="btn btn-default btn-outline-dark btn-action" 
                  data-toggle="modal" data-target="#exampleModal" onClick={() => handleShowPass( passId )}>
                  <i className="material-icons">remove_red_eye</i>
                </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-body">
                        <form>
                          <div className="form-group">
                            <label>Username:</label>
                            <input disabled className="form-control" type="text" name="username" value={username} />
                            <label htmlFor="password">Your Password</label>
                            <input type="password" className="form-control" name="inputPass" onChange={this.handleChange} placeholder="Your Password" onKeyPress={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                showPassword({ url, username, password, passId, showPass });
                              }
                            } } />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => showPassword({ url, username, password, passId, showPass })}>Show</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={resetForm}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            }
            <button type="button" className="btn btn-default btn-outline-dark btn-action" onClick={()=> handleEdit({
              url,
              username, password, passId
              })}><i className="material-icons">create</i></button>
            <button type="button" className="btn btn-default btn-outline-dark btn-action" onClick={()=>
              handleDelete(passId)}><i className="material-icons">delete</i></button>
            </div>
          }
        </td>
      </tr >
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getPassAsync, removePassAsync, getDetailPass, updatePassAsync }, dispatch)
}

export default connect(null, mapDispatchToProps)(PasswordList);
