import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Usernav from './Usernav';
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';


const ConformityReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('https://server-5pxf.onrender.com/api/conformityReport');
                if (response.ok) {
                    const data = await response.json();
                    setReports(data);
                } else {
                    setError('Failed to load reports');
                }
            } catch (error) {
                setError('Error fetching reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <p>Loading reports...</p>;
    if (error) return <p>{error}</p>;

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
                      <p className='h5 fw-bold'>Conformity Report List</p>
                    </div>

                    <div className='col-lg-3 col-md-4 col-sm-4 col-5 text-lg-end text-md-end text-sm-end text-end'>
                    <a href='/conformityreport' className='btn btn-primary'>Add New</a>
                    </div>
                  </div>
                  <hr />



        <div className='row px-2 table-responsive'>
            
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Client Address</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length > 0 ? (
                        reports.map(report => (
                            <tr key={report._id}>
                                <td>{report._id}</td>
                                <td>{report.clientAddress}</td>
                                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`http://localhost:5173/conformityReport/${report._id}`} className='btn btn-primary'>
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No reports available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        
        </div>
        </div>
        </div>
        </div>
           }
        </div>
    );
};

export default ConformityReportList;
