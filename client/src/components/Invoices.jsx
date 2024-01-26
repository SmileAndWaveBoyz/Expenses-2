import React, { useEffect, useState } from 'react'
import jsonData from './data.json';
import { useStateContext } from '../contexts/ContextProvider';
import Header from '../components/Header';
import axios from 'axios';
import axiosClient from '../axios-client';

function Invoices() {
  const { token, refresh, editPage, listDisplay, setEditPage, setRefresh, setListDisplay, arrowRotate, setArrowRotate, setUpdateForm, setSelectedData, selectedItems, setSelectedItems, filters, setFilters} = useStateContext()
  const [editPagePosition, setEditPagePosition] = useState(window.innerWidth)
  const [selectedID, setSelectedID] = useState(0)


  const [data, setData] = useState([])
  const [itemData, setItemData] = useState([])
  useEffect(() => {
    

    const fetchInvoices = async () => {
      try {
        const response = await fetch('https://expenses-2-production.up.railway.app/api/invoices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });


        const data = await response.json();
        setData(data.invoices)

      } catch (error) {
        console.error('Error fetching invoices:', error.message);
      }
    };

    fetchInvoices()

    const fetchItems = async () => {
      try {
        const response = await fetch('https://expenses-2-production.up.railway.app/api/items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setItemData(data.items)
        // console.log('Items:', data.items);
      } catch (error) {
        console.error('Error fetching items:', error.message);
      }
    };

    fetchItems()

  }, [refresh]);

  async function deleteInvoice(invoiceId) {
    try {
      const response = await fetch(`https://expenses-2-production.up.railway.app/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (refresh) {
        setRefresh(false)
      } else{
        setRefresh(true)
      }
      setEditPage(false)

    } catch (error) {
       alert(error)
    }
  }

  useEffect(() => {

    if (editPage) {
      setEditPagePosition(0)
    } else{
      setEditPagePosition(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    function handleResize() {
      if (editPage) {
        setEditPagePosition(0)
        } else{
          setEditPagePosition(window.innerWidth)
        }
    }

    setSelectedData(data[selectedID])
    console.log("Selected", data[selectedID]);
  
    return () => {
      window.removeEventListener('resize', handleResize)
    };

  }, [editPage])

  function viewInvoice(id) {
    setSelectedID(id)
    setEditPage(true)

    let selectedItemsVar = []

    for (let i = 0; i < itemData.length; i++) {

        if (data[id].id === itemData[i].invoice_id) {
          selectedItemsVar.push(itemData[i])
        }
    }
    // console.log(selectedItemsVar);
    setSelectedItems(selectedItemsVar)
  }

  function viewInvoiceBack() {
    setEditPage(false)
  }

  function clearBoxClick() {
    setListDisplay("none")

    if (arrowRotate == 180) {
      setArrowRotate(0)
      setListDisplay("block")
    } else{
      setArrowRotate(180)
      setListDisplay("none")
    }
  }

  function markAsPaid(){

    const payload = {
      status: "paid",
  };

    axiosClient.put(`/markAsPaid/${data[selectedID].id}`, payload)
    .then(({ data }) => {
        console.log(data);
        if (!refresh) {
            setRefresh(true);
        } else {
            setRefresh(false);
        }
    })
    .catch((error) => {
        alert(error)
    });
  }  
  

  function markAsPending(){

    const payload = {
      status: "pending",
  };

    axiosClient.put(`/markAsPaid/${data[selectedID].id}`, payload)
    .then(({ data }) => {
        console.log(data);
        if (!refresh) {
            setRefresh(true);
        } else {
            setRefresh(false);
        }
    })
    .catch((error) => {
        alert(error)
    });
  }  
  
  return (
    <div className='home'>
      <div className="clearBox" onClick={clearBoxClick} style={{display: listDisplay}}></div>
      <div className="invoicePage">

      <main id='invoices'> 
      <Header/>
      {
        (data.length > 0) ?
        
        data.map((d, index)=>{
          return(
            (d.status === filters.draft || d.status === filters.paid || d.status === filters.pending  ) ?
                <div key={index} className='container invoices' onClick={()=>viewInvoice(index)}>
                    <section className='invoices__row'>
                      <div className="invoices_left">
                        <h3 className='invoices__id'><h3 className='invoices__idH'>#</h3>{d.invoiceID}</h3> 
                        <div className="invoices_dateContainer">
                            <p className='invoices__date due'>Due</p> <p className='invoices__date'> {d.paymentDue}</p> 
                        </div>
                        <h3 className='invoices__id'>£ {(d.total) ? d.total: "Null"}</h3>
                      </div>

                      <div className="invoices_right">
                        <p className='invoices__name'>{d.clientName}</p>
                        <div className={`invoices__status ${d.status}`}><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"> <circle className={`invoices__status-circle ${d.status}`} cx="4" cy="4" r="4" /></svg> {d.status}</div>
                        <svg className='mobileNoDisplay invoices__arrow' xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10" fill="none"> <path d="M1 1L5 5L1 9" stroke="#7C5DFA" stroke-width="2"/></svg>
                      </div>
                    </section>
                </div>
                :
                null

                )
        })
        :
        <main className='container empty'>
            <img className='empty__image' src="./assets/illustration-empty.svg" alt="" />
            <h2 className='empty__heading'>There is nothing here</h2>
            <p className='empty__paragraph'>Create an invoice by clicking the <br></br><strong>New Invoice</strong> button and get started</p> 
        </main>
      }
      </main>
      </div>

      <div className="editPage" style={{transform: `translateX(-${editPagePosition}px)`}}>
        <div className="container">
          <button onClick={viewInvoiceBack} className='nForm__backButton edit'><svg className='nForm__backButtonSVG'  width="6" height="11" viewBox="0 0 6 11" fill="none">  <path d="M4.3418 0.88623L0.113895 5.11413L4.3418 9.34203" stroke="#9277FF" stroke-width="2"/></svg>Go back</button>
        {
          (data.length > 0) ?

          <header className='editPage__header'>
            <p className='editPage__status'>Status</p>
            <div className={`invoices__status ${data[selectedID].status}`}><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"> <circle className={`invoices__status-circle ${data[selectedID].status}`} cx="4" cy="4" r="4" /></svg> {data[selectedID].status}</div>
            <div className="editPage__headerButtons">
              <button className='btn btn-transparent edit' onClick={() => setUpdateForm(true)}>Edit</button>
              <button className='btn btn-red delete' onClick={() => deleteInvoice(data[selectedID].id)}>Delete</button>
              {
                (data[selectedID].status === "pending") ?
                <button className='btn btn-primary paid' onClick={() => markAsPaid()}>Mark as Paid</button>
                :
                (data[selectedID].status === "paid") ?
                <button className='btn btn-red paid' onClick={() => markAsPending()}>Mark as Pending</button>
                :
                null
              }

            </div>
          </header>
          :
          null
          }

          {
            (data.length > 0) ?

            <div className="editPage__body" >
            <div className="editPage__top">
              <div className="editPage__idContainer">
                <h3 className='editPage__id'><h3 className='invoices__idH'>#</h3>{data[selectedID].invoiceID}</h3>
                <p className='editPage__description'>Graphic Design</p>
              </div>
              <div className="editPage__addressContainer">
                <p className='editPage__addressPar'>{data[selectedID].senderAddress_street}</p>
                <p className='editPage__addressPar'>{data[selectedID].senderAddress_city}</p>
                <p className='editPage__addressPar'>{data[selectedID].senderAddress_postCode}</p>
                <p className='editPage__addressPar'>{data[selectedID].senderAddress_country}</p>
              </div>
            </div>

            <div className="editPage__desktopMid">
              <div className="editPage__mid">
                <div className="editPage__midLeft">
                  <p className='editPage__infoHeading'>Invoice Date</p>
                  <p className='editPage__dateHeading'>{data[selectedID].createdAt}</p>
                  <p className='editPage__infoHeading'>Payment Due</p>
                  <p className='editPage__dateHeading second'>{data[selectedID].paymentDue}</p>
                </div>
                <div className="editPage__midRight">
                  <p className='editPage__infoHeading'>Bill To</p>
                  <p className='editPage__dateHeading name'>{data[selectedID].clientName}</p>
                  <div className="editPage__addressContainer">
                    <p className='editPage__addressPar'>{data[selectedID].clientAddress_street}</p>
                    <p className='editPage__addressPar'>{data[selectedID].clientAddress_city}</p>
                    <p className='editPage__addressPar'>{data[selectedID].clientAddress_postCode}</p>
                    <p className='editPage__addressPar'>{data[selectedID].clientAddress_country}</p>
                </div>
                </div>
              </div>

              <div className="editPage_midLow">
                <span>
                <p className='editPage__infoHeading'>Sent to</p>
                <p className='editPage__dateHeading email'>{data[selectedID].clientEmail}</p>
                </span>
              </div>
            </div>

            {
              (selectedItems.length > 0) ?

              <div className="editPage__bottom">
              {
                selectedItems.map((item)=>{
                  return(

                    <div className="editPage__itemContainer">
                      <div className="editPage__quantityContainer">
                        <div className="editPage__quantityContainerLeft">
                          <h3 className='editPage__quantityHeading'>{item.name}</h3>
                          <p className='editPage_quantityPar'>{item.quantity} x £ {item.price}</p>
                        </div>
                        <div className="editPage__quantityContainerRight">
                          <p className='editPage__quantityContainerAmount'>£ {item.quantity * item.price}</p>
                        </div>
                      </div>
                    </div>
                    )
                  
                })
              }

              <div className="editPage__totalContainer">
                <p className="editPage__totalHeading">Grand Total</p>
                <p className='editPage__totalAmount'>£ {data[selectedID].total}</p>
              </div>
            </div>
            :
            null
            }
          </div>
          :
          null
          }

          <footer className='editPage__footer '>
            <div className="container eFooter">
            <button className='btn btn-transparent edit' onClick={() => setUpdateForm(true)}>Edit</button>
            <button className='btn btn-red delete' onClick={() => deleteInvoice(data[selectedID].id)}>Delete</button>
              {
                (data[selectedID].status === "pending") ?
                <button className='btn btn-primary paid' onClick={() => markAsPaid()}>Mark as Paid</button>
                :
                (data[selectedID].status === "paid") ?
                <button className='btn btn-red paid' onClick={() => markAsPending()}>Mark as Pending</button>
                :
                null
              }
            </div>
          </footer>
        </div>
      </div>
  </div>
  )
}

export default Invoices