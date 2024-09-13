'use client'
import React, { useContext, useEffect, useState } from 'react';
import {Badge, Button, Form, Input, Spin, Tabs, Tag} from 'antd';
import ModalForm from '@/components/modal/Modal';
import { AlertContext } from '@/context/AlertContext';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { FormatDateTime } from '@/helper/FormatDate';
import PatientLogs from '@/components/tabs/PatientLogs';

const PatientDetail = () => {
 
  const {openNotification} = useContext (AlertContext);
  const [PId, setPId] = useState ('');

  const [patientData,setPatientData]=useState([])
  const{id}=useParams()
  const getPatientData=async()=>{
    try {
      const res=await axios.get(`/api/patient/details/${id}`)
      setPatientData(res.data.patient)
      setPId(res.data.patient._id)
    } catch (error) {
    }
  }

  useEffect(()=>{
    getPatientData()
  },[])

  const items = [
    {
      key: '1',
      label: 'Patient Log',
      children: <PatientLogs id={id}/>,
    },
  ];
  const [loadingBan,setLoadingBan] = useState(false);

  const BanUser=async()=>{
    setLoadingBan(true)
    try {
      const res=await axios.post('/api/admin/banpatient',{IdNo:id})
      setLoadingBan(false)
      getPatientData()
      openNotification('success',res.data.message,3,'green')
    } catch (error) {
      setLoadingBan(false)
      openNotification ('error', error.response.data.message, 3, 'red');
    }
  }

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalContentTitle, setModalContentTitle] = useState('');

  return(
    <>
    <ModalForm
      open={openModal}
      close={() => setOpenModal (false)}
      title={modalContentTitle}
      content={modalContent}
    />

    <div style={{display:'flex',justifyContent:'space-between'}}>
    <div>Registerd {FormatDateTime(patientData.createdAt)}  <Badge status={patientData.status==='Active'?'success':"error"} text={patientData.status}/></div>
    <div style={{display:'flex',gap:'10px'}}>
      {<Button disabled={loadingBan} loading={loadingBan} danger={patientData.status==="Active"} onClick={()=>BanUser()}>{patientData.status==="In Active"?"unBan":'Ban'}</Button>}
    </div>
    </div>
<div style={{display:"flex",justifyContent:'space-between'}}>
    {Object.keys(patientData).length > 0 ? (
      <Form
      layout="vertical"
      initialValues={patientData}
      disabled={true}
      style={{width:'35%'}}
    >
      <h3 style={{margin:'10px 0 0 0'}}>Personal Info</h3>
      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
      <Form.Item
        style={{margin: '5px'}}
        label="Full Name"
        name="fullName"
      >
        <Input />
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Sex"
        name="sex"
      >
        <Input/>
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Date Of Birth"
        name="dateOfBirth"
      >
        <Tag>{FormatDateTime(patientData.dateOfBirth)}</Tag>
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Blood Type"
        name="bloodType"
      >
      <Input/>
      </Form.Item>
      </div>

      <h3 style={{margin:'10px 0 0 0'}}>Contact Info</h3>

      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
      <Form.Item
        style={{margin: '5px'}}
        label="Phone"
        name="phone"
      >
        <Input />
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Email"
        name="email"
      >
        <Input />
      </Form.Item>
      <Form.Item style={{margin:'5px'}}
        label="City"
        name="city"
      > 
      <Input/>
    </Form.Item>

    <Form.Item style={{margin:'5px'}}
        label="Sub City"
        name="subCity"
      > 
      <Input/>
    </Form.Item>
      </div>

      <h3 style={{margin:'10px 0 0 0'}}>Emergency Contact</h3>

      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
      <Form.Item
        style={{margin: '5px'}}
        label="Full Name"
        name="emergencyContactName"
      >
        <Input />
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Phone"
        name="emergencyContactPhone"
      >
        <Input />
      </Form.Item>
      <Form.Item style={{margin:'5px'}}
        label="Relationship"
        name="emergencyContactRelationship"
      >
         <Input/>
      </Form.Item>
      
      </div>
    </Form>
    ) : (
      <Spin>Loading Patient data...</Spin>
    )}
    <div style={{width:'63%',display:'flex',flexDirection:'column',gap:'10px',height:"70vh",overflow:'scroll'}}>
    <Tabs
        defaultActiveKey="1"
        items={items}
        indicator={{
          size: (origin) => origin - 20,
        }}
      />
    </div>
    </div>
    </>
  )
}
export default PatientDetail;