'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input, Select} from 'antd';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useContext, useEffect, useState} from 'react';
import DepartmentList from '@/helper/Department.json'
import { BsFillSendFill } from 'react-icons/bs';

const NewMsgForm = ({openModalFun,id}) => {
  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const [loading, setLoading] = useState (false);
  const [form] = Form.useForm();

  const [roleValue, setRoleValue] = useState();

  let departmentOption =[] 
  if(roleValue==='physicians'){
    departmentOption=DepartmentList.map(d => ({
      value: d.name, 
      label: d.name
    }));
  }

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/sms/new`, {
        subject: values.subject,
        message: values.message,
        to:id?id: values.to,
        from:localStorage.getItem ('BHPFMS_IdNo'),
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

  const [depValue, setdepValue] = useState();
  const [physicianNames, setphysicianNames] = useState([]);

  const physicainNameOptions=physicianNames.map(d => ({
    value: d.IdNo, 
    label: d.fullName
  }));

  const handleDep = (value) => {
    setphysicianNames([])
    setdepValue(value);
    console.log(value)
  }
  const handleRole = (value) => {
    setRoleValue(value);
  }

  const getPhysiciansName =async () => {
    try {
      const res=await axios.get(`/api/admin/usernames/${roleValue}/${depValue&&depValue==='physicians'?depValue:"none"}`)
      console.log(res.data.names)
      setphysicianNames(res.data.names);
    } catch (error) {
      openNotification('error',error.response.data.message,3,'red');
    }
  };

  useEffect(()=>{getPhysiciansName()},[depValue,roleValue])

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

      {!id&&<div style={{display: 'flex', justifyContent: 'space-between'}}>
        
        <Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Role"
          rules={[
            {
              required: true,
              message: 'Please input Role',
            },
          ]}
          name="role"
        >
          <Select
            showSearch
            onChange={handleRole}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: 'cashier',
                label: 'Cashier',
              },
              {
                value: 'pharmacy',
                label: 'Pharmacy',
              },
              {
                value: 'physicians',
                label: 'Physicians',
              },
              {
                value: 'triage',
                label: 'Triage',
              },
              {
                value: 'diagnosticservices',
                label: 'Diagnostic Services',
              },
              {
                value: 'administrators',
                label: 'Administrators',
              },
            ]}
          />
        </Form.Item>

        {
          roleValue==='physicians'&&<Form.Item
          style={{margin: '5px', width: '48%'}}
          label="Department"
          name="department"
          rules={[
            {
              required: roleValue==='physicians',
              message: 'Please input Department',
            },
          ]}
        >
          <Select
            placeholder="Search to Select"
          onChange={(handleDep)}
          options={departmentOption}
          />
        </Form.Item>
        }
<Form.Item
          style={{margin: '5px', width: '48%'}}
          label="User"
          name="to"
          rules={[
            {
              required: true,
              message: 'Please input User',
            },
          ]}
        >
          <Select
            placeholder="Search to Select"
            options={physicainNameOptions}
          />
        </Form.Item>
      </div>}
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
        <Input />
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

export default NewMsgForm;
