'use client';
import {AlertContext} from '@/context/AlertContext';
import {Button, Form, Input, Select} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useContext, useState} from 'react';

const NewPrescriptionForm = ({id,openModalFun}) => {
  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const [loading, setLoading] = useState (false);
  const [form] = Form.useForm ();

  const [medications, setMedications] = useState ([
    {
      name: '',
      dosage: '',
      quantity: '',
    },
  ]);

  const handleAdd = () => {
    setMedications ([
      ...medications,
      {
        name: '',
        dosage: '',
        quantity: '',
      },
    ]);
  };

  const handleRemove = index => {
    setMedications (medications.filter ((_, i) => i !== index));
  };

  const onFinish = async (values) => {
    setLoading (true);
    console.log (id);
    try {
      const res = await axios.post (`/api/prescription/new`, {
        patientId: id,
        physicianId: localStorage.getItem ('BHPFMS_IdNo'),
        medications: medications,
        instruction: values.instruction,
      });
      openModalFun(false)
      setLoading (false);
      form.resetFields()
      setMedications([
        {
          name: '',
          dosage: '',
          quantity: '',
        },
      ])
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
    <Form
      form={form}
      layout="vertical "
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {medications.map ((medication, index) => (
          <div key={index} style={{display:'grid',gridTemplateColumns:'200px 150px 100px',gap:'5px',borderBottom:'1px solid gray',padding:"5px 0"}}>
          <Form.Item style={{margin:'0'}} label='Name' rules={[{required:true,message:'Durg Name Required'}]}>
          <Input
            placeholder="Name"
            value={medication.name}
            onChange={e => {
              const value = e.target.value;
              setMedications (prevMedications => {
                const updatedMedications = [...prevMedications];
                updatedMedications[index].name = value;
                return updatedMedications;
              });
            }}
          />
          </Form.Item>
          <Form.Item style={{margin:'0'}} label='Dosage' rules={[{required:true,message:'Dosage Required'}]}>

          <Input
            placeholder="Dosage"
            value={medication.dosage}
            onChange={e => {
              const value = e.target.value;
              setMedications (prevMedications => {
                const updatedMedications = [...prevMedications];
                updatedMedications[index].dosage = value;
                return updatedMedications;
              });
            }}
          />
          </Form.Item>
          
          <Form.Item style={{margin:'0'}} label='Quantity' rules={[{required:true,message:'Quantity Required'}]}>
          <Input
          type='number'
            value={medication.quantity}
            onChange={e => {
              const value = e.target.value;
              setMedications (prevMedications => {
                const updatedMedications = [...prevMedications];
                updatedMedications[index].quantity = value;
                return updatedMedications;
              });
            }}
          />
          </Form.Item>

          {index > 0 &&
            <Button style={{marginTop:'5px'}} onClick={() => handleRemove (index)}>
              Remove
            </Button>}
          </div>
      ))}
      <Button style={{margin:'10px 0'}} type='primary' onClick={handleAdd}>
        Add Medication
      </Button>

      <Form.Item
        name="instruction"
        label="Instruction"
        rules={[
          {
            required: true,
            message: 'Please select Instruction',
          },
        ]}
      >
        <TextArea placeholder="Instruction" />
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

export default NewPrescriptionForm;
