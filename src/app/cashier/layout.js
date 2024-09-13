'use client';
import SideTopNav from '../../components/sidetopnav/sidetopnav';
import React, { useState } from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import { FaCashRegister } from "react-icons/fa6";
import IsAuth from '@/helper/IsAuth';
const CashierLayout = ({children}) => {
    const Links = [
        {key: 1, href: "/cashier", icon: <LuLayoutDashboard />, label: "Dashboard" },
        {key: 2, href: "/cashier/requests", icon: <FaCashRegister />, label: "Requests" },
      ];
    const [loading,setLoading]=useState(false);

  return (
    <div>
      <IsAuth path={'cashier'} setLoading={(e)=>setLoading(e)}/>
      {loading?null:
      <SideTopNav content={children} links={Links} footer={"Cashier Dashboard"}/>}
    </div>
  );
};

export default CashierLayout;
