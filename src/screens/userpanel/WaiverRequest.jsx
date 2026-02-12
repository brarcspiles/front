import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import { ColorRing } from 'react-loader-spinner';

export default function WaiverRequest() {
    const [loading, setLoading] = useState(true);
    const [waiverEmail, setWaiverEmail] = useState('');
    const [showEmailAlert, setShowEmailAlert] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // To disable the button
    const [submittedEmails, setSubmittedEmails] = useState([]); // Store submitted emails to check for duplicates
    
    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('authToken') || localStorage.getItem('isTeamMember') === 'true') {
            navigate('/');
        } else {
            setLoading(false)
        }
    }, [navigate]);

    const handleAlertClose = () => {
        setShowEmailAlert(false); // Close the alert
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userid');

        // Check if the email has already been submitted
        if (submittedEmails.includes(waiverEmail)) {
            setShowEmailAlert(true);
            return; // Exit early to prevent duplicate entry
        }

        try {
            setIsButtonDisabled(true); // Disable the button to prevent multiple submissions
            
            const response = await fetch('https://server-5pxf.onrender.com/api/send-waiver-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify({
                    to: waiverEmail,
                    userId: userId
                }),
            });

            if (response.ok) {
                console.log('Email sent successfully!');
                setShowEmailAlert(true);
                setSubmittedEmails([...submittedEmails, waiverEmail]); // Add the email to the submitted list
            } else {
                console.error('Failed to send email.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setIsButtonDisabled(false); // Re-enable the button after request is complete
        }
    };

    return (
        <div className='bg'>
            {loading ? (
                <div className='row'>
                    <ColorRing
                        width={200}
                        loading={loading}
                        size={500}
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        aria-label='Loading Spinner'
                        data-testid='loader'
                    />
                </div>
            ) : (
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                            <Usernavbar />
                        </div>
                        <div className='col-lg-10 col-md-9 col-12 mx-auto'>
                            <div className='d-lg-none d-md-none d-block mt-2'>
                                <Usernav />
                            </div>
                            <div className='bg-white my-5 p-4 box mx-4'>
                                <div className='row py-2'>
                                    <div className='col-lg-4 col-md-6 col-sm-6 col-7'>
                                        <a href='/userpanel/waiverrequestlist' className='btn btn-primary'>View List</a>
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-lg-4 col-md-6 col-sm-6 col-7 me-auto'>
                                        <p className='h3 fw-bold'>Waiver Request</p>
                                    </div>
                                </div>
                                <form onSubmit={handleFormSubmit}>
                                    <div className='row py-2'>
                                        <div className='col-lg-6'>
                                            <div className='mb-3'>
                                                <label htmlFor='waiverrequestemail' className='form-label'>
                                                    Enter Email Address
                                                </label>
                                                <input
                                                    type='email'
                                                    name='waiverrequestemail'
                                                    className='form-control'
                                                    id='waiverrequestemail'
                                                    required
                                                    value={waiverEmail}
                                                    onChange={(e) => setWaiverEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className='notification mt-4'>
                                                {showEmailAlert && (
                                                    <div className="alert alert-success row" role="alert">
                                                        <div className="col-11">
                                                            <p className='mb-0'>
                                                                {submittedEmails.includes(waiverEmail) 
                                                                    ? 'Email has already been submitted!'
                                                                    : 'Email sent successfully!'}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            aria-label="Close"
                                                            onClick={handleAlertClose}>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='col-lg-2'>
                                            <div className='mt-4 mt-3 my-3'>
                                                <button 
                                                    className='btn btn-primary'
                                                    type="submit"
                                                    disabled={isButtonDisabled} // Disable the button while submitting
                                                >
                                                    {isButtonDisabled ? 'Sending...' : 'Send'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
