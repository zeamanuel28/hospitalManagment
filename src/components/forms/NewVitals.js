'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input, Select} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useContext, useState} from 'react';

const NewVitalsForm = ({id,openModalFun}) => {
  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const [loading, setLoading] = useState (false);
  const [form] = Form.useForm();

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/patient/writevitals`, {
        patientId:id,
      complaint:values.complaint,
      triageId:localStorage.getItem('BHPFMS_IdNo'),
      medicalHistory:values.medicalHistory,
      symptoms:values.symptoms,
      symptomSeverity:values.severity,
      vitalsSigns:values.vitalSign,
      });
      setLoading (false)
      openModalFun();
      form.resetFields()
      openNotification ('success', res.data.message, 3, 'green');
    } catch (error) {
      console.log(error)
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
      form={form}
      autoFocus="true"
    >
      <Form.Item
        style={{margin: '5px'}}
        label="Complaint"
        rules={[
          {
            required: true,
            message: 'Please input Complaint',
          },
        ]}
        name="complaint"
      >
        <Input />
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Symptoms"
        rules={[
          {
            required: true,
            message: 'Please input Symptoms',
          },
        ]}
        name="symptoms"
      >
        <Input />
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Medical history"
        rules={[
          {
            required: true,
            message: 'Please input Medical',
          },
        ]}
        name="medicalHistory"
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        style={{margin: '5px'}}
        label="Symptom severity"
        name="severity"
        rules={[
          {
            required: true,
            message: 'Please input severity',
          },
        ]}
      >
        <Select
          placeholder="Search to Select"
          options={[
            {
              value: 'High',
              label: 'High',
            },
            {
              value: 'Mid',
              label: 'Mid',
            },
            {
              value: 'Normal',
              label: 'Normal',
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        style={{margin: '5px'}}
        label="Vitals Signs"
        rules={[
          {
            required: true,
            message: 'Please input Vitals',
          },
        ]}
        name="vitalSign"
      >
        <TextArea />
      </Form.Item>

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

export default NewVitalsForm;
