'use client'
import DashboardCard from '@/components/card/DashboardCard';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaUser} from 'react-icons/fa6';
import {GiCalendar, GiMedicinePills, GiPerson, GiTestTubes} from "react-icons/gi";

const Dashboard = () => {
  const [totalData,setTotalData]=useState([])
  const [appData,setAppData]=useState([])
  const [diagReq,setDiaReq]=useState([])
  const [drugs,setDrugs]=useState([])
  const [patientsData,setPatientsData]=useState([])
  const [loading,setLoading]=useState(false)

  const getTotalData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/physician/dashboard/${localStorage.getItem ('BHPFMS_IdNo')}`);
      setLoading (false);
      setTotalData(res.data.results)
      setPatientsData(res.data.results.weeklyPatients)
      setAppData(res.data.results.weeklyAppointments)
      setDiaReq(res.data.results.weeklyDiagnosticReq)
      setDrugs(res.data.results.weeklyPresciprion)
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
          label: "Patients",
          data: patientsData.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', 
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        },
        {
          label: "Appointments",  
          data: appData.map(item => item.count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }
      ]
    }

    const chart2Data ={
      labels:drugs.map(item => item.date.slice(0,10)),
      datasets: [
        {
          label: "Prescription",
          data: drugs.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', 
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        },
        {
          label: "Diagnostic Request",  
          data: diagReq.map(item => item.count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }
      ]
    }

    if(loading)return(<div style={{width:'100%',minHeight:"500px",display:'flex',alignItems:'center',justifyContent:'center'}}><Spin></Spin></div>)
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
      <DashboardCard title={"Today Appointment"} icon={<FaCalendarCheck color='green' size={30}/>}ci={'Complete'} f={totalData.todayCancelApp} fi={'Canceled'} c={totalData.todayCompletedApp}  pi={"Pending"} p={totalData.todayPendingApp}/>
      <DashboardCard title={"Today Patients"} icon={<FaUser color='rgb(0,140,255)' size={30}/>} ci={'Complete'} c={totalData.todayAssignedCompletedPatient}  pi={"Pending"} p={totalData.todayAssignedPendingPatient}/>
      
      <DashboardCard title={"Total Appointments"} icon={<GiCalendar color='green' size={30}/>} ci={'Complete'} c={totalData.completedApp} fi={'Canceled'} f={totalData.cancelApp} pi={"Pending"} p={totalData.pendingApp}/>
      <DashboardCard title={"Total Patients"} icon={<GiPerson color='rgb(0,140,255)' size={30}/>} ci={'Complete'} c={totalData.assignedCompletedPatient} p={totalData.assignedPendingPatient} pi={"Pending"}/>
      <DashboardCard title={"Total Diagnostic"} icon={<GiTestTubes color='brown' size={30}/>} ci={'Complete'} c={totalData.completedRequest} p={totalData.pendingRequest} pi={"Pending"}/>
      <DashboardCard title={"Total Prescription"} icon={<GiMedicinePills color='green' size={30}/>} ci={'Complete'} c={totalData.completedDrug} p={totalData.pendingDrug} pi={"Pending"}/>
      
      <div style={{width:'48%',marginTop:'30px',background:'rgb(240,255,240)'}}><LineChart lineData={chartData}/></div>
      <div style={{width:'48%',marginTop:'30px',background:'rgb(240,255,240)'}}><LineChart lineData={chart2Data}/></div>
    </div>
  );
};

export default Dashboard;
