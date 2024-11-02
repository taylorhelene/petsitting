import 'bootstrap/dist/css/bootstrap.css';
import {  useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';


function Header(){
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const user = localStorage.getItem('user');

    // Check if user is logged in
    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        }
    }, [isLoggedIn,user]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
    };


    return(
        <div className='container '> 
           <nav className="navbar navbar-inverse ">
            <div className="container-fluid">
                <div className="navbar-brand">
                    <img src={process.env.PUBLIC_URL + '/logo.png'} /> 
                </div>
                <div className="row">
                    <p className="col-sm" onClick={()=> navigate("/")}>Home</p>
                    <p className="col-sm" onClick={()=> navigate("/petlisting")}>Our Petsitters</p>
                    <p className="col-sm" onClick={()=> navigate("/ownerlisting")}>Petsitting jobs</p>
                </div>
                <div className="navbar-nav navbar-right ">
                    <div className="flex row">
                        {/* If the user is logged in, show Logout button */}
                        {isLoggedIn ? (
                            <div className="col-sm">
                                <button className="text-nowrap btn btn-info btn-rounded rounded-pill" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            // If the user is not logged in, show Login and Sign Up buttons
                            <>
                                <div className="col-sm">
                                    <button className="text-nowrap btn btn-info btn-rounded rounded-pill" onClick={() => navigate("/login")}>
                                        Log In
                                    </button>
                                </div>
                                <div className="col-sm">
                                    <button className="text-nowrap btn btn-outline-info btn-rounded rounded-pill" onClick={() => navigate("/signup")}>
                                        Sign Up
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        </div>
    )
}

export default Header;