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
      const res = await axios.get (`/api/payment/dashboard`);
      setLoading (false);
      setTotalData(res.data.results)
      console.log(res.data.results)
      setDrugs(res.data.results.weeklyPayment)
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
          label: "Payments",
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
        <DashboardCard title={"Today Payments"} icon={<FaCalendarCheck color='green' size={30}/>}ci={'Complete'} c={totalData.todayPaymentCompleted} pi={"Pending"} p={totalData.todayPaymentPending} fi={'Fail'} f={totalData.todayPaymentFail}/>
        <DashboardCard title={"Total Payments"} icon={<FaCalendarCheck color='green' size={30}/>}ci={'Complete'} c={totalData.PaymentCompleted} fi={'Fail'} f={totalData.PaymentFail} pi={"Pending"} p={totalData.PaymentPending}/>
      </div>
      <div style={{width:'48%',marginTop:'30px',background:'rgb(240,255,240)'}}><LineChart lineData={chartData}/></div>
    </div>
  );
};

export default Dashboard;
