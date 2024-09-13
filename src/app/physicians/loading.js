import { Spin } from 'antd'
import React from 'react'

const Loading = () => {
    const content = <div/>;
  return (
    <div><Spin style={{width:'100%',minHeight:'500px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}} tip="Loading">{content}</Spin></div>
  )
}

export default Loading