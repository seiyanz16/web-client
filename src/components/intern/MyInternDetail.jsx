import React, { createRef, useEffect, useState } from "react";
import InputDate from "../inputs/InputDate";
import axiosClient from "../../axios-client";
import { useMutation, useQuery } from "react-query";
import InputText from "../profile/InputText";
import LoginBtn from "../login/LoginBtn";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const MyIntern = ({ vacancy }) => {
  const navigate = useNavigate();
  const startDateRef = createRef();
  const [startDate, setStartDate] = useState("");
  const endDateRef = createRef();
  const [endDate, setEndDate] = useState("");
  const extendRef = createRef();
  const [extend, setExtend] = useState(1);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { data: user } = useQuery("user", () =>
    axiosClient.get("/me").then(({ data }) => data)
  );
  const { data: appliancesData } = useQuery(
    "internDates",
    async () => {
      const response = await axiosClient.get("/appliances/accepted");
      return response.data.intern_date[0];
    },
    {
      enabled: !!user?.id,
    }
  );
  useEffect(() => {
    if (appliancesData) {
      setStartDate(appliancesData.start_date || "");
      setEndDate(appliancesData.end_date || "");
    }
  }, [appliancesData]);

  const { mutate, data } = useMutation(
    (payload) =>
      axiosClient.put(
        `/appliances/${appliancesData.company_id}/edit-date`,
        payload
      ),
    {
      onSuccess: () => {
        setMessage("Tanggal berhasil diubah");
        setError(null);
      },
      onError: (err) => {
        const response = err.response;
        if (response.status === 500) {
          setError(response.data.message);
          setMessage(null);
        }
      },
    }
  );

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      start_date: startDateRef.current.value,
      end_date: endDateRef.current.value,
      extend: extendRef.current.value,
    };

    mutate(payload);
  };

  useEffect(() => {
    if (message || error) {
      const timeoutId = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [message, error]);

  return (
    <div className='flex flex-col'>
      <div className='m-10'>
        <h1 className='text-dark transition duration-300 dark:text-lightOne text-2xl font-medium capitalize'>
          {vacancy.name}
        </h1>
        <div className='flex'>
          <img
            src={vacancy.company.logo_url}
            alt='logo'
            width={90}
            className='my-5'
          />
          <div className='flex flex-col justify-center ml-5'>
            <h1 className='text-dark transition duration-300 dark:text-lightOne font-semibold'>
              {vacancy.company.name}
            </h1>
            <p className='text-dark transition duration-300 dark:text-lightOne font-medium'>
              {vacancy.company.address}, {vacancy.company.city},{" "}
              {vacancy.company.state}
            </p>
            <a
              className='text-dark transition duration-300 dark:text-lightOne underline'
              href={vacancy.company.website}
              target='blank'
            >
              {vacancy.company.website}
            </a>
          </div>
        </div>
        <div className='flex gap-5 text-sm'>
          <h1 className='text-main'>{vacancy.applied} pendaftar</h1>
          <h1 className='text-gray transition duration-300 dark:text-slate-300'>
            9 september 2006
          </h1>
        </div>
      </div>
      <div className='mx-10 mb-10 text-dark transition duration-300 dark:text-lightOne md:text-lg text-base'>
        <h1 className='text-2xl font-medium capitalize'>deskripsi pekerjaan</h1>
        <h1 className='first-letter:uppercase mt-5'>{vacancy.description}</h1>
      </div>
      <div className='mx-10 mb-10 text-dark transition duration-300 dark:text-lightOne md:text-lg text-base'>
        <form onSubmit={onSubmit}>
          <h1 className='text-2xl font-medium capitalize'>edit tanggal</h1>
          <InputDate
            label='Tanggal Mulai'
            name='start_date'
            innerRef={startDateRef}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <InputDate
            label='Tanggal Selesai'
            name='end_date'
            innerRef={endDateRef}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <InputText
            label='Lama Perpanjang (Bulan)'
            name='extend'
            type='number'
            innerRef={extendRef}
            placeholder='Perpanjang waktu magang'
            value={extend}
            onChange={(e) => setExtend(e.target.value)}
          />
          {message && (
            <div
              role='alert'
              className='alert alert-success fixed w-auto top-16 right-10 flex'
            >
              <Icon icon='icon-park-solid:success' width={30} />
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div
              role='alert'
              className='alert alert-error fixed w-auto top-16 right-10 flex'
            >
              <Icon icon='mingcute:alert-fill' width={30} />
              <span>{error}</span>
            </div>
          )}
          <LoginBtn text='Save' />
        </form>
      </div>
    </div>
  );
};

export default MyIntern;