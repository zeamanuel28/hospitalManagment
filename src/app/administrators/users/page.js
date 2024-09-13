'use client';
import NewUserForm from '@/components/forms/NewUserForm';
import ModalForm from '@/components/modal/Modal';
import UserTable from '@/components/tables/UserTable';
import {Button} from 'antd';
import { AlertContext } from '@/context/AlertContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';

const Users = () => {
  const {openNotification} = useContext(AlertContext);

  const [userData,setUserData]=useState([])
  const [loading,setLoading]=useState(false)

  const getUserData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/admin/getusers`);
      setLoading (false);
      setUserData(res.data.users)
    } catch (error) {
      openNotification('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  }

  useEffect(()=>{
    getUserData()
  },[])


  const [modalOpen, setModalOpen] = useState (false);

  return (
    <div>
      <div style={{height: '50px',display:'flex',gap:'10px'}}>
        <Button type="primary" onClick={() => setModalOpen (true)}>
          Add New User
        </Button>
        <Button type='default' onClick={getUserData} loading={loading}>
          Reload
        </Button>
        <ModalForm
          open={modalOpen}
          close={() => setModalOpen (false)}
          title={'New User Form'}
          content={<NewUserForm openModalFun={(e) => setModalOpen (e)}/>}
        />
      </div>
      <UserTable loading={loading} userData={userData}/>
    </div>
  );
};

export default Users;
