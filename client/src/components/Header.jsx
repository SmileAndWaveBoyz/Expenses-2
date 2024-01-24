import React, { useEffect, useRef, useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider';

function Header() {
    const {newForm, listDisplay, setNewForm, setListDisplay, arrowRotate, setArrowRotate, filters, setFilters} = useStateContext()
    
    function filterButtonClick() {
      if (arrowRotate == 180) {
        setArrowRotate(0)
        setListDisplay("block")
      } else{
        setArrowRotate(180)
        setListDisplay("none")
      }
    }

    function newInvoice() {
      setNewForm(true)
    }

    function checkBox(event) {

      switch (event.target.name) {
        case "draft":
          if (filters.draft === "draft") {
            setFilters((prevFilters) =>{
              return {...prevFilters, draft: "unchecked"}
            })
          }  else{
            setFilters((prevFilters) =>{
              return {...prevFilters, draft: "draft"}
            })
          }
          break;
        case "pending":
          if (filters.pending === "pending") {
            setFilters((prevFilters) =>{
              return {...prevFilters, pending: "unchecked"}
            })
          }  else{
            setFilters((prevFilters) =>{
              return {...prevFilters, pending: "pending"}
            })
          }
          break;
        case "paid":
          if (filters.paid === "paid") {
            setFilters((prevFilters) =>{
              return {...prevFilters, paid: "unchecked"}
            })
          }  else{
            setFilters((prevFilters) =>{
              return {...prevFilters, paid: "paid"}
            })
          }
          break;
      
        default:
          break;
      }

      console.log(filters);

    }
    
    return (
    <header className='container d-flex justify-content-between align-items-center' id='header'>
        <div className="header" >
          <h1>Invoices</h1>
          <h3><h3 className='mobileNoDisplay'>There are </h3> 7 <h3 className='mobileNoDisplay'>total</h3> invoices</h3>
        </div>

        <div className="header__right d-flex justify-content-between align-items-center">
        
        
        <button onClick={filterButtonClick}  className='header__filterButton'><p className='header__filterPar'>Filter&nbsp;</p> <p className='header__filterPar mobileNoDisplay'> by status</p>  <svg style={{transform: `rotateX(${arrowRotate}deg)`}}  className='header__filterButtonSVG' xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">  <path d="M1 6.22803L5.2279 2.00013L9.4558 6.22803" stroke="#7C5DFA" stroke-width="2"/></svg></button>
        <div className="inputContainer">
            <form className='inputContainer__form' style={{display: listDisplay}}>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="draft" onClick={checkBox}  defaultChecked />
                <label class="form-check-label"> Draft</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="pending" onClick={checkBox}  defaultChecked />
                <label class="form-check-label"> Pending</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="paid" onClick={checkBox}  defaultChecked />
                <label class="form-check-label"> Paid </label>
            </div>
            </form>
        </div>
        <button onClick={newInvoice} className='btn btn-primary header__newButton'><svg className='plusSVG' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="white"/><path d="M17.3131 21.0234V17.3136H21.0229V14.7333H17.3131V11.0234H14.7328V14.7333H11.0229V17.3136H14.7328V21.0234H17.3131Z" fill="#7C5DFA"/></svg>New</button>
        </div>
    </header>
  )
}

export default Header