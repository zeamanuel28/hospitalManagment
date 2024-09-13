'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input, Select} from 'antd';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useContext, useEffect, useState} from 'react';
import DepartmentList from '@/helper/Department.json';

const TreatmentForm = ({id,openModalFun}) => {
  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const [loading, setLoading] = useState (false);

  const onFinish = async values => {
    setLoading (true);
    try {
      console.log (id);
      const res = await axios.post (`/api/treatment/new`, {
        patientId: id,
        physicianId: localStorage.getItem ('BHPFMS_IdNo'),
        visitType: values.visitType,
        complaint: values.complaint,
        presentIllness: values.presentIllness,
        pastMedicalHistory: values.pastMedicalHistory,
        familyHistory: values.familyHistory,
        socialHistory: values.socialHistory,
        reviewOfSystems: values.reviewOfSystems,
        emotional: values.emotional,
      });
      setLoading (false);
      openModalFun(false)
      openNotification ('sucess', res.data.message, 3, 'green');
    } catch (error) {
      openNotification ('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log ('Failed:', errorInfo);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
      autoFocus="true"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Visit Type"
          name="visitType"
          rules={[
            {
              required: true,
              message: 'Please input Visit Type',
            },
          ]}
        >
          <Select
            placeholder="Search to Select"
            options={[
              {
                value: 'New',
                label: 'New',
              },
              {
                value: 'Follow Up',
                label: 'Follow Up',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Complaint"
          name="complaint"
          rules={[
            {
              required: true,
              message: 'Please input Complaint',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Detail of Present Illness"
          name="presentIllness"
          rules={[
            {
              required: true,
              message: 'Please input Detail of Present Illness',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Past Medical History"
          name="pastMedicalHistory"
          rules={[
            {
              required: true,
              message: 'Please input Past Medical History',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Family History"
          name="familyHistory"
          rules={[
            {
              required: true,
              message: 'Please input Family History',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Social History"
          name="socialHistory"
          rules={[
            {
              required: true,
              message: 'Please input Social History',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Review of Systems "
          name="reviewOfSystems"
          rules={[
            {
              required: true,
              message: 'Please input Review of Systems ',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Emotional Well-Being"
          name="emotional"
          rules={[
            {
              required: true,
              message: 'Please input Emotional Well-Being',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </div>

      <Form.Item
        style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}
      >
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
          loading={loading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TreatmentForm;
