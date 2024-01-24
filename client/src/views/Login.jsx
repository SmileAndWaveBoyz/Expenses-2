import React, { useRef, useState }  from 'react'
import { Link } from "react-router-dom";
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

function Login() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const { setUser, setToken } = useStateContext()
  const [errors, setErrors] = useState(null)

  function onSubmit(ev){
    ev.preventDefault()
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    setErrors(null)
    axiosClient.post('/login', payload)
    .then(({data})=>{
      setUser(data.user)
      setToken(data.token)
    })
    .catch((error) => {
      const response = error. response
      if (response && response.status === 422) {
        if (response.data.errors) {
          setErrors(response.data.errors)
        } else{
          setErrors({
            email:[response.data.message]
          })
        }
      }
    })
  }


  return (
    <div className='login '>
      <div className="row justify-content-md-center align-items-center align-items-center" style={{minHeight: "95vh"}}>
        <form className='login__form col-lg-4 col-md-6 col-sm-8 shadow rounded  px-4 pt-4 pb-3' onSubmit={onSubmit}>
          <h1 className='mb-4'>Login</h1>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" ref={emailRef} autoFocus/>
            {
              (errors && errors.email) ?
              <p class="errorMessage">{errors.email}</p>
              :
              null
            }
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref={passwordRef}/>
            {
              (errors && errors.password) ?
              <p class="errorMessage">{errors.password}</p>
              :
              null
            }
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
          
          <div className="row justify-content-center">
            <p>Not registered? <Link to={"/signup"}>Create an cccount</Link></p> 
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login