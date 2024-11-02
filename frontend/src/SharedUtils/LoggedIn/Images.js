import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate, NavLink } from "react-router-dom";

export default function Images(){
    const user = JSON.parse(localStorage.getItem('user'));

    return(
        <div className='container'>
        <div className='row'>
            <div className='col-md-3 sidenav card m-2'>
              
                
                <NavLink to="/profile" className='inactive '> Profile </NavLink>
                <NavLink to="/messages" className=' inactive'> Messages </NavLink>
                <NavLink to="/images" className='active'> Images </NavLink>
                <NavLink to="/listing" className='inactive'> Listings </NavLink>
                    
            </div>
            <div className='col-md row m-2 card'>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)', // Three images per row
                    gap: '5px'
                }}>
                {user.files && user.files.length > 0 ? (
                    user.files.map((fileUrl, index) => (
                        <div key={index} style={{ textAlign: 'center' }} className='p-2'>
                            {fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.gif') ? (
                                <img src={fileUrl} alt={`Uploaded file ${index + 1}`} style={{ width: '20vw', height: '40vh', objectFit: 'cover' }} className='rounded'/>
                            ) : (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    {`File ${index + 1}`}
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No files uploaded</p>
                )}
            </div>       
           
            </div>
        
        </div>

    </div>
    )
}