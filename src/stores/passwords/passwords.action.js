import {
  pwdRef
} from '../../firebase/firebase';
import swal from 'sweetalert';

const getPass = (payload) => {
  return {
    type: 'GET_PASS',
    payload
  }
}

const loadingPass = () => {
  return {
    type: 'LOADING_GET_PASS'
  }
}

const errorGetPass = () => {
  return {
    type: 'ERROR_GET_PASS'
  }
}

const savePassUser = (payload) => ({
  type: 'SAVE_PASS_USER',
  payload
})

const getPassAsync = (userId) => {
  return dispatch => {
    dispatch(loadingPass())
    let pass = []
    pwdRef.once("value", function (snapshot) {
        snapshot.forEach(function (data) {
          let passId = data.key;
          let passDetail = data.val();
          if (passDetail.userId === userId) {
            pass.push({
              [passId]: passDetail
            });
          }
        });
      })
      .then((result) => {
        dispatch(getPass(pass))
      })
      .catch((err) => {
        dispatch(errorGetPass())
      });
  }
}

const addPassAsync = payload => async dispatch => {
  let isDuplicated = false;
  pwdRef.once("value", function (snapshot) {
      snapshot.forEach(data => {
        let pass = data.val();
        if (pass.url === payload.url && pass.userId === payload.userId) {
          isDuplicated = true;
        }
      })
    })
    .then((result) => {
      if (!isDuplicated) {
        pwdRef.push().set(payload)
        swal("GREAT!", "Successfully add Password", "success");
      } else {
        swal("Oops...", "URL already submit!", "error");
      }
    }).catch((err) => {
      swal("Oops...", "Something was WRONG", "error");
    });
}

const removePassAsync = passId => async dispatch => {
  pwdRef.child(passId).remove();
};

const updatePassAsync = (passId, payload) => async dispatch => {
  pwdRef.child(passId).update(payload);
}

const getDetailPass = (payload) => {
  return {
    type: 'GET_PASS_DETAIL',
    payload
  }
}

const searchPass = (payload) => {
  return {
    type: "SEARCH_PASS",
    payload
  }
}

const logOut = () => {
  return {
    type: "LOG_OUT_USER"
  }
}

export {
  getPassAsync,
  addPassAsync,
  removePassAsync,
  getDetailPass,
  updatePassAsync,
  savePassUser,
  searchPass,
  logOut
};