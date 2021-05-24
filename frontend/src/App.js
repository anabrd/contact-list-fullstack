import { useState, useEffect } from 'react';
import './App.css';
import Card from './Card'

function App() {

  const [form, setForm] = useState({fullName: '', email: '', phone: '', address:''});
  const [contacts, setContacts] = useState([{fullName: '', email: '', phone: '', address:''}]);
  const [message, setMessage] = useState(null);
  const [picture, setPicture] = useState();

  useEffect(() => {
    let storedContact = JSON.parse(localStorage.getItem("contact"));
    if (storedContact) {
        setForm(storedContact);
    }}, []);

    useEffect(() => {
      const url = 'http://localhost:8080/contacts/all';
      fetch(url).then(data => data.json().then(
        contacts => setContacts(contacts)))
    }, []);


  const deleteContactHandler = (id) => {
    // creating an url parametrically with the id
    const url = 'http://localhost:8080/contacts/' + id;
    const options = {
      method: 'DELETE'
    }

    fetch(url, options).then(response => response.json().then(output => {

      if (output.status == "success") {
        setMessage(output.message);
        setTimeout(()=> setMessage(null), 3000);
        let newList = contacts.filter(contact => {
          if (contact._id != output.data) {
            return contact;
          }
        })
        setContacts(newList);
      } else {
        alert("There was an error!");
        setMessage(output.message);
        setTimeout(()=> setMessage(null), 3000);
        console.log(output.message);
      }
    }))
    .catch(err => {
      alert(err);
    })
  }

  // function with bind method would be {deleteContactHandler.bind(this, contact._id)}
  const cards = contacts.map(contact => <Card 
    key={contact._id} 
    contact = {contact} 
    deleteContact = {() => deleteContactHandler(contact._id)}
    message = {message}
    setMessage = {setMessage} />)

  const fillForm = (e, field) => {
    let newForm = {...form}
    newForm[field] = e.target.value;
    setForm(newForm);
    localStorage.setItem("contact", JSON.stringify(newForm));
  }

  // old addcontact form
  // const formSubmitHandler = (e) => {
  //   e.preventDefault();
  //   const url = 'http://localhost:8080/contacts/new';
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(form)
  //   }
  //   fetch(url, options)
  //   .then(data => data.json().then(output => {
    
  //     if (output.status == "success") {
  //       setMessage(output.message);
  //       setTimeout(()=> setMessage(null), 3000);
  //       setContacts([...contacts, form])
  //     } else {
  //       setMessage(output.message);
  //       setTimeout(()=> setMessage(null), 3000);
  //       console.log(output.message);
  //     }}))
  // };

  const changePicture = (e) => {
        setPicture(e.target.files[0]);
  }

  const addContact = (e) => {
        e.preventDefault();
      
        const formData = new FormData();
        formData.append('contactPic', picture);
        formData.append('fullName', form.fullName);
        formData.append('email', form.email);
        formData.append('phone', form.phone);
        formData.append('address', form.address);

        const url = 'http://localhost:8080/contacts/add';
        const options = {
        method: 'POST',
        body: formData
        }

        fetch(url, options)
        .then(data => data.json().then(output => {
            if (output.status === "success") {
                setMessage(output.message);
                setTimeout(()=> setMessage(null), 3000);
                setContacts([...contacts, output.data])
            } else {
                setMessage(output.message)
            }
        }))
    }


  return (
    <div className="App">
      <section>
        <form className="form" onSubmit = {addContact}>
          <h1>Contacts</h1>
          <input type="text" placeholder="Full Name" value= {form.fullName} required onChange = {(e) => fillForm(e, 'fullName')}/>
          <input type="email" placeholder="Email" value= {form.email} onChange = {(e) => fillForm(e, 'email')}/>
          <input type="tel" placeholder="Phone Number" value= {form.phone} onChange = {(e) => fillForm(e, 'phone')}/>
          <input type="text" placeholder="Address" value= {form.address} onChange = {(e) => fillForm(e, 'address')}/>
          <input type="file" onChange={changePicture}></input>
          <button>Create contact</button>
        </form>
      </section>

      <section className = "card-wrapper">
        <h4 className={message ? "message" : null}>{message}</h4>
        {cards}
      </section>
    </div>
  );
}

export default App;