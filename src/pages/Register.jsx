import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import swal from 'sweetalert';
import { usersRef } from '../firebase/firebase';
import PasswordValidator from '../components/PasswordValidator';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
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

  handleRegister = () => {
    const self = this;
    const { name, email, password } = this.state;
    let isReg = true;
    this.setState({
      loading: true
    });
    usersRef.once("value", function (snapshot) {
      snapshot.forEach(function (data) {
        let user = data.val();
        if (email === user.email) {
          isReg = false;
        }
      });
    }).then((data) => {
      setTimeout(() => {
        this.setState({
          loading: false
        });
        if (isReg) {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              const newUser = {
                name,
                email,
                password: hash
              }
              usersRef.push().set(newUser);
            });
          });
          self.props.history.push("/")
          swal({
            title: "Good job!",
            text: "You have successfully Register",
            icon: "success",
          });
        } else {
          swal("Oops...", "Your Email already registered!", "error");
        }
      }, 5000);
    })
  }

  render() {
    const { handleInput, handleRegister } = this;
    const { name, email, password, loading } = this.state;
    const isNameValid = /^$/.test(name);
    const isEmailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const isPwdValid = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#$!%*?&])[A-Za-z\d$@#$!%*?&]{6,}/)

    return (
      loading ? <div className="loader"></div> :
      <div className="card">
        <div className="container text-center">
          <form className="form-signin">
            <h1 className="h3 mb-3 font-weight-normal">Register Form</h1>
            <label htmlFor="inputEmail" className="sr-only">Name</label>
            <input type="text" name="name" id="inputName" className="form-control" placeholder="Name" required autoFocus
              onChange={handleInput} onBlur={handleInput} />
            {isNameValid ? <small>Name is Required</small> : null}
            <br />
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" name="email" id="inputEmail" className="form-control" placeholder="Email address"
              required onChange={handleInput} />
            {!isEmailValid && email ? <small>Email is Invalid</small> : null}
            <br />
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Password"
              required onChange={handleInput} />
            <PasswordValidator password={password} email={email} />
          </form>
          <button className="btn btn-lg btn-dark btn-block" type="submit" onClick={handleRegister} disabled={!name ||
            !password || !email || !isPwdValid || !isEmailValid}>Register</button>
          <hr />
          <p>Have an Account?
            <Link to={`/`}>Login </Link> Now</p>
        </div>
      </div>
    )
  }
}

export default Register;
