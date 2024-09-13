'use client';
import {usePathname, useRouter} from 'next/navigation';
import React, {useContext, useEffect} from 'react';
import axios from 'axios';
import {AlertContext} from '@/context/AlertContext';

const IsAuth = ({path,setLoading}) => {

  const {openNotification} = useContext (AlertContext);
  const navigate = useRouter ();
  const pathName = usePathname ();

  const isAuth = async () => {
    setLoading (true);
    try {
      await axios.post (`/api/auth`, {
        token: localStorage.getItem ('BHPFMS_Token'),
      });
      setLoading (false);
      // openNotification ('succes', 'Auth Successfully', 3, 'green');
    } catch (error) {
      // openNotification ('error', error.response.data.message, 3, 'red');
      if(path!=='/patient')navigate.replace('/')
      setLoading (false);
    }
  };


  useEffect (
    () => {
      if (localStorage.getItem ('BHPFMS_Role') !== path&& path!=='/patient') navigate.replace(`/${localStorage.getItem ('BHPFMS_Role')?localStorage.getItem ('BHPFMS_Role'):''}`);
      isAuth ();
    },
    [navigate,path]
  );

  //   return (
  //     <div>IsAuth</div>
  //   )
};

export default IsAuth;
