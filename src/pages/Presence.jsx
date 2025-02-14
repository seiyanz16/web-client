import { useState } from "react";
import { Header, CompanyDropdown, Loading } from "../components";
import ReactPaginate from "react-paginate";
import useCompanyDetails from "../hooks/useCompanyDetails";
import usePresences from "../hooks/usePresence";

const Presence = () => {
  const { companyDetails, selectedCompanyId, setSelectedCompanyId } = useCompanyDetails();
  const { data: presences, isLoading } = usePresences(selectedCompanyId);

  const [currentPage, setCurrentPage] = useState(0);
  const presencesPerPage = 6;
  const pageCount = Math.ceil(
    presences?.length
      ? presences.length / presencesPerPage
      : 6 / presencesPerPage
  );
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const slicedPresences = presences?.slice(
    currentPage * presencesPerPage,
    (currentPage + 1) * presencesPerPage
  );

  const handleCompanyChange = (event) => {
    setSelectedCompanyId(event.target.value);
    setCurrentPage(0);
  };

  return (
    <div className='m-2 md:m-10 p-8 md:p-10 bg-white dark:bg-dark rounded-3xl transition duration-300'>
      <div className='md:flex md:items-center md:justify-between mb-5'>
        <Header category='My' title='Presences' />
        <CompanyDropdown
          companyDetails={companyDetails}
          selectedCompanyId={selectedCompanyId}
          handleCompanyChange={handleCompanyChange}
          />
      </div>

      <div className='overflow-x-auto'>
        {isLoading ? (
          <Loading />
        ) : (
          <table className='table'>
            <thead>
              <tr className='border-b-dark dark:border-b-lightOne uppercase text-dark dark:text-lightOne'>
                <th>tanggal</th>
                <th>jam masuk</th>
                <th>jam keluar</th>
                <th>lampiran</th>
                <th>deskripsi</th>
                <th>status</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {slicedPresences?.map((presence) => (
                <tr
                  className='border-b-dark dark:border-b-lightOne'
                  key={presence.id}
                >
                  <th>{presence.date}</th>
                  <th>{presence.check_in}</th>
                  <th>{presence.check_out}</th>
                  <th>
                    <img
                      src={presence.attachment_url}
                      alt={presence.attachment_url}
                      width='150'
                    />
                  </th>
                  <th>{presence.description}</th>
                  <th>
                    <button
                      className='uppercase text-sm p-2 rounded-md text-lightOne'
                      style={{ backgroundColor: presence.presence_status.color }}
                      disabled
                    >
                      {presence.presence_status.name}
                    </button>
                  </th>
                  <th>
                    <button
                      className={`uppercase text-sm ${
                        presence.is_approved
                          ? "bg-[#A3F0D0] p-2 rounded-md text-[#0FB782]"
                          : "bg-[#F5ED8D] p-2 rounded-md text-[#E9B207]"
                      }`}
                      disabled
                    >
                      {presence.is_approved ? "disetujui" : "pending"}
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className='flex flex-col justify-between'>
        <div className='flex flex-col items-start justify-center'>
          <p>Total Presences: {presences?.length}</p>
          <p>
            Page: {currentPage + 1} of {pageCount}
          </p>
        </div>
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          pageLinkClassName={"pagination__link"}
          activeLinkClassName={"pagination__link--active"}
          breakClassName={"pagination__break"}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
        />
      </div>
    </div>
  );
};

export default Presence;
