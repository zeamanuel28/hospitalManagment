'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {Button, Input, Popconfirm, Space, Table, Tag} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaCalendarCheck, FaEye, FaListCheck, FaPen } from 'react-icons/fa6';
import { useRouter } from 'next/navigation'
import { FormatDateTime } from '@/helper/FormatDate';
import axios from 'axios';
import { AlertContext } from '@/context/AlertContext';
import { formatTime } from '@/helper/FormatTime';
import { FormatDay } from '@/helper/FormateDay';
import ModalForm from '../modal/Modal';
import PhAppointmentInfo from '../description/PhAppointmentInfo';

const AssignedAppointmentTable = () => {

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalContentTitle, setModalContentTitle] = useState('');

  const [appointmentData,setAppointmentData]=useState([])
  const [loading,setLoading]=useState(false)
  const {openNotification} = useContext (AlertContext);

  const [searchedColumn, setSearchedColumn] = useState('');
  const navigate=useRouter()
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        searchText
      ) : (
        text
      ),
  });

  
  const getAppointmentList=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/appointment/get/${localStorage.getItem ('BHPFMS_IdNo')}`);
      setLoading (false);
      console.log(res.data.appointments)
      setAppointmentData(res.data.appointments)
    } catch (error) {
      setLoading (false);
      openNotification('error', error.response.data.message, 3, 'red');
    }
  }

  useEffect(()=>{
    getAppointmentList()
  },[])
  
  const [loadingCancel, setLoadingCancel] = useState (false);

  const completeAppointment = async (id) => {
    setLoadingCancel(true);
    try {
      const res = await axios.post (`/api/appointment/update`,{id:id,IdNo:localStorage.getItem ('BHPFMS_IdNo'),status:"Completed"});
      setLoadingCancel(false);
      getAppointmentList()
      openNotification('success', res.data.message, 3, 'green');
    } catch (error) {
      console.log (error);
      openNotification('error', error.response.data.message, 3, 'red');
      setLoadingCancel(false);
    }
  };

  const columns = [
    {
      title: 'ID No',
      fixed: 'left',
      dataIndex: 'IdNo',
      width:'100px',
      ...getColumnSearchProps('IdNo'),
    },
        {
          title: 'Full Name',
          dataIndex: 'fullName',
          ...getColumnSearchProps('fullName'),
          key: 'fullName',
          width:"300px"
        },
    {
      title: 'Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render:r=>(<span>{FormatDay(r)}</span>)
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render:r=>(<span>{r} AM</span>)
    },
    // {
    //   title: 'Duration',
    //   dataIndex: 'duration',
    //   key: 'duration',
    // },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render:r=>(<Tag color={r==='High'?'red':r==='Mid'?"yellow":'green'}>{r}</Tag>),
      width:'100px',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render:r=>(<Tag color={r==='Pending'?'yellow':r==='Completed'?"green":'red'}>{r}</Tag>),
      fixed: 'right',
      width:'100px',
    },
    {
     title: 'Action',
     fixed: 'right',
     key: 'operation',
     render: (r) => <Space>
      <Button style={{border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}
       onClick={()=>navigate.replace(`patient/${r.IdNo}`)}><FaEye/></Button>
       {r.status==='Pending'&&<Popconfirm
          placement="topLeft"
          title={'are you sure?'}
          description={'complete appointment as completed'}
          okText="Yes"
          cancelText="No"
          onConfirm={()=>completeAppointment(r._id)}
        >
       <Button 
       disabled={loadingCancel}
       loading={loadingCancel}
        style={{border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}
       ><FaCalendarCheck/></Button>
       </Popconfirm>}
       <Button style={{border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}
        onClick={() =>{setModalContentTitle('Appointments Info');setOpenModal (true);setModalContent(<PhAppointmentInfo data={r}/>)}}
       ><FaListCheck/></Button>
       </Space>,
    },
  ];


  return (
    <div>
      <ModalForm
      open={openModal}
      close={() => setOpenModal (false)}
      title={modalContentTitle}
      content={modalContent}
    />
      <Button loading={loading} onClick={getAppointmentList} disabled={loading} style={{marginBottom:'10px'}}>Reload</Button>
      <Table
      columns={columns}
      size='small'
      loading={loading}
      scroll={{
        x: 700,
      }}
      pagination={{
        defaultPageSize: 7,
        showSizeChanger: false 
      }}
      dataSource={appointmentData}
    />
    </div>
  );
};
export default AssignedAppointmentTable;
