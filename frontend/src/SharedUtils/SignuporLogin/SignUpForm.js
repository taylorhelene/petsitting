import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';



export default function SignUpForm(){
    const navigate = useNavigate();
    const [avatar, setAvatar] = React.useState(`${process.env.PUBLIC_URL + '/avatar.png'}`);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        city: '',
        state: '',
        location: '',
        password: '',
        files: []
    });

    const [fileError, setFileError] = useState('');
    const [fileCount, setFileCount] = useState(0); // Counter for selected files


    // Function to handle text inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    // Function to handle multiple file input with limit for six images
    const handleMultipleFileChange = (e) => {
        const newFiles = Array.from(e.target.files); // Get the new files as an array
        const allFiles = [...formValues.files, ...newFiles]; // Merge previous files and new files
    
        if (allFiles.length > 6) {
            setFileError('You can only upload a maximum of six images.');
        } else {
            setFileError('');
            setFileCount(allFiles.length); // Update the file counter
            setFormValues({
                ...formValues,
                files: allFiles // Store all the files
            });
        }
    };    

    const [selectedRole, setSelectedRole] = useState(() => {
        // Initialize state from localStorage
        return localStorage.getItem('selectedRole') || '';
    });
    const [apiUrl, setUrl] = useState('');
    const [error, setError] = useState(null);
    
    useEffect(() => {
        // Function to fetch data based on the role
        const fetchData = async () => {
            

            if (selectedRole === 'owner') {

                setUrl('http://localhost:5000/owner');
                // Replace with your actual endpoint for owners
            } else if (selectedRole === 'petsitter') {
                setUrl('http://localhost:5000/petsitter');
                // Replace with your actual endpoint for petsitters
            } else {
                console.error('Invalid role selected');
                return; // Exit if role is invalid
            }
        };

        if (selectedRole) {
            fetchData(); // Fetch data only if a valid role is selected
        }
    }, [selectedRole]); // Run effect when selectedRole changes

    
    async function fetchItems() {
        try {
            const inputElement = document.getElementById('image-input'); // Get the input element
            const file = inputElement.files[0]; // Get the first selected file
    
             if (!file) {
                console.error('No file selected.');
                return;
            }
    
            // Create a new FormData object
            const formData = new FormData();

             // Append the six images as an array of files
             formValues.files.forEach((files, index) => {
                formData.append('files', files); // Ensure it's sent as an array
            });
            
            // Append the image file to the FormData object
            formData.append('image', file); // The name 'image' should match what your backend expects
            formData.append('name', formValues.name);
            formData.append('email', formValues.email);
            formData.append('city', formValues.city);
            formData.append('state', formValues.state);
            formData.append('location', formValues.location);
            formData.append('password', formValues.password);

            console.log(...formData)
            // Send the FormData object as a POST request
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData, // Send the FormData object
            });
    
            console.log('Response Status:', response.status);
           
            if (!response.ok) {
                const text = await response.text(); // Get the response text for debugging
                console.error('Error response:', text);
                alert('Network response was not ok')

                throw new Error('Network response was not ok');
            }

            if(response.status==200){
                alert('successfully signed up!')
                navigate("/login");
            }

            const result = await response.json(); // Assuming the response is JSON
        } catch (error) {
            console.error('Error sending image data:', error);
            alert('Error sending data')

        }
    }

    function handleChange(e) {
        console.log(e.target.files);
        setAvatar(URL.createObjectURL(e.target.files[0]));
    }



    return(
        <div className='container  border rounded p-4 '>
            <h1 className='text-center'>Sign Up</h1>
            <hr/>
            <div className='row container' >
        
                <div className='col-md' >
                    <img  src={avatar} className='avatar rounded' id='imagePreview' />
                    <input type="file" name="image" className='m-2' align="center" id="image-input" accept="image/*" onChange={handleChange}></input>
                </div>
                <div className='col-md '>
                    <div align='center' className='m-2'>
                        <label for="files" >Add six pictures. Three include you with pets. Three including you with pet foods:</label>
                        <div className='rounded m-2 p-4 border border-dotted border-2 '>
                            <input type="file" id="files" accept="image/*" name="files" multiple onChange={(e)=>handleMultipleFileChange(e)} />
                            <p>{fileCount} file(s) selected</p> {/* Display number of files selected */}
                            {fileError && <p className="text-danger">{fileError}</p>} {/* Display file limit error */}
                        </div>
                        
                        <br></br>
                    </div>
                    
                </div>
               
            </div>
           
            <div className='row ' >
                <div className='col-md-6'>
                    <label for="name">Name</label>
                    <input type="text" placeholder="Enter Full Name" name="name" id="name" required className='border-info-subtle rounded' onChange={handleInputChange}/>
                </div>
                <div className='col-md-6 '>
                    <label for="email">Email</label>
                    <input type="text" placeholder="Enter Email" name="email" id="email" required className='border-info-subtle rounded' onChange={handleInputChange}/>
                </div>
            </div>
            <div className='row' >
                <div className='col-md-6'>
                    <label for="city">City</label>
                    <input type="text" placeholder="Enter City" name="city" id="city" required className='border-info-subtle rounded' onChange={handleInputChange}/>
                </div>
                <div className='col-md-6 '>
                    <label for="state">State</label>
                    <input type="text" placeholder="Enter State" name="state" id="state" required className='border-info-subtle rounded' onChange={handleInputChange}/>
                </div>
            </div>
            <label for="location">Preference for pet sitting</label>
            <br></br>
            <select name="location" id="location" required class="border-info-subtle rounded" onChange={handleInputChange}>
                <option value="" disabled selected>Select preference</option>
                <option value="in-house">In-house</option>
                <option value="pet-sitter-house">Pet sitter's house</option>
            </select>
            <br></br>
            <label for="password">Password</label>
            <input type="password" placeholder="password" name="password" id="password" required className='border-info-subtle rounded' onChange={handleInputChange}></input>
            <hr/>
            <div align="center">
                <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>
                <button type="submit" class="text-center button btn  btn-info rounded" onClick={()=> fetchItems()}>Register</button>
    

                <div class="container signin">
                    <p>Already have an account? <a onClick={()=> navigate("/login")}>Sign in</a>.</p>
                </div>
            </div>
            
        </div>
    )
}