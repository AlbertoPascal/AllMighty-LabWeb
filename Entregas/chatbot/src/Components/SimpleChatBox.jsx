import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot from "react-simple-chatbot";
import { Card, Carousel } from "react-bootstrap";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      gender: "",
      age: "",
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const { name, gender, age } = steps;

    this.setState({ name, gender, age });
  }

  render() {
    const { name, gender, age } = this.state;
    return (
      <div style={{ width: "100%" }}>
        <Carousel>
          <Carousel.Item>
            <Card bg="dark" style={{ width: "10rem" }}>
              <Card.Body>
                <Card.Title>Summary</Card.Title>
                <Card.Text>
                  Name: {name.value} <br></br>
                </Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
          <Carousel.Item>
            <Card bg="dark" style={{ width: "10rem" }}>
              <Card.Body>
                <Card.Title>Summary</Card.Title>
                <Card.Text>
                  Gender: {gender.value} <br></br>
                </Card.Text>

              </Card.Body>
            </Card>
          </Carousel.Item>
          <Carousel.Item>
            <Card bg="dark" style={{ width: "10rem" }}>
              <Card.Body>
                <Card.Title>Summary</Card.Title>
                <Card.Text>
                  Age: {age.value}
                  <br></br>
                </Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}

Review.propTypes = {
  steps: PropTypes.object,
};

Review.defaultProps = {
  steps: undefined,
};

class SimpleChatbot extends Component {
  render() {
    return (
      <ChatBot
        steps={[
          {
            id: "1",
            message: "What is your name?",
            trigger: "name",
          },
          {
            id: "name",
            user: true,
            trigger: "3",
          },
          {
            id: "3",
            message: "Hi {previousValue}! What is your gender?",
            trigger: "gender",
          },
          {
            id: "gender",
            options: [
              { value: "male", label: "Male", trigger: "5" },
              { value: "female", label: "Female", trigger: "5" },
            ],
          },
          {
            id: "5",
            message: "How old are you?",
            trigger: "age",
          },
          {
            id: "age",
            user: true,
            trigger: "7",
            validator: (value) => {
              if (isNaN(value)) {
                return "value must be a number";
              } else if (value < 0) {
                return "value must be positive";
              } else if (value > 120) {
                return `${value}? Come on!`;
              }

              return true;
            },
          },
          {
            id: "7",
            message: "Great! Check out your summary",
            trigger: "review",
          },
          {
            id: "review",
            component: <Review />,
            asMessage: true,
            trigger: "update",
          },
          {
            id: "update",
            message: "Would you like to update some field?",
            trigger: "update-question",
          },
          {
            id: "update-question",
            options: [
              { value: "yes", label: "Yes", trigger: "update-yes" },
              { value: "no", label: "No", trigger: "end-message" },
            ],
          },
          {
            id: "update-yes",
            message: "What field would you like to update?",
            trigger: "update-fields",
          },
          {
            id: "update-fields",
            options: [
              { value: "name", label: "Name", trigger: "update-name" },
              { value: "gender", label: "Gender", trigger: "update-gender" },
              { value: "age", label: "Age", trigger: "update-age" },
            ],
          },
          {
            id: "update-name",
            update: "name",
            trigger: "7",
          },
          {
            id: "update-gender",
            update: "gender",
            trigger: "7",
          },
          {
            id: "update-age",
            update: "age",
            trigger: "7",
          },
          {
            id: "end-message",
            message: "Thanks! Your data was submitted successfully!",
            //end: true,
            trigger: "message",
          },
          {
            id: "message",
            message: "Now A message from our lord and saviour the Cookie Monster:",
            trigger: "cookie",
          },
          {
            id: "message",
            component: (
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://i.pinimg.com/originals/ba/d4/83/bad4834bf2a8dda50d7435e71fe97299.jpg"
                    alt="Lord Cookie Monster"
                  />
                  <Carousel.Caption>
                    <h3>Lord Cookie Monster</h3>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="data:image/jpeg;base64,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"
                    alt="more cookies"
                  />

                  <Carousel.Caption>
                    <h3>More Cookies</h3>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://i.ytimg.com/vi/Q47iFkM3A_o/hqdefault.jpg"
                    alt="bring Cookies"
                  />

                  <Carousel.Caption>
                    <h3>Bring Me Cookies</h3>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            ),
          },
        ]}
      />
    );
  }
}


export default SimpleChatbot;