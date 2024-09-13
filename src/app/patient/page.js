'use client'
import { Button, Form, Input, Select, Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import styles from './page.module.css'
import axios from 'axios'
import { AlertContext } from '@/context/AlertContext'
import IsAuth from '@/helper/IsAuth'

const Landing = () => {
  const {openNotification}=useContext(AlertContext)
  const navigate=useRouter()
  const [loading,setLoading]=useState(false)
  const [loginPage,setLoginForm]=useState(true)
  const onFinish =async (values) => {
    setLoading(true)
    try {
      const res=await axios.post(`/api/auth/patient/login`,{email:values.email,password:values.password})
      localStorage.setItem('BHPFMS_Token',res.data.token)
      localStorage.setItem('BHPFMS_IdNo',res.data.IdNo)
      localStorage.setItem('BHPFMS_Role',"patient/dashboard")
      navigate.replace('/patient/dashboard')
      openNotification('succes','Login Successfully',3,'green');
      setLoading(false)
    } catch (error) {
      openNotification('error',error.response.data.message,3,'red');
      setLoading(false)
    }
  };

  const onResetPassword =async (values) => {
    setLoading(true)
    try {
      const res=await axios.post(`/api/auth/patient/forgot`,{email:values.email})
      setLoginForm(true)
      openNotification('succes','Password Reset Successfully',3,'green');
      setLoading(false)
    } catch (error) {
      openNotification('error',error.response.data.message,3,'red');
      setLoading(false)
    }
  };
  
  return (
    <div className={styles.box}>
      <IsAuth path={'/patient'} setLoading={(e)=>setLoading(e)}/>
      <div className={styles.loginform2}/>
      <div className={styles.loginform}>
      <Tooltip placement="top" title={'Bensa Hospital Patient File Management System'}>
      <h2 style={{marginBottom:'50px'}}>Welcome to BHPFMS</h2>
      </Tooltip>
      <span style={{width:'70%',marginBottom:'10px'}}>{loginPage?"login to your account":'Reset your Password'}</span>
      {loginPage?<Form
        layout="vertical"
        name="login"
        style={{
          width: '70%',
        }}
        onFinish={onFinish}
        autoComplete="on"
        autoFocus='true'
        >
    <Form.Item
      label="Email"
      name="email"
      style={{margin:'5px 0'}}
      rules={[
        {
          required: true,
          type:'email',
          message: 'Please input your Email!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      style={{margin:'5px 0'}}
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Button style={{padding:0,display:'flex',flexDirection:'column',alignItems:'flex-end'}} type='link' onClick={()=>setLoginForm(false)}>Forgot Password?</Button>
    <Button type='link' style={{padding:0,display:'flex',flexDirection:'column',alignItems:'flex-end'}} onClick={()=>navigate.replace('/')}>Login as User</Button>
    <Form.Item
    style={{display:'flex',justifyContent:'center',margin:'5px 0'}}
    >
      <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
        Submit
      </Button>
    </Form.Item>
  </Form>
  :
  <Form
        layout="vertical"
        name="forget"
        style={{
          width: '70%',
        }}
        onFinish={onResetPassword}
        autoComplete="on"
        autoFocus='true'
        >
    <Form.Item
      label="Email"
      name="email"
      style={{margin:'5px 0'}}
      rules={[
        {
          required: true,
          type:'email',
          message: 'Please input your Email!',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Button type='link' style={{padding:0,display:'flex',flexDirection:'column',alignItems:'flex-end'}} onClick={()=>setLoginForm(true)}>Back to login</Button>

    <Form.Item
    style={{display:'flex',justifyContent:'center',margin:'5px 0'}}
    >
      <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
        Submit
      </Button>
    </Form.Item>
  </Form>}
      </div>
    </div>
  )
}

export default Landing