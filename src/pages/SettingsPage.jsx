import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Form, Input, Button, Progress, Statistic, Modal, message, Radio, Divider, Steps, Skeleton } from 'antd';
import { LockOutlined, DeleteOutlined, CreditCardOutlined, ShoppingCartOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SettingsPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [buyCreditsModalOpen, setBuyCreditsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const plans = [
        { id: 1, name: 'Starter', credits: 1000, price: 10, savings: null },
        { id: 2, name: 'Pro', credits: 5000, price: 40, savings: '20%' },
        { id: 3, name: 'Enterprise', credits: 10000, price: 70, savings: '30%' },
    ];

    const onFinish = (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('Passwords do not match!');
            return;
        }
        message.success('Password updated successfully!');
        form.resetFields();
    };

    const handleDeleteAccount = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete your account?',
            content: 'This action cannot be undone. All your data will be correctly lost.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                message.loading('Deleting account...').then(() => message.success('Account deleted (simulated)'));
            },
        });
    };

    const handleBuyCredits = () => {
        setBuyCreditsModalOpen(true);
        setCurrentStep(0);
        setSelectedPlan(plans[1]); // Default to Pro
    };

    const handlePayment = () => {
        setPaymentLoading(true);
        setTimeout(() => {
            setPaymentLoading(false);
            setBuyCreditsModalOpen(false);
            message.success(`Successfully purchased ${selectedPlan.credits} credits!`);
        }, 2000);
    };

    // Render Modal Content based on step
    const renderModalContent = () => {
        if (currentStep === 0) {
            return (
                <div style={{ marginTop: 20 }}>
                    <Radio.Group
                        onChange={(e) => setSelectedPlan(plans.find(p => p.id === e.target.value))}
                        value={selectedPlan?.id}
                        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                    >
                        {plans.map(plan => (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan)}
                                style={{
                                    border: `1px solid ${selectedPlan?.id === plan.id ? '#1677ff' : '#d9d9d9'}`,
                                    borderRadius: 8,
                                    padding: 16,
                                    cursor: 'pointer',
                                    backgroundColor: selectedPlan?.id === plan.id ? '#e6f4ff' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Radio value={plan.id} style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <div>
                                            <Text strong style={{ fontSize: 16 }}>{plan.name}</Text>
                                            <div style={{ color: '#666' }}>{plan.credits.toLocaleString()} Credits</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text strong style={{ fontSize: 18, color: '#1677ff' }}>${plan.price}</Text>
                                            {plan.savings && <div style={{ fontSize: 12, color: '#52c41a' }}>Save {plan.savings}</div>}
                                        </div>
                                    </div>
                                </Radio>
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            );
        } else {
            return (
                <div style={{ marginTop: 20 }}>
                    <Card size="small" title="Order Summary" style={{ background: '#f5f5f5', marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>{selectedPlan?.name} Plan ({selectedPlan?.credits} Credits)</Text>
                            <Text strong>${selectedPlan?.price}.00</Text>
                        </div>
                    </Card>

                    <Form layout="vertical">
                        <Form.Item label="Card Information" required>
                            <Input prefix={<CreditCardOutlined />} placeholder="Card Number" style={{ marginBottom: 8 }} />
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Input placeholder="MM / YY" />
                                </Col>
                                <Col span={12}>
                                    <Input placeholder="CVC" />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item label="Cardholder Name">
                            <Input placeholder="Name on card" />
                        </Form.Item>
                    </Form>
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="settings-container">
                <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 24 }} />
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <Card bordered={false}>
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card bordered={false}>
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Skeleton active paragraph={{ rows: 2 }} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Settings</Title>
                <Text type="secondary">Manage your account, billing, and preferences.</Text>
            </div>

            <Row gutter={[24, 24]}>
                {/* Credits Section */}
                <Col xs={24} lg={12}>
                    <Card title="Credit Balance" bordered={false}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Statistic
                                title="Available Credits"
                                value={2450}
                                prefix={<DollarCircleOutlined />}
                            />
                            <Button type="primary" onClick={handleBuyCredits}>Buy More Credits</Button>
                        </div>
                        <Progress percent={65} status="active" strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <Text type="secondary">Used: 4,550</Text>
                            <Text type="secondary">Limit: 7,000</Text>
                        </div>
                    </Card>
                </Col>

                {/* Password Section */}
                <Col xs={24} lg={12}>
                    <Card title="Security" bordered={false}>
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="New Password" name="newPassword" rules={[{ required: true }, { min: 6 }]}>
                                        <Input.Password prefix={<LockOutlined />} placeholder="New password" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true }]}>
                                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">
                                    Update Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Danger Zone */}
                <Col span={24}>
                    <Card
                        title={<span style={{ color: '#ff4d4f' }}>Danger Zone</span>}
                        bordered={false}
                        style={{ border: '1px solid #ffccc7', background: '#fff1f0' }}
                        headStyle={{ borderBottom: '1px solid #ffccc7' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ maxWidth: '70%' }}>
                                <Text strong>Delete Account</Text>
                                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                    Deleting your account is permanent. All your data and credits will be wiped out immediately.
                                </Paragraph>
                            </div>
                            <Button danger type="primary" icon={<DeleteOutlined />} onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Buy Credits Modal */}
            <Modal
                title="Purchase Credits"
                open={buyCreditsModalOpen}
                onCancel={() => setBuyCreditsModalOpen(false)}
                footer={[
                    currentStep === 1 && (
                        <Button key="back" onClick={() => setCurrentStep(0)}>
                            Back
                        </Button>
                    ),
                    <Button
                        key="submit"
                        type="primary"
                        loading={paymentLoading}
                        onClick={currentStep === 0 ? () => setCurrentStep(1) : handlePayment}
                    >
                        {currentStep === 0 ? 'Continue' : 'Pay Now'}
                    </Button>,
                ]}
            >
                <Steps
                    current={currentStep}
                    items={[
                        { title: 'Select Plan', icon: <ShoppingCartOutlined /> },
                        { title: 'Payment', icon: <CreditCardOutlined /> },
                    ]}
                />

                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default SettingsPage;
