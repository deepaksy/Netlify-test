import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all plans from backend and find the selected one
  useEffect(() => {
    const planId = searchParams.get('planId');

    axios.get("http://localhost:8080/subscriptions")
      .then(res => {
        setAllPlans(res.data);
        const plan = res.data.find(p => p.id === Number(planId));
        if (plan) {
          setSelectedPlan(plan);
          setErrorMessage('');
        } else {
          setErrorMessage('No valid plan selected!');
          setSelectedPlan(null);
        }
      })
      .catch(err => {
        console.error("Error fetching subscriptions:", err);
        setErrorMessage("Failed to fetch plan data.");
      });
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      const paymentData = {
        memberPlan: selectedPlan.id,
        amount: selectedPlan.price,
        paymentDetails: paymentInfo,
        duration: selectedPlan.duration
      };

      const response = await axios.post('/api/payments', paymentData);

      if (response.data.success) {
        setSuccessMessage('Payment successful! Receipt sent to your email.');
        setPaymentInfo({ name: '', email: '', cardNumber: '', expiry: '', cvc: '' });
      } else {
        setErrorMessage(response.data.message || 'Payment failed!');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  if (!selectedPlan) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{errorMessage || 'Invalid or expired plan selection!'}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Complete Your Payment for {selectedPlan.name} Plan</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="shadow-sm p-4">
        <div className="mb-4 bg-light p-3 rounded">
          <h5>{selectedPlan.name} Plan</h5>
          <p>Duration: {selectedPlan.duration} month(s)</p>
          <p>Total Amount: ₹{selectedPlan.price}</p>
          <p>Discount: {selectedPlan.discount}%</p>
        </div>

        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={paymentInfo.name}
                onChange={handleInputChange}
                name="name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={paymentInfo.email}
                onChange={handleInputChange}
                name="email"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="cardNumber" className="mb-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="4242 4242 4242 4242"
            value={paymentInfo.cardNumber}
            onChange={handleInputChange}
            name="cardNumber"
          />
        </Form.Group>

        <Row className="g-3 mb-3">
          <Col md={4}>
            <Form.Group controlId="expiry">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="MM/YY"
                value={paymentInfo.expiry}
                onChange={handleInputChange}
                name="expiry"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="cvc">
              <Form.Label>CVC</Form.Label>
              <Form.Control
                type="text"
                placeholder="123"
                value={paymentInfo.cvc}
                onChange={handleInputChange}
                name="cvc"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="w-100 py-2">
          Pay Now (₹{selectedPlan.price})
        </Button>
      </Form>
    </div>
  );
};

export default PaymentPage;
