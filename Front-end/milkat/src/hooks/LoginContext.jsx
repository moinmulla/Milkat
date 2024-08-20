// import React, {useState, createContext} from 'react';

// const LoginContext = createContext();

// const LoginProvider = ({children}) => {
//     const [login, setLogin] = useState("Login");
//     const [role, setRole] = useState("");
//     const [token, setToken] = useState("");

//     const changeRole = (value) => {
//         setRole(value);
//     };

//     const changeToken = (value) => {
//         setToken(value);
//     };

//     const changeLogin = (value) => {
//         setLogin(value);
//     };

//     return (
//         <LoginContext.Provider value={{login, changeLogin, role, changeRole, token, changeToken}}>
//             {children}
//         </LoginContext.Provider>
//     );
// };

// export {LoginContext, LoginProvider};

import React, { useState, createEffect, useEffect, createContext } from 'react';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
    const [login, setLogin] = useState(() => localStorage.getItem('login') || 'Login');
    const [role, setRole] = useState(() => localStorage.getItem('role') || '');
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');

    const changeLogin = (value) => {
        setLogin(value);
        localStorage.setItem('login', value);
    };

    const changeRole = (value) => {
        setRole(value);
        localStorage.setItem('role', value);
    };

    const changeToken = (value) => {
        setToken(value);
        localStorage.setItem('token', value);
    };

    useEffect(() => {
        const storedLogin = localStorage.getItem('login');
        if (storedLogin) setLogin(storedLogin);

        const storedRole = localStorage.getItem('role');
        if (storedRole) setRole(storedRole);

        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);

        if(!document.cookie) {
            localStorage.clear();
        }
    }, []);

    return (
        <LoginContext.Provider value={{ login, changeLogin, role, changeRole, token, changeToken }}>
            {children}
        </LoginContext.Provider>
    );
};

export { LoginContext, LoginProvider };
