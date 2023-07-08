import React, { useState, useRef } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import './App.css';

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  const fetchResponse = async () => {
    setIsLoading(true);
    try {
      const result = await fetch('https://v30sqc3706.execute-api.us-east-1.amazonaws.com/v1/send_data', {
        method: 'POST',
        body: JSON.stringify({ text: query }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();

      setResponse(data);
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred while fetching data.');
      setIsLoading(false);
    }
  };

  const resizeInputContainer = () => {
    const inputContainer = inputRef.current;
    if (inputContainer) {
      inputContainer.style.width = `${inputContainer.scrollWidth}px`;
    }
  };

  return (
    <div className="chat-container">
      <h1 className="title">Generative AI App</h1>
      <Form className="messages" onSubmit={handleSubmit}>
        <div className='mes'>
          <Form.Label className="user-message">User message: </Form.Label>
          <Form.Control
            className="input-container"
            type="text"
            placeholder="enter text here"
            value={query}
            onChange={handleInputChange}
            ref={inputRef}
            onFocus={resizeInputContainer}
            onBlur={resizeInputContainer}
          />
        </div>
    
        <div className='but'>
          <Button variant="primary" type="submit" className="btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
          </Button>
        </div>
      </Form>

<div className='load'>
      {isLoading && <p className="loading-text">Loading</p>}</div>
      {response && (
        <Alert variant="success" className="response-alert">
          {typeof response === 'object' ? response.message : response}
        </Alert>
      )}

    </div>
  );
}

export default App;
