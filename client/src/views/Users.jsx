import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Invoices from '../components/Invoices';
import NewInvoiceForm from "../components/NewInvoiceForm"
import UpdateInvoiceForm from '../components/UpdateInvoiceForm';

function Users() {
 

  return (
    <>
      <Navbar/>
      <NewInvoiceForm/>
      <UpdateInvoiceForm/>
      <Invoices/>
    </>
  )
}

export default Users