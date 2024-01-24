import { createContext, useState, useContext } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    newForm: 0,
    refresh: false,
    editPage: false,
    listDisplay: "none",
    arrowRotate: 180,
    updateForm: 0,
    selectedData: [],
    selectedItems: [],
    filters: {},
    setUpdateForm: () => {},
    setUser: () => {},
    setToken: () => {},
    setNewForm: () =>{},
    setRefresh: () => {},
    setEditPage: () => {},
    setListDisplay: () => {},
    setArrowRotate: () => {},
    setSelectedData: () => {},
    setSelectedItems: () => [],
    setFilters: () => {},

})

export const ContextProvider = ({children})=>{

    const [user, setUser] = useState({})
    const [selectedData, setSelectedData] = useState([])
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"))
    const setToken = (token)=>{
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else{
            localStorage.removeItem('ACCESS_TOKEN')
        }
    };

    const [newForm, setNewForm] = useState(false)
    const [updateForm, setUpdateForm] = useState(false)
    const [editPage, setEditPage] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [listDisplay, setListDisplay] = useState("none")
    const [arrowRotate, setArrowRotate] = useState(180)
    const [selectedItems, setSelectedItems] = useState([])
    const [filters, setFilters] = useState({draft: "draft", pending: "pending", paid: "paid"})

    function filterButtonClick() {
        if (arrowRotate == 180) {
          setArrowRotate(0)
          setListDisplay("block")
        } else{
          setArrowRotate(180)
          setListDisplay("none")
        }
      }

    return  <StateContext.Provider value={{filters, setFilters, selectedItems, setSelectedItems, selectedData, setSelectedData, updateForm, setUpdateForm, arrowRotate, setArrowRotate, user, token, newForm, refresh, editPage, listDisplay, setUser, setToken, setNewForm, setRefresh, setEditPage, setListDisplay}}>{children}</StateContext.Provider>
}

export const useStateContext = () => {
    return useContext(StateContext);
};
  

