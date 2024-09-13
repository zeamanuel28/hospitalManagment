'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input, Select, TimePicker} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {useRouter} from 'next/navigation';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';

const NewPaymentRequestForm = ({data}) => {
  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const [loading, setLoading] = useState (false);

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/payment/request`, {
        patientId: data.PId,
        payFor:data._id,
        payType:'Prescription',
        pharmacy:localStorage.getItem ('BHPFMS_IdNo'),
        amount: values.amount,
      });
      setLoading (false);
      openNotification ('success', res.data.message, 3, 'green');
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
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Form.Item
          label="Amount (in Birr)"
          style={{margin: '5px', width: '48%'}}
          name="amount"
          rules={[
            {
              required: true,
              message: 'Please select Amount',
            },
          ]}
        >
          <Input type='number'style={{width:'100%'}}/>
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

export default NewPaymentRequestForm;
