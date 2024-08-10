import React, {useState, createContext} from 'react';

const LoginContext = createContext();

const LoginProvider = ({children}) => {
    const [login, setLogin] = useState("Login");

    const changeLogin = (value) => {
        setLogin(value);
    };

    return (
        <LoginContext.Provider value={{login, changeLogin}}>
            {children}
        </LoginContext.Provider>
    );
};

export {LoginContext, LoginProvider};