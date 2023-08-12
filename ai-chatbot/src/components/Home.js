import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import ai from "../assets/images/ai-avatar.svg";
import user from "../assets/images/user-avatar.svg";


function Home({height}) {
    const [inputValue, setInputValue] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }]);
            sendMessage(inputValue);
            setInputValue('');
        }
    };
    const api_key=process.env.REACT_APP_API_KEY;

    const sendMessage = async (message) => {
        const url = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            "Content-type": "application/json",
            "Authorization": `Bearer ${api_key}`
        };
        const data = {
            model: "gpt-3.5-turbo-0613",
            messages: [{ "role": "user", "content": message }],
        };
    
        setIsLoading(true);
    
        try {
            const response = await axios.post(url, data, { headers: headers });
            const aiMessage = response.data.choices[0].message.content;
    
            setChatLog((prevChatLog) => [
                ...prevChatLog,
                { type: 'ai', message: aiMessage, isError: false } // No error, so isError is false
            ]);
    
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            
            // Handle error message and set it with red color
            setChatLog((prevChatLog) => [
                ...prevChatLog,
                { type: 'ai', message: "Request failed, API key unavailable for security reasons", isError: true }
            ]);
    
            setIsLoading(false);
        }
    };
    
    const userInputElement = useRef(null);

    // Function to scroll to the user-input div
    const scrollToUserInput = () => {
        if (userInputElement.current) {
            userInputElement.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    };

    useEffect(() => {
        // Scroll to user-input div whenever chatLog updates
        scrollToUserInput();
    }, [chatLog]);

    return (
        
            <Container className="d-flex flex-column" fluid style={{ height:`calc(100vh - ${height}px)`}}>
                
                <div className="flex-grow-1 px-3 py-4 d-flex flex-column" style={{width:'100%',  overflowY: 'auto'}}>
                    {chatLog.map((message, index) => (
                        <div key={index} className={`message ${message.type === 'ai' ? 'ai-message' : 'user-message'} ${message.isError ? 'error-message' : ''}`}
    
                        
                        >
                        <span className="align-self-center">
                          <img
                            src={message.type === 'ai' ? ai : user}
                            alt={message.type === 'ai' ? 'AI' : 'user'}
                            style={{
                              width: '30px',
                              height: '30px',
                              objectFit: 'cover',
                              borderRadius: '50%', // Make it circular
                              border: index % 2 === 0 ? '1px solid #92348C' : 'none' // Border for even indexes
                            }}
                          />
                        </span>
                        <div className={`speech-bubble p-2 ${message.type === 'ai' ? 'text-start' : 'text-end'}`}>
                          {message.message}
                        </div>
                      </div>
                      
                    ))}

                    <div className="flex-grow-1"></div>
                    <div ref={userInputElement} className='user-input'>
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type='text'
                                            placeholder='Type your message...'
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className='input-field'
                                        />
                                        <button type='submit' className='send-button' disabled={isLoading ? true : false }>{isLoading ? 'Loading...' : 'Send'}</button>
                                    </form>
                                    </div>
                </div>

                
            </Container>
        
    );
}

export default Home;
