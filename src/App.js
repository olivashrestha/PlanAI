import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import './App.css';

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryChosen, setCategoryChosen] = useState("");
  const [bodySent, setBodySent] = useState("");

  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setCategoryChosen(category);
  };

  const handleBodySentClick = (bodyText) => {
    setBodySent(bodyText);
  };

  useEffect(() => {
    // Listen for changes in bodySent and autofill the input container
    if (bodySent) {
      setQuery(bodySent);
    }
  }, [bodySent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  const fetchResponse = async () => {
    setIsLoading(true);
    try {
      const result = await fetch('https://hcw61bujfe.execute-api.us-east-1.amazonaws.com/v1/send_data', {
        method: 'POST',
        body: JSON.stringify({ body: query, category: categoryChosen }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();

     

      setResponse(data);
      setIsLoading(false);
      console.log('Response:', data);
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

  const handleStartNew = () => {
    const confirmReset = window.confirm("Are you sure? All your data will be lost.");
    if (confirmReset) {
      window.location.reload(); // Reload the page
    }
  };

  return (
    <div className="chat-container">
      <h1 className="title">Plan AI App</h1>
      <Form className="messages" onSubmit={handleSubmit}>
        <div className='category-buttons'>
          <Button
            variant="primary"
            onClick={() => handleCategoryClick("Classes")}
            disabled={categoryChosen !== "Classes" && categoryChosen !== ""}
            className={categoryChosen === "Classes" ? "selected" : ""}
          >
            Classes
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCategoryClick("Vacation")}
            disabled={categoryChosen !== "Vacation" && categoryChosen !== ""}
            className={categoryChosen === "Vacation" ? "selected" : ""}
          >
            Vacation
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCategoryClick("Weekend")}
            disabled={categoryChosen !== "Weekend" && categoryChosen !== ""}
            className={categoryChosen === "Weekend" ? "selected" : ""}
          >
            Weekend
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCategoryClick("Selfcare")}
            disabled={categoryChosen !== "Selfcare" && categoryChosen !== ""}
            className={categoryChosen === "Selfcare" ? "selected" : ""}
          >
            Selfcare
          </Button>
        </div>


        <div className='mes'>
          <Form.Label className="user-message">User message:</Form.Label>
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

        {bodySent === "" && (
          <div className='body-sent-buttons'>
            <Button
              variant="primary"
              onClick={() => handleBodySentClick("I want to plan a wedding")}
              disabled={bodySent === "I want to plan a wedding"}
            >
              I want to plan a wedding
            </Button>
            <Button
              variant="primary"
              onClick={() => handleBodySentClick("I have a week to do things")}
              disabled={bodySent === "I have a week to do things"}
            >
              I have a week to do things
            </Button>
            <Button
              variant="primary"
              onClick={() => handleBodySentClick("I want to add more sleep")}
              disabled={bodySent === "I want to add more sleep"}
            >
              I want to add more sleep
            </Button>
          </div>
        )}


        <div className='but'>
          <Button variant="primary" type="submit" className="btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
          </Button>
        </div>
      </Form>

      <div className='load'>
         {isLoading && <p className="loading-text">Loading</p>}
      </div>
      {response && (
      <Alert variant="success" className="response-alert">
         {typeof response === 'object' ? (
            <div dangerouslySetInnerHTML={{ __html: JSON.stringify(response.body.replace(/\\n\\n/g, '<br><br>').replace(/\"/g, '')) }} />
         ) : (
         response
        )}
      </Alert>
      )}



    <div className='start-new-button'>
        <Button variant="primary" onClick={handleStartNew}>
          Start New
        </Button>
    </div>
    </div>

  );
  
}

export default App;
