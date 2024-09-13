import { FormatDateTime } from '@/helper/FormatDate'
import { Tag } from 'antd'
import React from 'react'
// import MasonryList from '@react-native-seoul/masonry-list';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

const VitalsInfo = ({data}) => {
  return (
    <div>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}><span style={{fontWeight:'bold'}}>Date : </span><span style={{marginLeft:'5px'}}>{FormatDateTime(data.createdAt)}</span></div>
        <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}
            >
                <Masonry gutter='10px'>
                    <div><span style={{fontWeight:'bold'}}>Complaint</span> : <span>{data.complaint}</span></div>
            <div><span style={{fontWeight:'bold'}}>Severity</span> : <Tag color={data.symptomSeverity==='High'?'red':data.symptomSeverity==='Mid'?'orange':'green'}>{data.symptomSeverity}</Tag></div>
            <div><span style={{fontWeight:'bold'}}>Symptoms</span> : <span>{data.symptoms}</span></div>
            <div><span style={{fontWeight:'bold'}}>Medical History</span> : <span>{data.medicalHistory}</span></div>
            <div><span style={{fontWeight:'bold'}}>Vitals Signs</span> : <span>{data.vitalsSigns}</span></div>
                </Masonry>
            </ResponsiveMasonry>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:'20px'}}>Recorded By : {data.triageId}</div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>Updated At : {data.updateAt}</div>
    </div>
    // {_id, patientId, triageId, complaint, symptoms, medicalHistory, symptomSeverity, vitalsSigns, updatedAt, createdAt
    // VitalsInfo {data.triageId}
  )
}

export default VitalsInfo