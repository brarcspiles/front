import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useParams,useNavigate } from 'react-router-dom';
import sign from '../../../public/jsbrar.png';
import { ColorRing } from 'react-loader-spinner';
import html2pdf from 'html2pdf.js';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';

const ConformityReportView = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emails, setEmails] = useState([]);
    const [bccEmails, setBccEmails] = useState([]);
    const [content, setContent] = useState('');
    const modalRef = useRef(null);
  let navigate = useNavigate();
    // Email handlers
    const handleEmailChange = (emails) => setEmails(emails);
    const handleBccEmailsChange = (bccEmails) => setBccEmails(bccEmails);
    const handleContentChange = (e) => setContent(e.target.value);

    const generatePdfFromHtml = async () => {
        return new Promise((resolve, reject) => {
            const content = document.getElementById('invoiceContent');
            const opt = {
                filename: `ConformityReport_${id}.pdf`,
                margin: 10,
                html2canvas: { 
                    scale:2, 
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true,
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'] 
                }
            };

            html2pdf()
                .from(content)
                .set(opt)
                .toPdf()
                .get('pdf')
                .then((pdf) => {
                    const pdfAsDataUri = pdf.output('datauristring');
                    resolve(pdfAsDataUri);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
   
        if (!emails.length) {
            alert('Please add at least one recipient email.');
            return;
        }
    
        try {
            setLoading(true);
            const authToken = localStorage.getItem('authToken');
            const pdfDataUri = await generatePdfFromHtml();
            const pdfBlob = await fetch(pdfDataUri).then(res => res.blob());
    
            if (!pdfBlob || pdfBlob.size === 0) {
                throw new Error('Failed to generate PDF');
            }
    
            const formData = new FormData();
            formData.append('pdf', pdfBlob, `ConformityReport_${id}.pdf`);
            formData.append('emails', JSON.stringify(emails));
            formData.append('bccEmails', JSON.stringify(bccEmails || []));
            formData.append('content', content || 'Please find attached the Conformity Report.');
            formData.append('reportId', id);
    
            console.log('Sending FormData:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
    
            const response = await fetch('https://server-5pxf.onrender.com/api/sendConformityReportEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                  },
                body:JSON.stringify({
                    pdfAttachment:pdfDataUri,
                    to: emails,
                    bcc: bccEmails || [], 
                    content:content || 'Please find attached the Conformity Report.',
                    reportId:id
                })
                
            });
    
            if (response.ok) {
                alert('Email sent successfully!');
                setEmails([]);
                setBccEmails([]);
                setContent('');
                navigate("/");
                
            // Hide modal manually
            const modalElement = document.getElementById('sendEmailModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            

            } else {
                const errorData = await response.json();
                alert(`Failed to send email: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred while sending the email.');
        } finally {
            setLoading(false);
        }
    };

    const convertToPdf = () => {
        const content = document.getElementById('invoiceContent').innerHTML;
        const opt = {
            filename: `ConformityReport_${id}.pdf`,
            html2canvas: { scale: 1, useCORS: true },
            enableLinks: true,
            image: { type: 'jpeg', quality: 0.98 },
            margin: 0.2,
            jsPDF: {
                unit: 'in',
                format: 'A4',
                orientation: 'portrait'
            },
            userUnit: 450 / 210
        };
        html2pdf().from(content).set(opt).save();
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`https://server-5pxf.onrender.com/api/conformityReport/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setReport(data);
                    setEmails([data.email])
                    console.log(data,"data a;;");
                    
                } else {
                    setError('Failed to load report');
                }
            } catch (error) {
                console.error('Error fetching report:', error);
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
                        <div className='text-center py-5'>
                            <button className='pdfbtn text-center mx-2' onClick={convertToPdf}>
                                <i className="fa-solid fa-download mx-2"></i>Download
                            </button>
                            <a className='btn rounded-pill btn-danger text-white fw-bold mx-2' data-bs-toggle="modal" data-bs-target="#sendEmailModal">
                                <i className="fa-solid fa-envelope mx-2"></i>Send
                            </a>
                        </div>

                        {/* ===== PDF CONTENT (PROFESSIONAL DESIGN) ===== */}
                        <div className="container conformity" id="invoiceContent" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '210mm', margin: '0 auto', padding: '20px', background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                            
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #007BFF', paddingBottom: '10px', marginBottom: '20px' }}>
                                <div>
                                    <h1 style={{ color: '#007BFF', margin: 0 }}>CANADIAN SCREW PILES</h1>
                                    <p style={{ margin: '5px 0', color: '#555' }}>Unit #101 3425 29 St NE Calgary, AB</p>
                                    <p style={{ margin: 0, color: '#555' }}>Phone: (403) - 439 - 7700</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h2 style={{ margin: 0, color: '#333' }}>CONFORMITY REPORT</h2>
                                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Report #: {id}</p>
                                    <p style={{ margin: 0 }}>Date: {report?.date || new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Client Info */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontWeight: 'bold' }}>To: {report?.clientAddress || 'Client Name'}</p>
                                <p style={{ fontWeight: 'bold' }}>Project: {report?.project || 'Project Name'}</p>
                                <p style={{ fontWeight: 'bold' }}>File: {report?.file || 'File Reference'}</p>
                            </div>

                            {/* Introduction */}
                            <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
                                <p>To whom it may concern,</p>
                                <p>This conformity report is being issued following the installation of our Canadian Screw Piles at <strong>{report?.clientAddress || 'the specified location'}</strong>.</p>
                            </div>

                            {/* 1. Canadian Screw Piles */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#007BFF', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>1. CANADIAN SCREW PILES</h3>
                                <p>The installed Canadian Screw Piles are as follows:</p>
                                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Quantity</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Model</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Avg. Depth</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Outside Diameter</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Wall Thickness</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Helix Diameter</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report?.canadianScrewPiles?.map((pile, index) => (
                                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pile.quantity}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pile.model}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pile.averageDepth}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pile.outsideDiameter}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pile.wallThickness}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pile.helixDiameter}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p style={{ fontStyle: 'italic' }}>These piles were installed in accordance with the National Building Code of Canada 2015 and CCMC Evaluation Report #14098-R.</p>
                            </div>

                            {/* 2. Bearing Capacity */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#007BFF', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>2. BEARING CAPACITY</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Model</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Load (kN)</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Compression</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report?.bearingCapacity?.map((capacity, index) => (
                                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{capacity.modelP}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{capacity.load}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{capacity.compression}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. Special Notes */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#007BFF', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>3. SPECIAL NOTES</h3>
                                <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                                    <li>If there is a staircase leaning directly onto the ground, three options are possible so that the staircase can move freely during freeze and thaw periods.</li>
                                    <li>All piles were installed to the specified torque requirements.</li>
                                    <li>Site conditions were noted and accounted for during installation.</li>
                                </ul>
                            </div>

                            {/* 4. Compliance */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#007BFF', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>4. COMPLIANCE OF INSTALLATION</h3>
                                <p style={{ lineHeight: '1.6' }}>
                                    We confirm that the Canadian Screw Piles used are adequate, that the installation is compliant, and that the installed piles are able to support the design loads of the project. This installation is covered by a transferable warranty of 5 years against future subsiding.
                                </p>
                            </div>

                            {/* Closing */}
                            <div style={{ marginTop: '40px', lineHeight: '1.6' }}>
                                <p>We hope you find this document satisfactory. Please don't hesitate to contact us for any further information.</p>
                                <p>Sincerely,</p>
                                <div style={{ marginTop: '30px' }}>
                                    <img src={sign} alt="Authorized Signature" style={{ height: '50px' }} />
                                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Canadian Screw Piles</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ marginTop: '50px', paddingTop: '10px', borderTop: '1px solid #ddd', fontSize: '12px', color: '#777' }}>
                                <p>Canadian Screw Piles | Unit #101 3425 29 St NE Calgary, AB | Phone: (403) 439-7700</p>
                                <p>© {new Date().getFullYear()} Canadian Screw Piles. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Modal (unchanged) */}
            <div className="modal fade" id="sendEmailModal" tabIndex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-4 fw-bold" id="exampleModalLabel">Send document</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row mb-3">
                                    <label htmlFor="to" className="col-sm-2 col-form-label">To</label>
                                    <div className="col-sm-10">
                                        <ReactMultiEmail
                                            emails={emails}
                                            onChange={handleEmailChange}
                                            getLabel={(email, index, removeEmail) => (
                                                <div data-tag="true" key={index}>
                                                    {email}
                                                    <span
                                                        data-tag-handle="true"
                                                        onClick={() => removeEmail(index)}
                                                    >
                                                        ×
                                                    </span>
                                                </div>
                                            )}
                                            placeholder="Add more people..."
                                            style={{
                                                input: { width: '90%' },
                                                emailsContainer: { border: '1px solid #ccc' },
                                                emailInput: { backgroundColor: 'lightblue' },
                                                invalidEmailInput: { backgroundColor: '#f9cfd0' },
                                                container: { marginTop: '20px' },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="bcc" className="col-sm-2 col-form-label">Bcc</label>
                                    <div className="col-sm-10">
                                        <ReactMultiEmail
                                            emails={bccEmails}
                                            onChange={handleBccEmailsChange}
                                            getLabel={(email, index, removeEmail) => (
                                                <div data-tag="true" key={index}>
                                                    {email}
                                                    <span
                                                        data-tag-handle="true"
                                                        onClick={() => removeEmail(index)}
                                                    >
                                                        ×
                                                    </span>
                                                </div>
                                            )}
                                            placeholder="Add BCC recipients..."
                                            style={{
                                                input: { width: '90%' },
                                                emailsContainer: { border: '1px solid #ccc' },
                                                emailInput: { backgroundColor: 'lightblue' },
                                                invalidEmailInput: { backgroundColor: '#f9cfd0' },
                                                container: { marginTop: '20px' },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">Content</label>
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        name="content"
                                        rows="5"
                                        value={content}
                                        onChange={handleContentChange}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConformityReportView;