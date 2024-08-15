import React from 'react';
import './Thankyou.css'

const WaiverSignThanks = () => {
    return (
        <div className="thank-you-container">
            <div className="svg-animation">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="checkmark"
                >
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </div>
            <h2>Thank you for signing!</h2>
        </div>
    );
};

export default WaiverSignThanks;
