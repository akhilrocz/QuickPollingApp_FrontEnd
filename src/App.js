import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";

const API_URL = "https://quick-polling-app-backend-7rgy.vercel.app/polls";

const PollingApp = () => {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPolls = async () => {
    const response = await axios.get(API_URL);
    setPolls(response.data);
  };

  const createPoll = async () => {
    if (question.trim() === "" || options.some((opt) => opt.trim() === ""))
      return;
    await axios.post(API_URL, { question, options });
    setQuestion("");
    setOptions(["", ""]);
    fetchPolls();
  };

  const vote = async (pollId, optionIndex) => {
    await axios.post(`${API_URL}/${pollId}/vote`, { optionIndex });
    fetchPolls();
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Quick Polling App</h2>
      <Card className="p-3 mb-4">
        <Form>
          <Form.Group controlId="pollQuestion">
            <Form.Label>Poll Question</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Form.Group>
          {options.map((option, index) => (
            <Form.Group key={index} className="mt-2">
              <Form.Control
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
              />
            </Form.Group>
          ))}
          <Button variant="primary" className="mt-3" onClick={createPoll}>
            Create Poll
          </Button>
        </Form>
      </Card>
      <h3 className="text-center">Active Polls</h3>
      {polls.map((poll) => (
        <Card key={poll._id} className="mt-3 p-3">
          <Card.Body>
            <Card.Title>{poll.question}</Card.Title>
            {poll.options.map((option, index) => (
              <Row key={index} className="align-items-center">
                <Col>
                  {option.text} ({option.votes} votes)
                </Col>
                <Col className="text-end">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => vote(poll._id, index)}
                  >
                    Vote
                  </Button>
                </Col>
              </Row>
            ))}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default PollingApp;
