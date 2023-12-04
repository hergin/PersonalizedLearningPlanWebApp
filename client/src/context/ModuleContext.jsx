import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { ApiClient } from "../hooks/ApiClient";

const ModuleContext = createContext();

export function useModuleData() {
    return useContext(ModuleContext);
}

export function ModuleProvider({children}) {
    const [modules, setModules] = useState([]);
    const { user } = useUser();
    const { get } = ApiClient();
    
    useEffect(() => {
        async function getModules() {
          try {
            console.log(
              `User: ${user.email} ${user.accessToken} ${user.refreshToken}`,
            );
            const result = await get(`/module/get/${user.email}`);
            console.log(`Resulting data: ${result}`);
            let newModules = [];
            for (let module of result) {
              newModules.push(module);
            }
            setModules(newModules);
          } catch (error) {
            console.error(error);
            alert(error.response ? error.response.data : error);
          }
        }
    
        getModules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return (
        <ModuleContext.Provider value={{modules, setModules}}>
            {children}
        </ModuleContext.Provider>
    );
}
