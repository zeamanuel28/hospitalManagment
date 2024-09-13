'use client'
import { FormatDateTime } from '@/helper/FormatDate';
import { Badge, Collapse, Empty, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BiSolidSend } from 'react-icons/bi';
import { HiMail } from "react-icons/hi";

const SentFeedBack = ({fecth}) => {
  const [loading, setLoading] = useState (false);
  const [sentData, setSentData] = useState ([]);

  const getSentFeedBack = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/sms/feedback/sent/${localStorage.getItem ('BHPFMS_IdNo')}`);
      setLoading (false);
      console.log (res.data);
      setSentData(res.data.sents);
    } catch (error) {
      console.log (error);
      setLoading (false);
    }
  };
  useEffect (() => {
    getSentFeedBack ();
  }, [fecth]);

  const items =sentData.map(d => ({
    key: d._id,
    label:<div style={{display:'flex',justifyContent:'center',flexDirection:'column',gap:'10px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span>{FormatDateTime(d.createdAt)}</span>
        <Badge color={d.status==='Pending'?'yellow':'green'}></Badge>
      </div>
    </div>,
    children: <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <span style={{fontWeight:'bold',fontSize:'20px'}}>{d.subject}</span>
      <span style={{wordBreak:'break-all',width:'100%',flexWrap:'wrap',fontSize:'17px'}}>{d.message}</span>
      <div style={{fontSize:'12px'}}>UpdatedAT: {FormatDateTime(d.updatedAt)}</div>
      </div>
  }))

  return (
    <div style={{width:'100%',height:'380px',overflow:'scroll'}}>
      {loading?<Spin style={{width:'100%',height:'100%',dispaly:'flex',alignItems:'center',justifyContent:'center'}}></Spin>:items.length > 0?<Collapse items={items} expandIcon={<HiMail/>} expandIconPosition='right' />:<Empty image={<BiSolidSend size={60}/>} description='No Sent Messages'/>}
    </div>
  )
}

export default SentFeedBack