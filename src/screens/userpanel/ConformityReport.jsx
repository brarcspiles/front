import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import Select from 'react-select'; // Assuming you're using react-select

const ConformityReportSubmission = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Selected customer
    const [customers, setCustomers] = useState([]); // List of customers
    const [selectedInvoice, setSelectedInvoice] = useState(null); // Selected invoice
    const [invoices, setInvoices] = useState([]); // List of invoices
    const [project, setProject] = useState(''); // Project as text input
    const [date, setDate] = useState('');
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    let navigate = useNavigate();
    const [canadianScrewPiles, setCanadianScrewPiles] = useState([{
        quantity: '',
        model: '',
        averageDepth: '',
        outsideDiameter: '',
        wallThickness: '',
        helixDiameter: ''
    }]);
    const [bearingCapacity, setBearingCapacity] = useState([{
        modelP: '',
        load: '',
        compression: ''
    }]);

    // Fetch customers when component mounts
    useEffect(() => {
        fetchCustomerData();
    }, []);

    // Fetch customer data
    const fetchCustomerData = async () => {
        try {
            const userid = localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://server-5pxf.onrender.com/api/customers/${userid}`, {
                headers: {
                    'Authorization': authToken,
                }
            });

            if (response.status === 401) {
                const json = await response.json();
                alert(json.message);
                setLoading(false);
                window.scrollTo(0, 0);
                return;
            } else {
                const json = await response.json();
                if (Array.isArray(json)) {
                    console.log("CustomerData:-> ", json);
                    setCustomers(json);
                }
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    // Fetch invoices when a customer is selected
    useEffect(() => {
        if (selectedCustomer) {
            fetchInvoices(selectedCustomer.email); // Assuming customer object has an 'email' field
        }
    }, [selectedCustomer]);

    // Fetch invoice data for the selected customer
    const fetchInvoices = async (customerEmail) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://server-5pxf.onrender.com/api/customerwisedata/${customerEmail}`, {
                headers: {
                    'Authorization': authToken,
                }
            });

            if (response.status === 401) {
                const json = await response.json();
                alert(json.message);
                return;
            } else {
                const json = await response.json();
                if (Array.isArray(json)) {
                    console.log("InvoiceData:-> ", json);
                    setInvoices(json);
                }
            }
        } catch (error) {
            console.error('Error fetching invoice data:', error);
        }
    };

    // Handle customer selection
    const onChangeCustomer = (selectedOption) => {
        const customer = customers.find(c => c._id === selectedOption.value);
        setSelectedCustomer(customer);
        setSelectedInvoice(null); // Reset invoice selection when customer changes
        setInvoices([]); // Clear previous invoices
    };

    // Handle invoice selection
    const onChangeInvoice = (selectedOption) => {
        const invoice = invoices.find(i => i.job === selectedOption.value);
        setSelectedInvoice(invoice);
        setProject(invoice?.job || ""); // Set project state with invoice.job
    };

    // Handle input changes for Canadian Screw Piles
    const handleScrewPilesInputChange = (index, field, value) => {
        const updatedPiles = [...canadianScrewPiles];
        updatedPiles[index][field] = value;
        setCanadianScrewPiles(updatedPiles);
    };

    // Add a new Canadian Screw Piles section
    const addScrewPileSection = () => {
        setCanadianScrewPiles([...canadianScrewPiles, {
            quantity: '',
            model: '',
            averageDepth: '',
            outsideDiameter: '',
            wallThickness: '',
            helixDiameter: ''
        }]);
    };

    // Remove a Canadian Screw Piles section
    const removeScrewPileSection = (index) => {
        const updatedPiles = [...canadianScrewPiles];
        updatedPiles.splice(index, 1);
        setCanadianScrewPiles(updatedPiles);
    };

    // Handle input changes for Bearing Capacity
    const handleBearingCapacityInputChange = (index, field, value) => {
        const updatedBearingCapacity = [...bearingCapacity];
        updatedBearingCapacity[index][field] = value;
        setBearingCapacity(updatedBearingCapacity);
    };

    // Add a new Bearing Capacity section
    const addBearingCapacitySection = () => {
        setBearingCapacity([...bearingCapacity, {
            modelP: '',
            load: '',
            compression: ''
        }]);
    };

    // Remove a Bearing Capacity section
    const removeBearingCapacitySection = (index) => {
        const updatedBearingCapacity = [...bearingCapacity];
        updatedBearingCapacity.splice(index, 1);
        setBearingCapacity(updatedBearingCapacity);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!selectedCustomer) {
            alert('Please select a customer!');
            return;
        }

        const data = {
            clientAddress: selectedCustomer ? selectedCustomer.name : '', // Use customer name as clientAddress
            email: selectedCustomer ? selectedCustomer.email : '', // Use customer name as clientAddress
            project: selectedInvoice ? selectedInvoice.job : '', // Project remains a text input
            file,
            date,
            canadianScrewPiles,
            bearingCapacity
        };

        try {
            setLoading(true);
            const response = await fetch('https://server-5pxf.onrender.com/api/conformityReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Conformity Report Submitted Successfully!');
                navigate('/conformityreportlist');
            } else {
                alert('Failed to submit report.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the report.');
        } finally {
            setLoading(false);
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
                                        <a href='/conformityreportlist' className='btn btn-primary'>View List</a>
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-lg-12 col-md-6 col-sm-6 col-7 me-auto'>
                                        <p className='h3 fw-bold'>Conformity Report</p>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    {/* Customer Selection */}
                                    <div className='form-group row mb-3'>
                                        <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                            <label>Customer</label>
                                            <Select
                                                value={selectedCustomer ? { value: selectedCustomer._id, label: selectedCustomer.name } : null}
                                                onChange={onChangeCustomer}
                                                options={customers.map(customer => ({
                                                    value: customer._id,
                                                    label: customer.name,
                                                }))}
                                                placeholder="Select a customer"
                                                required
                                            />
                                        </div>
                                        {/* Invoice Selection */}
                                        <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
    <label>Project</label>
    <Select
        value={selectedInvoice ? { value: selectedInvoice.job, label: `Job: ${selectedInvoice.job}` } : null}
        onChange={onChangeInvoice}
        options={invoices.map(invoice => ({
            value: invoice.job, // Use invoice.job as the value
            label: `Job: ${invoice.job}`, // Display job as the label
        }))}
        placeholder="Select an invoice"
        isDisabled={!selectedCustomer} // Disable until a customer is selected
    />
</div>
                                        {/* Project as Text Input */}
                                        {/* <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                            <label>Project</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={project}
                                                onChange={(e) => setProject(e.target.value)}
                                                required
                                            />
                                        </div> */}
                                        <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                            <label>Date</label>
                                            <input
                                                type='date'
                                                className='form-control'
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                            <label>File</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={file}
                                                onChange={(e) => setFile(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Canadian Screw Piles Section */}
                                    <h3>1.0. Canadian Screw Piles</h3>
                                    {canadianScrewPiles.map((pile, index) => (
                                        <div key={index} className='row mb-3'>
                                            <div className='col-md-2'>
                                                <input
                                                    type='text'
                                                    placeholder='Quantity'
                                                    className='form-control'
                                                    value={pile.quantity}
                                                    onChange={(e) => handleScrewPilesInputChange(index, 'quantity', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-2'>
                                                <input
                                                    type='text'
                                                    placeholder='Model'
                                                    className='form-control'
                                                    value={pile.model}
                                                    onChange={(e) => handleScrewPilesInputChange(index, 'model', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-2'>
                                                <input
                                                    type='text'
                                                    placeholder='Average Depth'
                                                    className='form-control'
                                                    value={pile.averageDepth}
                                                    onChange={(e) => handleScrewPilesInputChange(index, 'averageDepth', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-2'>
                                                <input
                                                    type='text'
                                                    placeholder='Outside Diameter'
                                                    className='form-control'
                                                    value={pile.outsideDiameter}
                                                    onChange={(e) => handleScrewPilesInputChange(index, 'outsideDiameter', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-2'>
                                                <input
                                                    type='text'
                                                    placeholder='Wall Thickness'
                                                    className='form-control'
                                                    value={pile.wallThickness}
                                                    onChange={(e) => handleScrewPilesInputChange(index, 'wallThickness', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-2'>
                                                <input
                                                    type='text'
                                                    placeholder='Helix Diameter'
                                                    className='form-control'
                                                    value={pile.helixDiameter}
                                                    onChange={(e) => handleScrewPilesInputChange(index, 'helixDiameter', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {canadianScrewPiles.length > 1 && (
                                                <div className='col-12'>
                                                    <button type='button' className='btn btn-danger' onClick={() => removeScrewPileSection(index)}>Remove</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button type='button' className='btn btn-success' onClick={addScrewPileSection}>Add Canadian Screw Pile Section</button>

                                    {/* Bearing Capacity Section */}
                                    <h3 className='mt-4'>2.0. Bearing Capacity</h3>
                                    {bearingCapacity.map((capacity, index) => (
                                        <div key={index} className='row mb-3'>
                                            <div className='col-md-3'>
                                                <input
                                                    type='text'
                                                    placeholder='Model P'
                                                    className='form-control'
                                                    value={capacity.modelP}
                                                    onChange={(e) => handleBearingCapacityInputChange(index, 'modelP', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-3'>
                                                <input
                                                    type='text'
                                                    placeholder='Load'
                                                    className='form-control'
                                                    value={capacity.load}
                                                    onChange={(e) => handleBearingCapacityInputChange(index, 'load', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-3'>
                                                <input
                                                    type='text'
                                                    placeholder='Compression'
                                                    className='form-control'
                                                    value={capacity.compression}
                                                    onChange={(e) => handleBearingCapacityInputChange(index, 'compression', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {bearingCapacity.length > 1 && (
                                                <div className='col-12'>
                                                    <button type='button' className='btn btn-danger' onClick={() => removeBearingCapacitySection(index)}>Remove</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button type='button' className='btn btn-success' onClick={addBearingCapacitySection}>Add Bearing Capacity Section</button>

                                    {/* Submit Button */}
                                    <div className='mt-4'>
                                        <button type='submit' className='btn btn-primary' disabled={isButtonDisabled}>Submit Report</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConformityReportSubmission;