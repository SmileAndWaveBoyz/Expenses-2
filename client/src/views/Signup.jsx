import React, { useRef, useState } from 'react'
import { Link } from "react-router-dom";
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

function Signup() {

  const nameRef = useRef()
  const surnameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmationRef = useRef()

  const {setUser, setToken} = useStateContext()
  const [errors, setErrors] = useState(null)

  function onSubmit(ev){
    ev.preventDefault()
    const payload = {
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value
    }
    setErrors(null)
    axiosClient.post('/signup', payload)
      .then(({data})=>{
        console.log("success");
        console.log(data);
        setUser(data.user)
        setToken(data.token)
      })
      .catch((error) => {
        const response = error. response
        if (response && response.status === 422) {
          if (response.data.errors) {
            console.log("Error");
            console.log(response.data.errors);
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
  <div className='signup'>
    <div className="row justify-content-md-center align-items-center" style={{ minHeight: "95vh" }}>
      <form className='login__form col-lg-4 col-md-6 col-sm-8 shadow rounded px-4 pt-4 pb-3'  >
        <h1 className='mb-4'>Signup</h1>
        <div className="row">
          <div className="form-group col-sm-6">
            <label htmlFor="name">First name</label>
            <input ref={nameRef} type="text" className="form-control" id="name" placeholder="First name" autoFocus />
            {
              (errors && errors.name) ?
              <p class="errorMessage">{errors.name}</p>
              :
              null
            }
          </div>
          <div className="form-group col-sm-6">
            <label htmlFor="surname">Surname</label>
            <input ref={surnameRef} type="text" className="form-control" id="surname" placeholder="Surname" />
            {
              (errors && errors.surname) ?
              <p class="errorMessage">{errors.surname}</p>
              :
              null
            }
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input ref={emailRef} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            {
              (errors && errors.email) ?
              <p class="errorMessage">{errors.email}</p>
              :
              null
            }
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input ref={passwordRef} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            {
              (errors && errors.password) ?
              <p class="errorMessage">{errors.password}</p>
              :
              null
            }
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Confirm password</label>
          <input ref={passwordConfirmationRef} type="password" className="form-control" id="exampleInputPassword2" placeholder="Confirm password" />
        </div>

        <button onClick={onSubmit} className="btn btn-primary w-100 mb-3">Sign up</button>

        <div className="row justify-content-center">
          <p>Already registered? <Link to={"/login"}>Log in</Link></p>
        </div>
      </form>
    </div>
  </div>

  )
}

export default Signup