import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import jwt from 'jwt-decode';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import { api } from '../constants';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          // const response = await axios.get('/api/account/my-account');
          const user = jwt(accessToken);
          if (user.role === 'ADMIN') {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user,
              },
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.LOGIN}`, {
      email,
      password,
    });

    const user = jwt(response.data.token);
    localStorage.setItem('accessToken', response.data.token);
    if (user.role === 'ADMIN') {
      const accessToken = response.data.token;
      localStorage.setItem('accessToken', response.data.token);
      setSession(accessToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } else  {
      localStorage.clear();
      setSession(null);
      
        throw new Error("Sai role");
    
        // alert(e.message); // This is an error
    
    //  throw new Error( message: ,'không đúng role' );
      // console.error('Not role admin', user.role);
      
    }
  };

  const logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
