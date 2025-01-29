import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../shared/Navbar';

const MissingPersonsSearch = () => {
  const [searchParams, setSearchParams] = useState({
    DateFrom: '15/01/2025',
    DateTo: '16/01/2025',
    AgeFrom: 0,
    AgeTo: 100
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e, page = 1) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        ...searchParams,
        page,
        pageSize
      };
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(`http://localhost:4001/api/missingSearch?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(null, newPage);
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1);
    handleSearch(null, 1);
  };

  // Function to extract ImID from the image URL
  const getImgIdFromUrl = (url) => {
    const match = url.match(/ImID=([^&]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
    <Navbar />
    <div className="p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-6">Missing Persons Search</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date From</label>
            <input
              type="text"
              name="DateFrom"
              value={searchParams.DateFrom}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date To</label>
            <input
              type="text"
              name="DateTo"
              value={searchParams.DateTo}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age From</label>
            <input
              type="number"
              name="AgeFrom"
              value={searchParams.AgeFrom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age To</label>
            <input
              type="number"
              name="AgeTo"
              value={searchParams.AgeTo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Search size={20} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Results Table */}
      {data && (
        <div className="overflow-x-auto">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <strong>Total Records: {data.totalRecords}</strong>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="mr-2">Records per page:</label>
                <select 
                  value={pageSize} 
                  onChange={handlePageSizeChange}
                  className="p-2 border rounded"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
          
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Sr. No</th>
                <th className="border p-2">Photo</th>
                <th className="border p-2">Date of Registration</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Incident Place</th>
                <th className="border p-2">Police Station</th>
                <th className="border p-2">District</th>
              </tr>
            </thead>
            <tbody>
              {data.missingPersons.map((person) => (
                <tr key={person.srNo} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{person.srNo}</td>
                  <td className="border p-2">
                    <img
                      src={`http://localhost:4001/api/missing-person-image/${getImgIdFromUrl(person.imageUrl)}`}
                      alt={person.nameOfMissingPerson}
                      className="w-24 h-24"
                  
                    />
                  </td>
                  <td className="border p-2">{person.dateOfRegistration}</td>
                  <td className="border p-2">{person.nameOfMissingPerson}</td>
                  <td className="border p-2 text-center">{person.age}</td>
                  <td className="border p-2">{person.incidentPlace}</td>
                  <td className="border p-2">{person.policeStation}</td>
                  <td className="border p-2">{person.district}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              Showing page {data.currentPage} of {data.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === data.totalPages}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default MissingPersonsSearch;