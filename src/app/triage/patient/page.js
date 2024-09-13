'use client';
import NewPatientForm from '@/components/forms/NewPatientForm';
import ModalForm from '@/components/modal/Modal';
import PatientTable from '@/components/tables/PatientTable';
import {Button} from 'antd';
import React, {useState} from 'react';

const Patient = () => {

  const [modalOpen, setModalOpen] = useState (false);
  return (
    <div>
      <div style={{height: '50px'}}>
        <Button type="primary" onClick={() => setModalOpen (true)}>
          Add New Patient
        </Button>
        <ModalForm
          open={modalOpen}
          close={() => setModalOpen (false)}
          title={'New Patient Form'}
          content={<NewPatientForm modalOpen={() => setModalOpen (false)}/>}
        />
      </div>
      <PatientTable />
    </div>
  );
};

export default Patient;
