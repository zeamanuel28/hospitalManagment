'use client';
import SideTopNav from '../../components/sidetopnav/sidetopnav';
import React, { useState } from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import { BsPrescription } from "react-icons/bs";
import { GiMedicines } from "react-icons/gi";
import IsAuth from '@/helper/IsAuth';

const PharmacyLayout = ({children}) => {
  const [loading,setLoading]=useState(false);

    const Links = [
        {key: 1, href: "/pharmacy", icon: <LuLayoutDashboard />, label: "Dashboard" },
        {key: 2, href: "/pharmacy/prescription", icon: <BsPrescription />, label: "Prescription" },
        {key: 3, href: "/pharmacy/drugs", icon: <GiMedicines />, label: "Drugs" },
      ];

  return (
    <div>
      <IsAuth path={'pharmacy'} setLoading={(e)=>setLoading(e)}/>
      {loading?null:
      <SideTopNav content={children} links={Links} footer={"Pharmacy Dashboard"}/>}
    </div>
  );
};

export default PharmacyLayout;
