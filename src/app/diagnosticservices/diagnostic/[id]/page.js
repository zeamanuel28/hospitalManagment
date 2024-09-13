'use client';
import NewDiagnosticResultForm from '@/components/forms/NewDiagnosticResult';
import ModalForm from '@/components/modal/Modal';
import {useParams} from 'next/navigation';
import {Badge, Button, Form, Input, Tabs} from 'antd';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import LabResult from '@/components/tabs/LabResult';

const RequestDetail = () => {
  const [openModal, setOpenModal] = useState (false);
  const [modalContent, setModalContent] = useState ();
  const [modalContentTitle, setModalContentTitle] = useState ('');
  const {id} = useParams ();
  const [PId, setPId] = useState ('');
  const [patientData, setPatientData] = useState ([]);

  console.log(id.slice(8,))
  const getPatientData = async () => {
    try {
      const res = await axios.get (`/api/patient/details/${id.slice(0,8)}`);
      setPatientData (res.data.patient);
      setPId (res.data.patient._id);
      console.log (res.data.patient);
    } catch (error) {
      console.log (error);
    }
  };

  useEffect (() => {
    getPatientData ();
  }, []);

  const items = [
    {
      key: '5',
      label: 'Lab and test results',
      children: <LabResult id={PId}/>,
    },
    {
      key: '6',
      label: 'Patient Log',
      children: 'Content of Tab Pane 6',
    },
  ];

  return (
    <div>
      <ModalForm
        open={openModal}
        close={() => setOpenModal (false)}
        title={modalContentTitle}
        content={modalContent}
      />
      <div style={{width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            Registerd Date:23/03/2001 <Badge status="success" text="Active" />
          </div>
          <div
            style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}
          >

            <Button
            disabled={!id}
              onClick={() => {
                setModalContentTitle ('Result');
                setOpenModal (true);
                setModalContent (<NewDiagnosticResultForm id={id.slice(0,8)} requestId={id.slice(8,)} />);
              }}
            >
              Results
            </Button>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {Object.keys (patientData).length > 0
            ? <Form
                layout="vertical"
                style={{width: '35%'}}
                initialValues={patientData}
              >
                <h3>Personal Info</h3>
                <div
                  style={{display: 'grid', gridTemplateColumns: 'auto auto'}}
                >
                  <Form.Item
                    style={{margin: '5px'}}
                    label="Full Name"
                    name="fullName"
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item style={{margin: '5px'}} label="Sex" name="sex">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    style={{margin: '5px'}}
                    label="Date Of Birth"
                    name="dateOfBirth"
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    style={{margin: '5px'}}
                    label="Blood Type"
                    name="bloodType"
                  >
                    <Input disabled />
                  </Form.Item>
                </div>

                <h3 style={{margin: '10px 0 0 0'}}>Contact Info</h3>

                <div
                  style={{display: 'grid', gridTemplateColumns: 'auto auto'}}
                >
                  <Form.Item style={{margin: '5px'}} label="Phone" name="phone">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item style={{margin: '5px'}} label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item style={{margin: '5px'}} label="City" name="city">
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    style={{margin: '5px'}}
                    label="Subcity"
                    name="subCity"
                  >
                    <Input disabled />
                  </Form.Item>
                </div>

                <h3 style={{margin: '10px 0 0 0'}}>Emergency Contact</h3>

                <div
                  style={{display: 'grid', gridTemplateColumns: 'auto auto'}}
                >
                  <Form.Item
                    style={{margin: '5px'}}
                    label="Full Name"
                    name="emergencyContactName"
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    style={{margin: '5px'}}
                    label="Phone"
                    name="emergencyContactPhone"
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    style={{margin: '5px'}}
                    label="Relationship"
                    name="emergencyContactRelationship"
                  >
                    <Input disabled />
                  </Form.Item>

                </div>

              </Form>
            : <p>Loading patient data...</p>}
          <div
            style={{
              width: '63%',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              height: '70vh',
              overflow: 'scroll',
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={items}
              indicator={{
                size: origin => origin - 20,
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
