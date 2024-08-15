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
                    
                    </div>
                  </div>
                  <hr />
               

                  <div className='row px-2 table-responsive'>
                    <table className='table table-bordered'>
                      <thead>
                        <tr>
                          <th scope='col'>Email</th>
                          <th scope='col'>Company name</th>
                          {/* <th scope='col'>Status</th> */}
                          <th scope='col'>Job Address</th>
                          {/* <th scope='col'>EMAIL STATUS</th> */}
                          <th scope='col'>Print name</th>
                          <th scope='col'>Sign</th>
                          <th scope='col'>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                      {waivers.map((list, index) => (
                        <tr key={index}>
                            <td>{list.waiveremail}</td>
                            <td>{list.companyname}</td>
                            <td>{list.jobsiteaddress}</td>
                            <td>{list.printname}</td>
                            <td><a href={`/waiversignedview?id=${list._id}`}>View</a></td>
                            <td>{list.status}</td>

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