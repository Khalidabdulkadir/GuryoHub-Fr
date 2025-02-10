import React from "react";
import { Accordion, Card } from "react-bootstrap";
import "./Faqs.css";

const FaQsComponent = () => { // Change FAqs to FAQs
  // Sample FAQ data
  const faqs = [
    {
      question: "How do I list my property for sale or rent?",
      answer:
        "To list your property, sign up for an account, go to the 'List Property' section, and fill out the required details. Once submitted, our team will review and publish your listing.",
    },
    {
      question: "What fees are involved in listing a property?",
      answer:
        "Listing a property is free. However, we charge a small commission once the property is successfully sold or rented through our platform.",
    },
    {
      question: "How can I contact a property owner or agent?",
      answer:
        "You can contact the property owner or agent directly through the contact information provided on the property listing page.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Yes, we take your privacy seriously. Your personal information is encrypted and only shared with relevant parties when necessary.",
    },
    {
      question: "Can I schedule a property viewing online?",
      answer:
        "Yes, you can schedule a property viewing directly through the property listing page. Simply click the 'Schedule Viewing' button and choose a convenient time.",
    },
  ];

  return (
    <div className="faqs-section my-5">
      <h2 className="text-center mb-4">Frequently Asked Questions</h2>
      <Accordion defaultActiveKey="0">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
              <h5 className="mb-0">{faq.question}</h5>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>{faq.answer}</Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default FaQsComponent; // Change FAqs to FAQs