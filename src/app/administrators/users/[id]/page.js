'use client'
import React, { useContext, useEffect, useState } from 'react';
import {Badge, Button, Form, Input, Select, Tabs} from 'antd';
import { AlertContext } from '@/context/AlertContext';
import axios from 'axios';
import { useParams} from 'next/navigation';
import { FormatDateTime } from '@/helper/FormatDate';
import DepartmentList from '@/helper/Department.json'
import Logs from '@/components/tabs/Logs';

const UsersDetail = () => {
 
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);
  const params=useParams()

  const [roleValue, setRoleValue] = useState();

  const handleRole = (value) => {
    setRoleValue(value);
  }

  let departmentOption =[] 
  if(roleValue==='physicians'){
    departmentOption=DepartmentList.map(d => ({
      value: d.name, 
      label: d.name
    }));
  }

  const items = [
    {
      key: '6',
      label: 'User Log',
      children: <Logs id={params.id}/>,
    },
  ];

  const onFinish = async values => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/admin/updateuser`, {
        IdNo: params.id,
        email: values.email,
        phone: values.phone,
        department: values.department,
        role: values.role,
      });
      setLoading (false);
      openNotification ('success',res.data.message, 3, 'green');
    } catch (error) {
      openNotification ('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };

  const [userData,setuserData]=useState([])
  const getuserData=async()=>{
    try {
      const res=await axios.get(`/api/admin/getusers/details/${params.id}`)
      setuserData(res.data.user)
      setPId(res.data.user._id)
      setRoleValue(res.data.user.role)
    } catch (error) {
    }
  }

  useEffect(()=>{
    getuserData()
  },[])

  const [loadingDelete,setLoadingDelete] = useState(false);
  const [loadingBan,setLoadingBan] = useState(false);
  const [loadingChPass,setLoadingChPass] = useState(false);

  const DeleteUser=async()=>{
    setLoadingDelete(true)
    try {
      const res=await axios.post('/api/admin/deleteuser',{IdNo:params.id})
      setLoadingDelete(false)
      getuserData()
      openNotification('success',res.data.message,3,'green')
    } catch (error) {
      setLoadingDelete(false)
      openNotification ('error', error.response.data.message, 3, 'red');
    }
  }

  const BanUser=async()=>{
    setLoadingBan(true)
    try {
      const res=await axios.post('/api/admin/banuser',{IdNo:params.id})
      setLoadingBan(false)
      getuserData()
      openNotification('success',res.data.message,3,'green')
    } catch (error) {
      setLoadingBan(false)
      openNotification ('error', error.response.data.message, 3, 'red');
    }
  }

  const ChangePassword=async()=>{
    setLoadingChPass(true)
    try {
      const res=await axios.post('/api/admin/changepassword',{IdNo:params.id})
      setLoadingChPass(false)
      openNotification('success',res.data.message,3,'green')
    } catch (error) {
      setLoadingChPass(false)
      openNotification ('error', error.response.data.message, 3, 'red');
    }
  }

  return(
    <>
    <div style={{display:'flex',justifyContent:'space-between'}}>
    <div>Registerd {FormatDateTime(userData.createdAt)}  <Badge status={userData.status==='Active'?'success':"error"} text={userData.status}/></div>
    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <Button type='primary' disabled={loadingDelete} danger={userData.status!=="Deleted"} loading={loadingDelete} onClick={()=>DeleteUser()}>{userData.status==="Deleted"?"Restore":"Delete"}</Button>
        {userData.status!=="Deleted" &&<Button danger={userData.status==="Active"} disabled={loadingBan} loading={loadingBan} onClick={()=>BanUser()}>{userData.status==="In Active"?"unBan":'Ban'}</Button>}
        <Button style={{marginRight:'10px'}} disabled={loadingChPass} loading={loadingChPass} onClick={()=>ChangePassword()} >Change Password</Button>
    </div>
    </div>
<div style={{display:"flex",justifyContent:'space-between'}}>
{Object.keys(userData).length > 0 ? (
      <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={userData}
      disabled={loading}
      autoComplete="on"
      autoFocus="true"
      style={{width:'35%'}}
    >
      <h3 style={{margin:'10px 0 0 0'}}>Personal Info</h3>
      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
      <Form.Item
        style={{margin: '5px'}}
        label="IdNo"
        name="IdNo"
      >
        <Input disabled/>
      </Form.Item>

      <Form.Item
        style={{margin: '5px'}}
        label="Full Name"
        name="fullName"
      >
        <Input disabled/>
      </Form.Item>

      <Form.Item
        style={{margin: '5px'}}
        label="Sex"
        name="sex"
      >
        <Input disabled/>
      </Form.Item>
      </div>

      <h3 style={{margin:'10px 0 0 0'}}>Details{roleValue}</h3>

      <div style={{display:'grid',gridTemplateColumns:'auto auto'}}>
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

      <Form.Item
        style={{margin: '5px'}}
        label="Email"
        rules={[
          {
            required: true,
            message: 'Please input Email',
            type:'email'
          },
        ]}
        name="email"
      >
        <Input />
      </Form.Item>

      <Form.Item
          style={{margin: '5px'}}
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
         ( roleValue==='physicians'&&userData.role==='physicians')&&<Form.Item
          style={{margin: '5px'}}
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
            options={departmentOption}
          />
        </Form.Item>
        }

      </div>

      <Form.Item
        style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}
      >
        <Button
          type='default'
          style={{marginRight:'10px'}}
        >
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
    ) : (
      <p>Loading User data...</p>
    )}
    <div style={{width:'63%',display:'flex',flexDirection:'column',gap:'10px',height:"70vh",overflow:'scroll'}}>
    <Tabs
        defaultActiveKey="1"
        items={items}
        indicator={{
          size: (origin) => origin - 20,
        }}
      />
    </div>
    </div>
    </>
  )
}
export default UsersDetail;