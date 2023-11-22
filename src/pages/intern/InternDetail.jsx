import React, { useEffect, useState } from "react";
import { InternButton, InternDetails } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { Icon } from "@iconify/react";

const InternDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [vacancy, setVacancy] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/vacancies/${id}`);
        setVacancy(response.data.vacancy);
        setIsLoading(false);
        console.log(response.data.vacancy);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onBatal = () => {
    axiosClient
      .put(`/appliances/${vacancy.id}/cancel`)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch((err) => {
        const response = err.response;
        if (response && (response.status === 401 || response.status === 500)) {
          setMessage(response.data.message);
        }
      });
  };

  const onDaftar = () => {
    const payload = {
      vacancy_id: vacancy.id,
    };

    axiosClient
      .post("/appliances", payload)
      .then(() => {
        setMessage("Berhasil daftar!");
      })
      .catch((err) => {
        const response = err.response;
        if (response && (response.status === 401 || response.status === 500)) {
          setMessage(response.data.message);
          console.log(response.data.message);
        }
      });
  };

  useEffect(() => {
    if (message) {
      const timeoutId = setTimeout(() => {
        navigate("/intern");
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [message, navigate]);

  return (
    <div className='m-2 md:m-10 mt-24 shadow-xl transition duration-300 dark:bg-secondary-dark-bg bg-white rounded-3xl'>
      {isLoading ? (
        <div className='flex items-center justify-center h-screen'>
          <span className='loading loading-spinner loading-lg'></span>
        </div>
      ) : (
        <>
          {message && (
            <div
              role='alert'
              className='alert alert-success fixed w-auto top-16 right-10'
            >
              <Icon icon='icon-park-solid:success' width={30} />
              <span>{message}</span>
            </div>
          )}
          <InternDetails vacancy={vacancy} />
          <div className='flex justify-center'>
            <div className='m-10 flex justify-center items-center gap-7 text-center w'>
              <InternButton vacancy={vacancy} text='simpan' left />
              {vacancy.in_pending ? (
                <InternButton
                  vacancy={vacancy}
                  text='batal daftar'
                  onClick={() => onBatal()}
                />
              ) : vacancy.in_processed ? (
                <InternButton vacancy={vacancy} text='Processing' />
              ) : (
                <InternButton
                  vacancy={vacancy}
                  text='daftar'
                  onClick={() => onDaftar()}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InternDetail;