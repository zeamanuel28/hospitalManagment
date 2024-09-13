'use client';
import { FormatDateTime } from '@/helper/FormatDate';
import {Button, Descriptions, Table, Tag} from 'antd';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { FaEye } from 'react-icons/fa6';
import ModalForm from '../modal/Modal';
import TreatmentInfo from '../description/TreatmentInfo';

const TreatmentTab = ({id}) => {
  const [patinetTreatment, setPatientTreatment] = useState ([]);
  const [loading, setLoading] = useState (false);

  const getPatientVitals = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/treatment/get/${id}`);
      setLoading (false);
      setPatientTreatment (res.data.results);
    } catch (error) {
      openNotification('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };
  useEffect (() => {
    getPatientVitals ();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalContentTitle, setModalContentTitle] = useState('');

  const columns = [
    {
      title: 'Visit Type',
      dataIndex: 'visitType',
      key: 'visitType',
      render:r=>(<Tag color={r==='New'?'green':'orange'}>{r}</Tag>),
      width:'100px'
    },
    {
      title: 'Complaint',
      dataIndex: 'complaint',
      key: 'complaint',
      width:'200px'
    },
    {
      title: 'By',
      dataIndex: 'physicianId',
      key: 'physicianId',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render:r=>(<span>{FormatDateTime(r)}</span>)
    },
    {
      title: 'Action',
      width: '80px',
      fixed: 'right',
      key: 'operation',
      render: r => (
        <Button
          style={{
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() =>{setModalContentTitle('Treatment Info');setOpenModal (true);setModalContent(<TreatmentInfo data={r}/>)}}
        >
          <FaEye/>
        </Button>
      ),
    },
  ];

  
  return (
    <div style={{height: '500px', overflow: 'scroll'}}>
      <ModalForm
      open={openModal}
      close={() => setOpenModal (false)}
      title={modalContentTitle}
      content={modalContent}
    />
      <Button onClick={getPatientVitals} loading={loading}>Reload</Button>
      <Table
      size='small'
        columns={columns}
        // scroll={{
        //   x: 1500,
        // }}
        pagination={{
          defaultPageSize: 7,
          showSizeChanger: false,
        }}
        dataSource={patinetTreatment}
        loading={loading}
      />
    </div>
  );
};

export default TreatmentTab;
