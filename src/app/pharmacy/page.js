'use client'
import DashboardCard from '@/components/card/DashboardCard';
import LineChart from '@/components/charts/LineChart';
import { Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaUser} from 'react-icons/fa6';

const Dashboard = () => {
  const [totalData,setTotalData]=useState([])
  const [drugs,setDrugs]=useState([])
  const [loading,setLoading]=useState(false)

  const getTotalData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/prescription/dashboard`);
      setLoading (false);
      setTotalData(res.data.results)
      console.log(res.data.results)
      setDrugs(res.data.results.weeklyPrescription)
    } catch (error) {
      setLoading (false);
    }
  }

  useEffect(()=>{
    getTotalData()
  },[])


  const chartData ={
      labels:drugs.map(item => item.date.slice(0,10)),
      datasets: [
        {
          label: "Prescriptions",
          data: drugs.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', 
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        },
      ]
    }

    if(loading)return(<div style={{width:'100%',minHeight:"500px",display:'flex',alignItems:'center',justifyContent:'center'}}><Spin></Spin></div>)
  return (
    <div>
      <div style={{display:'flex',gap:'10px'}}>
        <DashboardCard title={"Today Prescription"} icon={<FaCalendarCheck color='green' size={30}/>}ci={'Complete'} c={totalData.todayPrescriptionCompleted} pi={"Pending"} p={totalData.todayPrescriptionPending}/>
        <DashboardCard title={"Total Prescription"} icon={<FaCalendarCheck color='green' size={30}/>}ci={'Complete'} c={totalData.prescriptionCompleted} pi={"Pending"} p={totalData.prescriptionPending}/>
      </div>
      <div style={{width:'48%',marginTop:'30px',background:'rgb(240,255,240)'}}><LineChart lineData={chartData}/></div>
    </div>
  );
};

export default Dashboard;
