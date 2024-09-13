'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {Button, Input, Space, Table, Tag} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaCheck, FaDeleteLeft, FaEye, FaPen } from 'react-icons/fa6';
import { useRouter } from 'next/navigation'
import { FormatDateTime } from '@/helper/FormatDate';
import axios from 'axios';
import { AlertContext } from '@/context/AlertContext';
import DrawerOpen from '../modal/Drawer';

const PaymentRequestTable = () => {

  const [searchedColumn, setSearchedColumn] = useState('');
  const navigate=useRouter()
  const [searchText, setSearchText] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState([]);
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
          width:"300px"
        },
    {
      title: 'Payment For',
      dataIndex: 'payType',
      key: 'payType',
    },
    {
      title: 'Request by',
      dataIndex: 'userID',
      key: 'userID',
    },
    {
      title: 'Amount',
      render:r=>(<span>{r} Birr</span>),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render:r=>(<Tag color={r==='Pending'?'yellow':r==='Paid'?"green":'red'}>{r}</Tag>),
      fixed: 'right',
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
      {r.status==="Pending"?<Space>
      <Button style={{border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}
      onClick={()=>UpdatePayment('Paid',r._id)}><FaCheck/></Button>
       <Button style={{border:'none',display:'flex',alignItems:'center',justifyContent:'center'}}
       onClick={()=>UpdatePayment('Fail',r._id)}><FaDeleteLeft/></Button></Space>:<Tag color='green'>Finished</Tag>}
       </Space>
    },
  ];

  const [paymentReqList,setPaymentReqList]=useState([])
  const [loading,setLoading]=useState(false)
  const {openNotification} = useContext (AlertContext);

  const getPaymentRequestList=async()=>{
    setLoading(true)
    try {
      const res = await axios.get (`/api/payment/requests`);
      setLoading (false);
      console.log(res.data.results)
      setPaymentReqList(res.data.results)
    } catch (error) {
      setLoading (false);
      openNotification('error', error.response.data.message, 3, 'red');
    }
  }

  const UpdatePayment=async(e,id)=>{
    setLoading(true)
    try {
      const res = await axios.post(`/api/payment/update`,{id:id,status:e});
      setLoading (false);
      openNotification('sucess', res.data.message, 3, 'green');
      getPaymentRequestList()
    } catch (error) {
      setLoading (false);
      openNotification('error', error.response.data.message, 3, 'red');
    }
  }

  const [fectchData,setFetchData]=useState()
  useEffect(()=>{
    getPaymentRequestList()
  },[fectchData])

  return (
    <div>
      <DrawerOpen open={openDrawer} setOpen={setOpenDrawer} content={drawerData} fun={setFetchData}/>
      <Button loading={loading} onClick={getPaymentRequestList} disabled={loading} style={{marginBottom:'10px'}}>Reload</Button>
      <Table
      columns={columns}
      size='small'
      loading={loading}
      pagination={{
        defaultPageSize: 7,
        showSizeChanger: false 
      }}
      dataSource={paymentReqList}
    />
    </div>
  );
};
export default PaymentRequestTable;
