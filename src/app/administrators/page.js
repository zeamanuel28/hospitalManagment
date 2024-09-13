'use client'
import DashboardCard from '@/components/card/DashboardCard';
import BubbleChart from '@/components/charts/BubbleChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaMoneyBill1Wave, FaMoneyBills, FaMoneyCheck, FaPersonCircleCheck, FaPills, FaUser, FaUsers} from 'react-icons/fa6';
import {GiCalendar, GiMedicinePills, GiPerson, GiTestTubes} from "react-icons/gi";
import { LuTestTube2 } from 'react-icons/lu';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const Dashboard = () => {
  const [totalData,setTotalData]=useState([])
  const [appData,setAppData]=useState([])
  const [diagReq,setDiaReq]=useState([])
  const [drugs,setDrugs]=useState([])
  const [patientsData,setPatientsData]=useState([])
  const [assignedData,setAssignedData]=useState([])
  const [loading,setLoading]=useState(false)

  const getTotalData=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/admin/dashboard`);
      setLoading (false);
      setTotalData(res.data.results)
      setPatientsData(res.data.results.weeklyPatients)
      setAssignedData(res.data.results.weeklyAssigned)
      setAppData(res.data.results.weeklyAppointments)
      setDiaReq(res.data.results.weeklyDiagnosticReq)
      setDrugs(res.data.results.weeklyPresciprion)
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
          label: "Assigned",  
          data: assignedData.map(item => item.count),
          backgroundColor: 'rgba(100, 99, 132, 0.5)',
          borderColor: 'rgba(100, 99, 132, 1)',
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
        },
        {
          label: "Diagnostic Request",  
          data: diagReq.map(item => item.count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
        }
      ]
    }
    const patientsInfo = {
      labels:['Active Patient', 'InActive Patient'],
      datasets: [
        {
          data: [totalData.activepatient, totalData.inactivepatient], // Replace with actual data for cancelled and delivered orders
          backgroundColor: ['#a7c957f1','#ffbc42f1'], // Light green and light red background colors
          hoverBackgroundColor: ['#a7c957', '#ffbc42'], // Bolder hover background colors
        },
      ],
    };

    const usersinfo = {
      labels:['Active User', 'Deleted User',"InActive User"],
      datasets: [
        {
          data: [totalData.activeusers, totalData.deletedusers,totalData.inactiveusers], // Replace with actual data for cancelled and delivered orders
          backgroundColor: ['#a7c957f1', 'rgba(255,0,0,.5)','#ffbc42f1'], // Light green and light red background colors
          hoverBackgroundColor: ['#a7c957', 'rgba(255,0,0,.8)','#ffbc42'], // Bolder hover background colors
        },
      ],
    };
  
    // if(loading)return(<div style={{width:'100%',minHeight:"500px",display:'flex',alignItems:'center',justifyContent:'center'}}><Spin></Spin></div>)
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
      <ResponsiveMasonry style={{width:'630px'}} columnsCountBreakPoints={{620: 1, 750: 3, 900: 3}}>
        <Masonry gutter='10px'>
        <DashboardCard title={"Today Payment"} icon={<FaMoneyBills color='green' size={30}/>}pi={'Pending'} p={totalData.todaypendingPayment} fi={'Fail'} f={totalData.todayfailedPayment}  ci={"Paid"} c={totalData.todaycompletedPayment}/>
      <DashboardCard title={"Today Appointment"} icon={<FaCalendarCheck color='green' size={30}/>}ci={'Complete'} f={totalData.todayCancelApp} fi={'Canceled'} c={totalData.todayCompletedApp}  pi={"Pending"} p={totalData.todayPendingApp}/>
      <DashboardCard title={"Today Assigned"} icon={<FaPersonCircleCheck color='green' size={30}/>}ci={'Complete'} p={totalData.todayAssignedPendingPatient} c={totalData.todayAssignedCompletedPatient}  pi={"Pending"} />
      <DashboardCard title={"Total Payment"} icon={<FaMoneyBill1Wave color='brown' size={30}/>}fi={'Fail'} f={totalData.failedPayment} ci={'Complete'} c={totalData.completedPayment}  pi={"Pending"} p={totalData.pendingPayment}/>
      
      <DashboardCard title={"Total Appointments"} icon={<GiCalendar color='brown' size={30}/>} ci={'Complete'} c={totalData.completedApp} fi={'Canceled'} f={totalData.cancelApp} pi={"Pending"} p={totalData.pendingApp}/>
      <DashboardCard title={"Total Assigned"} icon={<GiPerson color='brown' size={30}/>} ci={'Complete'} c={totalData.assignedCompletedPatient} p={totalData.assignedPendingPatient} pi={"Pending"}/>
      <DashboardCard title={"Today Diagnostic"} icon={<LuTestTube2 color='rgb(0,140,255)' size={30}/>}ci={'Complete'} c={totalData.todaycompletedRequest}  pi={"Pending"} p={totalData.todaypendingRequest}/>
      <DashboardCard title={"Today Prescription"} icon={<FaPills color='rgb(0,140,255)' size={30}/>}ci={'Complete'} c={totalData.completedDrug}  pi={"Pending"} p={totalData.pendingDrug}/>
      <DashboardCard title={"Total Users"} icon={<FaUsers color='rgb(0,140,255)' size={30}/>}ci={'Active'} c={totalData.activeusers}   pi={"In Active"} p={totalData.inactiveusers} fi={"Deleted"} f={totalData.deletedusers}/>
      <DashboardCard title={"Total Diagnostic"} icon={<GiTestTubes color='rgba(0,140,255,.6)' size={30}/>} ci={'Complete'} c={totalData.completedRequest} p={totalData.pendingRequest} pi={"Pending"}/>
      <DashboardCard title={"Total Prescription"} icon={<GiMedicinePills color='rgba(0,140,255,.6)' size={30}/>} ci={'Complete'} c={totalData.completedDrug} p={totalData.pendingDrug} pi={"Pending"}/>
      <DashboardCard title={"Total Patient"} icon={<FaUser color='rgba(0,140,255,.6)' size={30}/>}ci={'Active'} c={totalData.activepatient}  pi={"In Active"} p={totalData.inactivepatient}/>
      
        </Masonry>
      </ResponsiveMasonry>
      <div style={{width:'48%',marginTop:'30px'}}><LineChart lineData={chartData}/></div>
      <div style={{width:'24%',height:'300px',marginTop:'30px'}}><BubbleChart lineData={patientsInfo}/></div>
      <div style={{width:'24%',height:'300px',marginTop:'30px'}}><PieChart lineData={usersinfo}/></div>
      
      <div style={{width:'48%',marginTop:'30px'}}><LineChart lineData={chart2Data}/></div>
    </div>
  );
};

export default Dashboard;
