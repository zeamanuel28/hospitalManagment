'use client'
import React, {useEffect, useState } from 'react';
import {Badge, Form, Input, Tabs} from 'antd';
import axios from 'axios';
import LabResult from '@/components/tabs/LabResult';
import PrescriptionTab from '@/components/tabs/PrescriptionTab';
import AppointmentTab from '@/components/tabs/AppointmentTab';
import LabRequest from '@/components/tabs/LabRequest';

const DashoardPatient = () => {
  const [patientData,setPatientData]=useState([])
  const [PId, setPId] = useState ('');

  const getPatientData=async()=>{
    try {
      const res=await axios.get(`/api/patient/details/${localStorage.getItem ('BHPFMS_IdNo')}`)
      setPatientData(res.data.patient)
      setPId(res.data.patient._id)
      console.log(res.data.patient)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getPatientData()
  },[])

  const items = [
    {
      key: '1',
      label: 'Appointment',
      children: <AppointmentTab id={PId}/>,
    },
    {
      key: '4',
      label: 'Medications',
      children: <PrescriptionTab id={PId}/>,
    },
    {
      key: '2',
      label: 'Lab Request',
      children: <LabRequest id={PId}/>,
    },
    {
      key: '5',
      label: 'Results',
      children: <LabResult id={PId}/>,
    },
  ];

  return(
    <>
    <div style={{display:'flex',justifyContent:'space-between'}}>
    <div>Registerd Date:23/03/2001   <Badge status='success' text="Active"/></div>
    </div>
<div style={{display:"flex",justifyContent:'space-between'}}>
{Object.keys(patientData).length > 0 ? (
    <Form
      layout="vertical"
      style={{width:'35%'}}
      initialValues={patientData}
    >
      <h3>Personal Info</h3>
      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
      <Form.Item
        style={{margin: '5px'}}
        label="Full Name"
        name="fullName"
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Sex"
        name="sex"
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Date Of Birth"
        name="dateOfBirth"
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Blood Type"
        name="bloodType"
      >
        <Input disabled/>
      </Form.Item>
      </div>

      <h3 style={{margin:'10px 0 0 0'}}>Contact Info</h3>

      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
      <Form.Item
        style={{margin: '5px'}}
        label="Phone"
        name="phone"
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Email"
        name="email"
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item style={{margin:'5px'}}
        label="City"
        name="city"
      > 
      <Input disabled/>
    </Form.Item>

    <Form.Item style={{margin:'5px'}}
        label="Subcity"
        name="subCity"
      > 
      <Input disabled/>
    </Form.Item>
      </div>

      <h3 style={{margin:'10px 0 0 0'}}>Emergency Contact</h3>

      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
      <Form.Item
        style={{margin: '5px'}}
        label="Full Name"
        name="emergencyContactName"
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Phone"
        name="emergencyContactPhone"
      >
        <Input disabled/>
      </Form.Item>
      <Form.Item style={{margin:'5px'}}
        label="Relationship"
        name="emergencyContactRelationship"

      >
        <Input disabled/>
      </Form.Item>
      
      </div>

    </Form>
):
    <p>Loading patient data...</p>
}
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
export default DashoardPatient;