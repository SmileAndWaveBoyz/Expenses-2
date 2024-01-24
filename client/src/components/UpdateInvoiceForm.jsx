import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

function UpdateInvoiceForm(props) {

    const [errors, setErrors] = useState(null)
    const senderAddressStreetRef = useRef(null)
    const senderAddressCityRef = useRef(null)
    const senderAddressPostCodeRef = useRef(null)
    const senderAddressCountryRef = useRef(null)
    const clientsNameRef = useRef(null)
    const clientsEmailRef = useRef(null)
    const clientAddressStreetRef = useRef(null)
    const clientAddressCityRef = useRef(null)
    const clientAddressPostCodeRef = useRef(null)
    const clientAddressCountryRef = useRef(null)
    const invoiceDateRef = useRef(null)
    const paymentTermsRef = useRef(null)
    const projectDescriptionRef = useRef(null)
    

    const { updateForm, setUpdateForm, refresh, setRefresh, setSelectedData, selectedData, selectedItems} = useStateContext()
    const [newFormPosition, setNewFormPosition] = useState(window.innerWidth)  

    const [items, setItems] = useState([
        { name: '', quantity: '', price: ''},
      ]);
    
    function handleItemChange(index, field, value) {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index][field] = value;
            return updatedItems;
        });
    }

    function handleAddItem() {
        setItems((prevItems)=>{
            return [...prevItems, { name: '', quantity: '', price: ''}]
        })
    }

    function handleDeleteItem(index) {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems.splice(index, 1);
            return updatedItems;
        });
    }
    
    useEffect(() => {

      if (updateForm) {
        setNewFormPosition(0)
      } else{
        setNewFormPosition(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)
      function handleResize() {
        if (updateForm) {
            setNewFormPosition(0)
          } else{
            setNewFormPosition(window.innerWidth)
          }
      }

      
      

        clientAddressCityRef.current.value = selectedData.clientAddress_city
        clientAddressCountryRef.current.value = selectedData.clientAddress_country
        clientAddressPostCodeRef.current.value = selectedData.clientAddress_postCode
        clientAddressStreetRef.current.value = selectedData.clientAddress_street
        clientsEmailRef.current.value = selectedData.clientEmail
        clientsNameRef.current.value = selectedData.clientName
        invoiceDateRef.current.value = selectedData.createdAt
        projectDescriptionRef.current.value = selectedData.description
        paymentTermsRef.current.value = selectedData.paymentTerms
        senderAddressCityRef.current.value = selectedData.senderAddress_city
        senderAddressCountryRef.current.value = selectedData.senderAddress_country
        senderAddressPostCodeRef.current.value = selectedData.senderAddress_postCode
        senderAddressStreetRef.current.value = selectedData.senderAddress_street

      setItems(selectedItems)
    
      return () => {
        window.removeEventListener('resize', handleResize)
      };

    }, [updateForm])

    function goBack() {
        setUpdateForm(false)
    }
    

    function draft(event) {
        event.preventDefault();
    
        const payload = {
            clientAddress_city: clientAddressCityRef.current.value,
            clientAddress_country: clientAddressCountryRef.current.value,
            clientAddress_postCode: clientAddressPostCodeRef.current.value,
            clientAddress_street: clientAddressStreetRef.current.value,
            clientEmail: clientsEmailRef.current.value,
            clientName: clientsNameRef.current.value,
            createdAt: invoiceDateRef.current.value,
            description: projectDescriptionRef.current.value,
            paymentTerms: paymentTermsRef.current.value,
            senderAddress_city: senderAddressCityRef.current.value,
            senderAddress_country: senderAddressCountryRef.current.value,
            senderAddress_postCode: senderAddressPostCodeRef.current.value,
            senderAddress_street: senderAddressStreetRef.current.value,
            status: "draft",
            items: items
        };
    
        setErrors(null);
        console.log(selectedData.id);
    
        axiosClient.put(`/updateDraft/${selectedData.id}`, payload)
            .then(({ data }) => {
                console.log(data);
                setUpdateForm(false);
                refreshForm();
                if (!refresh) {
                    setRefresh(true);
                } else {
                    setRefresh(false);
                }
            })
            .catch((error) => {
                const response = error.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        console.log("Error");
                        // console.log(response.data.errors);
                        setErrors(response.data.errors);
                    }
                }
            });
    }

    function onSubmit(event) {
        event.preventDefault();
    
        const payload = {
            clientAddress_city: clientAddressCityRef.current.value,
            clientAddress_country: clientAddressCountryRef.current.value,
            clientAddress_postCode: clientAddressPostCodeRef.current.value,
            clientAddress_street: clientAddressStreetRef.current.value,
            clientEmail: clientsEmailRef.current.value,
            clientName: clientsNameRef.current.value,
            createdAt: invoiceDateRef.current.value,
            description: projectDescriptionRef.current.value,
            paymentTerms: paymentTermsRef.current.value,
            senderAddress_city: senderAddressCityRef.current.value,
            senderAddress_country: senderAddressCountryRef.current.value,
            senderAddress_postCode: senderAddressPostCodeRef.current.value,
            senderAddress_street: senderAddressStreetRef.current.value,
            status: "pending",
            items: items
        };
    
        setErrors(null);
        console.log(selectedData.id);
    
        axiosClient.put(`/invoices/${selectedData.id}`, payload)
            .then(({ data }) => {
                console.log(data);
                setUpdateForm(false);
                refreshForm();
                if (!refresh) {
                    setRefresh(true);
                } else {
                    setRefresh(false);
                }
            })
            .catch((error) => {
                const response = error.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        console.log("Error");
                        // console.log(response.data.errors);
                        setErrors(response.data.errors);
                    }
                }
            });
    }
    

    function refreshForm() {
        clientAddressCityRef.current.value = ""
        clientAddressCountryRef.current.value = ""
        clientAddressPostCodeRef.current.value = ""
        clientAddressStreetRef.current.value = ""
        clientsEmailRef.current.value = ""
        clientsNameRef.current.value = ""
        invoiceDateRef.current.value = ""
        projectDescriptionRef.current.value = ""
        paymentTermsRef.current.value = ""
        senderAddressCityRef.current.value = ""
        senderAddressCountryRef.current.value = ""
        senderAddressPostCodeRef.current.value = ""
        senderAddressStreetRef.current.value = ""

        setItems([{name: "", quantity: "", price: ""}])
    }

    

  return (
    <>
        <div className="blackBox update" style={updateForm ? {display: "block"} : {display: "none"}} onClick={goBack}></div>
        <div className='nForm update' style={{transform: `translateX(-${newFormPosition}px)`}}>
            <div className="nForm__Padding container">
                <button onClick={goBack} className='nForm__backButton'> <svg className='nForm__backButtonSVG'  width="6" height="11" viewBox="0 0 6 11" fill="none">  <path d="M4.3418 0.885742L0.113895 5.11364L4.3418 9.34155" stroke="#7C5DFA" stroke-width="2"/></svg>Go back</button>
                <h1 className='nForm__header'>Update Invoice</h1>

                <form className='nForm_form' >

                <h2 className='nForm__header2'>Bill From</h2>
                <div className="form-group">
                    <label>Street address</label>
                    <input type="text" className="form-control" ref={senderAddressStreetRef} autoFocus/>
                    {
                    (errors && errors.senderAddress_street) ?
                    <p class="errorMessage">{errors.senderAddress_street}</p>
                    :
                    null
                    }
                </div>
                <div className="row">
                    <div className="form-group col">
                        <label>City</label>
                        <input type="text" className="form-control" ref={senderAddressCityRef}/>
                        {
                        (errors && errors.senderAddress_city) ?
                        <p class="errorMessage">{errors.senderAddress_city}</p>
                        :
                        null
                    }
                    </div>
                    <div className="form-group col">
                        <label>Post Code</label>
                        <input ref={senderAddressPostCodeRef} type="text" className="form-control" />
                        {
                            (errors && errors.senderAddress_postCode) ?
                            <p class="errorMessage">{errors.senderAddress_postCode}</p>
                            :
                            null
                        }
                    </div>
                    <div className="form-group col-md">
                        <label>Country</label>
                        <input ref={senderAddressCountryRef} type="text" className="form-control"/>
                        {
                            (errors && errors.senderAddress_country) ?
                            <p class="errorMessage">{errors.senderAddress_country}</p>
                        :
                        null
                        }
                    </div>
                </div>


                <h2 className='nForm__header3'>Bill To</h2>

                <div className="form-group">
                    <label>Client's name</label>
                    <input ref={clientsNameRef} type="text" className="form-control"/>
                    {
                        (errors && errors.clientName) ?
                        <p class="errorMessage">{errors.clientName}</p>
                        :
                        null
                    }
                </div>

                <div className="form-group">
                    <label>Client's Email</label>
                    <input ref={clientsEmailRef} type="email" className="form-control"/>
                    {
                    (errors && errors.clientEmail) ?
                    <p class="errorMessage">{errors.clientEmail}</p>
                    :
                    null
                    }
                </div>

                <div className="form-group">
                    <label>Street Address</label>
                    <input ref={clientAddressStreetRef} type="text" className="form-control"/>
                    {
                    (errors && errors.clientAddress_street) ?
                    <p class="errorMessage">{errors.clientAddress_street}</p>
                    :
                    null
                    }
                </div>

                <div className="row">
                    <div className="form-group col">
                        <label>City</label>
                        <input  type="text" className="form-control" ref={clientAddressCityRef}/>
                        {
                        (errors && errors.clientAddress_city) ?
                        <p class="errorMessage">{errors.clientAddress_city}</p>
                        :
                        null
                    }
                    </div>
                    <div className="form-group col">
                        <label>Post Code</label>
                        <input ref={clientAddressPostCodeRef} type="text" className="form-control" />
                        {
                            (errors && errors.clientAddress_postCode) ?
                            <p class="errorMessage">{errors.clientAddress_postCode}</p>
                            :
                            null
                        }
                    </div>
                <div className="form-group col-md">
                    <label>Country</label>
                    <input ref={clientAddressCountryRef} type="text" className="form-control"/>
                    {
                    (errors && errors.clientAddress_country) ?
                    <p class="errorMessage">{errors.clientAddress_country}</p>
                    :
                    null
                    }
                </div>
                </div>


                <div className="form-group">
                    <label>Invoice Date</label>
                    <input ref={invoiceDateRef} type="date" className="form-control"/>
                    {
                        (errors && errors.createdAt) ?
                        <p class="errorMessage">{errors.createdAt}</p>
                        :
                        null
                    }
                </div>

                <div className="form-group">
                    <label>Payment Terms</label>
                    <select ref={paymentTermsRef} className="form-control" name="cars" id="cars">
                        <option value="1">Net 1 Day</option>
                        <option value="7">Net 7 Day</option>
                        <option value="14">Net 14 Day</option>
                        <option value="30">Net 30 Day</option>
                    </select>
                    {
                    (errors && errors.paymentTerms) ?
                    <p class="errorMessage">{errors.paymentTerms}</p>
                    :
                    null
                    }
                </div>

                <div className="form-group">
                    <label>Project Description</label>
                    <input ref={projectDescriptionRef} type="text" className="form-control"/>
                    {
                        (errors && errors.description) ?
                        <p class="errorMessage">{errors.description}</p>
                        :
                        null
                    }
                </div>

                <h2 className='nForm__ItemHeader'>Item List</h2>
                {
                    items.map((item, index)=>{
                        return (
                            <div>
                                <div className="form-group">
                                    <label>Item Name</label>
                                    <input type="text" className="form-control" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)}/>
                                    {
                                    (errors && !item.name) ? 
                                    
                                    <p className="errorMessage">Required</p>
                                    
                                    : null

                                    }
                                </div>

                                <div className="row">
                                    <div className="form-group col">
                                        <label>Qty.</label>
                                        <input type="text" className="form-control" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}/>
                                        {
                                        (errors && !item.quantity) ? 
                                        
                                        <p className="errorMessage">Required</p>
                                        
                                        : null

                                        }
                                    </div>
                                    <div className="form-group col">
                                        <label>Price</label>
                                        <input type="text" className="form-control" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)}/>
                                        {
                                        (errors && !item.price) ? 
                                        
                                        <p className="errorMessage">Required</p>
                                        
                                        : null

                                        }
                                    </div>
                                    <div className="form-group col">
                                        <label>Total</label>
                                        <div className="nForm__totalContainer">
                                            <p className='nForm__total'>{items[index].price * items[index].quantity}</p>
                                        </div>
                                    </div>
                                    <div className="form-group col">
                                    <div className="nForm__space"></div>
                                        <div className="nForm__deleteContainer">
                                            <button onClick={() => handleDeleteItem(index)} className='nForm__deleteButton'><svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 13 16" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.44442 0L9.33333 0.888875H12.4444V2.66667H0V0.888875H3.11108L4 0H8.44442ZM2.66667 16C1.68442 16 0.888875 15.2045 0.888875 14.2222V3.55554H11.5555V14.2222C11.5555 15.2045 10.76 16 9.77779 16H2.66667Z" fill="#888EB0"/></svg></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </form>
                <button onClick={handleAddItem} className='btn btn-transparent nForm__addButton'>+ Add New Item</button>
            </div>
            <div className="nForm__rectangle"> </div>
            <div className="nForm__Padding nForm_row container">
                <button className='btn btn-transparent nForm__discardButton '>Discard</button>
                <button className='btn btn-dark nForm__saveButton ' onClick={draft}>Save as Draft</button>
                <button className='btn btn-primary nForm__sendButton' onClick={onSubmit}>Save & Send</button>
            </div>
        </div>
    </>
  )
}

export default UpdateInvoiceForm