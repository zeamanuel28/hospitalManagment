'use client';
import SideTopNav from '../../components/sidetopnav/sidetopnav';
import React, { useState } from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import {BsPersonRolodex} from "react-icons/bs";
import {GiTestTubes} from "react-icons/gi";
import IsAuth from '@/helper/IsAuth';
import { RiCalendarCheckFill, RiCalendarScheduleFill, RiMedicineBottleFill } from "react-icons/ri"

const PhysiciansLayout = ({children}) => {
  const [loading,setLoading]=useState(false);

  const Links = [
        {key: 1, href: "/physicians", icon: <LuLayoutDashboard />, label: "Dashboard" },
        {key: 2,href: "/physicians/patient",icon: <BsPersonRolodex />,label: "Patient",},
        {key: 3, href: "/physicians/schedule", icon: <RiCalendarScheduleFill />, label: "Schedule" },
        {key: 4, href: "/physicians/appointment", icon: <RiCalendarCheckFill />, label: "Appointment" },
        {key: 5, href: "/physicians/prescription", icon: <RiMedicineBottleFill />, label: "Prescription" },
        {key: 6, href: "/physicians/diagnostic", icon: <GiTestTubes />, label: "Diagnostic" },
      ];

  return (
    <div>
      <IsAuth path={'physicians'} setLoading={(e)=>setLoading(e)}/>
      {loading?null:
      <SideTopNav content={children} links={Links} footer={"Physician Dashboard"}/>}
    </div>
  );
};

export default PhysiciansLayout;
