import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";


export default function List(){

    const user = JSON.parse(localStorage.getItem('user'));
    const [people, setPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const navigate = useNavigate();

    

    useEffect(() => {
        // Fetch owners only if the role is petsitter
        if (user.role === 'petsitter') {
            fetch('http://localhost:5000/owners')
                .then(response => response.json())
                .then(data => setPeople(data))
                .catch(error => console.error('Error fetching owners:', error));
        }else if(user.role === 'owner') {
            fetch('http://localhost:5000/petsitters')
                .then(response => response.json())
                .then(data => setPeople(data))
                .catch(error => console.error('Error fetching petsitters:', error));
        }
    }, [user.role]);

    // Function to open the modal with selected person details
    const openModal = (person) => {
        setSelectedPerson(person);
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

    return(
        <div className='container'>
        <div className='row'>
            <div className='col-md-3 sidenav card m-2'>
              
                
                <NavLink to="/profile" className='inactive '> Profile </NavLink>
                <NavLink to="/messages" className=' inactive'> Messages </NavLink>
                <NavLink to="/images" className='inactive'> Images </NavLink>
                <NavLink to="/listing" className='active'> Listings </NavLink>
                    
            </div>
            <div className='col-md-9 row m-2 card p-2'>
                        {people?.length> 0 ?  <h6>Listings</h6> : <p>Nobody has been listed yet</p>}
                        {people?.map((person, index) => (
                            <div key={index} className='card-selected' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }} onClick={() => openModal(person)}>
                                {/* Person Avatar */}
                                <img
                                    src={person.avatar}
                                    alt={`Person ${person.name}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginRight: '20px' }}
                                />
                                {/* Person Details */}
                                <div>
                                    <p><strong>{person.name}</strong></p>
                                    <p>Email: {person.email}</p>
                                    <p>Location: {person.city}, {person.state}</p>
                                    <p>Similar photos percentage : {(person.similarityAnalysis?.length/21 * 100).toFixed(2)} </p>
                                </div>
                            </div>
                        ))}
                   
            </div>

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
                                <p>Similar photos percentage : {(selectedPerson.similarityAnalysis?.length/21 * 100).toFixed(2)} </p>
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

    </div>
    )
}