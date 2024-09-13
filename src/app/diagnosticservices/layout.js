'use client';
import SideTopNav from '../../components/sidetopnav/sidetopnav';
import React, { useState } from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import {GiTestTubes} from "react-icons/gi";
import IsAuth from '@/helper/IsAuth';
import { TbReportMedical  } from 'react-icons/tb';

const DiagnosticLayout = ({children}) => {
  const [loading,setLoading]=useState(false);

    const Links = [
        {key: 1, href: "/diagnosticservices", icon: <LuLayoutDashboard />, label: "Dashboard" },
        {key: 5, href: "/diagnosticservices/diagnostic", icon: <GiTestTubes />, label: "Diagnostic" },
        {key: 2, href: "/diagnosticservices/results", icon: <TbReportMedical />, label: "Results" },
      ];

  return (
    <div>
      <IsAuth path={'diagnosticservices'} setLoading={(e)=>setLoading(e)}/>
    {loading?null:
      <SideTopNav content={children} links={Links} footer={"Diagnostic Services Dashboard"}/>}
    </div>
  );
};

export default DiagnosticLayout;
