import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import SignatureModal from '../../components/SignatureModal';
import html2pdf from 'html2pdf.js';

const WaiverSignView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const waiverId = searchParams.get('id');
  const [waiverData, setwaiverData] = useState(null);

  // State for input fields
  const [companyname, setCompanyName] = useState('');
  const [jobsiteaddress, setJobSiteAddress] = useState('');
  const [printname, setPrintName] = useState('');
  const [date, setDate] = useState('');
  const [waiversign, setwaiversign] = useState('');
  const [waiveremail, setwaiveremail] = useState('');



  const estimateId = searchParams.get('estimateId');
  const [estimateData, setEstimateData] = useState(null);
  const signatureButtonRef = useRef(null);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [signupdata, setsignupdata] = useState({
    Businesstype: "",
    CurrencyType: "",
    FirstName: "",
    LastName: "",
    TaxName: "",
    address: "",
    city: "",
    companyImageUrl: "",
    companyname: "",
    country: "",
    email: "",
    state: "",
    taxPercentage: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [items, setitems] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [signatureData, setsignatureData] = useState(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isCompleteButtonVisible, setIsCompleteButtonVisible] = useState(false);
  const [showGoToSignButton, setShowGoToSignButton] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const shouldShowButton = showGoToSignButton && scrollPosition < window.innerHeight;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    console.log(waiverId, "sd");
    if (!waiverId) {
      setError('Invalid waiverId ID');
      setloading(false);
      return;
    }

    fetchWaiverData();
    // fetchsignupdata();
    // fetchtransactiondata();
  }, [waiverId]);



  const handlePrintContent = async () => {
    const content = document.getElementById('invoiceContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Waiver</title>
        <style>
          /* Global Styles */
          body {
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
          }
          h2, h3 {
            color: #004085;
            margin-bottom: 10px;
          }
          p {
            margin: 0 0 10px;
          }
          .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }

          /* Header and Footer Styles */
          .header, .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid #e9ecef;
          }
          .footer {
            border-top: 2px solid #e9ecef;
            margin-top: 30px;
            font-size: 12px;
          }

          /* Content Styles */
          .content {
            padding: 20px;
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            margin-bottom: 30px;
          }
          .content img {
            max-width: 150px;
            margin-bottom: 15px;
          }

          /* Table Styles */
          .table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
          }
          .table th, .table td {
            border: 1px solid #dee2e6;
            padding: 8px;
            text-align: left;
          }
          .table th {
            background-color: #f1f3f5;
            font-weight: bold;
          }

          /* Signature Section */
          .signature-section {
            margin-top: 30px;
          }
          .signature-section img {
            max-width: 200px;
            margin-bottom: 10px;
          }

          /* Print-specific Styles */
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }
            .header, .footer {
              page-break-before: always;
              background-color: #f8f9fa !important;
            }
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Canadian Screw Piles & Contracting Ltd.</h2>
          <p>Waiver Document</p>
        </div>
        <div class="container">
          <div class="content">
            ${content}
          </div>
          <div class="signature-section">
            <p>Signature:</p>
            <img src="${waiversign}" alt="Signature" />
            <p>Date: ${date}</p>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Canadian Screw Piles & Contracting Ltd. All rights reserved.</p>
        </div>
      </body>
    </html>
    `);
    printWindow.document.close();
    await timeout(1000);
    printWindow.print();
  };

  
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  
  const fetchWaiverData = async () => {
    try {
      // const userid = localStorage.getItem("userid");
      // const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://server-5pxf.onrender.com/api/waiver/${waiverId}`, {
        // headers: {
        //   'Authorization': authToken,
        // }
      });

      if (response.status === 401) {
        const json = await response.json();

       
        setAlertMessage(json.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      }
      else {
        const json = await response.json();
        console.log(json, "Json Data....")
        setwaiverData(json);
        // Set default values for input fields
        setCompanyName(json.waiver.companyname || '');
        setJobSiteAddress(json.waiver.jobsiteaddress || '');
        setPrintName(json.waiver.printname || '');
        setDate(json.waiver.date || '');
        setwaiversign(json.waiver.waiversign || '');
        setwaiveremail(json.waiver.waiveremail || '');
        console.log(json.waiver.printname,"Data check");
      
         

        setloading(false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setloading(false);
    }
  }

  const handleUpdateWaiver = async () => {
    const updatedData = {
      companyname,
      jobsiteaddress,
      printname,
      date,
      status:"Signed"
    };
    console.log(typeof waiverId, "waiverId");

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
        console.log(updatedData, json, "Json Ok Data");
        alert('Waiver updated successfully!');
        // Optionally redirect or update the UI
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
      // Update the existing waiver signature
      const updateResponse = await fetch(`https://server-5pxf.onrender.com/api/addwaiversignature/${encodeURIComponent(waiverId)}`, {
        method: 'POST',  // Use POST method as per your API route
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waiversign: signatureData,                 // Signature data to be saved
          companyname: waiverData.companyname || '', // Company name from waiverData
          jobsiteaddress: waiverData.jobsiteaddress || '', // Job site address from waiverData
          printname: waiverData.printname || '',     // Print name from waiverData
          isAddSignature: true,                      // Assuming you want to add the signature
          date: new Date().toISOString(),            // Current date
        }),
      });
  
      if (updateResponse.ok) {
        alert('Signature updated successfully');
        setIsCompleteButtonVisible(true);
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
  

  
  const handleSignatureClick = async () => {
    setIsSignatureModalOpen(true);
    try {
        const updateResponse = await fetch(`https://server-5pxf.onrender.com/api/updatewaiversignature/${encodeURIComponent(waiverData.waiver._id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': authToken,
          },
        });
    } catch (error) {
      console.error('Error saving signature:', error);
      // alert('Error saving signature');
    } finally {
      // setIsSignatureModalOpen(false);
    }
  };
  
  
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    // clean up code
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  

  return (

    <div className='bg'>
      {
        loading ?
          <div className='row position-relative'>
            <ColorRing
              loading={loading}
              display="flex"
              justify-content="center"
              align-items="center"
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div> 
          :
          <div className='container-fluid'>
            <div className="row">
              <div className='m-auto'>
                <div className='text-center pt-5'>
                  <button className='pdfbtn text-center' onClick={handlePrintContent}><i className="fa-solid fa-print mx-2"></i>Pdf</button>
                </div>

                <div className="row py-4 px-2">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12" id="">
                    <div className='print'>
                      <div className="invoice-body">
                        <div className='row'>
                          <div className='col-sm-12 col-md-12 mb-3 mb-md-0 pt-3'>
                            <h2 className='text-center'>Canadian Screw Piles </h2>
                            <p className='text-center'>& Contracting Ltd.</p>
                            <h3 className='text-center'>Waiver </h3>
                          </div>


                        </div>
                        <div className="clr"></div>
                      </div>
                      <div id='invoiceContent'>
                      <div className='invoice-header1' style={{padding:"25px 50px"}}>
                        <div className="row g-3 align-items-center">
                        <div class="mb-3">
                        Company Name/ Builder: {companyname}
                        </div>
                        <div class="mb-3">
                       Email: {waiveremail}
                        </div>
                        <div class="mb-3">
                       Job/Site Address: {jobsiteaddress}
                        </div>
                      
                        </div>

                        <div className="clr"></div>
                      </div>

                      <div className='invoice-table'>
                        <div className='content'>
                          <p>Canadian Screw Piles and Contracting Ltd. will not be responsible for the marking of the piles. The builder has to specify the location of the pile in order to avoid the services underneath. In case of any damages to the services, Canadian Screw Pile & Contracting Ltd. is not be liabile and will not be covering any related expenses. The Bulider/owner will be fully resposible for the any damages than occur to the services underneath at the marked locations.</p>
                          
                        </div>
                        <hr />
                       
                        <div className="clr"></div>
                      </div>
                      </div>
                     
                      <div className='invoice-table'>
                        <div className='content'>
                        <div className="row g-3 align-items-center">
                          <div class="mb-3">
                          <img src={waiversign} alt="Signature" className="img-fluid" />
                            
                          </div>
                          <div class="mb-3">

                          Signature
                           
                          </div>
                          <div class="mb-3">

                            Print Name: {printname}
                           
                          </div>
                          <div class="mb-3">
                          Date: {date}
                          </div>
                        </div>
                        </div>
                      </div>

                      <div className='invoice-price page-not-break'>
                        <div className='invoice-price-left text-end'>
                          <div className='d-none d-md-block'></div>
                        </div>

                      </div>

                      <div className="col-6">
                        <div className="my-2">
                          <div className='text-center txt-center center'>
                            <p className='fw-bold fs-5 margin-top-sign txt-center center'></p>

                           
                          </div>
                        </div>
                      </div>
                      {isSignatureModalOpen.toString() == "true" && (
                              <SignatureModal
                                  onSave={handleSaveSignature}
                                  onClose={() => setIsSignatureModalOpen(false)}
                              />
                          )}


                    </div>
                  </div>
                </div>
                <div className='text-center mb-4'>
                  {signatureData != null ?
                    (signatureData.completeButtonVisible != "" && signatureData.completeButtonVisible != undefined && signatureData.completeButtonVisible != null ?
                      <button className="btn btn-primary" onClick={handleDocumentComplete}>
                        Complete
                      </button>
                      : '')
                    : ('')}
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default WaiverSignView;
