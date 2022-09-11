import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { usersRef } from '../firebase/firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Swal from 'sweetalert';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loading: false
    };
  }

  handleInput = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = () => {
    const self = this
    const {
      email,
      password
    } = self.state
    let isRegistered = false
    let userData = null
    let userId = null
    this.setState({
      loading: true
    });
    usersRef.once("value", function (snapshot) {
        snapshot.forEach(function (data) {
          let user = data.val();
          if (email === user.email) {
            isRegistered = true;
            userData = user;
            userId = data.key
          }
        });
      })
      .then((data) => {
        setTimeout(() => {
          this.setState({
            loading: false
          });
          if (!isRegistered) {
            Swal("Oops...", "Email Not Found Please Register", "error");
          } else {
            bcrypt.compare(password, userData.password, function (err, res) {
              if (err) {
                Swal("Oops...", "Something was Wrong", "error")
              } else if (res) {
                let token = jwt.sign({
                  userId,
                  name: userData.name,
                  email
                }, 'shhhhh');
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userPass', password);
                Swal({
                  icon: 'success',
                  title: 'You has been logged in',
                  showConfirmButton: false
                })
                self.props.history.push("/main");
              } else {
                Swal("Oops...", "Your Password is Wrong", "error");
              }
            });
          }
        }, 5000);
      })
  }

  render() {
    const { handleInput, handleSubmit } = this
    const { email, password, loading } = this.state;
    const isEmailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const isPwdValid = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#$!%*?&])[A-Za-z\d$@#$!%*?&]{6,}/)

    return (
      loading ? <div className="loader"></div> :
      <div className="card">
        <div className="container text-center">
          <form id="form-login" className="form-signin">
            <h1 className="h3 mb-3 font-weight-normal">Sign-in</h1>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" name="email" id="inputEmail" className="form-control" placeholder="Email address"
              required autoFocus onChange={handleInput} />
            {!isEmailValid && email ? <small> Email is Invalid </small> : null}
            <br />
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Password"
              required onChange={handleInput} />
            {!isPwdValid && password ? <small> Password is Invalid </small> : null}
          </form>
          <button className="btn btn-lg btn-dark btn-block" disabled={!isEmailValid || !isPwdValid || !email ||
            !password} onClick={handleSubmit}>Sign in</button>
          <hr />
          <p className="text-center">Don't have an account?
            <Link to={`/register`}>Register </Link> Now</p>
        </div>
      </div>
    )
  }
}

export default Login;