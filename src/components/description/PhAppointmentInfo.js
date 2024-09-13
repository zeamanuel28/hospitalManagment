import { FormatDateTime } from '@/helper/FormatDate'
import { FormatDay } from '@/helper/FormateDay'
import { formatTime } from '@/helper/FormatTime'
import { Tag } from 'antd'
import React from 'react'
// import MasonryList from '@react-native-seoul/masonry-list';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

const PhAppointmentInfo = ({data}) => {
  return (
    <div>
        <div style={{display:'flex',justifyContent:'flex-end'}}><span style={{fontWeight:'bold'}}>Date : </span><span style={{marginLeft:'5px'}}>{FormatDateTime(data.createdAt)}</span></div>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}><span style={{fontWeight:'bold'}}>Status : </span><Tag style={{marginLeft:'5px'}} color={data.status==='Completed'?'green':data.status==='Pending'?'yellow':'red'}>{data.status}</Tag></div>
        <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}
            >
                <Masonry gutter='10px'>
                    <div><span style={{fontWeight:'bold'}}>Date</span> : <span>{FormatDay(data.appointmentDate)}</span></div>
            <div><span style={{fontWeight:'bold'}}>Priority</span> : <Tag color={data.priority==='High'?'red':data.priority==='Mid'?'orange':'green'}>{data.priority}</Tag></div>
            <div><span style={{fontWeight:'bold'}}>Time</span> : <span>{(data.startTime)}</span></div>
            <div><span style={{fontWeight:'bold'}}>Duration</span> : <span>{data.duration}</span></div>
            <div><span style={{fontWeight:'bold'}}>Description</span> : <span>{data.description}</span></div>
                </Masonry>
            </ResponsiveMasonry>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'20px'}}>
          <div><span style={{fontWeight:'bold'}}>Assigned By</span> : {data.appointmentBy}</div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}><span style={{fontWeight:'bold'}}>Updated BY </span>: {data.updatedBy}</div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>Updated At : {FormatDateTime(data.updatedAt)}</div>
    </div>
    // {_id, patientId, triageId, complaint, symptoms, medicalHistory, symptomSeverity, vitalsSigns, updatedAt, createdAt
    // PhAppointmentInfo {data.triageId}
  )
}

export default PhAppointmentInfo