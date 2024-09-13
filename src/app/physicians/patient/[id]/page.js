'use client'
import React, { useContext, useEffect, useState } from 'react';
import {Badge, Button, Descriptions, Form, Input, Select, Tabs} from 'antd';
import ModalForm from '@/components/modal/Modal';
import axios from 'axios';
import NewPrescriptionForm from '@/components/forms/NewPrescriptionForm';
import NewDiagnosticForm from '@/components/forms/NewDiagnosticRequest';
import VitalsTab from '@/components/tabs/VitalsTab';
import { useParams } from 'next/navigation';
import NewPhAppointmentForm from '@/components/forms/NewPhAppointment';
import TreatmentForm from '@/components/forms/TreatmentForm';
import LabResult from '@/components/tabs/LabResult';
import TreatmentTab from '@/components/tabs/TreatmentTab';
import PrescriptionTab from '@/components/tabs/PrescriptionTab';

const PatientDetailPhysician = () => {
  const{id}=useParams()
  const [patientData,setPatientData]=useState([])
  const [PId, setPId] = useState ('');

  const getPatientData=async()=>{
    try {
      const res=await axios.get(`/api/patient/details/${id}`)
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
      label: 'Vitals',
      children: <VitalsTab id={id}/>,
    },
    {
      key: '3',
      label: 'Treament',
      children: <TreatmentTab id={id}/>,
    },
    {
      key: '4',
      label: 'Medications',
      children: <PrescriptionTab id={PId}/>,
    },
    {
      key: '5',
      label: 'Lab and test results',
      children: <LabResult id={PId}/>,
    },
  ];

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
    <div>Registerd Date:23/03/2001   <Badge status='success' text="Active"/></div>
    <div>
        <Button disabled={!PId} style={{marginRight:'10px'}} onClick={() =>{setModalContentTitle('Treatment');setOpenModal (true);setModalContent(<TreatmentForm openModalFun={(e) => setOpenModal(e)} id={id}/>)}}>Treatment</Button>
        <Button disabled={!PId} style={{marginRight:'10px'}} onClick={() =>{setModalContentTitle('Diagnostic');setOpenModal (true);setModalContent(<NewDiagnosticForm openModalFun={(e) => setOpenModal (e)} id={PId}/>)}}>Diagnostic</Button>
        <Button disabled={!PId} style={{marginRight:'10px'}} onClick={() =>{setModalContentTitle('Prescription');setOpenModal (true);setModalContent(<NewPrescriptionForm openModalFun={(e) => setOpenModal (e)} id={PId}/>)}}>Prescription</Button>
        <Button disabled={!PId} onClick={() => {setModalContentTitle('Appointment');setOpenModal (true);setModalContent(<NewPhAppointmentForm id={PId} openModalFun={(e) => setOpenModal (e)}/>)}}>Set Appointment</Button></div>
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
export default PatientDetailPhysician;