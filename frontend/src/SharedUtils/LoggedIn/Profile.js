import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate, NavLink  } from "react-router-dom";
import { useEffect } from 'react';


export default function Profile(){
    const user = JSON.parse(localStorage.getItem('user'));

    return(
        <div className='container'>
            <div className='row'>
                <div className='col-md-3 sidenav card m-2'>
                  
                    
                    <NavLink to="/profile" className='active '> Profile </NavLink>
                    <NavLink to="/messages" className=' inactive'> Messages </NavLink>
                    <NavLink to="/images" className='inactive'> Images </NavLink>
                    <NavLink to="/listing" className='inactive'> Listings </NavLink>
                    
                </div>
                <div className='col-md-9 row m-2 '>
                    
                    <div className='card col-md-6  p-4'>
                        <div align="center" className='p-0 m-0'>
                            <img className='profile rounded' src={user.avatar} alt="User Avatar" />
                        </div>
                        <p>My profile: Welcome, {user.name} </p>

                        <div className='row'>
                            <div className='col-sm'>
                                <p>City: {user.city}</p>
                                <hr></hr>
                            </div>
                            <div className='col-sm'>
                                <p>State: {user.state}</p>
                                <hr></hr>
                            </div>
                        </div>
                        <p>Email: {user.email}</p>
                        <hr></hr>
                        <p>Preference: {user.preference}</p>
                        <hr></hr>
                        <div align="center">
                            <button className='btn btn-info btn-rounded rounded' align='center'> Edit </button>
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className='card p-4 m-2'>
                            <div className='row'>
                                <p className='col-md-9'>My messages</p>
                                <button className=' btn btn-info btn-rounded rounded col-sm-3'>View</button>
                            </div>
                            <div id="reportContainer" style={{ height: '500px' }}></div>
                            <hr/>
                        </div>

                        <div className='card p-4 m-2'>
                            <div className='row'>
                                <p className='col-md-9'>My messages</p>
                                <button className=' btn btn-info btn-rounded rounded col-sm-3'>View</button>
                            </div>
                            <hr/>
                        </div>
                    </div>
                    
               
                </div>
            
            </div>
    
        </div>
    )
}