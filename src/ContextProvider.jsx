import { createContext } from 'react';
import { getAuth } from 'firebase/auth';

export const userContext = createContext()

const ContextProvider = ({children}) =>{
    const auth = getAuth();
    const user = auth.currentUser;
    const role = 'admin';

    return (
        <userContext.Provider value={{role, user}}>
            {children}
        </userContext.Provider>
    )


}
export default ContextProvider
