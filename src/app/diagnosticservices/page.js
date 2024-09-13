'use client'
import DashboardCard from '@/components/card/DashboardCard';
import LineChart from '@/components/charts/LineChart';
import { Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaUser} from 'react-icons/fa6';
import {GiCalendar, GiMedicinePills, GiPerson, GiTestTubes} from "react-icons/gi";
import { GrDocumentTest, GrTestDesktop } from 'react-icons/gr';
import { LuTestTubes } from 'react-icons/lu';

const Dashboard = () => {
  const [totalData,setTotalData]=useState([])
  const [diagReq,setDiaReq]=useState([])
  const [drugs,setDrugs]=useState([])
  const [loading,setLoading]=useState(false)

  const getTotalData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/diagnostic/dashboard`);
      setLoading (false);
      setTotalData(res.data.results)
      setDiaReq(res.data.results.weeklyDiagnosticRes)
      setDrugs(res.data.results.weeklyDiagnostic)
      console.log(res.data.results)
    } catch (error) {
      setLoading (false);
    }
  }

  useEffect(()=>{
    getTotalData()
  },[])


  const chartData ={
      labels:diagReq.map(item => item.date.slice(0,10)),
      datasets: [
        {
          label: "Results",
          data: diagReq.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', 
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        },
      ]
    }

    const chart2Data ={
      labels:drugs.map(item => item.date.slice(0,10)),
      datasets: [
        {
          label: "Requests",  
          data: drugs.map(item => item.count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }
      ]
    }

    if(loading)return(<div style={{width:'100%',minHeight:"500px",display:'flex',alignItems:'center',justifyContent:'center'}}><Spin></Spin></div>)
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
      <DashboardCard title={"Today Request"} icon={<GiTestTubes color='green' size={30}/>}ci={'Complete'}  c={totalData.todayDiagnosticCom}  pi={"Pending"} p={totalData.todayDiagnosticPen}/>
      <DashboardCard title={"Today Results"} icon={<GrTestDesktop color='rgb(0,140,240)' size={30}/>} ci={'Complete'} c={totalData.todayDiagnosticResultCom} />
      
      <DashboardCard title={"Total Request"} icon={<LuTestTubes color='green' size={30}/>} ci={'Complete'} c={totalData.totalDiagnosticCom}  pi={"Pending"} p={totalData.totalDiagnosticPen}/>
      <DashboardCard title={"Total Results"} icon={<GrDocumentTest color='rgb(0,140,255)' size={30}/>} ci={'Complete'} c={totalData.totalDiagnosticResultCom}/>
      
      <div style={{width:'48%',marginTop:'30px',background:'rgb(240,255,240)'}}><LineChart lineData={chartData}/></div>
      <div style={{width:'48%',marginTop:'30px',background:'rgb(240,255,240)'}}><LineChart lineData={chart2Data}/></div>
    </div>
  );
};

export default Dashboard;
