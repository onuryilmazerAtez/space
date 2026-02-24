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
    ShoppingOutlined,
    TagOutlined,
    GiftOutlined,
    ShopOutlined,
    RocketOutlined,
    FundProjectionScreenOutlined,
    MailOutlined,
    NotificationOutlined,
    DollarOutlined,
    WalletOutlined,
    BankOutlined,
    AuditOutlined,
    CustomerServiceOutlined,
    QuestionCircleOutlined,
    BugOutlined,
    PhoneOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

/* Icon hover animation styles */
const sidebarAnimationStyles = `
@keyframes iconBounce {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.35) rotate(-8deg); }
    50%  { transform: scale(0.95) rotate(4deg); }
    70%  { transform: scale(1.15) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); }
}

@keyframes iconPulse {
    0%   { transform: scale(1); opacity: 1; }
    50%  { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}

.sidebar-animated-menu .ant-menu-item:hover .anticon,
.sidebar-animated-menu .ant-menu-submenu-title:hover .anticon {
    animation: iconBounce 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    color: #69c0ff !important;
    transition: color 0.3s ease;
}

.sidebar-animated-menu .ant-menu-item .anticon,
.sidebar-animated-menu .ant-menu-submenu-title .anticon {
    transition: color 0.3s ease, transform 0.3s ease;
    font-size: 16px;
}

.sidebar-animated-menu .ant-menu-item:hover,
.sidebar-animated-menu .ant-menu-submenu-title:hover {
    background: rgba(255, 255, 255, 0.08) !important;
}

.sidebar-animated-menu .ant-menu-sub {
    background: #1a3e5c !important;
}

.sidebar-animated-menu .ant-menu-sub .ant-menu-item {
    padding-left: 48px !important;
}

.sidebar-animated-menu .ant-menu-submenu-arrow {
    color: rgba(255, 255, 255, 0.65) !important;
}

.sidebar-animated-menu .ant-menu-submenu-open > .ant-menu-submenu-title .anticon {
    animation: iconPulse 0.4s ease forwards;
    color: #69c0ff !important;
}
`;

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
        {
            type: 'divider',
            style: { borderColor: 'rgba(255,255,255,0.1)', margin: '12px 16px' },
        },
        {
            key: 'products-sub',
            icon: <ShoppingOutlined />,
            label: 'Ürünler',
            children: [
                {
                    key: '/products/catalog',
                    icon: <ShopOutlined />,
                    label: 'Katalog',
                },
                {
                    key: '/products/categories',
                    icon: <TagOutlined />,
                    label: 'Kategoriler',
                },
                {
                    key: '/products/inventory',
                    icon: <GiftOutlined />,
                    label: 'Stok Yönetimi',
                },
            ],
        },
        {
            key: 'marketing-sub',
            icon: <RocketOutlined />,
            label: 'Pazarlama',
            children: [
                {
                    key: '/marketing/campaigns',
                    icon: <FundProjectionScreenOutlined />,
                    label: 'Kampanyalar',
                },
                {
                    key: '/marketing/email',
                    icon: <MailOutlined />,
                    label: 'E-Posta',
                },
                {
                    key: '/marketing/notifications',
                    icon: <NotificationOutlined />,
                    label: 'Bildirimler',
                },
            ],
        },
        {
            key: 'finance-sub',
            icon: <DollarOutlined />,
            label: 'Finans',
            children: [
                {
                    key: '/finance/payments',
                    icon: <WalletOutlined />,
                    label: 'Ödemeler',
                },
                {
                    key: '/finance/accounting',
                    icon: <BankOutlined />,
                    label: 'Muhasebe',
                },
                {
                    key: '/finance/invoices',
                    icon: <AuditOutlined />,
                    label: 'Faturalar',
                },
            ],
        },
        {
            key: 'support-sub',
            icon: <CustomerServiceOutlined />,
            label: 'Destek',
            children: [
                {
                    key: '/support/tickets',
                    icon: <QuestionCircleOutlined />,
                    label: 'Talepler',
                },
                {
                    key: '/support/bugs',
                    icon: <BugOutlined />,
                    label: 'Hata Bildirimi',
                },
                {
                    key: '/support/contact',
                    icon: <PhoneOutlined />,
                    label: 'İletişim',
                },
            ],
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
            <style>{sidebarAnimationStyles}</style>
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
                    className="sidebar-animated-menu"
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => {
                        if (!key.endsWith('-sub')) {
                            navigate(key);
                        }
                    }}
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
