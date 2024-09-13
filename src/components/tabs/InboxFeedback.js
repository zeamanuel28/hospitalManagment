'use client'
import { FormatDateTime } from '@/helper/FormatDate';
import { Badge, Collapse, Empty, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { LiaMailBulkSolid  } from "react-icons/lia"
import { HiMail } from "react-icons/hi";

const InboxFeedback = ({fecth}) => {
  const [loading, setLoading] = useState (false);
  const [inboxData, setInboxData] = useState ([]);

  const getInboxFeedback = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/sms/feedback/get/${localStorage.getItem ('BHPFMS_IdNo')}`);
      setLoading (false);
      console.log (res.data);
      setInboxData(res.data.inboxs);
    } catch (error) {
      console.log (error);
      setLoading (false);
    }
  };

  useEffect (() => {
    getInboxFeedback ();
  }, [fecth]);

  const items =inboxData.map(d => ({
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
      {loading?<Spin style={{width:'100%',height:'100%',dispaly:'flex',alignItems:'center',justifyContent:'center'}}></Spin>
      :items.length > 0?<Collapse expandIcon={<HiMail/>} 
        key={items.key} items={items} expandIconPosition='right' 
       />
      :<Empty image={<LiaMailBulkSolid size={60}/>} description='No Recived Messages'/>}
    </div>
  )
}

export default InboxFeedback