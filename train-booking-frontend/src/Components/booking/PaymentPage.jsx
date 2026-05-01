import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock booking data - in real app this would come from context/state
  const bookingData = {
    totalFare: 1500,
    passengers: 2
  };

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // Mock successful payment
      navigate('/booking/confirmation');
    }, 3000);
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>Payment</h1>
        <p>Complete your booking by making the payment</p>
      </div>

      <div className="payment-content">
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-details">
            <p><strong>Passengers:</strong> {bookingData.passengers}</p>
            <p><strong>Total Amount:</strong> ₹{bookingData.totalFare}</p>
          </div>
        </div>

        <div className="payment-form">
          <h2>Payment Method</h2>

          <div className="payment-methods">
            <label className="payment-method">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Credit/Debit Card</span>
            </label>
            <label className="payment-method">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>UPI</span>
            </label>
            <label className="payment-method">
              <input
                type="radio"
                value="netbanking"
                checked={paymentMethod === 'netbanking'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Net Banking</span>
            </label>
          </div>

          {paymentMethod === 'card' && (
            <form onSubmit={handlePayment} className="card-form">
              <div className="form-group">
                <label htmlFor="name">Cardholder Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="number">Card Number</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry">Expiry Date</label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <ErrorMessage message={error} />

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? <Loader message="Processing payment..." /> : `Pay ₹${bookingData.totalFare}`}
              </button>
            </form>
          )}

          {paymentMethod === 'upi' && (
            <div className="upi-payment">
              <p>UPI payment integration would go here</p>
              <button
                className="btn btn-primary btn-full"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? <Loader message="Processing..." /> : `Pay ₹${bookingData.totalFare} via UPI`}
              </button>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="netbanking-payment">
              <p>Net banking payment integration would go here</p>
              <button
                className="btn btn-primary btn-full"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? <Loader message="Processing..." /> : `Pay ₹${bookingData.totalFare} via Net Banking`}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="payment-actions">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/booking/summary')}
        >
          Back to Summary
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
