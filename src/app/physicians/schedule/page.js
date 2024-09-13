'use client'
import React, { useEffect, useState } from 'react';
import { Badge, Button, Calendar, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import ModalForm from '@/components/modal/Modal';
import ScheduleForm from '@/components/forms/ScheduleForm';
import axios from 'axios';
import { IoReload } from "react-icons/io5";

const Schedule = () => {
  const [value, setValue] = useState(() => dayjs('2024-06-25'));
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalContentTitle, setModalContentTitle] = useState('');
  const [loading, setLoading] = useState (false);
  const [scheduleData, setScheduleData] = useState ([]);

  const getScheduleData = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/schedule/get/${localStorage.getItem('BHPFMS_IdNo')}`);
      setLoading (false);
      console.log(res.data.results)
      setScheduleData(res.data.results)
    } catch (error) {
      console.log(error)
      setLoading (false);
    }
  };

  useEffect(()=>{
    getScheduleData();
  },[])

  const onSelect = (newValue) => {
    if(newValue < Date.now())return
    setValue(newValue);
    setModalContentTitle('Schedule');setOpenModal (true);setModalContent(<ScheduleForm close={()=>setOpenModal(false)} fecth={getScheduleData} selectedValue={newValue}/>)

  };
  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  const monthCellRender = (value) => {
    const currentMonth = value.month();
  
    const schedule = scheduleData.find(s => {
      return dayjs(s.date).month() === currentMonth; 
    });
  
    return (
      <div className="notes-month">
        <section>{schedule?.notes}</section>
        <span>Notes</span>
      </div>
    );
  }

  const dateCellRender = (value) => {
    const currentDate = dayjs(value);
    const schedule = scheduleData.find(s => dayjs(s.date).isSame(currentDate, 'day'));
  
    return (
      <ul className="events">
        <Tag color={schedule?(schedule.status==='Open'?'green':'red'):''}>{schedule?schedule.status:'none'}</Tag>

        {schedule?.times.map(item => (
          <li key={item.time}>
           <Badge color={item.status==='Open'?'green':'red'}/><span style={{fontSize:'13px'}}> {item.time} Am</span> 
          </li>  
        ))}
      </ul>
    );
  }

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };


  return (
    <div>
    <ModalForm
      open={openModal}
      close={() => setOpenModal (false)}
      title={modalContentTitle}
      content={modalContent}
    />
    <Button disabled={loading} loading={loading} onClick={getScheduleData}><IoReload/></Button>
      <div style={{width:'100%',minHeight:'500px',display:'flex',alignItems:'center',justifyContent:'center'}}>
      {loading?
       <Spin></Spin>
       :
      <Calendar fullscreen={true} value={value} onSelect={onSelect} onPanelChange={onPanelChange} cellRender={cellRender}/>
      }
      </div>
    </div>
  );
};
export default Schedule;