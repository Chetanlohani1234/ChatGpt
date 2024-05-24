import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '@/styles/RightSections.css';
import AuthService from '../Services/auth.service';

const RightSections = () => {

  const [userMessages,setUserMessages] = useState([]);
  const [assistantMessages,setAssistantMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [token, setToken] = useState(''); // Assume token is set somehow, maybe after login
  const [userId, setUserId] = useState(1); // Example user_id
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const [conversationHistory, setConversationHistory] = useState([]);

   // Retrieve the token from localStorage on component mount
  //  useEffect(() => {
  //   const storedToken = AuthService.getCurrentToken();
  //   setToken(storedToken);
  // }, []);

    // Retrieve the token from localStorage on component mount
    useEffect(() => {
      const storedToken = localStorage.getItem("token")
      setToken(storedToken);
    }, []);

    useEffect(() => {
      const fetchConversationHistory = async () => {
        const apiUrl = 'https://api-es5l.onrender.com/get-chat'; // Your API endpoint for fetching history
         
         
        try {
          const response = await axios.post(apiUrl, {
            token,
            user_id: userId,
            prompt: ""
          });
    
          if (response.data && response.data.response) {
            const apiMessage = response.data.response;
            const { user, conversation_history, response: assistantResponse } = apiMessage;
    
            console.log("API Response Data:", apiMessage);
    
            // Initialize conversation history if it's null or undefined
            setConversationHistory(conversation_history || []);
    
            // Check if user content is not null or empty
            if (inputMessage && inputMessage.trim() !== '') {
              // Add the new user and assistant response to the conversation history
              setConversationHistory(prevHistory => [
                ...prevHistory,
                { role: 'user', content: inputMessage },
                { role: 'assistant', content: assistantResponse }
              ]);
            }
          } else {
            console.error('Error: No response from API');
          }
        } catch (error) {
          console.error('Error fetching conversation history:', error);
        }
      };
    
      fetchConversationHistory();
    }, [token, userId]);
    
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }, [conversationHistory, messages]);
 
    const streamResponse = (responseText) => {
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < responseText.length) {
          setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const newText = lastMessage.from === 'api' ? lastMessage.text + responseText[currentIndex] : responseText[currentIndex];
            return [
              ...prevMessages.slice(0, -1),
              { from: 'api', text: newText }
            ];
          });
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50); // Adjust the speed as needed
    };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const prompt = inputMessage;
    const apiUrl = 'https://api-es5l.onrender.com/get-chat'; // Your API endpoint
    //const timestamp = new Date().toLocaleTimeString();

    try {
      const response = await axios.post(apiUrl, {
        token,
        user_id: userId,
        prompt
      });

      if (response.data && response.data.response) {

        const apiMessage = response.data.response;

       
        setMessages([...messages, { from: 'user', text: inputMessage }, { from: 'api', text: ''}]);
        setInputMessage('');
        streamResponse(apiMessage.response);


      } else {
        console.error('Error: No response from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };



  return (
    <>
      <link
        href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <title>Chat</title>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
        integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
        integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css"
      />
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-12 col-xl-9 chat">
            <div className="card">
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight">
                  <div className="user_info">
                    <span>Root AI</span>
                  </div>
                </div>
              </div>
              <div className="card-body msg_card_body">


              {/* {conversationHistory.map((msg, index) => (
      msg.content && msg.content.trim() !== '' && (
        <div key={index} className={`d-flex justify-content-${msg.role === 'user' ? 'end' : 'start'} mb-4`}>
          <div className={`msg_cotainer${msg.role === 'user' ? '_send' : ''}`}>
            {msg.content}
            <span className={`msg_time${msg.role === 'user' ? '_send' : ''}`}>Now</span>
          </div>
        </div>
      )
    ))}
     */}
                    

    {conversationHistory.map((msg, index) => {
      // Check if current message is from the user and has content
      const currentUserMessage = msg.role === 'user' && msg.content && msg.content.trim() !== '';
      const nextMessage = conversationHistory[index + 1];
      const nextAssistantMessage = nextMessage && nextMessage.role === 'assistant' && nextMessage.content && nextMessage.content.trim() !== '';

      // Only render both messages if the user message has content
      if (currentUserMessage && nextAssistantMessage) {
        return (
          <React.Fragment key={index}>
            <div className={`d-flex justify-content-${msg.role === 'user' ? 'end' : 'start'} mb-4`}>
              <div className={`msg_cotainer${msg.role === 'user' ? '_send' : ''}`}>
                {msg.content}
                <span className={`msg_time${msg.role === 'user' ? '_send' : ''}`}> {new Date(msg.timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <div className={`d-flex justify-content-${nextMessage.role === 'user' ? 'end' : 'start'} mb-4`}>
              <div className={`msg_cotainer${nextMessage.role === 'user' ? '_send' : ''}`}>
                {nextMessage.content}
                <span className={`msg_time${nextMessage.role === 'user' ? '_send' : ''}`}> {new Date(msg.timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </React.Fragment>
        );
      }
      return null;
    })}
                    {messages.map((msg, index) => (
                      <div key={index} className={`d-flex justify-content-${msg.from === 'user' ? 'end' : 'start'} mb-4`}>
                        <div className={`msg_cotainer${msg.from === 'user' ? '_send' : ''}`}>
                          {msg.text}
                          <span className={`msg_time${msg.from === 'user' ? '_send' : ''}`}>{Now}</span>
                       </div>
                      </div>
                    ))}

                  <div ref={chatEndRef} />

              </div>
              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text attach_btn">
                      <i className="fas fa-paperclip" />
                    </span>
                  </div>
                  <textarea
                    ref={inputRef}
                    name=""
                    className="form-control type_msg"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text send_btn" 
                    onClick={handleSendMessage}
                    >
                      <i className="fas fa-location-arrow" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSections;

