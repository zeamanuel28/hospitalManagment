'use client'
import { Button, Empty} from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

const PageNotFound = () => {
    const navigate=useRouter()
    // const path=localStorage.getItem('BHPFMS_Role')
    const path=''
  return (
    <div style={{width:"100vw",height:'100%',display:'flex',alignItems:'center',flexDirection:'column',gap:'10px'}}>PageNotFound
        <Button onClick={()=>navigate.replace(`/${path}`)}>Go To Home Page</Button>
    </div>
  )
}

export default PageNotFound