import  {useContext,createContext,useState,useMemo,useCallback,useEffect} from 'react';

const supportChainIds = [1,56,137,250];
const ApplicationContext = createContext();

export function useApplicationContext (){
    return useContext(ApplicationContext);
}

export default function Provider({children}) {
    const [chainId, setChainId] = useState(1);
    const [chainError, setChainError] = useState(false);

    const updateChainId = (id) => {
        //console.log(Number(id.toString()));
        if(supportChainIds.includes(Number(id.toString()))){
            //console.log("chainge chainid",Number(id.toString()))
            setChainId(Number(id.toString()));
            setChainError(false);
        }
        else {
            setChainError(true);
        }
        return chainError;
    }

    return (
        <ApplicationContext.Provider
            value = {useMemo(()=>({chainId,chainError, updateChainId}),[chainId,chainError])}
        >
            {children}
        </ApplicationContext.Provider>
    )
}