import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { useUser } from "../hooks/useUser";
import { ApiClient } from "../hooks/ApiClient";
import { Module } from "../types";

interface ModuleContextProps {
  modules: Module[],
  setModules: (modules: Module[]) => void
}

const ModuleContext = createContext<ModuleContextProps>({modules: [], setModules: () => {}});

export function useModuleData() {
  return useContext(ModuleContext);
}

export function ModuleProvider({children}: PropsWithChildren) {
  const [modules, setModules] = useState<Module[]>([]);
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
          let newModules : Module[] = [];
          for (let module of result) {
            const data : Module = {
              id: module.module_id, 
              name: module.module_name, 
              description: module.description,
              completion: module.completion_percent, 
            };
            newModules.push(data);
          }
          setModules(newModules);
        } catch (error : any) {
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
