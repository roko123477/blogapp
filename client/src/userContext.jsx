import { createContext,useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const[userInfo,setUserInfo]=useState({});
  return (
    <UserContext.Provider value={{userInfo,setUserInfo}}>
      <div>{children}</div>
    </UserContext.Provider>
  );
};
