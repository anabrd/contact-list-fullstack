import './GetContact.css'

function GetContact() {


    const submitHandler = (e) => {
        e.preventDefault();

        let data = {

        };

        data.fullName = e.target[0].value;
        data.email = e.target[1].value;
        data.phone = e.target[2].value;
        data.message = e.target[3].value;

        console.log(data)

        let url = "http://localhost:8080/get-contact"
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        fetch(url, options)
        .then(result => result.json()
        .then(output => {
            if (output.status == "success") {
                alert("success");
            } else {
                alert(output.message);
            }
            console.log(data)
        }));
    }

    return (
        <div id="get-contact">
            <h1>Contact us</h1>
            <form className="contact-form" onSubmit={submitHandler}>
                <input type="text" placeholder="Full Name"></input>
                <input type="email" placeholder="Email"></input>
                <input type="tel" placeholder="Phone"></input>
                <textarea placeholder="Message"></textarea>
                <button>Get Contact</button>
            </form>
        </div>
    )
}

export default GetContact
