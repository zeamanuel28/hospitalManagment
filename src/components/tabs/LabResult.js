'use client';
import { FormatDateTime } from '@/helper/FormatDate';
import {Button, Descriptions, Table, Tag} from 'antd';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { FaEye } from 'react-icons/fa6';
import ModalForm from '../modal/Modal';
import VitalsInfo from '../description/VitalsInfo';
import DiagnosticResultInfo from '../description/DiagnosticReslutInfo';

const LabResult = ({id}) => {
  const [patinetLabResults, setPatientLabResults] = useState ([]);
  const [loading, setLoading] = useState (false);

  const getPatientLabResults = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/diagnostic/results/get/${id}`);
      setLoading (false);
      console.log (res.data);
      setPatientLabResults (res.data.results);
    } catch (error) {
      console.log (error);
      // openNotification('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };
  useEffect (() => {
    getPatientLabResults ();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalContentTitle, setModalContentTitle] = useState('');

  const columns = [
    {
      title: 'Test',
      dataIndex: 'test',
      key: 'test',
    },
    {
      title: 'By',
      dataIndex: 'diagnosticId',
      key: 'diagnosticId',
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
          onClick={() =>{setModalContentTitle('Diagnostic Info');setOpenModal (true);setModalContent(<DiagnosticResultInfo data={r}/>)}}
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
      <Button onClick={getPatientLabResults} loading={loading}>Reload</Button>
      <Table
      size='small'
        columns={columns}
        pagination={{
          defaultPageSize: 7,
          showSizeChanger: false,
        }}
        dataSource={patinetLabResults}
        loading={loading}
      />
    </div>
  );
};

export default LabResult;
