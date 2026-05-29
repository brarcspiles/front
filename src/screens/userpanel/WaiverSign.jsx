import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import SignatureModal from '../../components/SignatureModal';

const WaiverSign = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const waiverId = searchParams.get('waiverId');
  const [waiverData, setwaiverData] = useState(null);

  // State for input fields
  const [companyname, setCompanyName] = useState('');
  const [jobsiteaddress, setJobSiteAddress] = useState('');
  const [printname, setPrintName] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [waiversign, setwaiversign] = useState('');

  const signatureButtonRef = useRef(null);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  useEffect(() => {
    if (!waiverId) {
      setError('Invalid waiverId ID');
      setloading(false);
      return;
    }

    if (waiversign !== '') {
      alert('Waiver Document Already signed!');
      setloading(false);
      return;
    }

    fetchWaiverData();
  }, [waiverId]);

  const fetchWaiverData = async () => {
    try {
      const response = await fetch(`https://server-5pxf.onrender.com/api/waiver/${waiverId}`);
      if (response.status === 401) {
        const json = await response.json();
        setError(json.message);
        setloading(false);
        return;
      }
      const json = await response.json();
      setwaiverData(json);
      setCompanyName(json.waiver.companyname || '');
      setJobSiteAddress(json.waiver.jobsiteaddress || '');
      setPrintName(json.waiver.printname || '');
      setDate(json.waiver.date || '');
      setwaiversign(json.waiver.waiversign || '');
      setloading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setloading(false);
    }
  };

  
  const handlePrintContent = async () => {
    const content = document.getElementById('invoiceContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Estimate</title>
        
      </head>
      <body>
        <div className="print-page">
          ${content}
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    await timeout(1000);
    printWindow.print();
  };
  const handleUpdateWaiver = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!companyname || !jobsiteaddress || !printname || !date || !waiversign) {
      alert('Please fill out all required fields and sign the waiver.');
      return;
    }

    const updatedData = {
      companyname,
      jobsiteaddress,
      printname,
      date,
      status: 'Signed',
    };

    try {
      const response = await fetch(`https://server-5pxf.onrender.com/api/waiver/${waiverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const json = await response.json();

      if (response.ok) {
        alert('Waiver updated successfully!');
        navigate('/waiversignthanks');
      } else {
        alert('Failed to update waiver: ' + json.message);
      }
    } catch (error) {
      console.error('Error updating waiver:', error);
      alert('An error occurred while updating the waiver.');
    }
  };

  const handleSaveSignature = async (signatureData) => {
    try {
      const updateResponse = await fetch(`https://server-5pxf.onrender.com/api/addwaiversignature/${encodeURIComponent(waiverId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waiversign: signatureData,
          companyname: waiverData.companyname || '',
          jobsiteaddress: waiverData.jobsiteaddress || '',
          printname: waiverData.printname || '',
          isAddSignature: true,
          date: new Date().toISOString(),
        }),
      });

      if (updateResponse.ok) {
        alert('Signature updated successfully');
        setwaiversign(signatureData);
      } else {
        alert('Error updating signature');
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      alert('Error saving signature');
    } finally {
      setIsSignatureModalOpen(false);
    }
  };

  return (
    <div className="bg">
      {loading ? (
        <div className="row position-relative">
          <ColorRing loading={loading} display="flex" justify-content="center" align-items="center" aria-label="Loading Spinner" data-testid="loader" />
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="m-auto">
              <div className="text-center pt-5">
                <button className="pdfbtn text-center" onClick={handlePrintContent}>
                  <i className="fa-solid fa-print mx-2"></i>Pdf
                </button>
              </div>

              <div className="row py-4 px-2">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="print" id="invoiceContent">
                    <form onSubmit={handleUpdateWaiver}>
                      <div className="invoice-body">
                        <div className="row">
                          <div className="col-sm-12 col-md-12 mb-3 mb-md-0 pt-3">
                            <h2 className="text-center">Canadian Screw Piles </h2>
                            <p className="text-center">& Contracting Ltd.</p>
                            <h3 className="text-center">Waiver </h3>
                          </div>
                        </div>
                        <div className="clr"></div>
                      </div>
                      <div className="invoice-header">
                        <div className="row g-3 align-items-center">
                          <div className="mb-3">
                            <label htmlFor="companyName" className="form-label">
                              Company Name/Builder: <span className='text-danger'>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="companyName"
                              value={companyname}
                              required
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="Your Company Name"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">
                              Email:
                            </label>
                            <input type="text" value={waiverData.waiver.waiveremail} disabled className="form-control" id="exampleFormControlInput1" placeholder="ABC Company Name" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="jobSiteAddress" className="form-label">
                              Job site Address: <span className='text-danger'>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="jobSiteAddress"
                              required
                              value={jobsiteaddress}
                              onChange={(e) => setJobSiteAddress(e.target.value)}
                              placeholder="Job Site Address"
                            />
                          </div>
                        </div>

                        <div className="clr"></div>
                      </div>

                      <div className="invoice-table">
                        <div className="content">
                          <p>
                            Canadian Screw Piles and Contracting Ltd. will not be responsible for the marking of the piles. The builder has to specify the location of the pile in order to avoid the services underneath. In
                            case of any damages to the services, Canadian Screw Pile & Contracting Ltd. is not be liable and will not be covering any related expenses. The Builder/owner will be fully responsible for any
                            damages that occur to the services underneath at the marked locations.
                          </p>

                          {waiversign === '' && (
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" required id="flexCheckChecked" />
                              <label className="form-check-label" htmlFor="flexCheckChecked">
                                I agree to the condition and the price
                              </label>
                            </div>
                          )}
                        </div>
                        <hr />
                        <div className="row g-3 align-items-center">
                          <div className="mb-3">
                            <label htmlFor="signature" className="form-label">
                              Signature <span className='text-danger'>*</span>
                            </label>
                            {waiversign === '' ? (
                              <button type="button" className="signbtn" ref={signatureButtonRef} onClick={() => setIsSignatureModalOpen(true)}>
                                Signature 
                              </button>
                            ) : (
                              <img src={waiversign} alt="Signature" className="img-fluid" />
                            )}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="printName" className="form-label">
                              Print Name <span className='text-danger'>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="printName"
                              required
                              value={printname}
                              onChange={(e) => setPrintName(e.target.value)}
                              placeholder="Your Name"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="date" className="form-label">
                              Date <span className='text-danger'>*</span>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              id="date"
                              required
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              placeholder="Date"
                            />
                          </div>
                        </div>
                        <div className="clr"></div>
                      </div>
                      <div className="row text-end">
                        <div className="col-md-12 text-end">
                          <button type="submit" className="btn btn-primary" disabled={!waiversign}>
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>

                    {isSignatureModalOpen && (
                      <SignatureModal isOpen={isSignatureModalOpen} onSave={handleSaveSignature} onCancel={() => setIsSignatureModalOpen(false)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiverSign;




