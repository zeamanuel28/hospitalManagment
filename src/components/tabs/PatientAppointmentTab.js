'use client';
import { FormatDateTime } from '@/helper/FormatDate';
import {Button, Descriptions, Popconfirm, Space, Table, Tag} from 'antd';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import { FaCalendarMinus, FaEye } from 'react-icons/fa6';
import ModalForm from '../modal/Modal';
import { FormatDay } from '@/helper/FormateDay';
import AppointmentInfo from '../description/AppointmentInfo';
import { AlertContext } from '@/context/AlertContext';

const PatientAppointmentTab = ({id}) => {
  const [patinetAppointments, setPatientAppointments] = useState ([]);
  const [loading, setLoading] = useState (false);
  const [loadingCancel, setLoadingCancel] = useState (false);
  const {openNotification} = useContext (AlertContext);

  const canacelAppointment = async (id) => {
    setLoadingCancel(true);
    try {
      const res = await axios.post (`/api/appointment/update`,{id:id,IdNo:localStorage.getItem ('BHPFMS_IdNo'),status:"Cancel"});
      setLoadingCancel(false);
      getPatientAppointments()
      openNotification('success', res.data.message, 3, 'green');
    } catch (error) {
      console.log (error);
      openNotification('error', error.response.data.message, 3, 'red');
      setLoadingCancel(false);
    }
  };

  const getPatientAppointments = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/appointment/get/patient/${id}`);
      setLoading (false);
      console.log (res.data);
      setPatientAppointments(res.data.appointments);
    } catch (error) {
      console.log (error);
      // openNotification('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };

  useEffect (() => {
    getPatientAppointments ();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalContentTitle, setModalContentTitle] = useState('');

  const columns = [
    {
      title: 'Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render:r=>(<span>{FormatDay(r)}</span>)
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      render:r=>(<span>{r} Am</span>),
      key: 'startTime',
    },
    {
      title: 'By',
      dataIndex: 'appointmentBy',
      key: 'appointmentBy',
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
      fixed: 'right',
      key: 'operation',
      render: r => (
        <Space>
        <Button
          style={{
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() =>{setModalContentTitle('Appointments Info');setOpenModal (true);setModalContent(<AppointmentInfo data={r}/>)}}
        >
          <FaEye/>
        </Button>
        {
          r.status==='Pending'&&
          <Popconfirm
          placement="topLeft"
          title={'are you sure?'}
          description={'Cancle the appointment'}
          okText="Yes"
          cancelText="No"
          onConfirm={()=>canacelAppointment(r._id)}
        >
       <Button 
       disabled={loadingCancel}
       loading={loadingCancel}
        style={{border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}
       ><FaCalendarMinus color='red'/></Button>
       </Popconfirm>
        }
      </Space>
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
      <Button onClick={getPatientAppointments} loading={loading}>Reload</Button>
      <Table
      size='small'
        columns={columns}
        pagination={{
          defaultPageSize: 7,
          showSizeChanger: false,
        }}
        dataSource={patinetAppointments}
        loading={loading}
      />
    </div>
  );
};

export default PatientAppointmentTab;
