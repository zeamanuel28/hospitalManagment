import React from 'react'

const DashboardCard = ({f,c,p,title,icon,ci,fi,pi}) => {
  return (
    <div
        style={{
          width: '200px',
          height: '100px',
          boxShadow: '0 0 1px rgb(170,170,170)',
          borderRadius: '10px',
        }}
      >
        <div style={{display:'flex',gap:'20px',alignItems:'center',height:'70%'}}>
          <div
            style={{
              display: 'flex',
              marginLeft:'20px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
          <div style={{display: 'flex', flexDirection: 'column',gap:'5px'}}>
            <span>{ci} : {c}</span>
            {pi&&<span>{pi} : {p?p:0}</span>}
            {fi&&<span>{fi} : {f?f:0}</span>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:'center',height:'30%',fontWeight:'bold',paddingLeft:'10px',fontSize:'16px'}}>{title} {c+(p?p:0)+(f?f:0)}</div>
      </div>
  )
}

export default DashboardCard