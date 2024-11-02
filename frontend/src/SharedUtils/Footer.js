import 'bootstrap/dist/css/bootstrap.css';
import {  useNavigate } from "react-router-dom";
import { useState } from 'react';



function Footer(){
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [name2, setName2] = useState('');
    const [email2, setEmail2] = useState('');
    const [subject2, setSubject2] = useState('');
    const [message2, setMessage2] = useState('');
    const [showModal2, setShowModal2] = useState(false);


    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleShowModal2 = () => setShowModal2(true);
    const handleCloseModal2 = () => setShowModal2(false);


    function sendMail() {
      
        // Send the complainant's details to your server (or directly to Azure if applicable)
        fetch('http://localhost:5000/api/send-complaint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, subject, message })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Success')
            handleCloseModal();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`Error:${error}`)
        });
    }

    function contactUs() {
      
        // Send the complainant's details to your server (or directly to Azure if applicable)
        fetch('http://localhost:5000/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name2, email2, subject2, message2 })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Success')
            handleCloseModal();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`Error:${error}`)
        });
    }
    

    return(
        <>
        <footer className='bg-dark-subtle row p-4 m-1 footer  '>
            <img src={process.env.PUBLIC_URL + '/logo.png'} className='col-sm-2'></img>
            <div className='col-md-3'>
                <h6>Our Services</h6>
            </div>
            <div className='col-md-3'>
                <h6>Contact</h6>
                <p onClick={handleShowModal} style={{ cursor: 'pointer' }}>Contact Us</p>
                <p onClick={handleShowModal} style={{ cursor: 'pointer' }}>Report Abuse</p>
            </div>
            <div className='col-md-3'>
                <h6>Payments</h6>
            </div>
            <hr className="rounded"></hr>
        </footer>

            {/* Contact Us Modal */}
            <div className={`modal fade ${showModal2 ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Contact Us</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal2}></button>
                        </div>
                        <div className="modal-body">
                            <form className="php-email-form">
                                <div className="row gy-4">
                                    <div className="col-md-6">
                                    <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName2(e.target.value)}
                                            className="form-control"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail2(e.target.value)}
                                            className="form-control"
                                            placeholder="Your Email"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <input
                                            value={subject} 
                                            onChange={(e) => setSubject2(e.target.value)}
                                            className="form-control"
                                            placeholder="Subject"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage2(e.target.value)}
                                            className="form-control"
                                            rows="6"
                                            placeholder="Your message"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); contactUs();} }>Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

             {/* report Modal */}
             <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Report A User</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            <form className="php-email-form">
                                <div className="row gy-4">
                                    <div className="col-md-6">
                                    <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-control"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-control"
                                            placeholder="Fraudster's/Offender's Email"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <select
                                            value={subject} 
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="form-control"
                                            required >
                                            <option value="" disabled>Select offender's group</option> 
                                            <option value="owner">Owner</option> 
                                            <option value="petsitter">Petsitter</option> 
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="form-control"
                                            rows="6"
                                            placeholder="The exact message that was sent by the user"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); sendMail();} }>Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Footer;