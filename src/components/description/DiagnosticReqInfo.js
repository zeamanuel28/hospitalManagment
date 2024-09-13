import { FormatDateTime } from '@/helper/FormatDate'
import { Tag } from 'antd'
import React from 'react'
// import MasonryList from '@react-native-seoul/masonry-list';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

const DiagnosticReqInfo = ({data}) => {
  return (
    <div>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}><span style={{fontWeight:'bold'}}>Date : </span><span style={{marginLeft:'5px'}}>{FormatDateTime(data.createdAt)}</span></div>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}><span style={{fontWeight:'bold',marginRight:'5px'}}>Status : </span><Tag color={data.status==='Pending'?'yellow':data.status==='Completed'?"green":'red'}>{data.status}</Tag></div>
        <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}
            >
                <Masonry gutter='10px'>
                  <div><span style={{fontWeight:'bold'}}>Test</span> : {data.test}</div>
                  <div><span style={{fontWeight:'bold'}}>Body Type</span> : <span>{data.bodyType}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Reason</span> : <span>{data.reason}</span></div>
                  <div><span style={{fontWeight:'bold'}}>Instructions</span> : <span>{data.instructions}</span></div>
                </Masonry>
            </ResponsiveMasonry>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:'20px'}}>Request By : {data.IdNo}</div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>Updated At : {FormatDateTime(data.updatedAt)}</div>
    </div>
  )
}

export default DiagnosticReqInfo