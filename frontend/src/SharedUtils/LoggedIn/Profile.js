import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate, NavLink  } from "react-router-dom";
import { useEffect } from 'react';


export default function Profile(){
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)

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
                        <h6>My profile: Welcome, {user.name} </h6>

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
                        
                    </div>

                    <div className='col-md-6'>
                        <div className='card p-4 m-2'>
                            <div className='row'>
                                <h6 className='col-md-9'>My Similarity results</h6>
                            </div>
                            <hr/>
                            <p>Number of similar photos: {user.similarityAnalysis?.length}</p>
                            <div>
                                <p> <strong>Similar photos data</strong></p>
                                <hr/>
                            </div>
                            {user.similarityAnalysis?.map((analysis,index)=>{
                                return(
                                    <>
                                    <p>{index+1}. </p>
                                    <p>Similarity: {analysis.similarity}</p>
                                    <p>Analysis : {analysis.result}</p>
                                    </>
                                )
                            })}

                        </div>

                    
                    </div>
                    
               
                </div>
            
            </div>
    
        </div>
    )
}