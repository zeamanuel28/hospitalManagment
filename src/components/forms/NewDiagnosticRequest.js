'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input, Select} from 'antd';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useContext, useState} from 'react';
import BodyType from '@/helper/BodyPart.json'
import DiagnosticTest from '@/helper/DiagnosticTest.json'

const NewDiagnosticForm = ({id,openModalFun}) => {
  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const [loading, setLoading] = useState (false);

  let DiagnosticTestOption=DiagnosticTest.map(d => ({
      value: d.name, 
      label: d.name
    }));

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/diagnostic/new`, {
        patientId: id,
        physicianId: localStorage.getItem ('BHPFMS_IdNo'),
        test:values.test,
        bodyType:values.bodyType,
        reason:values.reason,
        priority:values.priority,
        instructions:values.instructions,
      });
      setLoading (false);
      openModalFun(false)
      openNotification ('success', res.data.message, 3, 'green');
    } catch (error) {
      openNotification ('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>

      <div style={{display:'flex',justifyContent:'space-between'}}>
      <Form.Item
        style={{margin: '0',width:'48%'}}
        name="test"
        label="Test"
        rules={[
          {
            required: true,
            message: 'Please input Test Type',
          },
        ]}
      >
        <Select
          options={DiagnosticTestOption}
        />
      </Form.Item>

      <Form.Item
        style={{margin: '0',width:'48%'}}
        rules={[
          {
            required: true,
            message: 'Please input Body Type',
          },
        ]}
        name="bodyType"
        label="Body Part"
      >
        <Input />
      </Form.Item>
      </div>

      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please input Reason',
          },
        ]}
        style={{margin: '0'}}
        name="reason"
        label="Reason"
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        style={{margin: '0'}}
        rules={[
          {
            required: true,
            message: 'Please input Priority',
          },
        ]}
        name="priority"
        label="Priority"
      >
        <Select
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
        style={{marginTop: '10px'}}
        name="instructions"
        label="Instructions"
        rules={[
          {
            required: true,
            message: 'Please input Priority',
          },
        ]}
      >
        <Input.TextArea />
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

export default NewDiagnosticForm;
