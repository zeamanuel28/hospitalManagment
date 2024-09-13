'use client'
import DashboardCard from '@/components/card/DashboardCard';
import LineChart from '@/components/charts/LineChart';
import { Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { FaCalendarCheck, FaUser} from 'react-icons/fa6';
import {GiCalendar, GiMedicinePills, GiPerson, GiTestTubes} from "react-icons/gi";

const Dashboard = () => {
  const [totalData,setTotalData]=useState([])
  const [appData,setAppData]=useState([])
  const [patientsData,setPatientsData]=useState([])
  const [loading,setLoading]=useState(false)

  const getTotalData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/patient/dashboard`);
      setLoading (false);
      setTotalData(res.data.results)
      setPatientsData(res.data.results.weeklyPatients)
      setAppData(res.data.results.weeklyAppointments)
      console.log(res.data.results)
    } catch (error) {
      setLoading (false);
    }
  }

  useEffect(()=>{
    getTotalData()
  },[])


  const chartData ={
      labels:patientsData.map(item => item.date.slice(0,10)),
      datasets: [
        {
          label: "Assigned",
          data: patientsData.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', 
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        },
      ]
    }

    const chart2Data ={
      labels:patientsData.map(item => item.date.slice(0,10)),
      datasets: [
        {
          label: "Appointments",  
          data: appData.map(item => item.count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }
      ]
    }

    if(loading)return(<div style={{width:'100%',minHeight:"500px",display:'flex',alignItems:'center',justifyContent:'center'}}><Spin></Spin></div>)
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'10px'}}>
      <DashboardCard title={"Today's Appointment"} icon={<FaCalendarCheck color='green' size={30}/>}ci={'Complete'} f={totalData.todayCancelApp} fi={'Canceled'} c={totalData.todayCompletedApp}  pi={"Pending"} p={totalData.todayPendingApp}/>
      <DashboardCard title={"Today's Assigned"} icon={<FaUser color='rgb(0,140,255)' size={30}/>} ci={'Complete'} c={totalData.todayAssignedCompletedPatient}  pi={"Pending"} p={totalData.todayAssignedPendingPatient}/>
      
      <DashboardCard title={"Total Appointments"} icon={<GiCalendar color='green' size={30}/>} ci={'Complete'} c={totalData.completedApp} fi={'Canceled'} f={totalData.cancelApp} pi={"Pending"} p={totalData.pendingApp}/>
      <DashboardCard title={"Total Patients"} icon={<GiPerson color='rgb(0,140,255)' size={30}/>} ci={'Active'} c={totalData.activePatient} p={totalData.inActivePatient} pi={"In Active"}/>

      <div style={{width:'48%',marginTop:'30px'}}><LineChart lineData={chartData}/></div>
      <div style={{width:'48%',marginTop:'30px'}}><LineChart lineData={chart2Data}/></div>
    </div>
  );
};

export default Dashboard;
