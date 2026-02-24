import React, { useState } from 'react';
import { Steps, Form, Select, Input, Button, Card, Typography, Divider, Space, Row, Col, InputNumber, message, Progress, Badge } from 'antd';
import { CalculatorOutlined, GlobalOutlined, FileTextOutlined, DollarOutlined, CheckCircleOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const TaxCalculationPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const countries = ['Türkiye', 'Almanya', 'Fransa', 'İtalya', 'İspanya', 'ABD', 'Çin', 'Japonya'];
    const regimes = ['İthalat', 'İhracat', 'Transit', 'Geçici İthalat'];
    const currencies = ['USD', 'EUR', 'TRY', 'GBP', 'JPY'];
    const paymentMethods = ['Peşin', 'Vadeli', 'Akreditif', 'Vesaik Mukabili'];
    const deliveryTerms = ['FOB', 'CIF', 'CFR', 'EXW', 'DDP'];

    const steps = [
        {
            title: 'Ülke Bilgileri',
            icon: <GlobalOutlined />,
            description: 'Çıkış, varış ve menşe ülkelerini belirleyin'
        },
        {
            title: 'Rejim ve GTIP',
            icon: <FileTextOutlined />,
            description: 'Gümrük rejimi ve ürün kodunu girin'
        },
        {
            title: 'Sonuçlar',
            icon: <CalculatorOutlined />,
            description: 'Hesaplama sonuçlarını görüntüleyin'
        },
    ];

    const handleNext = async () => {
        try {
            const values = await form.validateFields();
            setFormData({ ...formData, ...values });
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleFinish = async () => {
        try {
            const values = await form.validateFields();
            const finalData = { ...formData, ...values };
            console.log('Final Tax Calculation Data:', finalData);
            message.success('Vergi hesaplama tamamlandı!');
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{ padding: '24px 0' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '32px',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            color: 'white'
                        }}>
                            <GlobalOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <Title level={3} style={{ color: 'white', margin: 0 }}>Ülke Bilgilerini Giriniz</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                                Gümrük işleminiz için gerekli ülke bilgilerini seçin
                            </Text>
                        </div>

                        <Form form={form} layout="vertical" size="middle">
                            <Card
                                style={{
                                    marginBottom: 16,
                                    borderRadius: 12,
                                    border: '2px solid #f0f0f0',
                                    transition: 'all 0.3s'
                                }}
                                className="form-card"
                            >
                                <Form.Item
                                    label={<Text strong style={{ fontSize: 16 }}>🚀 Çıkış Ülkesi</Text>}
                                    name="originCountry"
                                    rules={[{ required: true, message: 'Lütfen çıkış ülkesini seçiniz' }]}
                                >
                                    <Select
                                        placeholder="Ülke seçiniz"
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {countries.map(country => (
                                            <Option key={country} value={country}>{country}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Card>

                            <Card
                                style={{
                                    marginBottom: 16,
                                    borderRadius: 12,
                                    border: '2px solid #f0f0f0'
                                }}
                                className="form-card"
                            >
                                <Form.Item
                                    label={<Text strong style={{ fontSize: 16 }}>🎯 Varış Ülkesi</Text>}
                                    name="destinationCountry"
                                    rules={[{ required: true, message: 'Lütfen varış ülkesini seçiniz' }]}
                                >
                                    <Select
                                        placeholder="Ülke seçiniz"
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {countries.map(country => (
                                            <Option key={country} value={country}>{country}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Card>

                            <Card
                                style={{
                                    marginBottom: 16,
                                    borderRadius: 12,
                                    border: '2px solid #f0f0f0'
                                }}
                                className="form-card"
                            >
                                <Form.Item
                                    label={<Text strong style={{ fontSize: 16 }}>🏭 Menşe Ülkesi</Text>}
                                    name="sourceCountry"
                                    rules={[{ required: true, message: 'Lütfen menşe ülkesini seçiniz' }]}
                                >
                                    <Select
                                        placeholder="Ülke seçiniz"
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {countries.map(country => (
                                            <Option key={country} value={country}>{country}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Card>
                        </Form>
                    </div>
                );
            case 1:
                return (
                    <div style={{ padding: '24px 0' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            padding: '32px',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            color: 'white'
                        }}>
                            <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <Title level={3} style={{ color: 'white', margin: 0 }}>Rejim ve GTIP Kodu</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                                Gümrük rejimini ve ürün kodunu belirleyin
                            </Text>
                        </div>

                        <Form form={form} layout="vertical" size="middle">
                            <Card
                                style={{
                                    marginBottom: 16,
                                    borderRadius: 12,
                                    border: '2px solid #f0f0f0'
                                }}
                                className="form-card"
                            >
                                <Form.Item
                                    label={<Text strong style={{ fontSize: 16 }}>📋 Rejim</Text>}
                                    name="regime"
                                    rules={[{ required: true, message: 'Lütfen rejim seçiniz' }]}
                                >
                                    <Select placeholder="Rejim seçiniz">
                                        {regimes.map(regime => (
                                            <Option key={regime} value={regime}>{regime}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Card>

                            <Card
                                style={{
                                    marginBottom: 16,
                                    borderRadius: 12,
                                    border: '2px solid #f0f0f0'
                                }}
                                className="form-card"
                            >
                                <Form.Item
                                    label={<Text strong style={{ fontSize: 16 }}>🔢 G.T.İ.P Kodu</Text>}
                                    name="gtipCode"
                                    rules={[
                                        { required: true, message: 'Lütfen GTIP kodunu giriniz' },
                                        { pattern: /^\d{8,12}$/, message: 'GTIP kodu 8-12 haneli olmalıdır' }
                                    ]}
                                    extra={<Text type="secondary">8-12 haneli ürün kodu (örn: 84713000)</Text>}
                                >
                                    <Input placeholder="Örn: 84713000" />
                                </Form.Item>
                            </Card>
                        </Form>
                    </div>
                );
            case 2:
                return (
                    <div style={{ padding: '24px 0' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            padding: '32px',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <CheckCircleOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                            <Title level={2} style={{ color: 'white', margin: 0 }}>Hesaplama Sonuçları</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                                İşleminiz için gerekli bilgiler ve belgeler
                            </Text>
                        </div>

                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col span={8}>
                                <Card style={{ textAlign: 'center', borderRadius: 12, background: '#f6ffed', border: '2px solid #b7eb8f' }}>
                                    <Text type="secondary">Çıkış</Text>
                                    <Title level={4} style={{ margin: '8px 0' }}>{formData.originCountry || '-'}</Title>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ textAlign: 'center', borderRadius: 12, background: '#e6f7ff', border: '2px solid #91d5ff' }}>
                                    <Text type="secondary">Varış</Text>
                                    <Title level={4} style={{ margin: '8px 0' }}>{formData.destinationCountry || '-'}</Title>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ textAlign: 'center', borderRadius: 12, background: '#fff7e6', border: '2px solid #ffd591' }}>
                                    <Text type="secondary">Menşe</Text>
                                    <Title level={4} style={{ margin: '8px 0' }}>{formData.sourceCountry || '-'}</Title>
                                </Card>
                            </Col>
                        </Row>

                        <Card
                            title={
                                <Space>
                                    <FileTextOutlined style={{ color: '#1890ff' }} />
                                    <Text strong>Vergilendirmeyi Etkileyen Belgeler</Text>
                                </Space>
                            }
                            style={{ marginBottom: 16, borderRadius: 12 }}
                            headStyle={{ background: '#f0f5ff', borderRadius: '12px 12px 0 0' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {[
                                    { icon: '📄', text: 'Fatura (Invoice)' },
                                    { icon: '🏆', text: 'Menşe Şahadetnamesi' },
                                    { icon: '🚢', text: 'Konşimento / Taşıma Belgesi' },
                                    { icon: '📦', text: 'Paket Listesi' },
                                    { icon: '🛡️', text: 'Sigorta Poliçesi (varsa)' }
                                ].map((item, idx) => (
                                    <div key={idx} style={{
                                        padding: '12px 16px',
                                        background: '#fafafa',
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12
                                    }}>
                                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                                        <Text>{item.text}</Text>
                                    </div>
                                ))}
                            </Space>
                        </Card>

                        <Card
                            title={
                                <Space>
                                    <CalculatorOutlined style={{ color: '#52c41a' }} />
                                    <Text strong>Detaylı Eşya Tanımlama</Text>
                                </Space>
                            }
                            style={{ marginBottom: 16, borderRadius: 12 }}
                            headStyle={{ background: '#f6ffed', borderRadius: '12px 12px 0 0' }}
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div style={{ textAlign: 'center', padding: 16, background: '#fafafa', borderRadius: 8 }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>GTIP Kodu</Text>
                                        <Title level={4} style={{ margin: 0 }}>{formData.gtipCode || '-'}</Title>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{ textAlign: 'center', padding: 16, background: '#fafafa', borderRadius: 8 }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Rejim</Text>
                                        <Title level={4} style={{ margin: 0 }}>{formData.regime || '-'}</Title>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{ textAlign: 'center', padding: 16, background: '#fafafa', borderRadius: 8 }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Menşe</Text>
                                        <Title level={4} style={{ margin: 0 }}>{formData.sourceCountry || '-'}</Title>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        <Card
                            title={
                                <Space>
                                    <DollarOutlined style={{ color: '#faad14' }} />
                                    <Text strong>Eşyanın Kıymeti ve Miktarı</Text>
                                </Space>
                            }
                            headStyle={{ background: '#fffbe6', borderRadius: '12px 12px 0 0' }}
                            style={{ borderRadius: 12 }}
                        >
                            <Form form={form} layout="vertical" size="large">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<Text strong>💳 Ödeme Şekli</Text>}
                                            name="paymentMethod"
                                            rules={[{ required: true, message: 'Ödeme şeklini seçiniz' }]}
                                        >
                                            <Select placeholder="Seçiniz">
                                                {paymentMethods.map(method => (
                                                    <Option key={method} value={method}>{method}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<Text strong>🚚 Teslim Şekli</Text>}
                                            name="deliveryTerm"
                                            rules={[{ required: true, message: 'Teslim şeklini seçiniz' }]}
                                        >
                                            <Select placeholder="Seçiniz">
                                                {deliveryTerms.map(term => (
                                                    <Option key={term} value={term}>{term}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<Text strong>💰 Eşya Kıymeti</Text>}
                                            name="value"
                                            rules={[{ required: true, message: 'Kıymet giriniz' }]}
                                        >
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder="0.00"
                                                min={0}
                                                precision={2}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<Text strong>💵 Döviz Cinsi</Text>}
                                            name="currency"
                                            rules={[{ required: true, message: 'Döviz cinsi seçiniz' }]}
                                        >
                                            <Select placeholder="Seçiniz">
                                                {currencies.map(curr => (
                                                    <Option key={curr} value={curr}>{curr}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    label={<Text strong>📊 Miktar (kg/adet)</Text>}
                                    name="quantity"
                                    rules={[{ required: true, message: 'Miktar giriniz' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="0"
                                        min={0}
                                    />
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)',
        }}>
            {/* Page layout: left progress sidebar + right content */}
            <div style={{ display: 'flex', alignItems: 'flex-start', padding: '32px 32px 32px 24px', gap: 24 }}>

                {/* Left: Sticky Vertical Progress Sidebar */}
                <div style={{
                    position: 'sticky',
                    top: 80,
                    width: 220,
                    flexShrink: 0,
                    background: 'white',
                    borderRadius: 16,
                    padding: '24px 20px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0',
                }}>
                    {/* Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                        <div style={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CalculatorOutlined style={{ color: 'white', fontSize: 18 }} />
                        </div>
                        <Text strong style={{ fontSize: 13, lineHeight: '1.3' }}>Vergi<br />Hesaplama</Text>
                    </div>

                    {/* Vertical Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {steps.map((step, index) => {
                            const isDone = index < currentStep;
                            const isActive = index === currentStep;
                            const isClickable = isDone;

                            // Summary values to show under each completed step
                            const stepSummary = (() => {
                                if (!isDone) return null;
                                if (index === 0) {
                                    const lines = [];
                                    if (formData.originCountry) lines.push(`🚀 ${formData.originCountry}`);
                                    if (formData.destinationCountry) lines.push(`🎯 ${formData.destinationCountry}`);
                                    if (formData.sourceCountry) lines.push(`🌍 ${formData.sourceCountry}`);
                                    return lines;
                                }
                                if (index === 1) {
                                    const lines = [];
                                    if (formData.regime) lines.push(`📋 ${formData.regime}`);
                                    if (formData.gtipCode) lines.push(`🔢 ${formData.gtipCode}`);
                                    return lines;
                                }
                                return null;
                            })();

                            return (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <div
                                        style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 12,
                                            cursor: isClickable ? 'pointer' : 'default',
                                            borderRadius: 8,
                                            padding: '4px 4px',
                                            width: '100%',
                                            transition: 'background 0.2s',
                                        }}
                                        onClick={() => isClickable && setCurrentStep(index)}
                                        onMouseEnter={e => { if (isClickable) e.currentTarget.style.background = '#f5f5f5'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {/* Circle */}
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: isDone ? '#52c41a' : isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                                            border: isActive ? 'none' : isDone ? 'none' : '2px solid #e0e0e0',
                                            flexShrink: 0,
                                            transition: 'all 0.3s',
                                        }}>
                                            {isDone
                                                ? <CheckCircleOutlined style={{ color: 'white', fontSize: 16 }} />
                                                : <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'white' : '#bbb' }}>{index + 1}</span>
                                            }
                                        </div>
                                        {/* Label + Summary */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Text style={{
                                                fontSize: 13,
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive ? '#1890ff' : isDone ? '#52c41a' : '#999',
                                                display: 'block',
                                            }}>{step.title}</Text>
                                            {stepSummary && stepSummary.length > 0 ? (
                                                <div style={{ marginTop: 4 }}>
                                                    {stepSummary.map((line, i) => (
                                                        <Text key={i} style={{
                                                            fontSize: 11, color: '#555', display: 'block',
                                                            lineHeight: '1.6', whiteSpace: 'nowrap',
                                                            overflow: 'hidden', textOverflow: 'ellipsis'
                                                        }}>{line}</Text>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Text style={{ fontSize: 11, color: '#bbb', lineHeight: '1.2' }}>{step.description}</Text>
                                            )}
                                            {isClickable && (
                                                <Text style={{ fontSize: 10, color: '#1890ff', marginTop: 2, display: 'block' }}>
                                                    Düzenle →
                                                </Text>
                                            )}
                                        </div>
                                    </div>
                                    {/* Connector line */}
                                    {index < steps.length - 1 && (
                                        <div style={{
                                            width: 2, height: 28, marginLeft: 15,
                                            background: isDone ? '#52c41a' : '#e8e8e8',
                                            borderRadius: 2,
                                            transition: 'background 0.3s',
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress percentage */}
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>İlerleme</Text>
                            <Text strong style={{ fontSize: 12, color: '#667eea' }}>
                                {Math.round((currentStep / (steps.length - 1)) * 100)}%
                            </Text>
                        </div>
                        <Progress
                            percent={Math.round((currentStep / (steps.length - 1)) * 100)}
                            strokeColor={{ '0%': '#667eea', '100%': '#52c41a' }}
                            showInfo={false}
                            size="small"
                        />
                    </div>

                    {/* Back to home */}
                    <Button
                        onClick={() => navigate('/')}
                        icon={<ArrowLeftOutlined />}
                        style={{ marginTop: 20, width: '100%' }}
                        size="small"
                    >
                        Ana Sayfa
                    </Button>
                </div>

                {/* Right: Main Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Inline Page Title */}
                    <div style={{ marginBottom: 24 }}>
                        <Title level={3} style={{ margin: 0 }}>Vergi Hesaplama</Title>
                        <Text type="secondary">Gümrük vergisi ve ithalat maliyetlerini hesaplayın</Text>
                    </div>

                    {/* Content Card */}
                    <Card style={{ borderRadius: 16, minHeight: 400 }}>
                        {renderStepContent()}

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            {currentStep > 0 && (
                                <Button
                                    size="large"
                                    onClick={handlePrevious}
                                    icon={<ArrowLeftOutlined />}
                                >
                                    Geri
                                </Button>
                            )}
                            {currentStep < steps.length - 1 && (
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleNext}
                                    style={{ marginLeft: 'auto' }}
                                    icon={<ArrowRightOutlined />}
                                    iconPosition="end"
                                >
                                    İleri
                                </Button>
                            )}
                            {currentStep === steps.length - 1 && (
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleFinish}
                                    style={{ marginLeft: 'auto', background: '#52c41a', borderColor: '#52c41a' }}
                                    icon={<CheckCircleOutlined />}
                                    iconPosition="end"
                                >
                                    Hesaplamayı Tamamla
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <style jsx>{`
                .form-card:hover {
                    border-color: #1890ff !important;
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
                }
            `}</style>
        </div>
    );
};

export default TaxCalculationPage;
