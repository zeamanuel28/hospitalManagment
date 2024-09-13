'use client';
import SideTopNav from '../../components/sidetopnav/sidetopnav';
import React, { useState } from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import {FaUsers} from "react-icons/fa6";
import { BsFillPersonVcardFill } from 'react-icons/bs';
import { MdOutlineSecurity } from "react-icons/md";
import IsAuth from '@/helper/IsAuth';

const SystemAdminLayout = ({children}) => {
  const [loading,setLoading]=useState(false);

    const Links = [
        {key: 1, href: "/administrators", icon: <LuLayoutDashboard />, label: "Dashboard" },
        {key: 2,href: "/administrators/users",icon: <FaUsers />,label: "Users",},
        {key: 3,href: "/administrators/patients",icon: <BsFillPersonVcardFill />,label: "Patients",},
        // {key: 4,href: "/administrators/log",icon: <MdOutlineSecurity />,label: "Log",},
      ];

  return (
    <div>
      <IsAuth path={'administrators'} setLoading={(e)=>setLoading(e)}/>
      {loading?null:
      <SideTopNav content={children} links={Links} footer={"Administrators Dashboard"}/>}
    </div>
  );
};

export default SystemAdminLayout;
