'use client';
import SideTopNav from '../../components/sidetopnav/sidetopnav';
import React, { useState } from 'react';
import {LuLayoutDashboard} from 'react-icons/lu';
import {FaRegCalendarCheck} from 'react-icons/fa6';
import {BsPersonArmsUp, BsPersonRolodex} from 'react-icons/bs';
import IsAuth from '@/helper/IsAuth';
import { Button } from 'antd';

const TriageLayout = ({children}) => {
  const [loading,setLoading]=useState(false);

  const Links = [
    {key: 1, href: '/triage', icon: <LuLayoutDashboard />, label: 'Dashboard'},
    {
      key: 2,
      href: '/triage/patient',
      icon: <BsPersonRolodex />,
      label: 'Patient',
    },
    {
      key: 3,
      href: '/triage/assigned',
      icon: <BsPersonArmsUp />,
      label: 'Assigned',
    },
    {
      key: 4,
      href: '/triage/appointment',
      icon: <FaRegCalendarCheck />,
      label: 'Appointment',
    },
  ];

  return (
    <div>
      <IsAuth path={'triage'} setLoading={(e)=>setLoading(e)}/>
      {loading?<div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100vw',height:'100vh'}}><Button loading={true} type='primary'></Button></div>:<SideTopNav
        content={children}
        links={Links}
        footer={'Triage Dashboard'}
      />}
    </div>
  );
};

export default TriageLayout;
