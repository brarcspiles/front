import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Usernav from './Usernav';
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';

const WaiverRequestList = () => {

  const [waivers, setWaivers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true") {
      navigate("/");
    }
    const fetchWaivers = async () => {
      const userId = localStorage.getItem('userid');

      try {
        setLoading(true);
        const response = await fetch(`https://server-5pxf.onrender.com/api/getAllWaivers?userId=${encodeURIComponent(userId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.length > 0) {
          setWaivers(data);
          console.log(data, "Data");
        } else {
          setWaivers([]);
          setError('No waivers found for this user.');
        }
      } catch (err) {
        console.error('Error fetching waivers:', err);
        setError('Failed to fetch waivers.');
      } finally {
        setLoading(false);
      }
    };

    fetchWaivers();
  }, [])
  const getCurrentPageInvoices = () => {
    const filteredInvoices = getFilteredInvoices();
    const startIndex = currentPage * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredInvoices.slice(startIndex, startIndex + entriesPerPage);
    // return invoices.slice(startIndex, endIndex);
  };


  if (error) {
    return <div>{error}</div>;
  }
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this waiver?")) {
      try {
        const response = await fetch(`https://server-5pxf.onrender.com/api/deleteWaiver?id=${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert('Waiver deleted successfully');
          // Optionally, refresh the list of waivers here
          // For example, you could call a function to fetch the updated list
          // Update the waivers list by removing the deleted item
        setWaivers(prevWaivers => prevWaivers.filter(waiver => waiver._id !== id));
        } else {
          alert('Failed to delete waiver');
        }
      } catch (error) {
        console.error('Error deleting waiver:', error);
        alert('There was an error deleting the waiver. Please try again.');
      }
    }
  };

  return (
    <div className='bg'>
      {
        loading ?
          <div className='row'>
            <ColorRing
              // width={200}
              loading={loading}
              // size={500}
              display="flex"
              justify-content="center"
              align-items="center"
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div> :

          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                <div>
                  <Usernavbar />
                </div>
              </div>

              <div className='col-lg-10 col-md-9 col-12 mx-auto'>
                <div className='d-lg-none d-md-none d-block mt-2'>
                  <Usernav />
                </div>
                <div className='bg-white my-5 p-4 box mx-4'>
                  <div className=''>
                    {error && <Alertauthtoken message={error} onClose={() => setError('')} />}
                  </div>

                  <div className='row py-2'>
                    <div className='col-lg-4 col-md-6 col-sm-6 col-7 me-auto'>
                      <p className='h5 fw-bold'>Waiver Requests List</p>
                    </div>

                    <div className='col-lg-3 col-md-4 col-sm-4 col-5 text-lg-end text-md-end text-sm-end text-end'>
                    <a href='/userpanel/waiverrequest' className='btn btn-primary'>Add New</a>
                    </div>
                  </div>
                  <hr />


                  <div className='row px-2 table-responsive'>
                    <table className='table table-bordered'>
                      <thead>
                        <tr>
                          <th scope='col'>Email</th>
                          <th scope='col'>Company name</th>
                          <th scope='col'>Job Address</th>
                          <th scope='col'>Print name</th>
                          <th scope='col'>Sign</th>
                          <th scope='col'>Status</th>
                          <th scope='col'>Actions</th> {/* Add a column for Actions */}
                        </tr>
                      </thead>
                      <tbody>
                        {waivers.map((list, index) => (
                          <tr key={index}>
                            <td>{list.waiveremail}</td>
                            <td width='20%'>{list.companyname}</td>
                            <td width='20%'>{list.jobsiteaddress}</td>
                            <td>{list.printname}</td>
                            <td>
                              {list.status === 'Signed' ? (
                                <a className='btn btn-success' href={`/waiversignedview?id=${list._id}`}>View</a>
                              ) : (
                                ''
                              )}
                            </td>
                            <td>
                              {list.status === 'Signed' ? (
                                <div className='text-success'>
                                  <i className="fa fa-check-circle"></i> Signed
                                </div>
                              ) : (
                                <div className='text-danger'>
                                  <i className="fa fa-times-circle"></i> Pending
                                </div>
                              )}
                            </td>
                            <td> {/* Actions column */}
                              <button
                                className='btn btn-danger'
                                onClick={() => handleDelete(list._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default WaiverRequestList