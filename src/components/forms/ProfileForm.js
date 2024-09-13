'use client';
import React, {useContext, useEffect, useState} from 'react';
import {Badge, Button, Descriptions, Form, Input, Select, Tabs} from 'antd';
import ModalForm from '@/components/modal/Modal';
import NewAppointmentForm from '@/components/forms/NewAppointment';
import NewVitalsForm from '@/components/forms/NewVitals';
import {AlertContext} from '@/context/AlertContext';
import axios from 'axios';
import VitalsTab from '@/components/tabs/VitalsTab';
import AssignDocForm from '@/components/forms/AssignDocFrom';
import {useParams} from 'next/navigation';
import City from '@/helper/City.json';

const ProfileForm = () => {
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);

  const [userData, setUserDate] = useState ([]);

  const getuserData = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/auth/detail/${localStorage.getItem ('BHPFMS_IdNo')}`);
      setLoading (false);
      setUserDate (res.data.user);
    } catch (error) {
      setLoading (false);
      console.log (error);
    }
  };

  useEffect (() => {
    getuserData ();
  }, []);

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/auth/detail`, {
        IdNo: localStorage.getItem ('BHPFMS_IdNo'),
        fullName: values.fullName,
        phone: values.phone,
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

  return (
    <div>
      {Object.keys (userData).length > 0
        ? <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={userData}
            disabled={loading}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
            autoFocus="true"
            style={{width: '100%'}}
          >
            <h3 style={{margin: '10px 0 0 0'}}>Personal Info</h3>
            <div
              style={{
                display: 'grid',
                width: '100%',
                gridTemplateColumns: 'auto auto',
              }}
            >
              <Form.Item style={{margin: '5px'}} label="Id No" name="IdNo">
                <Input disabled />
              </Form.Item>
              <Form.Item
                style={{margin: '5px'}}
                label="Full Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input Name',
                  },
                ]}
                name="fullName"
              >
                <Input />
              </Form.Item>
              <Form.Item style={{margin: '5px'}} label="Role" name="role">
                <Input disabled />
              </Form.Item>
              <Form.Item
                style={{margin: '5px'}}
                label="Department"
                name="department"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                style={{margin: '5px'}}
                label="Sex"
                rules={[
                  {
                    required: true,
                    message: 'Please input Sex',
                  },
                ]}
                name="sex"
              >
                <Select
                  placeholder="Search to Select"
                  required={true}
                  options={[
                    {
                      value: 'Male',
                      label: 'Male',
                    },
                    {
                      value: 'Female',
                      label: 'Female',
                    },
                  ]}
                />
              </Form.Item>
            </div>

            <h3 style={{margin: '10px 0 0 0'}}>Contact Info</h3>

            <div style={{display: 'grid', gridTemplateColumns: 'auto auto'}}>
              <Form.Item
                style={{margin: '5px'}}
                label="Phone"
                rules={[
                  {
                    required: true,
                    message: 'Please input Phone',
                  },
                ]}
                name="phone"
              >
                <Input />
              </Form.Item>
              <Form.Item style={{margin: '5px'}} label="Email" name="email">
                <Input disabled />
              </Form.Item>
            </div>

            <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '15px',
              }}
            >
              <Button type="default" style={{marginRight: '10px'}}>
                Cancel
              </Button>
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
        : <p>Loading User data...</p>}
    </div>
  );
};

export default ProfileForm;
