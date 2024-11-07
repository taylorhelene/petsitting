import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate ,NavLink} from "react-router-dom";
import { useState, useEffect } from 'react';

export default function Messages(){

    
    const [role, setRole] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [receiver, setReceiver] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [selecteduser, setSelected] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Handler to set the selected item
    const handleSelect = (index, item) => {
        setSelectedItem(index);        // Highlight selected conversation
        setSelected(item);             // Set the selected user
        
        // Set the receiver directly from item without relying on selecteduser
        const receiverData = { email: item.participantEmail };
        localStorage.setItem('receiver', JSON.stringify(receiverData));
        setReceiver(receiverData);      // Set the receiver with updated data immediately
      };

    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem('user'));


    useEffect(() => {
        // Fetch the user role and details from localStorage
        const storedReceiver = JSON.parse(localStorage.getItem('receiver'));  // Receiver for the current conversation
        const userRole = storedUser?.role || null;
        setRole(userRole);
        setCurrentUser(storedUser?.email);  // Set current user email
        setReceiver(storedReceiver || '');  // Set the receiver (if available)

        // Fetch messages for the user
        fetchMessages(storedUser?.email, storedReceiver);
    
    },[currentUser]);
  
    const fetchMessages = async (userEmail, conversationReceiver) => {
        let apiUrl = '';

        // Determine the appropriate API endpoint
        if (role === 'owner') {
            apiUrl = `http://localhost:5000/owner/get-messages/${userEmail}`;
        } else if (role === 'petsitter') {
            apiUrl =  `http://localhost:5000/petsitter/get-messages/${userEmail}`;
        }

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (result.success) {

                setMessages(result.groupedMessages);
            } else {
                alert(result.message || 'Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

   
    const handleSendMessage = async () => {
        if (!message || !receiver) {
            alert("Please enter a message and select a receiver");
            return;
        }

        const apiUrl = role === 'owner'
            ? 'http://localhost:5000/owner/add-message'
            : 'http://localhost:5000/petsitter/add-message';

        const data = {
            sender: currentUser,  // Sender's email from localStorage
            receiver: receiver.email,   // Receiver's email from localStorage or user input
            message: message      // The message content
        };

        const receiverapiUrl = role === 'owner'
            ? 'http://localhost:5000/petsitter/add-messagefromowner'
            : 'http://localhost:5000/owner/add-messagefromsitter';

        const dataurl = {
            sender: currentUser,  // Sender's email from localStorage
            receiver: receiver.email,   // Receiver's email from localStorage or user input
            message: message      // The message content
        };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                alert('Message sent successfully');
                setMessage('');  // Clear message input after sending
                fetchMessages(currentUser, receiver);  // Refresh messages after sending
            } else {
                alert(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }

        try {
          const response = await fetch(receiverapiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataurl)
          });

          const result = await response.json();
          if (result.success) {
              alert('Message sent successfully');
              setMessage('');  // Clear message input after sending
              fetchMessages(currentUser, receiver);  // Refresh messages after sending
          } else {
              alert(result.message || 'Failed to send message');
          }
      } catch (error) {
          console.error('Error sending message:', error);
      }
    };


    return(
        <div className='container'>
            <div className='row'>
                <div className='col-md-3 sidenav card mx-4'>
                    <NavLink to="/profile" className='inactive '> Profile </NavLink>
                    <NavLink to="/messages" className=' active'> Messages </NavLink>
                    <NavLink to="/images" className='inactive'> Images </NavLink>
                    <NavLink to="/listing" className='inactive'> Listings </NavLink>
                    
                </div>
                <div className='col-md-4 sidemessage rounded border p-2 '>
                    <div className='m-0 border border-top-0 allconvosheader p-2' align='center' >
                        <p className='m-0'> All conversations </p>
                    </div>
                        {messages ? messages.map((item,index)=>{
                                return(
                                    <div className={`row border p-2 m-1 ${selectedItem === index ? 'selected2' : ''}`} key={index}  onClick={() => handleSelect(index,item)} >
                                        <img  src={item.participantAvatar} className='messageimage col-sm p-2' />
                                        <div className='col-sm m-0' align='right'> 
                                          <p>{item.participantName}</p>
                                        </div>
                                        
                                    </div>
                                )
                            }) 
                        : <p> No messages</p>}
                    
                </div>

                <div className='col-md fullmessagebackground  p-0 rounded row'>       
                  <div className="msg-header p-2">
                    <img src={storedUser.avatar} className="msgimg" />
                    <div className="active">
                        <p>{storedUser.name}</p>
                    </div>
                    <div className="container1">     
                  </div>
                </div>
      
                <div className="chat-page">
                    <div className="msg-inbox">
                        <div className="chats">
                            <div className="msg-page">

                              {selecteduser?.messages.map(item=>{
                                if(item.sender!=storedUser?.email){
                                  return(
                                    <div className="received-chats">
                                      <div className="received-chats-img">
                                        <img src={selecteduser.participantAvatar} />
                                      </div>
                                      <div className="received-msg">
                                        <div className="received-msg-inbox">
                                            <p>{item.message}</p>
                                            <span className="time">{item.timestamp}</span>
                                        </div>
                                      </div>
                                  </div>
                                  )
                                }else if(item.sender==storedUser?.email){
                                  return(
                                    <div className="outgoing-chats">
                                      <div className="outgoing-chats-img">
                                        <img src={storedUser?.avatar} />
                                      </div>
                                      <div className="outgoing-msg">
                                        <div className="outgoing-chats-msg">
                                            <p>{item.message}</p>
                                            <span className="time">{item.timestamp}</span>
                                        </div>
                                      </div>
                                  </div>
                                  )
                                }
                              })}

              
            </div>
          </div>


                <div className="msg-bottom">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />

                      <span className="input-group-text send-icon" onClick={handleSendMessage}>
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