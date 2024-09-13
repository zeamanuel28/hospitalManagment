'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {Button, Input, Space, Table, Tag} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaEye, FaPen } from 'react-icons/fa6';
import { useRouter } from 'next/navigation'
import { FormatDateTime } from '@/helper/FormatDate';
import { AlertContext } from '@/context/AlertContext';
import axios from 'axios';
import { formatTime } from '@/helper/FormatTime';
import { FormatDay } from '@/helper/FormateDay';

const AppointmentTable = () => {

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
          width:"250px"
        },
        {
          title: 'Physician',
          dataIndex: 'physician',
          key: 'physician',
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
      render:r=>(<span>{r} AM</span>),
      key: 'startTime',
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
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description',
    // },
    {
      title: 'By',
      dataIndex: 'appointmentBy',
      key: 'appointmentBy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render:r=>(<Tag color={r==='Pending'?'yellow':r==='Completed'?"green":'red'}>{r}</Tag>),
      width:'100px',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render:r=>(<span>{FormatDateTime(r)}</span>)
    },
    {
     title: 'Action',
     fixed: 'right',
     key: 'operation',
     render: (r) => <Space>
      <Button style={{border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}
       onClick={()=>navigate.replace(`patient/${r.IdNo}`)}><FaEye/></Button>
       </Space>,
    },
  ];

  const [appointmentData,setAppointmentData]=useState([])
  const [loading,setLoading]=useState(false)
  const {openNotification} = useContext (AlertContext);

  const getAppointmentList=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/appointment/get`);
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

  return (
    <div>
      <Button loading={loading} onClick={getAppointmentList} disabled={loading} style={{marginBottom:'10px'}}>Reload</Button>
      <Table
      size='small'
      columns={columns}
      loading={loading}
      scroll={{
        x: 1500,
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
export default AppointmentTable;
