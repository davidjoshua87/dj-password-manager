const initialState = {
  loading: true,
  error: false,
  listPass: [],
  passDetail: {},
  userPass: '',
  listPassSearch: [],
  notFound: false
};

const getPass = (state = { ...initialState
}, action) => {
  switch (action.type) {
    case 'GET_PASS':
      return {
        ...state,
        listPass: action.payload,
        loading: false,
        error: false
      };
    case 'LOADING_GET_PASS':
      return {
        ...state,
        loading: true
      }
    case 'ERROR_GET_PASS':
      return {
        ...state,
        error: true
      }
    case 'GET_PASS_DETAIL':
      return {
        ...state,
        passDetail: action.payload
      }
    case 'SAVE_PASS_USER':
      return {
        ...state,
        userPass: action.payload
      }
    case 'SEARCH_PASS':
      let keyword = action.payload
      const newList = state.listPass.filter(data => {
        let key = Object.getOwnPropertyNames(data)
        return data[key].url.search(
          keyword) !== -1
      })
      if (newList.length > 0) {
        return {
          ...state,
          listPassSearch: newList,
          notFound: false
        }
      } else {
        return {
          ...state,
          notFound: true
        }
      }
    case 'LOG_OUT_USER':
      return initialState
    default:
      return state;
  }
}

export default getPass;