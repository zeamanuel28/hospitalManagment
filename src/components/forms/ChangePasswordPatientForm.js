'use client';
import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Input} from 'antd';
import {AlertContext} from '@/context/AlertContext';
import axios from 'axios';

const ChangePasswordPatientForm = () => {
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);

  const onFinish = async values => {
    setLoading (true);
    if (values.newPassword !== values.confirmPassword) {
      setLoading (false);
      return openNotification ('error', 'Confirm Password is Incorrect', 3, 'red');
    }
    try {
      const res = await axios.post (`/api/auth/patient/changepassword`, {
        IdNo: localStorage.getItem ('BHPFMS_IdNo'),
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      setLoading (false);
      openNotification ('sucess', res.data.message, 3, 'green');
    } catch (error) {
      openNotification ('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log ('Failed:', errorInfo);
  };
  
  // Check password strength
  const validatePasswordStrength = (rule, value, callback) => {
    // regex to check requirements
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  
    if(!regex.test(value)) {
      callback('Password must contain uppercase, lowercase, number and symbol with min 8 characters');
    }
    callback();
  }
  
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      disabled={loading}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
      autoFocus="true"
      style={{width: '100%'}}
    >
      <Form.Item
        style={{margin: '5px'}}
        label="Old Password"
        name="oldPassword"
        rules={[
          {
            required: true,
            message: 'Old Password Is Required',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="New Password"
        rules={[
          {
            required: true,validator: validatePasswordStrength,
            message: 'New Password Is Required',
          },
        ]}
        name="newPassword"
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        style={{margin: '5px'}}
        label="Confirm Password"
        rules={[
          {
            required: true,
            message: 'Confirm Password Is Required',
          },
        ]}
        name="confirmPassword"
      >
        <Input.Password />
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
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePasswordPatientForm;
