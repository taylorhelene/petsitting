import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate ,NavLink} from "react-router-dom";

export default function Messages(){

    const myObj = [{"John": [{"jane":{
                                    "John": "hey",
                                    "jane": " hi , how are you",
                                    "John":"lets talk"
                                }},
                                {"jay":{
                                    "John": "hey",
                                    "jay": " hi , how are you",
                                    "John":"lets talk"
                                }},
                            ]
                            }, 
                    {"Jay":{"jane":{
                                    "Jay": "hey",
                                    "jane": " hi , how are you",
                                    "Jay":"lets talk"
                                }} },
                            ];


    return(
        <div className='container'>
            <div className='row'>
                <div className='col-md-3 sidenav card m-4'>
                    <NavLink to="/profile" className='inactive '> Profile </NavLink>
                    <NavLink to="/messages" className=' active'> Messages </NavLink>
                    <NavLink to="/" className='inactive'> Images </NavLink>
                </div>
                <div className='col-md-4 sidemessage rounded border '>
                    <div className='m-0 border border-top-0 allconvosheader p-2' align='center' >
                        <p className='m-0'> All conversations </p>
                    </div>
                    
                    <div className=' p-2 m-0'>
                        {myObj[0].John.map(item=>{
                                return(
                                    <div className='row border p-2 m-1'>
                                        <img  src={process.env.PUBLIC_URL + '/signup.png'} className='messageimage col-sm' />
                                        <div className='col-sm m-0' align='right'>
                                            {Object.keys(item).map(key=>{
                                                return(
                                                    <p >{key}</p>
                                                )
                                            })}
                                        </div>
                                        
                                    </div>
                                )
                            }) 
                        }
                    </div>
                </div>

                <div className='col-md fullmessagebackground  p-0 rounded row'>
                       
                <div className="msg-header">
                    <div className="container1">
                    <img src="user1.png" className="msgimg" />
                    <div className="active">
                        <p>User name</p>
                    </div>
                    </div>
                </div>
      
                <div className="chat-page">
                    <div className="msg-inbox">
                        <div className="chats">
                            <div className="msg-page">

                                <div className="received-chats">
                                    <div className="received-chats-img">
                                        <img src="user2.png" />
                                    </div>
                                    <div className="received-msg">
                                        <div className="received-msg-inbox">
                                            <p>
                                            Hi !! This is message from Riya . Lorem ipsum, dolor sit
                                            amet consectetur adipisicing elit. Non quas nemo eum,
                                            earum sunt, nobis similique quisquam eveniet pariatur
                                            commodi modi voluptatibus iusto omnis harum illum iste
                                            distinctio expedita illo!
                                            </p>
                                            <span className="time">18:06 PM | July 24</span>
                  </div>
                </div>
              </div>
              <div className="outgoing-chats">
                <div className="outgoing-chats-img">
                  <img src="user1.png" />
                </div>
                <div className="outgoing-msg">
                  <div className="outgoing-chats-msg">
                    <p className="multi-msg">
                      Hi riya , Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Illo nobis deleniti earum magni
                      recusandae assumenda.
                    </p>
                    <p className="multi-msg">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>

                    <span className="time">18:30 PM | July 24</span>
                  </div>
                </div>
              </div>
              <div className="received-chats">
                <div className="received-chats-img">
                  <img src="user2.png" />
                </div>
                <div className="received-msg">
                  <div className="received-msg-inbox">
                    <p className="single-msg">
                      Hi !! This is message from John Lewis. Lorem ipsum, dolor
                      sit amet consectetur adipisicing elit. iste distinctio
                      expedita illo!
                    </p>
                    <span className="time">18:31 PM | July 24</span>
                  </div>
                </div>
              </div>
              <div className="outgoing-chats">
                <div className="outgoing-chats-img">
                  <img src="user1.png" />
                </div>
                <div className="outgoing-msg">
                  <div className="outgoing-chats-msg">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Velit, sequi.
                    </p>

                    <span className="time">18:34 PM | July 24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="msg-bottom">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Write message..."
              />

              <span className="input-group-text send-icon">
                <i className="bi bi-send"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    
                  </div>
            
            </div>
    
        </div>
    )
}