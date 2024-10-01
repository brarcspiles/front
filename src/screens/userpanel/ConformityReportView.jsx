import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sign from '../../../public/jsbrar.png';
import { ColorRing } from 'react-loader-spinner';

const ConformityReportView = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlePrintContent = async () => {
        const content = document.getElementById('invoiceContent').innerHTML;
        const printWindow = window.open('', '_blank');

        printWindow.document.open();
        printWindow.document.write(`
        <html>
          <head>
            <title>Print Waiver</title>
            <style>
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
              .signature-section {
                margin-top: 30px;
              }
              .signature-section img {
                max-width: 200px;
                margin-bottom: 10px;
              }
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
            <div class="container">
              <div class="content">
                ${content}
              </div>
            </div>
          </body>
        </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 1000); // Ensure timeout is defined
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`https://server-5pxf.onrender.com/api/conformityReport/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setReport(data);
                } else {
                    setError('Failed to load report');
                }
            } catch (error) {
                console.error('Error fetching report:', error); // Log error for debugging
                setError('Error fetching report');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    if (loading) {
        return (
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
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='bg'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='m-auto'>
                        <div className='text-center pt-5'>
                            <button
                                className='pdfbtn text-center'
                                onClick={handlePrintContent}
                                aria-label="Print report as PDF"
                            >
                                <i className="fa-solid fa-print mx-2"></i>Pdf
                            </button>
                        </div>

                        <div className='container conformity' id='invoiceContent'>
                            <h2 className='text-center pb-5'>Conformity Report</h2>

                            {/* Client Address */}
                            <div className='row'>
                                <div className='ms-auto col-md-4'>
                                    <h4>Canadian Screw Piles</h4>
                                    <p className='m-0'>Unit #101 3425 29 St NE Calgary, AB</p>
                                    <p>Phone: (403) - 439 - 7700</p>
                                </div>
                            </div>

                            <div className='ms-auto'>
                                <p>Date: July 02, 2024</p>
                                <p><strong>Re: Conformity Report - Canadian Screw Piles</strong></p>
                                <p>Project: {report.project}</p>
                                <p>File: {report.file}</p>
                                <p>To whom it may concern,</p>
                                <p>This conformity report is being issued following the installation of our Canadian Screw Piles at {report.clientAddress}</p>
                            </div>

                            {/* Canadian Screw Piles Section */}
                            <h3>1.0 Canadian Screw Piles</h3>
                            <p>The installed Canadian Screw Piles are the following:</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Quantity</th>
                                        <th>Model</th>
                                        <th>Average Depth</th>
                                        <th>Outside Diameter</th>
                                        <th>Wall Thickness</th>
                                        <th>Helix Diameter</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.canadianScrewPiles && report.canadianScrewPiles.map((pile, index) => (
                                        <tr key={index}>
                                            <td>{pile.quantity}</td>
                                            <td>{pile.model}</td>
                                            <td>{pile.averageDepth}</td>
                                            <td>{pile.outsideDiameter}</td>
                                            <td>{pile.wallThickness}</td>
                                            <td>{pile.helixDiameter}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className='pt-2'>These Canadian Screw Piles were installed in accordance with the requirements of the National Building Code of Canada 2015 and CCMC Evaluation Report #14098-R.</p>

                            {/* Bearing Capacity Section */}
                            <h3>2.0 Bearing Capacity</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Model P</th>
                                        <th>Load</th>
                                        <th>Compression</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.bearingCapacity && report.bearingCapacity.map((capacity, index) => (
                                        <tr key={index}>
                                            <td>{capacity.modelP}</td>
                                            <td>{capacity.load}</td>
                                            <td>{capacity.compression}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Additional Notes Section */}
                            <h3 className='pt-2'>3.0 Special Notes</h3>
                            <p>If there is a staircase leaning directly onto the ground, three options are possible so that the staircase can move freely during the freeze and thaw period...</p>

                            {/* Compliance Section */}
                            <h3>4.0 Compliance of Installation</h3>
                            <p>We confirm that the Canadian Screw Piles used are adequate, that the installation is compliant and that the Canadian Screw Piles installed are able to support the design loads of the project.</p>
                            <p>Finally, this installation is covered by a transferable warranty of 5 years against future subsiding.</p>

                            <p>We hope that you will find this document satisfactory. Please do not hesitate to contact us for any further information or inquiries.</p>

                            <p>Sincerely,</p>

                            <img src={sign} alt="Signature" />
                            <p>Canadian Screw Piles</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConformityReportView;
