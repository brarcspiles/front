import React, { useEffect, useRef, useState } from 'react';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';

export default function Esignpractice() {
  const sigCanvas = useRef({});
  const navigate = useNavigate();
  const [signatureId, setSignatureId] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('authToken') || localStorage.getItem('isTeamMember') === 'true') {
      navigate('/');
    }
    loadSignature();
    setTimeout(() => {
      // setLoading(false);
    }, 1000);
  }, [navigate]);

  const clear = () => sigCanvas.current.clear();

  const save = () => {
    const signatureData = sigCanvas.current.toDataURL();
    fetch('https://server-5pxf.onrender.com/api/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature: signatureData }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSignatureId(data.id);
        setSignatureData(signatureData);
      })
      .catch(error => console.error('Error:', error));
  };

  const loadSignature = () => {
    if (signatureId) {
      fetch(`https://server-5pxf.onrender.com/api/signature/${signatureId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setSignatureData(data.data);
        })
        .catch(error => console.error('Error:', error));
    }
  };

  return (
    <div className="bg">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none">
            <div>
              <Usernavbar />
            </div>
          </div>
          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Usernav />
            </div>
            <div className="bg-white my-5 p-4 box mx-4">
              <div className="row py-2">
                <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                  <p className="h5 fw-bold">E-Sign</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/Userpanel/Userdashboard" className="txtclr text-decoration-none">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        E-Sign
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
              <hr />
              <div className="row my-2">
                <div>
                  <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                  />
                  <button onClick={clear}>Clear</button>
                  <button onClick={save}>Save</button>
                </div>
              </div>
              {signatureData && (
                <div className="row my-2">
                  <div>
                    <p>Saved Signature:</p>
                    <img src={signatureData} alt="Saved Signature" style={{ border: '1px solid black' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
