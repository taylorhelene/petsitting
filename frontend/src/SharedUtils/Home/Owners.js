import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Owners() {
    const [people, setPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/owners')
            .then(response => response.json())
            .then(data => setPeople(data))
            .catch(error => console.error('Error fetching owners:', error));
    }, []);
    console.log(people);

    // Function to open the modal with selected person details if user is logged in
    const openModal = (person) => {
        if (localStorage.getItem('user')) {
            setSelectedPerson(person);
        } else {
            navigate('/signup');  // Redirect to signup if not logged in
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setSelectedPerson(null);
    };

    // Function to save the selected person in localStorage and navigate to messages page
    const goToMessages = (person) => {
        localStorage.setItem('receiver', JSON.stringify(person));  // Save the person details in localStorage
        navigate('/messages');  // Navigate to the messages page
    };

    return (
        <div className='container border m-2 p-2'> 
            <div align='center'>
                <h6>Here is the list of Petsitting Job Offers</h6>
            </div>
            {people?.map((person, index) => (
                <div key={index} className='card-selected p-2' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }} onClick={() => openModal(person)}>
                    
                    <h6 className='m-2 '>{index+1}. </h6>
                    <img
                        src={person.avatar}
                        alt={`Person ${person.name}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginRight: '20px' }}
                    />
                    <div>
                        <p>Pet Owner: <strong>{person.name}</strong></p>
                        <p>Preference: {person.preference}</p>
                    </div>

                </div>
            ))}

            {/* Modal for displaying person details */}
            {selectedPerson && (
                <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedPerson.name}'s Details</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <img src={selectedPerson.avatar} className="modal-avatar" alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                <p><strong>Email:</strong> {selectedPerson.email}</p>
                                <p><strong>Location:</strong> {selectedPerson.city}, {selectedPerson.state}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => goToMessages(selectedPerson)}
                                >
                                    Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}