// DefaultLayout.jsx
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function DefaultLayout() {

  const {token, setUser, setToken } = useStateContext()

  useEffect(()=>{
    axiosClient.get("/user")
    .then(({data}) => {
      setUser(data)
    })
  }, [])
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  function onLogout (event){
    event.preventDefault()
    axiosClient.post("/logout")
      .then(()=>{
        setUser({})
        setToken(null)
      })
  }


  return (
    <div id='defaultLayout'>
      <Outlet />
    </div>
  );
}
