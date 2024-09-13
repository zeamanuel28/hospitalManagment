'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Select} from 'antd';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useContext, useState} from 'react';

const ScheduleForm = ({selectedValue,close,fecth}) => {
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/schedule/new`, {
      IdNo:localStorage.getItem('BHPFMS_IdNo'),
      date:selectedValue,
      times:values.times,
      });
      setLoading (false);
      close()
      fecth()
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
      <span>Date: {selectedValue?.format('YYYY-MM-DD')}</span>
      <Form.Item
        style={{margin: '5px'}}
        label="Times"
        name="times"
        rules={[
          {
            required: true,
            message: 'Please input Times',
          },
        ]}
      >
        <Select
        mode="multiple"
        allowClear
          placeholder="Search to Select"
          options={[
            {
              value: '3',
              label: '3 AM',
            },
            {
              value: '4',
              label: '4 AM',
            },
            {
              value: '5',
              label: '5 AM',
            },
            {
              value: '7',
              label: '7 AM',
            },
            {
              value: '8',
              label: '8 AM',
            },
            {
              value: '9',
              label: '9 AM',
            },
            {
              value: '10',
              label: '10 AM',
            },
            {
              value: '11',
              label: '11 AM',
            },
          ]}
        />
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

export default ScheduleForm;
