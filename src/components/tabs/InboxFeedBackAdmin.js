'use client'
import { FormatDateTime } from '@/helper/FormatDate';
import { Badge, Button, Collapse, Empty, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GoReply} from 'react-icons/go';
import ModalForm from '../modal/Modal';
import { LiaMailBulkSolid  } from "react-icons/lia"
import { HiMail } from "react-icons/hi";
import NewFeedbackForm from '../forms/NewFeedbackForm';

const InboxFeedBackAdmin = ({fecth,unReads}) => {
  const [loading, setLoading] = useState (false);
  const [inboxData, setInboxData] = useState ([]);
  const [openValue, setOpenValue] = useState (false);
  const [openTitle, setTitle] = useState (false);
  const [openContent, setOpenContent] = useState ();

  const getInboxFeedBackAdmin = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/sms/feedback/get`);
      setLoading (false);
      console.log (res.data);
      setInboxData(res.data.inboxs);
    } catch (error) {
      console.log (error);
      setLoading (false);
    }
  };


  useEffect (() => {
    getInboxFeedBackAdmin ();
  }, [fecth]);

  const items =inboxData.map(d => ({
    key: d._id,
    label:<div style={{display:'flex',justifyContent:'center',flexDirection:'column',gap:'10px'}}>
      <div style={{display:'flex',gap:'15px'}}>From : <span>{d.IdNo}</span><span>{d.fullName}</span></div>
      
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span>{FormatDateTime(d.createdAt)}</span>
        <Badge color={d.status==='Pending'?'yellow':'green'}></Badge>
      </div>
    </div>,
    children: <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <span style={{fontWeight:'bold',fontSize:'20px'}}>{d.subject}</span>
      <span style={{wordBreak:'break-all',width:'100%',flexWrap:'wrap',fontSize:'17px'}}>{d.message}</span>
      <div style={{fontSize:'12px'}}>UpdatedAT: {FormatDateTime(d.updatedAt)}</div>
      <Button
      onClick={() => {
        setOpenValue (true);
        setOpenContent (<NewFeedbackForm id={d.IdNo} openModalFun={(e)=>setOpenValue(e)}/>);
        setTitle ('Message');
      }}
      style={{display:'flex',alignItems:'center',gap:'5px',justifyContent:'center'}}><GoReply/> Reply</Button>
      </div>
  }))

  return (
    <div style={{width:'100%',height:'380px',overflow:'scroll'}}>
      <ModalForm
        open={openValue}
        close={() => setOpenValue (false)}
        content={openContent}
        title={openTitle}
        func={() => setOpenValue (c => !c)}
      />
      {loading?<Spin style={{width:'100%',height:'100%',dispaly:'flex',alignItems:'center',justifyContent:'center'}}></Spin>
      :items.length > 0?<Collapse expandIcon={<HiMail/>} 
        key={items.key} items={items} expandIconPosition='right' />
      :<Empty image={<LiaMailBulkSolid size={60}/>} description='No Recived Messages'/>}
    </div>
  )
}

export default InboxFeedBackAdmin