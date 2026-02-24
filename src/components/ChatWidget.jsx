import React, { useState } from 'react';
import { FloatButton, Badge, Drawer, List, Avatar, Input, Button, Space, Tag, Checkbox } from 'antd';
import { MessageOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const messages = [
        { id: 1, sender: 'Alice Johnson', text: 'Hey, can you review the latest design?', time: '2 min ago', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=1677ff&color=fff', unread: true },
        { id: 2, sender: 'Bob Smith', text: 'Meeting at 3 PM today', time: '15 min ago', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=52c41a&color=fff', unread: true },
        { id: 3, sender: 'Charlie Davis', text: 'Project Alpha is completed!', time: '1 hour ago', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=faad14&color=fff', unread: false },
        { id: 4, sender: 'Diana Prince', text: 'Can we reschedule our call?', time: '3 hours ago', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=f56a00&color=fff', unread: false },
    ];

    const unreadCount = messages.filter(m => m.unread).length;

    const handleToggleMessage = (id) => {
        setSelectedMessages(prev =>
            prev.includes(id) ? prev.filter(msgId => msgId !== id) : [...prev, id]
        );
    };

    const handleSendMessage = () => {
        if (messageText.trim()) {
            console.log('Sending message:', messageText);
            setMessageText('');
        }
    };

    return (
        <>
            <FloatButton
                icon={<Badge count={unreadCount} offset={[-5, 5]}><MessageOutlined /></Badge>}
                type="primary"
                style={{ right: 24, bottom: 24, width: 60, height: 60 }}
                onClick={() => setOpen(true)}
            />

            <Drawer
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Messages</span>
                        {selectedMessages.length > 0 && (
                            <Tag color="blue">{selectedMessages.length} selected</Tag>
                        )}
                    </div>
                }
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
                width={400}
                footer={
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onPressEnter={handleSendMessage}
                        />
                        <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                            Send
                        </Button>
                    </Space.Compact>
                }
            >
                <List
                    dataSource={messages}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                padding: '12px 0',
                                background: selectedMessages.includes(item.id) ? '#f0f5ff' : 'transparent',
                                borderRadius: 8,
                                marginBottom: 8,
                                paddingLeft: 8,
                                paddingRight: 8
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Space>
                                        <Checkbox
                                            checked={selectedMessages.includes(item.id)}
                                            onChange={() => handleToggleMessage(item.id)}
                                        />
                                        <Badge dot={item.unread} offset={[-5, 5]}>
                                            <Avatar src={item.avatar} />
                                        </Badge>
                                    </Space>
                                }
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: item.unread ? 600 : 400 }}>{item.sender}</span>
                                        <span style={{ fontSize: 12, color: '#999' }}>{item.time}</span>
                                    </div>
                                }
                                description={
                                    <span style={{ color: item.unread ? '#000' : '#666' }}>{item.text}</span>
                                }
                            />
                        </List.Item>
                    )}
                />

                {selectedMessages.length > 0 && (
                    <div style={{
                        position: 'sticky',
                        bottom: 0,
                        background: '#fff',
                        padding: '12px 0',
                        borderTop: '1px solid #f0f0f0',
                        marginTop: 16
                    }}>
                        <Space>
                            <Button size="small" onClick={() => console.log('Mark as read:', selectedMessages)}>
                                Mark as Read
                            </Button>
                            <Button size="small" onClick={() => console.log('Enable notifications:', selectedMessages)}>
                                Enable Notifications
                            </Button>
                            <Button size="small" danger onClick={() => setSelectedMessages([])}>
                                Clear Selection
                            </Button>
                        </Space>
                    </div>
                )}
            </Drawer>
        </>
    );
};

export default ChatWidget;
