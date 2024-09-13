import { FormatDateTime } from '@/helper/FormatDate'
import { Tag } from 'antd'
import React from 'react'
// import MasonryList from '@react-native-seoul/masonry-list';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

const TreatmentInfo = ({data}) => {
  return (
    <div>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}><span style={{fontWeight:'bold'}}>Date : </span><span style={{marginLeft:'5px'}}>{FormatDateTime(data.createdAt)}</span></div>
        <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}
            >
                <Masonry gutter='10px'>
                  <div><span style={{fontWeight:'bold'}}>Visit Type</span> : <Tag color={data.visitType==='New'?'green':'orange'}>{data.visitType}</Tag></div>
                  <div><span style={{fontWeight:'bold'}}>Complaint</span> : <span>{data.complaint}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Present Illness</span> : <span>{data.presentIllness}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Past Medical History</span> : <span>{data.pastMedicalHistory}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Family History</span> : <span>{data.familyHistory}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Social History</span> : <span>{data.familyHistory}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Review of Systems</span> : <span>{data.reviewOfSystems}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Emotional Well-Being</span> : <span>{data.emotional}</span></div>
                </Masonry>
            </ResponsiveMasonry>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:'20px'}}>Recorded By : {data.physicianId}</div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>Updated At : {data.updateAt}</div>
    </div>
  )
}

export default TreatmentInfo