import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import SignatureModal from '../../components/SignatureModal';
import html2pdf from 'html2pdf.js';

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
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
  const [waiversign, setwaiversign] = useState('');



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
    if (!waiverId) {
      setError('Invalid waiverId ID');
      setloading(false);
      return;
    }

    if(waiversign !== ''){
      alert("Waiver Document Already signed!")

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
        <title>Print Estimate</title>
        <style>
      
        .print-page{
          // width:80%;
          margin:auto
        }
        .adminborder{
        
          
          width:100%;
        }
        .row{
  
          width:100% !important;
          margin:auto;
        }
      .pt-30{
        padding-top:30px;
      }
      .pb-30{
        padding-bottom:30px;
      }
      .pb-90{
        padding-bottom: 66px;
        padding-top: 15px;
        padding-left: 10px;
        margin-top: 20px;
        margin-bottom: 30px;
      }

      .padding-20{
        padding-top:15px;
        padding-bottom:45px;
      }
        .col-6{
          width:50%;
          float:left
        }
        .col-md-6{
          width:50%;
          float:left
        }
        p, h1,h2,h3,h4,h5,h6 {
          margin:0
        }
        .clear{
          clear:both;
        }

        .invoice-contentcol-6{
          width:25% !important;
          float:left
        }

        .invoice-contentcol-2{
          width:25% !important;
          float:left;
        }
        
        .fw-bold{
          font-weight:bold;
        }

        .invoice-contentcol-12{
          width:100%;
        }

        .printcol-8{
          width:50%;
          float:left;
          text-align:right
        }
        .invoice-contentcol-8{
          width:50% !important;
          float:left;
          text-align:center;
        }

        .logoimage{
          width:50%;
        }

        .detailbg{
          background-color: #f0f3f4 !important;
        }

        .offset-8{
          width:25%;
        }

        .txt-center{
          text-align:left !important;
          }

        .text-left{
          text-align:left;
        }

        .text-right{
          text-align:right;
        }

        .right{
          text-align:right;
        }

        .padding{
          padding:20px
        }

        .flex{
          display: flex;
          justify-content: end;
        }

        .m-right{
          margin-right:100px;
        }
        
        /* Adjustments for better PDF rendering */
        body {
          font-size: 14px;
        }
        .invoice-content {
          page-break-inside: avoid;
        }
        .page-not-break {
          page-break-before: auto;
          page-break-after: auto;
          page-break-inside: avoid;
          reak-before: auto;
          break-after: auto;
          break-inside: avoid;
        }
        .invoice-price .invoice-price-right {
          width: 30%;
          background: #f0f3f4;
          color: black;
          border: 2px solid #f0f3f4;
          font-size: 28px;
          text-align: right;
          vertical-align: bottom;
          font-weight: 300;
          position: relative;
          right: 38px;
          padding: 28px 12px 16px;
        }
        .invoice-price .invoice-price-right span {
          display: block;
          font-weight: 400;
        }
        .invoice-price .invoice-price-right small {
          display: block;
          opacity: .7;
          position: absolute;
          top: 10px;
          left: 12px;
          font-size: 18px;
        }
        
        @media only screen and (max-width: 575.98px) {
              .invoice-price .invoice-price-right {
                  right: 18px;
              }
        
              .invoice-price-right{
                width: 290px !important;
                display: block !important;
              }
          }
        .invoice-price {
          /* background: #f0f3f4; */
          display: table;
          width: 100%;
        }
        .invoice-price .invoice-price-left, .invoice-price .invoice-price-right {
          display: table-cell;
          font-size: 20px;
          font-weight: 600;
          width: 70%;
          position: relative;
          vertical-align: middle;
        }
        .print {
          margin-top: 10px;
            max-width: 28cm;
            zoom: 0.8;
            box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.2);
            margin-right: auto;
            margin-left: auto;
            background: white !important;
            flex-direction: row; justify-content: space-between; margin-bottom: 10px;
        }
        .invoice-header {
          background: #f0f3f4;
          padding: 25px 50px;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .invoice-header {
            background: #f0f3f4;
            padding: 25px 50px;
          }
          @page {
            /* Hide header and footer */
            margin: 0;
          }
          @page :first {
            /* Hide header on first page */
            header {
              display: none;
            }
          }
          @page {
            /* Hide footer on all pages */
            footer {
              display: none;
            }
          }
}
        .invoice-body {
          background: #fff;
          padding: 30px 50px;
        }
        .invoice-to {
          // padding-right: 20px;
        }
        .invoice-date {
          /* text-align: right; */
          // padding-left: 15px;
        }
        .table{
          width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    vertical-align: top;
    border-color: #dee2e6;
        }
        .table>thead {
    vertical-align: bottom;
        border-color: inherit;
    border-style: solid;
    border-width: 0;
}

.col-12 {
  width: 100%;
}
thead{
  text-align:left;
}

.center{
  text-align:center;
}

.text-end {
  text-align: right;
}
        .invoice-table{
          padding: 20px 38px 10px;
        }
        .text-md-end {
          text-align: right;
        }
        .clr {
          clear: both;
        }

        .margin-top-sign{
          margin-top:20px
        }
        .col-md-6{
          width:50%;
          float: left;
        }
        .row {
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(-1* var(--bs-gutter-y));
    margin-right: calc(-.5* var(--bs-gutter-x));
    margin-left: calc(-.5* var(--bs-gutter-x));
}
        
        .invoice-content {
          padding: 00px 38px 10px;
        }


        </style>
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
                    <div className='print' id='invoiceContent'>
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
                      <div className='invoice-header'>
                        <div className="row g-3 align-items-center">
                          <div class="mb-3">
                            <label for="exampleFormControlInput" class="form-label">Company Name/ Builder:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="companyName"
                              value={companyname}
                              required
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="ABC Company Name"
                            />
                          </div>
                          <div class="mb-3">
                            <label for="exampleFormControlInput" class="form-label">Email:</label>
                            <input
                              type="text"
                              value={waiverData.waiver.waiveremail}
                              disabled
                              class="form-control"
                              id="exampleFormControlInput1"
                              placeholder="ABC Company Name" />
                          </div>
                          <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Job site Address:</label>
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

                      <div className='invoice-table'>
                        <div className='content'>
                          <p>Canadian Screw Piles and Contracting Ltd. will not be responsible for the marking of the piles. The builder has to specify the location of the pile in order to avoid the services underneath. In case of any damages to the services, Canadian Screw Pile & Contracting Ltd. is not be liabile and will not be covering any related expenses. The Bulider/owner will be fully resposible for the any damages than occur to the services underneath at the marked locations.</p>
                          
                          {
                              waiversign == ""
                              ?
<div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" required id="flexCheckChecked" />
                            <label class="form-check-label" for="flexCheckChecked">
                              I agree to the condition and the price
                            </label>
                          </div>
                      
                              : ''
                            }
                          
                          
                          
                          
                        </div>
                        <hr />
                        <div className="row g-3 align-items-center">
                          <div class="mb-3">
                            <label for="exampleFormControlInput" class="form-label">Signature</label>
                            {
                              waiversign == '' ?
                              <button className="signbtn" ref={signatureButtonRef} onClick={() => setIsSignatureModalOpen(true)}>Signature</button>
                              : 
                              <img src={waiversign} alt="Signature" className="img-fluid" />
                            }
                          </div>
                          <div class="mb-3">
                            <label for="exampleFormControlInput" class="form-label">Print Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="printName"
                              required
                              value={printname}
                              onChange={(e) => setPrintName(e.target.value)}
                              placeholder="Print Name"
                            />
                          </div>
                          <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">Date</label>
                            <input
                              type="date"
                              className="form-control"
                              required
                              id="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="clr"></div>
                      </div>
                      <div className='text-center mb-4'>

                            {
                              waiversign == ""
                              ?
 <button className="btn btn-primary" onClick={handleUpdateWaiver}>
                          Update Waiver
                        </button>
                              : ''
                            }


                       
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

export default WaiverSign;
