import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Statistic, Progress, Avatar, List, Button, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DollarCircleOutlined, ProjectOutlined, CalculatorOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ShipmentStatusBar from '../components/ShipmentStatusBar';

const { Title, Text } = Typography;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const quickAccess = [
        { label: 'New Project', icon: <ProjectOutlined /> },
        { label: 'Upload File', icon: <UserOutlined /> },
        { label: 'Share Report', icon: null },
    ];

    // Stats Data
    const stats = [
        { title: 'Total Revenue', value: 12450, icon: <DollarCircleOutlined />, diff: 12.5 },
        { title: 'New Users', value: 1254, icon: <UserOutlined />, diff: -2.4 },
        { title: 'Active Projects', value: 45.00, icon: <ProjectOutlined />, diff: 5.8 },
    ];

    // Recent Activity Data
    const activities = [
        { title: 'New user registered', time: '2 min ago', color: 'blue' },
        { title: 'Project "Alpha" completed', time: '1 hour ago', color: 'green' },
        { title: 'Server maintenance', time: '4 hours ago', color: 'orange' },
        { title: 'Billing payment failed', time: '1 day ago', color: 'red' },
    ];

    if (loading) {
        return (
            <div className="dashboard-container">
                <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 24 }} />
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    {[1, 2, 3].map((i) => (
                        <Col xs={24} sm={8} key={i}>
                            <Card bordered={false}>
                                <Skeleton active />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card bordered={false}>
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card bordered={false}>
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Good Morning, Onur!</Title>
                    <Text type="secondary">Here's what's happening today.</Text>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    {quickAccess.map((item, idx) => (
                        <Button key={idx} icon={item.icon}>
                            {item.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Shipment Status Bar */}
            <div style={{ marginBottom: 24 }}>
                <ShipmentStatusBar onFilterChange={(key) => console.log('Filter:', key)} />
            </div>

            {/* Stats Grid */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                {stats.map((stat, idx) => (
                    <Col xs={24} sm={8} key={idx}>
                        <Card bordered={false} bodyStyle={{ padding: 24 }}>
                            <Statistic
                                title={<Text type="secondary">{stat.title}</Text>}
                                value={stat.value}
                                precision={2}
                                valueStyle={{ fontWeight: 600 }}
                                prefix={stat.icon}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Text type={stat.diff > 0 ? "success" : "danger"} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {stat.diff > 0 ? <RiseOutlined /> : <FallOutlined />}
                                    {Math.abs(stat.diff)}%
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>from last month</Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Tax Calculation Card */}
            <Card
                bordered={false}
                style={{
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    minHeight: 200,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                hoverable
                onClick={() => navigate('/tax-calculation')}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <div>
                        <Title level={3} style={{ color: 'white', marginBottom: 8 }}>
                            <CalculatorOutlined /> Vergi Hesaplama
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                            Gümrük vergisi ve ithalat maliyetlerinizi hızlıca hesaplayın
                        </Text>
                        <div style={{ marginTop: 16 }}>
                            <Button type="primary" ghost size="large">
                                Hesaplamaya Başla →
                            </Button>
                        </div>
                    </div>
                    <CalculatorOutlined style={{ fontSize: 120, opacity: 0.2 }} />
                </div>
            </Card>

            {/* Activity & Chart Section (Placeholder for Chart) */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Recent Projects" bordered={false} extra={<Button type="link">View All</Button>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={[
                                { title: 'Project Alpha', status: 'Active', members: 5 },
                                { title: 'Marketing Campaign', status: 'Pending', members: 3 },
                                { title: 'Website Redesign', status: 'Completed', members: 8 },
                                { title: 'Mobile App', status: 'Active', members: 4 },
                            ]}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Text
                                            key="status"
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: 12,
                                                fontSize: 12,
                                                background: item.status === 'Active' ? '#e6f7ff' : item.status === 'Pending' ? '#fff7e6' : '#f6ffed',
                                                color: item.status === 'Active' ? '#1677ff' : item.status === 'Pending' ? '#faad14' : '#52c41a'
                                            }}
                                        >
                                            {item.status}
                                        </Text>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>{item.title[0]}</Avatar>}
                                        title={item.title}
                                        description={`${item.members} members involved`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Recent Activity" bordered={false}>
                        <List
                            dataSource={activities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>}
                                        title={item.title}
                                        description={item.time}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
