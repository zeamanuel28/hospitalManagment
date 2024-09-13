'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input} from 'antd';
import axios from 'axios';
import React, {useContext, useRef, useState} from 'react';

const NewDiagnosticResultForm = ({id,requestId,openModalFun,fecth}) => {
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);
  const [form] = Form.useForm ();

  const menuImgRef=useRef(null)

  const onFinish = async values => {
    setLoading (true);
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      let resimg;
      if(menuImgRef.current.files[0]) {resimg = await axios.post(`https://abstore.zaahirahtravels.com/products/image`,{files:menuImgRef.current.files[0]},{headers});}
      const res = await axios.post (`/api/diagnostic/results/write`, {
        patientId: id,
        requestId: requestId,
        diagnosticId: localStorage.getItem ('BHPFMS_IdNo'),
        test:values.test,
        findings:values.findings,
        image:resimg?resimg.data.data.images[0]:'',
        conclusions:values.conclusions,
        notes:values.notes,
      });
      form.resetFields()
      setLoading (false);
      fecth()
      openModalFun(false)
      openNotification ('success', res.data.message, 3, 'green');
    } catch (error) {
      openNotification ('error', error.response.data ? error.response.data.message : error.message, 3, 'red');
      setLoading (false);
    }
  };

  return (
    <Form layout="vertical" 
    form={form}
    onFinish={onFinish}>

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
        <Input/>
      </Form.Item>

      <Form.Item
        style={{margin: '0',width:'48%'}}
        rules={[
          {
            required: true,
            message: 'Please input Findings',
          },
        ]}
        name="findings"
        label="Findings"
      >
        <Input />
      </Form.Item>
      </div>

      <Form.Item
        rules={[
          {
            required: true,
            message: 'Please input Conclusions',
          },
        ]}
        style={{margin: '0'}}
        name="conclusions"
        label="Conclusions"
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        style={{marginTop: '10px'}}
        name="notes"
        label="Notes"
        rules={[
          {
            required: true,
            message: 'Please input Notes',
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
        <input type='file' hidden ref={menuImgRef}/>
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

export default NewDiagnosticResultForm;
