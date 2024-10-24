import React, { useEffect, useState } from 'react';
import { fetchLeads, searchLeads, createLead } from './services/leadService';
import LeadList from './components/Leads/AddLeadModal';
import SearchTab from './components/Leads/SearchTab';
import LeadTable from './components/Leads/allLeadsTable';

// function App() {

 
//   return (
   
//   );
// }

// export default App;


import { Breadcrumb, Button, Layout, Menu, notification, theme } from 'antd';
import Search from 'antd/es/input/Search';
import Home from './pages/Home';
const { Header, Content, Footer } = Layout;
const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));
const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: message ?? 'Notification Title',
      
    });
  };
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          justifyContent:"space-between",
          alignItems: 'center',
        }}
      >
        <div style={{color:'white'}} >Lead Managment</div>
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        {/* <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
             <div>
      <h1>Lead Management</h1>
      {loading && <p>Loading...</p>}

<Search
      placeholder="input search text"
      allowClear
      onSearch={setSearchQuery}
      style={{
        width: 200,
      }}
    />
      <LeadTable handleCreate={handleCreate} leads={leads} />
      <div>
        <button
          onClick={() => loadLeads(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <button onClick={() => loadLeads(currentPage + 1)} disabled={loading}>
          Next
        </button>
      </div>
    </div>
        </div> */}
              {contextHolder}

        <Home openNotificationWithIcon={openNotificationWithIcon}/>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Lead Management ©{new Date().getFullYear()} Created by Ryan
      </Footer>
    </Layout>
  );
};
export default App;