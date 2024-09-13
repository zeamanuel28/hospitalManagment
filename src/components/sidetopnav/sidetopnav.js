'use client';
import React, {useContext, useEffect, useState} from 'react';
import {Layout,theme,Dropdown, Button,Badge,Breadcrumb,Tabs,Tooltip, Spin,} from 'antd';
const {Header, Content, Footer, Sider} = Layout;
import { BiMessageDetail } from "react-icons/bi";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { SlSizeFullscreen } from "react-icons/sl";
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {IoNotificationsCircle, IoSettingsOutline} from 'react-icons/io5';
import ModalForm from '../modal/Modal';
import ProfileForm from '../forms/ProfileForm';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import axios from 'axios';
import {FaAngleRight, FaUser} from 'react-icons/fa6';
import NewMsgForm from '../forms/NewMsgForm';
import InboxMsg from '../tabs/InboxMsg';
import SentMsg from '../tabs/SentMsg';
import AlertTab from '../tabs/AlertTab';
import useSound from 'use-sound'
import InboxFeedBackAdmin from '../tabs/InboxFeedBackAdmin';
import SentFeedBackAdmin from '../tabs/SentFeedBackAdmin';
import { AlertContext } from '@/context/AlertContext';

const SideTopNav = ({content, links, footer}) => {
  const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken ();
  const [play] = useSound('/sound/msg.mp3');
  const pathName = usePathname ();
  const [openValue, setOpenValue] = useState (false);
  const [openTitle, setTitle] = useState (false);
  const [openContent, setOpenContent] = useState ();
  const [hoverLink, setHoverLink] = useState ();
  const {openNotification}=useContext(AlertContext)
  const navigate=useRouter()
  const [userName, setUserName] = useState ('');
  const [loading, setLoading] = useState (false);
  const [logoutLoading, setLogoutLoading] = useState (false);
  const [loadingAlert, setLoadingAlert] = useState (false);
  const [loadingUnread, setLoadingUnread] = useState (false);
  const [unreadCount, setUnreadCount] = useState ();
  const [alertValue, setAlertValue] = useState ();
  const [fetchData, setFetchData] = useState (false);

  const paths = pathName.split ('/').filter (path => path);

  const getuserData = async () => {
    setLoading (true);
    try {
      const res = await axios.get (
        `/api/auth/detail/${localStorage.getItem ('BHPFMS_IdNo')}`
      );
      setLoading (false);
      setUserName (res.data.user.fullName);
    } catch (error) {
      setLoading (false);
      console.log (error);
    }
  };

  const getUnreadMsg = async () => {
    setLoadingUnread (true);
    try {
      const res = await axios.get (
        `/api/sms/unread/${localStorage.getItem ('BHPFMS_IdNo')}`
      );
      setLoadingUnread (false);
      setUnreadCount (res.data.unreads);
      // if(res.data.unreads > 0){
      //   setTimeout(() => {
      //     play(); 
      //   }, 3000);
      // }
    } catch (error) {
      setLoadingUnread (false);
      console.log (error);
    }
  };

  const getAlert = async () => {
    if(localStorage.getItem ('BHPFMS_IdNo')!=='physician')return
    setLoadingAlert (true);
    try {
      const res = await axios.get (
        `/api/appointment/reminder/physicain/${localStorage.getItem ('BHPFMS_IdNo')}`
      );
      setLoadingAlert (false);
      console.log(res.data.message);
      setAlertValue(res.data.message);
    } catch (error) {
      setLoadingAlert (false);
      console.log (error);
    }
  };

  useEffect (() => {
    getuserData ();
    getAlert()
    getUnreadMsg()
  }, [pathName]);

  useEffect(()=>{
    getAlert()
  },[])

  const tabs = [
    {
      key: '1',
      label: 'Alert',
      children: <AlertTab data={alertValue} loading={loadingAlert}/>,
    },
    {
      key: '2',
      label: 'Inbox',
      children: <InboxMsg  unReads={getUnreadMsg} fecth={fetchData}/>,
    },
    {
      key: '3',
      label: 'Sent',
      children: <SentMsg fecth={fetchData}/>,
    },
    {key: '4',
      label: 'FeedBacks',
      children: <InboxFeedBackAdmin  unReads={getUnreadMsg} fecth={fetchData}/>,
    },
    {key: '5',
      label: 'Reply',
      children: <SentFeedBackAdmin fecth={fetchData}/>,
    }
  ];

  const LogoutFunc = async () => {
    setLogoutLoading (true);
    try {
      const res = await axios.get(`/api/auth/logout/${localStorage.getItem ('BHPFMS_IdNo')}`)
      localStorage.setItem ('BHPFMS_Token', '');
      localStorage.setItem ('BHPFMS_Role', '');
      setLogoutLoading (false);
      navigate.replace('/')
      openNotification ('success', res.data.message, 3, 'green');
    } catch (error) {
      console.log(error)
      openNotification ('error', error.response.data.message, 3, 'red');
      setLogoutLoading (false);
    }
  };

  const items = [
    {
      key: '1',
      label: (
        <span style={{width:'100%',display:'flex',alignItems:'center'}}
          onClick={() => {
            setOpenValue (true);
            setOpenContent (<ProfileForm />);
            setTitle ('Profile');
          }}
        >
          Profile
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span
          onClick={() => {
            setOpenValue (true);
            setOpenContent (<ChangePasswordForm />);
            setTitle ('Change Password');
          }}
        >
          Change Password
        </span>
      ),
    },
    {
      key: '3',
      label: (
        <span style={{width:'100%',display:'flex',alignItems:'center'}}
          onClick={LogoutFunc}
        >
          {logoutLoading?<Spin></Spin>:'Logout'}
        </span>
      ),
    },
  ];

  const itemss = [
    {
      key: '4',
      label: (
        <Tabs defaultActiveKey="1" items={paths.includes('administrators')?tabs:tabs.slice(0,3)} style={{width: '350px',height:'450px'}} onChange={()=>setFetchData(c=>!c)}/>
      ),
    },
  ];
  const [visible, setVisible] = useState(false);
  const [makeFullScreen, setMakeFullScreen] = useState(false);


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      launchFullscreen(document.documentElement);
    } else {
      exitFullscreen();
    }

    setMakeFullScreen(prev => !prev);
  }

  // Fullscreen API
  function launchFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if(document.exitFullscreen) {
      document.exitFullscreen(); 
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } 
  }

  return (
    <Layout style={{height: '100vh'}}>
      <ModalForm
        open={openValue}
        close={() => setOpenValue (false)}
        content={openContent}
        title={openTitle}
        func={() => setOpenValue (c => !c)}
      />
      <Sider
        breakpoint='md'
        collapsedWidth="0"
      >
        <div
          style={{
            width: '100%',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* <Image
            src={logo}
            width={50}
            style={{borderRadius: '50%'}}
            height={50}
            alt="user"
          /> */}
          <FaUser size={35} color='white'/>
          <span style={{color: 'white', fontWeight: 'bold'}}>
            {loading ? 'loading' : userName}
          </span>
        </div>
        <div
          style={{
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {links.map (d => (
            <Link
              onMouseEnter={() => setHoverLink (d.href)}
              style={{
                color: pathName === d.href ||
                  hoverLink === d.href ||
                  pathName.startsWith (d.href)
                  ? 'white'
                  : 'rgb(200,200,200)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: '90%',
                height: '35px',
                background: pathName === d.href ? 'rgb(0,140,255)' : 'none',
                padding: '0 10px',
                borderRadius: '5px',
              }}
              href={d.href}
              key={d.key}
            >
              {d.icon} {d.label}
            </Link>
          ))}
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div>
            <Breadcrumb separator={<FaAngleRight />}>
              {paths.map ((path, index) => {
                const url = '/' + paths.slice (0, index + 1).join ('/');
                return (
                  <Breadcrumb.Item key={path}>
                    <Link href={url}>{path.toLocaleUpperCase ()}</Link>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <Tooltip title='Write Message'>
          <BiMessageDetail onClick={() => {
            setOpenValue (true);
            setOpenContent (<NewMsgForm openModalFun={(e)=>setOpenValue(e)}/>);
            setTitle ('Message');
          }} size={25} cursor={'pointer'} />
          </Tooltip>
          <Dropdown 
          visible={visible}
          onVisibleChange={v=>setVisible(v)}
              menu={{
                items: itemss,onClick:()=>setVisible(true)
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Badge size="small" count={unreadCount}>
                <IoNotificationsCircle size={26} cursor={'pointer'} />
                {/* <IoNotificationsCircle size={26} onClick={()=>play()} cursor={'pointer'} /> */}
              </Badge>
            </Dropdown>
            <Dropdown
              menu={{
                items: items,
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <IoSettingsOutline size={22} cursor={'pointer'} />
            </Dropdown>
            <Button style={{display:'flex',alignItems:'center'}} onClick={toggleFullscreen}>{makeFullScreen?<AiOutlineFullscreenExit/>:<SlSizeFullscreen/>}</Button>
          </div>
        </Header>
        <Content
          style={{
            overflow: 'scroll',
            margin: '16px 8px 0',
          }}
        >
          <div
            style={{
              padding: 16,
              minHeight: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {content}
          </div>
        </Content>
        <Footer
          style={{
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {footer}
          {' '}
          ©
          {new Date ().getFullYear ()}
          {' '}
          by
          {' '}
          <Link href={'https://www.t.me/idofc'}> Group 4</Link>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default SideTopNav;
