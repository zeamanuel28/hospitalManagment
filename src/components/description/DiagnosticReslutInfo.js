import { FormatDateTime } from '@/helper/FormatDate'
import { Image, Tag } from 'antd'
import React from 'react'
// import MasonryList from '@react-native-seoul/masonry-list';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import env from '@/backend/config/env';
const DiagnosticResultInfo = ({data}) => {

  const IMGBACKEND = env.IMGBACKEND;

  return (
    <div>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}><span style={{fontWeight:'bold'}}>Date : </span><span style={{marginLeft:'5px'}}>{FormatDateTime(data.createdAt)}</span></div>
        <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}
            >
                <Masonry gutter='10px'>
                    <div><span style={{fontWeight:'bold'}}>Test</span> : <Tag color='green'>{data.test}</Tag></div>
            <div><span style={{fontWeight:'bold'}}>Findings</span> : <span>{data.findings}</span></div>
            <div><span style={{fontWeight:'bold'}}>Conclusions</span> : <span>{data.conclusions}</span></div>
            <div><span style={{fontWeight:'bold'}}>Additional Notes</span> : <span>{data.notes}</span></div>
            {data.image&&<div><Image src={`https://abstore.zaahirahtravels.com/${data.image}`}/></div>}
                </Masonry>
            </ResponsiveMasonry>
        {/* <div style={{width:'100%',maxHeight:'500px',marginTop:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}><Image src={img1} width={'100%'} height={'100%'}/></div> */}
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:'20px'}}>Recorded By : {data.diagnosticId}</div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>Updated At : {data.updateAt}</div>
    </div>
    
  )
}

export default DiagnosticResultInfo
