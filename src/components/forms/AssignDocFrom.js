'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Select} from 'antd';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useContext, useEffect, useState} from 'react';
import DepartmentList from '@/helper/Department.json'

const AssignDocForm = ({id,openModalFun}) => {
  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const [loading, setLoading] = useState (false);
  const [form] = Form.useForm();


  const [nameloading,setnameLoading]=useState(false)

  const departmentOption=DepartmentList.map(d => ({
    value: d.name, 
    label: d.name
  }));

  const [depValue, setdepValue] = useState();
  const [physicianNames, setphysicianNames] = useState([]);

  const physicainNameOptions=physicianNames.map(d => ({
    value: d.IdNo, 
    label: d.fullName
  }));

  const handleDep = (value) => {
    setphysicianNames([])
    setdepValue(value);
  }


  const getPhysiciansName =async () => {
    setnameLoading(true)
    try {
      const res=await axios.get(`/api/physician/name/${depValue}`)
      setnameLoading(false)
      console.log(res.data.names)
      setphysicianNames(res.data.names);
    } catch (error) {
      setnameLoading(false)
      openNotification('error',error.response.data.message,3,'red');
    }
  };

  useEffect(()=>{getPhysiciansName()},[depValue])

  const onFinish = async values => {
    setLoading (true);
    try {
      console.log(id)
      const res = await axios.post (`/api/patient/assign`, {
        patientId:id,
        priorty:values.priorty,
        department:values.department,
        physician:values.physician,
        triage:localStorage.getItem ('BHPFMS_IdNo')
      });
      setLoading (false);
      form.resetFields()
      openModalFun()
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
      form={form}
      autoComplete="on"
      autoFocus="true"
    >
      <Form.Item
        style={{margin: '5px'}}
        label="Priorty"
        name="priorty"
        rules={[
          {
            required: true,
            message: 'Please input priorty',
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
        label="Department"
        name="department"
        rules={[
          {
            required: true,
            message: 'Please input Department',
          },
        ]}
      >
        <Select
          placeholder="Search to Select"
          onChange={handleDep}
          options={departmentOption}
        />
      </Form.Item>
      <Form.Item
        style={{margin: '5px'}}
        label="Physician"
        name="physician"
        rules={[
          {
            required: true,
            message: 'Please input Physician',
          },
        ]}
      >
        <Select
          placeholder="Search to Select"
          options={physicainNameOptions}
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

export default AssignDocForm;
