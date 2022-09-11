import React, { Component } from 'react'

class PasswordValidator extends Component {
  checkPwd = (validator) => {
    return validator ? { __html: '&#10003;' } : { __html: '&#10007' }
  }

  validation(pwd) {
    let valid = false;
    let result = /[A-Z]|[a-z]|[-!@#$%^&*()_+|~=`{}\\[\]:";'<>?,.//]|\d/.test(pwd);
    if (pwd.length > 0) {
      if (result) {
        valid = true;
      }
    }
    return valid;
  }

  render() {
    const { checkPwd, validation } = this
    const { url, username, password } = this.props
    const isPwdValid = validation(password);
    const isPwdValid1 = /[A-Z]/.test(password);
    const isPwdValid2 = /[a-z]/.test(password);
    const isPwdValid3 = /[-!@#$%^&*()_+|~=`{}\\[\]:";'<>?,.//]/.test(password);
    const isPwdValid4 = /\d/.test(password);
    const isPwdValid5 = password.length > 5 ? true : false;

    return (
      (url !== '' && username !== '' &&
      <div className="text-left">
        <center>
        <p>Password Strength</p>
        </center>
        {isPwdValid &&
          <ul className="validatorStrength">
            {isPwdValid1 &&
              <li><span dangerouslySetInnerHTML={checkPwd(isPwdValid1)}></span> Password harus memiliki setidaknya satu
                karakter huruf besar ( upper-case )</li>
            }
            {isPwdValid2 &&
              <li><span dangerouslySetInnerHTML={checkPwd(isPwdValid2)}></span> Password harus memiliki setidaknya satu
                karakter huruf kecil (lower-case )</li>
            }
            {isPwdValid3 &&
              <li><span dangerouslySetInnerHTML={checkPwd(isPwdValid3)}></span> Password harus memiliki setidaknya satu
                karakter spesial ( #$@!%...)</li>
            }
            {isPwdValid4 &&
              <li><span dangerouslySetInnerHTML={checkPwd(isPwdValid4)}></span> Password harus memiliki setidaknya satu
                angka</li>
            }
            {isPwdValid5 &&
              <li><span dangerouslySetInnerHTML={checkPwd(isPwdValid5)}></span> Password harus memiliki panjang (length)
                lebih dari 5 karakter</li>
            }
          </ul>
        }
      </div>
      )
    )
  }
}

export default PasswordValidator;