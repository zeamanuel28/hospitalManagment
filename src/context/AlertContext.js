'use client'
import React from 'react';
import {notification} from 'antd'
export const AlertContext = React.createContext();

const AlertProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (title,description,time,color) => {
      api.open({
        message: title,
        description:description,
        duration: time?time:3,
        style:{border:`1px solid ${color?color:''}`}
      });
    };

  return (
    <AlertContext.Provider value={{openNotification}}>
      {children}{contextHolder}
    </AlertContext.Provider>
  );
};

export default AlertProvider;