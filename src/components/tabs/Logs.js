'use client';
import { FormatDateTime } from '@/helper/FormatDate';
import {Button,Table} from 'antd';
import axios from 'axios';
import React, {useEffect, useState} from 'react';

const Logs = ({id}) => {
  const [patinetVitals, setPatientVitals] = useState ([]);
  const [loading, setLoading] = useState (false);

  const getPatientVitals = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/admin/loginlog/${id}`);
      setLoading (false);
      console.log (res.data);
      setPatientVitals (res.data.logs);
    } catch (error) {
      console.log (error);
      // openNotification('error', error.response.data.message, 3, 'red');
      setLoading (false);
    }
  };
  useEffect (() => {
    getPatientVitals ();
  }, []);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render:r=>(<span>{FormatDateTime(r)}</span>)
    },
  ];

  
  return (
    <div style={{height: '500px', overflow: 'scroll'}}>
      <Button onClick={getPatientVitals} loading={loading}>Reload</Button>
      <Table
      size='small'
        columns={columns}
        pagination={{
          defaultPageSize: 7,
          showSizeChanger: false,
        }}
        dataSource={patinetVitals}
        loading={loading}
      />
    </div>
  );
};

export default Logs;
