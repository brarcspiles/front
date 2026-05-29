import React, { useState } from 'react';
import SignatureModal from '../../components/SignatureModal';

export default function Esignmodalpractice() {
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [ownerId, setOwnerId] = useState('');
    const [isAddSignatureSwitchOn, setIsAddSignatureSwitchOn] = useState(false);
    const [isCustomerSignSwitchOn, setIsCustomerSignSwitchOn] = useState(false);

    const handleSignatureSwitch = async (event) => {
        if (event.target.checked) {
            try {
                const ownerId = localStorage.getItem('userid');
                const response = await fetch(`https://server-5pxf.onrender.com/api/check-signature/${ownerId}`);
                const data = await response.json();
                setHasSignature(data.hasSignature);

                if (!data.hasSignature) {
                    setIsSignatureModalOpen(true);
                }
                setIsAddSignatureSwitchOn(true); // Automatically activate "Add My Signature"
                setIsCustomerSignSwitchOn(true); // Automatically activate "Customer to Sign"
            } catch (error) {
                console.error('Error checking signature:', error);
            }
        } else {
            setIsAddSignatureSwitchOn(false);
            setIsCustomerSignSwitchOn(false);
            setHasSignature(false); // Ensure switches are hidden
        }
    };

    const handleAddSignatureSwitch = (event) => {
        setIsAddSignatureSwitchOn(event.target.checked);
        if (!event.target.checked && !isCustomerSignSwitchOn) {
            setHasSignature(false);
        }
    };

    const handleCustomerSignSwitch = (event) => {
        setIsCustomerSignSwitchOn(event.target.checked);
        if (!event.target.checked && !isAddSignatureSwitchOn) {
            setHasSignature(false);
        }
    };

    const saveSignature = async (signatureData) => {
        try {
            const ownerId = localStorage.getItem('userid');
            const email = localStorage.getItem('userEmail');
            await fetch('https://server-5pxf.onrender.com/api/ownersignature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ signature: signatureData, ownerId, email }),
            });
            setHasSignature(true);
            setIsSignatureModalOpen(false);
        } catch (error) {
            console.error('Error saving signature:', error);
        }
    };

    return (
        <div className='bg'>
            <div className='box1 rounded adminborder p-4 my-2 mx-0 mb-5'>
                <div className="form-check form-switch">
                    <div>
                        <label className="form-check-label" htmlFor="signatureSwitch">Signature</label>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="signatureSwitch"
                            onChange={handleSignatureSwitch}
                            checked={hasSignature}
                        />
                    </div>
                    {hasSignature && (
                        <>
                            <div>
                                <label className="form-check-label" htmlFor="addSignatureSwitch">Add My Signature</label>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="addSignatureSwitch"
                                    checked={isAddSignatureSwitchOn}
                                    onChange={handleAddSignatureSwitch}
                                />
                            </div>
                            <div>
                                <label className="form-check-label" htmlFor="customerSignSwitch">Customer to Sign</label>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="customerSignSwitch"
                                    checked={isCustomerSignSwitchOn}
                                    onChange={handleCustomerSignSwitch}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isSignatureModalOpen && (
                <SignatureModal
                    onSave={saveSignature}
                    onClose={() => setIsSignatureModalOpen(false)}
                />
            )}
        </div>
    );
}
