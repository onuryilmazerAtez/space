import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Avatar, Dropdown, theme } from 'antd';
import {
    AppstoreOutlined,
    BarChartOutlined,
    UserOutlined,
    MessageOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    DownOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <AppstoreOutlined />,
            label: 'Overview',
        },
        {
            key: '/analytics',
            icon: <BarChartOutlined />,
            label: 'Analytics',
        },
        {
            key: '/users',
            icon: <UserOutlined />,
            label: 'Users',
        },
        {
            key: '/reports',
            icon: <FileTextOutlined />,
            label: 'Raporlar',
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    const userMenu = {
        items: [
            {
                key: '1',
                label: 'Profile',
            },
            {
                key: '2',
                label: 'Logout',
                danger: true,
            },
        ],
    };

    return (
        <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={250}
                style={{
                    background: '#214F73',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
                    zIndex: 100,
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflow: 'auto',
                    flexShrink: 0
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? 0 : '0 24px',
                    background: '#1a3e5c',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        marginRight: collapsed ? 0 : 12
                    }}>
                        <AppstoreOutlined />
                    </div>
                    {!collapsed && <span style={{ fontWeight: 600, fontSize: 16, color: 'white' }}>Dashboard</span>}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{
                        background: '#214F73',
                        borderRight: 0,
                        marginTop: 16
                    }}
                />
            </Sider>
            <Layout style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh' }}>
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', zIndex: 99, flexShrink: 0, position: 'sticky', top: 0 }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <Badge count={3} size="small">
                            <Button type="text" shape="circle" icon={<BellOutlined />} />
                        </Badge>

                        <Dropdown menu={userMenu}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                                <Avatar src="https://ui-avatars.com/api/?name=Onur+Yilmazer&background=214F73&color=fff" />
                                <span style={{ fontWeight: 500 }}>Onur Yilmazer</span>
                                <DownOutlined style={{ fontSize: 12, color: '#999' }} />
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflowY: 'auto',
                        flex: 1,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
