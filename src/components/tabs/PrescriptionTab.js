'use client';
import { FormatDateTime } from '@/helper/FormatDate';
import {Button, Descriptions, Table, Tag} from 'antd';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { FaEye } from 'react-icons/fa6';
import ModalForm from '../modal/Modal';
import { FormatDay } from '@/helper/FormateDay';
import PrescriptionInfo from '../description/PrescriptionInfo';

const PrescriptionTab = ({id}) => {
  const [patinetPrescriptions, setPatientPrescriptions] = useState ([]);
  const [loading, setLoading] = useState (false);

  const getPatientPrescriptions = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/prescription/get/${id}`);
      setLoading (false);
      console.log (res.data);
      setPatientPrescriptions(res.data.results);
    } catch (error) {
      console.log (error);
      // openNotification('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };
  useEffect (() => {
    getPatientPrescriptions ();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalContentTitle, setModalContentTitle] = useState('');

  const columns = [
    {
      title: 'By',
      dataIndex: 'physicianId',
      key: 'physicianId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render:r=>(<Tag color={r==='Pending'?'yellow':r==='Completed'?"green":'red'}>{r}</Tag>),
      fixed: 'right',
      width:'100px',
    },
    {
      title: 'Created At',
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
          onClick={() =>{setModalContentTitle('Prescriptions Info');setOpenModal (true);setModalContent(<PrescriptionInfo data={r}/>)}}
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
      <Button onClick={getPatientPrescriptions} loading={loading}>Reload</Button>
      <Table
      size='small'
        columns={columns}
        pagination={{
          defaultPageSize: 7,
          showSizeChanger: false,
        }}
        dataSource={patinetPrescriptions}
        loading={loading}
      />
    </div>
  );
};

export default PrescriptionTab;
