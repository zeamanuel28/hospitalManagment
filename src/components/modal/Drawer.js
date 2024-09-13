'use client';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Descriptions, Drawer, List, Tag} from 'antd';
import NewPaymentRequestForm from '../forms/NewPaymentRequest';
import ModalForm from './Modal';
import axios from 'axios';
import {AlertContext} from '@/context/AlertContext';

const DrawerOpen = ({open, setOpen, content,fun}) => {
  const [openModal, setOpenModal] = useState (false);
  const [modalContent, setModalContent] = useState ();
  const [modalContentTitle, setModalContentTitle] = useState ('');
  const [paymentStatus, setPaymentStatus] = useState ([]);
  const {openNotification} = useContext (AlertContext);
  const [loading, setLoading] = useState (false);

  const items = [
    {
      key: '1',
      label: 'Amount',
      children: paymentStatus && paymentStatus.amount,
    },
    {
      key: '2',
      label: 'Status',
      children: (
        <Tag
          color={
            paymentStatus && paymentStatus.status === 'Paid'
              ? 'green'
              : paymentStatus && paymentStatus.status === 'Pending'
                  ? 'yellow'
                  : 'red'
          }
        >
          {paymentStatus && paymentStatus.status}
        </Tag>
      ),
    },
  ];

  const item2 = [
    {
      key: '1',
      label: 'Instruction',
      children: content.instruction,
    },
  ];
  const getPaymentStat = async () => {
    setLoading (true);
    try {
      const res = await axios.get (`/api/payment/request/get/${content._id}`);
      setLoading (false);
      setPaymentStatus (res.data.paymentStatus);
    } catch (error) {
      setLoading (false);
      console.log (error);
    }
  };

  const DespenceDrug = async () => {
    setLoading (true);
    try {
      const res = await axios.post (`/api/prescription/despence`, {
        transactionId: paymentStatus._id,
        prescriptionId: content._id,
      });
      fun(true);
      setLoading (false);
      openNotification ('sucess', res.data.message, 3, 'green');
    } catch (error) {
      setLoading (false);
      openNotification ('error', error.response.data.message, 3, 'red');
    }
  };

  useEffect (
    () => {
      getPaymentStat ();
    },
    [content, openModal]
  );

  return (
    <Drawer
      title={'Medical Prescription of ' + content.IdNo}
      onClose={() => setOpen (false)}
      open={open}
    >
      <ModalForm
        open={openModal}
        close={() => setOpenModal (false)}
        title={modalContentTitle}
        content={modalContent}
      />
      
      <List
        itemLayout="horizontal"
        dataSource={content.medications}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={item.name}
              description={
                'Dosage: ' + item.dosage + '  Quantity: ' + item.quantity
              }
            />
          </List.Item>
        )}
      />
      <Descriptions title={''} items={item2} />

      <Descriptions
        bordered
        column={{xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2}}
        title={'Payment Detail'}
        items={items}
      />
      {(paymentStatus === null ||
        (paymentStatus && paymentStatus.status === 'Fail')) &&
        <Button
          style={{marginTop: '10px'}}
          type="primary"
          onClick={() => {
            setModalContentTitle ('Payment Request');
            setOpenModal (true);
            setModalContent (<NewPaymentRequestForm data={content} />);
          }}
        >
          Payment Request
        </Button>}
      {paymentStatus &&
        paymentStatus.status === 'Paid' &&
        content.status !== 'Completed' &&
        <Button
          style={{marginTop: '10px'}}
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={DespenceDrug}
        >
          Despence
        </Button>}
      <Button
        style={{marginLeft: '10px',marginTop:'10px'}}
        onClick={getPaymentStat}
        loading={loading}
        disabled={loading}
      >
        refresh
      </Button>
    </Drawer>
  );
};
export default DrawerOpen;
