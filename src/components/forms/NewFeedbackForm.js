'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input} from 'antd';
import axios from 'axios';
import React, {useContext, useState} from 'react';
import { BsFillSendFill } from 'react-icons/bs';

const NewFeedbackForm = ({openModalFun,id}) => {
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);
  const [form] = Form.useForm();

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/sms/feedback/new`, {
        subject: values.subject,
        message: values.message,
        type:'User',
        from:id,
      });
      setLoading (false);
      openModalFun(false)
      openNotification ('success', res.data.message, 3, 'green');
      form.resetFields();
    } catch (error) {
      setLoading (false);
      openNotification ('error', error.response.data.message, 3, 'red');
    }
  };
  const onFinishFailed = errorInfo => {
    console.log ('Failed:', errorInfo);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        style={{margin: '5px'}}
        label="Subject"
        rules={[
          {
            required: true,
            message: 'Please input subject',
          },
        ]}
        name="subject"
      >
        <Input />
      </Form.Item>

      
      <Form.Item
        style={{margin: '5px'}}
        label="Message"
        rules={[
          {
            required: true,
            message: 'Please input message',
          },
        ]}
        name="message"
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
          style={{display:'flex',alignItems:'center',gap:'5px'}}
        >
          <BsFillSendFill/> Send
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewFeedbackForm;
