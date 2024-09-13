'use client';
import React from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegCalendarCheck} from "react-icons/fa6";
import SideTopNavPatient from '@/components/sidetopnav/sidetopnavpatient';
import { GiTestTubes } from 'react-icons/gi';
import { RiMedicineBottleFill } from 'react-icons/ri';

const PatientLayout = ({children}) => {
    const Links = [
        {key: 1, href: "/patient/dashboard", icon: <LuLayoutDashboard />, label: "Dashboard" },
        // {key: 2,href: "/patient/prescription",icon: <RiMedicineBottleFill />,label: "Prescription",},
        // {key: 3, href: "/patient/appointment", icon: <FaRegCalendarCheck />, label: "Appointment" },
        // {key: 4, href: "/patient/diagnostic", icon: <GiTestTubes />, label: "Diagnostic" },
      ];

  return (
    <div>
      <SideTopNavPatient content={children} links={Links} footer={"Patient Dashboard"}/>
    </div>
  );
};

export default PatientLayout;
