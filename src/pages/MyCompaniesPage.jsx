import { useState, useMemo } from 'react';
import {
    Table, Button, Typography, Checkbox, Select, Tag, Space, Tooltip, Modal,
    Card, Popconfirm, message, Input, Drawer, Steps, Avatar,
    Empty, List, Dropdown, Radio,
} from 'antd';
import {
    PlusOutlined, MinusOutlined, FileTextOutlined,
    DeleteOutlined, InfoCircleOutlined, SearchOutlined,
    UsergroupAddOutlined, CloseOutlined,
    CheckCircleFilled, UserOutlined, BankOutlined,
    ArrowRightOutlined, SwapOutlined,
    TeamOutlined, SafetyCertificateOutlined,
    ThunderboltOutlined, CheckOutlined, UserAddOutlined,
    CopyOutlined, DownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ESYA_GRUPLARI_OPTIONS = [
    { value: 'grup1', label: 'Gıda Ürünleri' },
    { value: 'grup2', label: 'Tekstil' },
    { value: 'grup3', label: 'Kimyasal Maddeler' },
    { value: 'grup4', label: 'Elektronik' },
    { value: 'grup5', label: 'Makine ve Aksamları' },
    { value: 'grup6', label: 'Plastik Ürünleri' },
];

const ALL_AVAILABLE_USERS = [
    { key: 'u1', name: 'Test ert', email: 'test.ert@atez.com.tr' },
    { key: 'u2', name: 'TEST Tst', email: 'test.tst@atez.com.tr' },
    { key: 'u3', name: 'Hüseyin Test', email: 'huseyin.ulug@atez.com.tr' },
    { key: 'u4', name: 'Ahmet Yılmaz', email: 'ahmet.yilmaz@atez.com.tr' },
    { key: 'u5', name: 'Mehmet Kaya', email: 'mehmet.kaya@atez.com.tr' },
    { key: 'u6', name: 'Zeynep Demir', email: 'zeynep.demir@atez.com.tr' },
    { key: 'u7', name: 'Ayşe Çelik', email: 'ayse.celik@atez.com.tr' },
    { key: 'u8', name: 'Ali Öztürk', email: 'ali.ozturk@atez.com.tr' },
];

const INITIAL_COMPANIES = [
    {
        key: '1', firma: 'DenememeMail AŞ.', vkn: '7414741585',
        firmaYetkilisi: 'Hüseyin Test', firmaYetkilisiEposta: 'huseyin.ulug@atez.com.tr',
        esyaGruplari: null, aktif: true,
        kullanicilar: [
            { key: '1-1', no: 1, kullanici: 'Test ert', exIm: null, esyaGruplari: null, esyaOlusturma: true, esyaSiniflandirma: false, esyaKataloguGoruntule: false, esyaKataloguDuzenleme: true },
            { key: '1-2', no: 2, kullanici: 'TEST Tst', exIm: null, esyaGruplari: null, esyaOlusturma: true, esyaSiniflandirma: false, esyaKataloguGoruntule: false, esyaKataloguDuzenleme: true },
        ],
    },
    {
        key: '2', firma: 'Müşteri Firma Test', vkn: '5555555555',
        firmaYetkilisi: 'Müşteri Firma', firmaYetkilisiEposta: 'musteri.trch@outlook.com',
        esyaGruplari: null, aktif: true, kullanicilar: [],
    },
    {
        key: '3', firma: 'test Landed Cost', vkn: '1203134943',
        firmaYetkilisi: 'Test Landed Cost', firmaYetkilisiEposta: 'testlandedcost@outlook.com',
        esyaGruplari: null, aktif: true, kullanicilar: [],
    },
];

const PERMISSIONS = [
    { key: 'esyaOlusturma', label: 'Eşya Oluşturma', group: 'Eşya' },
    { key: 'esyaSiniflandirma', label: 'Eşya Sınıflandırma', group: 'Eşya' },
    { key: 'esyaKataloguGoruntule', label: 'Katalog Görüntüle', group: 'Eşya Kataloğu' },
    { key: 'esyaKataloguDuzenleme', label: 'Katalog Düzenleme', group: 'Eşya Kataloğu' },
];

const emptyUserPerms = () => ({
    exIm: null,
    esyaGruplari: [],
    esyaOlusturma: false,
    esyaSiniflandirma: false,
    esyaKataloguGoruntule: false,
    esyaKataloguDuzenleme: false,
});

// Inline permission editor used in bulk wizard step 1 and move/copy modal
const PermissionEditor = ({ perms, onChange }) => (
    <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block', marginBottom: 4 }}>Export / Import</Text>
                <Select
                    placeholder="Seç (opsiyonel)" size="small" style={{ width: '100%' }}
                    value={perms.exIm || undefined} allowClear
                    onChange={v => onChange({ ...perms, exIm: v || null })}
                    options={[{ value: 'export', label: 'Export' }, { value: 'import', label: 'Import' }, { value: 'both', label: 'Her İkisi' }]}
                />
            </div>
            <div style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#8c8c8c', display: 'block', marginBottom: 4 }}>Eşya Grupları</Text>
                <Select
                    mode="multiple" placeholder="Seç (opsiyonel)" size="small" style={{ width: '100%' }}
                    value={perms.esyaGruplari || []} allowClear maxTagCount={1}
                    onChange={v => onChange({ ...perms, esyaGruplari: v })}
                    options={ESYA_GRUPLARI_OPTIONS}
                />
            </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PERMISSIONS.map(perm => (
                <div
                    key={perm.key}
                    onClick={() => onChange({ ...perms, [perm.key]: !perms[perm.key] })}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                        border: perms[perm.key] ? '1px solid #91d5ff' : '1px solid #f0f0f0',
                        background: perms[perm.key] ? '#e6f7ff' : '#fafafa',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Checkbox checked={!!perms[perm.key]} style={{ pointerEvents: 'none' }} />
                    <Text style={{ fontSize: 12, color: perms[perm.key] ? '#1890ff' : '#595959' }}>{perm.label}</Text>
                </div>
            ))}
        </div>
    </div>
);

const MyCompaniesPage = () => {
    const [companies, setCompanies] = useState(INITIAL_COMPANIES);
    const [allUsers, setAllUsers] = useState(ALL_AVAILABLE_USERS);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [firmaSearch, setFirmaSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');

    // Bulk wizard state
    const [bulkDrawerOpen, setBulkDrawerOpen] = useState(false);
    const [bulkStep, setBulkStep] = useState(0);
    const [bulkSelectedUsers, setBulkSelectedUsers] = useState([]);
    // Per-user permissions: { [userKey]: { exIm, esyaGruplari, esyaOlusturma, ... } }
    const [bulkUserPermissions, setBulkUserPermissions] = useState({});
    const [bulkUserSearch, setBulkUserSearch] = useState('');
    // Per-user company mapping: { userKey: [companyKey1, companyKey2, ...] }
    const [bulkUserCompanyMap, setBulkUserCompanyMap] = useState({});
    // Per-user-per-company permission overrides: { [userKey]: { [companyKey]: permissions } }
    // If no override exists, base permissions from bulkUserPermissions are used
    const [bulkUserCompanyOverrides, setBulkUserCompanyOverrides] = useState({});
    // Tracks which company perm editor is currently expanded in Step 2
    const [expandedCompanyPerm, setExpandedCompanyPerm] = useState(null); // null | { userKey, companyKey }

    // New user form in wizard
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');

    // Move/Copy user modal
    const [moveModalOpen, setMoveModalOpen] = useState(false);
    const [moveAction, setMoveAction] = useState('move'); // 'move' | 'copy'
    const [moveUserName, setMoveUserName] = useState('');
    const [moveFromCompanyKey, setMoveFromCompanyKey] = useState('');
    const [moveToCompanyKeys, setMoveToCompanyKeys] = useState([]); // multi-target
    const [moveUserRecord, setMoveUserRecord] = useState(null);
    // Per-target-company permissions: { [companyKey]: permissions }
    // null entry = use original permissions
    const [moveCompanyPerms, setMoveCompanyPerms] = useState({});
    const [moveExpandedCompanyPerm, setMoveExpandedCompanyPerm] = useState(null);

    const aktifCount = companies.filter(c => c.aktif).length;
    const pasifCount = companies.filter(c => !c.aktif).length;

    const filteredCompanies = useMemo(() => {
        let result = companies;
        if (firmaSearch) {
            const q = firmaSearch.toLowerCase();
            result = result.filter(c => c.firma.toLowerCase().includes(q) || c.vkn.includes(q) || c.firmaYetkilisi.toLowerCase().includes(q));
        }
        return result;
    }, [companies, firmaSearch]);

    const filterUsersBySearch = (users) => {
        if (!userSearch) return users;
        const q = userSearch.toLowerCase();
        return users.filter(u => u.kullanici.toLowerCase().includes(q));
    };

    const getUserCompanyCount = (userName) => {
        if (!userName) return 0;
        const q = userName.toLowerCase();
        return companies.filter(c => c.kullanicilar.some(u => u.kullanici.toLowerCase().includes(q))).length;
    };

    const toggleExpand = (key) => {
        setExpandedRowKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const handleAddUser = (companyKey) => {
        setCompanies(prev => prev.map(c => {
            if (c.key !== companyKey) return c;
            const nextNo = c.kullanicilar.length + 1;
            return {
                ...c, kullanicilar: [...c.kullanicilar, {
                    key: `${companyKey}-${nextNo}-${Date.now()}`, no: nextNo, kullanici: '', exIm: null, esyaGruplari: null,
                    esyaOlusturma: false, esyaSiniflandirma: false, esyaKataloguGoruntule: false, esyaKataloguDuzenleme: false,
                }]
            };
        }));
    };

    const handleRemoveUser = (companyKey, userKey) => {
        setCompanies(prev => prev.map(c => {
            if (c.key !== companyKey) return c;
            const filtered = c.kullanicilar.filter(u => u.key !== userKey);
            return { ...c, kullanicilar: filtered.map((u, i) => ({ ...u, no: i + 1 })) };
        }));
        message.success('Kullanıcı kaldırıldı');
    };

    const handleUserCheckbox = (companyKey, userKey, field, checked) => {
        setCompanies(prev => prev.map(c => {
            if (c.key !== companyKey) return c;
            return { ...c, kullanicilar: c.kullanicilar.map(u => u.key === userKey ? { ...u, [field]: checked } : u) };
        }));
    };

    const handleRemoveUserFromAll = () => {
        if (!userSearch) return;
        const q = userSearch.toLowerCase();
        let totalRemoved = 0;
        setCompanies(prev => prev.map(c => {
            const before = c.kullanicilar.length;
            const filtered = c.kullanicilar.filter(u => !u.kullanici.toLowerCase().includes(q));
            totalRemoved += (before - filtered.length);
            return { ...c, kullanicilar: filtered.map((u, i) => ({ ...u, no: i + 1 })) };
        }));
        message.success(`"${userSearch}" ile eşleşen ${totalRemoved} kullanıcı tüm firmalardan kaldırıldı`);
        setUserSearch('');
    };

    // Original permissions of the user being moved/copied (read-only reference)
    const moveOriginalPerms = moveUserRecord ? {
        exIm: moveUserRecord.exIm ?? null,
        esyaGruplari: moveUserRecord.esyaGruplari ?? [],
        esyaOlusturma: moveUserRecord.esyaOlusturma ?? false,
        esyaSiniflandirma: moveUserRecord.esyaSiniflandirma ?? false,
        esyaKataloguGoruntule: moveUserRecord.esyaKataloguGoruntule ?? false,
        esyaKataloguDuzenleme: moveUserRecord.esyaKataloguDuzenleme ?? false,
    } : emptyUserPerms();

    // Returns effective permissions for a target company in move/copy modal
    const getMoveEffectivePerms = (companyKey) =>
        moveCompanyPerms[companyKey] ?? moveOriginalPerms;

    // Open Move/Copy modal
    const openMoveModal = (companyKey, userRecord, action) => {
        setMoveFromCompanyKey(companyKey);
        setMoveUserName(userRecord.kullanici);
        setMoveUserRecord(userRecord);
        setMoveToCompanyKeys([]);
        setMoveAction(action);
        setMoveCompanyPerms({});
        setMoveExpandedCompanyPerm(null);
        setMoveModalOpen(true);
    };

    const handleMoveOrCopy = () => {
        if (moveToCompanyKeys.length === 0 || !moveFromCompanyKey || !moveUserRecord) return;

        setCompanies(prev => {
            let userData = null;
            let intermediate = prev;

            if (moveAction === 'move') {
                intermediate = prev.map(c => {
                    if (c.key !== moveFromCompanyKey) return c;
                    userData = c.kullanicilar.find(u => u.key === moveUserRecord.key);
                    const filtered = c.kullanicilar.filter(u => u.key !== moveUserRecord.key);
                    return { ...c, kullanicilar: filtered.map((u, i) => ({ ...u, no: i + 1 })) };
                });
            } else {
                prev.forEach(c => {
                    if (c.key === moveFromCompanyKey) {
                        userData = c.kullanicilar.find(u => u.key === moveUserRecord.key);
                    }
                });
            }

            if (!userData) return prev;

            return intermediate.map(c => {
                if (!moveToCompanyKeys.includes(c.key)) return c;
                const perms = getMoveEffectivePerms(c.key);
                const nextNo = c.kullanicilar.length + 1;
                return {
                    ...c, kullanicilar: [...c.kullanicilar, {
                        ...userData,
                        ...perms,
                        key: `${c.key}-${moveAction === 'move' ? 'mv' : 'cp'}-${Date.now()}`,
                        no: nextNo,
                    }]
                };
            });
        });

        const suffix = moveAction === 'move' ? 'taşındı' : 'kopyalandı';
        message.success(`${moveUserName} ${moveToCompanyKeys.length} firmaya başarıyla ${suffix}`);
        setMoveModalOpen(false);
    };

    // Bulk wizard handlers
    const openBulkDrawer = () => {
        setBulkDrawerOpen(true);
        setBulkStep(0);
        setBulkSelectedUsers([]);
        setBulkUserPermissions({});
        setBulkUserSearch('');
        setBulkUserCompanyMap({});
        setBulkUserCompanyOverrides({});
        setExpandedCompanyPerm(null);
        setShowNewUserForm(false);
        setNewUserName('');
        setNewUserEmail('');
    };

    const handleAddNewUser = () => {
        if (!newUserName.trim() || !newUserEmail.trim()) { message.warning('Ad ve e-posta zorunlu'); return; }
        const newKey = `u-new-${Date.now()}`;
        const newUser = { key: newKey, name: newUserName.trim(), email: newUserEmail.trim() };
        setAllUsers(prev => [...prev, newUser]);
        setBulkSelectedUsers(prev => [...prev, newKey]);
        setNewUserName('');
        setNewUserEmail('');
        setShowNewUserForm(false);
        message.success(`${newUser.name} eklendi ve seçildi`);
    };

    const initUserPermissions = () => {
        setBulkUserPermissions(prev => {
            const next = {};
            bulkSelectedUsers.forEach(uKey => {
                next[uKey] = prev[uKey] || emptyUserPerms();
            });
            return next;
        });
    };

    const initUserCompanyMap = () => {
        setBulkUserCompanyMap(prev => {
            const next = {};
            bulkSelectedUsers.forEach(uKey => {
                next[uKey] = prev[uKey] ?? companies.map(c => c.key);
            });
            return next;
        });
    };

    // Returns effective permissions for a user-company pair:
    // uses the per-company override if set, otherwise falls back to the user's base permissions.
    const getEffectivePerms = (userKey, companyKey) =>
        bulkUserCompanyOverrides[userKey]?.[companyKey] || bulkUserPermissions[userKey] || emptyUserPerms();

    const setCompanyPermOverride = (userKey, companyKey, perms) => {
        setBulkUserCompanyOverrides(prev => ({
            ...prev,
            [userKey]: { ...(prev[userKey] || {}), [companyKey]: perms },
        }));
    };

    const clearCompanyPermOverride = (userKey, companyKey) => {
        setBulkUserCompanyOverrides(prev => {
            const userOverrides = { ...(prev[userKey] || {}) };
            delete userOverrides[companyKey];
            return { ...prev, [userKey]: userOverrides };
        });
    };

    const handleBulkApply = () => {
        let totalAdded = 0;
        setCompanies(prev => prev.map(c => {
            const usersForThisCompany = bulkSelectedUsers.filter(uKey => (bulkUserCompanyMap[uKey] || []).includes(c.key));
            if (usersForThisCompany.length === 0) return c;
            const existingNames = c.kullanicilar.map(u => u.kullanici.toLowerCase());
            const newUsers = usersForThisCompany
                .filter(uKey => { const user = allUsers.find(u => u.key === uKey); return user && !existingNames.includes(user.name.toLowerCase()); })
                .map((uKey, idx) => {
                    const user = allUsers.find(u => u.key === uKey);
                    // Each user-company pair gets its own effective permissions
                    const perms = getEffectivePerms(uKey, c.key);
                    totalAdded++;
                    return {
                        key: `${c.key}-bulk-${uKey}-${Date.now()}-${idx}`,
                        no: c.kullanicilar.length + idx + 1,
                        kullanici: user.name,
                        exIm: perms.exIm ?? null,
                        esyaGruplari: perms.esyaGruplari?.length > 0 ? perms.esyaGruplari : null,
                        esyaOlusturma: perms.esyaOlusturma ?? false,
                        esyaSiniflandirma: perms.esyaSiniflandirma ?? false,
                        esyaKataloguGoruntule: perms.esyaKataloguGoruntule ?? false,
                        esyaKataloguDuzenleme: perms.esyaKataloguDuzenleme ?? false,
                    };
                });
            return { ...c, kullanicilar: [...c.kullanicilar, ...newUsers] };
        }));
        message.success(`${totalAdded} kullanıcı ataması başarıyla yapıldı`);
        setBulkDrawerOpen(false);
    };

    const canProceedStep = (step) => {
        if (step === 0) return bulkSelectedUsers.length > 0;
        if (step === 1) return true;
        if (step === 2) return Object.values(bulkUserCompanyMap).some(arr => arr.length > 0);
        return false;
    };

    const handleStepChange = (nextStep) => {
        if (nextStep === 1 && bulkStep === 0) initUserPermissions();
        if (nextStep === 2 && bulkStep === 1) initUserCompanyMap();
        setBulkStep(nextStep);
    };

    const getUserColumns = (companyKey) => [
        {
            title: '#', dataIndex: 'no', key: 'no', width: 50, align: 'center',
            render: (no) => <Text style={{ color: '#1890ff', fontWeight: 500 }}>{no}</Text>
        },
        { title: 'Kullanıcılar', dataIndex: 'kullanici', key: 'kullanici', width: 180 },
        {
            title: 'Ex/Im', dataIndex: 'exIm', key: 'exIm', width: 120,
            render: (val) => <Select placeholder="Seç" size="small" style={{ width: 100 }} value={val} allowClear
                options={[{ value: 'export', label: 'Export' }, { value: 'import', label: 'Import' }, { value: 'both', label: 'Her İkisi' }]} />
        },
        {
            title: 'Eşya Grupları', dataIndex: 'esyaGruplari', key: 'esyaGruplari', width: 160,
            render: (val) => <Select placeholder="Seç" size="small" style={{ width: 140 }} value={val}
                allowClear mode="multiple" maxTagCount={1} options={ESYA_GRUPLARI_OPTIONS} />
        },
        {
            title: (<div style={{ textAlign: 'center' }}><div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 4, marginBottom: 4 }}>Eşya</div>
                <div style={{ display: 'flex', gap: 0 }}><div style={{ flex: 1, fontSize: 12, padding: '0 4px' }}>Oluşturma</div><div style={{ flex: 1, fontSize: 12, padding: '0 4px' }}>Sınıflandırma</div></div></div>),
            key: 'esya', width: 180,
            render: (_, record) => (<div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
                <Checkbox checked={record.esyaOlusturma} onChange={(e) => handleUserCheckbox(companyKey, record.key, 'esyaOlusturma', e.target.checked)} />
                <Checkbox checked={record.esyaSiniflandirma} onChange={(e) => handleUserCheckbox(companyKey, record.key, 'esyaSiniflandirma', e.target.checked)} />
            </div>)
        },
        {
            title: (<div style={{ textAlign: 'center' }}><div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 4, marginBottom: 4 }}>Eşya Kataloğu</div>
                <div style={{ display: 'flex', gap: 0 }}><div style={{ flex: 1, fontSize: 12, padding: '0 4px' }}>Görüntüle</div><div style={{ flex: 1, fontSize: 12, padding: '0 4px' }}>Düzenleme</div></div></div>),
            key: 'esyaKatalogu', width: 180,
            render: (_, record) => (<div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
                <Checkbox checked={record.esyaKataloguGoruntule} onChange={(e) => handleUserCheckbox(companyKey, record.key, 'esyaKataloguGoruntule', e.target.checked)} />
                <Checkbox checked={record.esyaKataloguDuzenleme} onChange={(e) => handleUserCheckbox(companyKey, record.key, 'esyaKataloguDuzenleme', e.target.checked)} />
            </div>)
        },
        {
            title: '', key: 'actions', width: 130, align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: [
                                { key: 'move', label: 'Firmaya Taşı', icon: <SwapOutlined /> },
                                { key: 'copy', label: 'Firmaya Kopyala', icon: <CopyOutlined /> },
                            ],
                            onClick: ({ key }) => openMoveModal(companyKey, record, key),
                        }}
                    >
                        <Button type="text" size="small" style={{ color: '#1890ff' }}>
                            <Space size={2}>
                                <SwapOutlined />
                                <DownOutlined style={{ fontSize: 10 }} />
                            </Space>
                        </Button>
                    </Dropdown>
                    <Popconfirm title="Bu kullanıcıyı kaldırmak istediğinize emin misiniz?" onConfirm={() => handleRemoveUser(companyKey, record.key)} okText="Evet" cancelText="Hayır">
                        <Button type="link" danger size="small">Kaldır</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    const columns = [
        {
            title: '', key: 'expand', width: 48, align: 'center',
            render: (_, record) => (<Button type="text" size="small"
                icon={expandedRowKeys.includes(record.key) ? <MinusOutlined /> : <PlusOutlined />}
                onClick={() => toggleExpand(record.key)}
                style={{
                    width: 24, height: 24, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%', border: '1px solid #d9d9d9', color: '#595959', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s ease'
                }} />)
        },
        { title: 'Firma', dataIndex: 'firma', key: 'firma', width: 200 },
        { title: 'VKN', dataIndex: 'vkn', key: 'vkn', width: 140 },
        { title: 'Firma Yetkilisi', dataIndex: 'firmaYetkilisi', key: 'firmaYetkilisi', width: 180 },
        { title: 'Firma Yetkilisi E-Posta', dataIndex: 'firmaYetkilisiEposta', key: 'firmaYetkilisiEposta', width: 250 },
        {
            title: 'Eşya Grupları', dataIndex: 'esyaGruplari', key: 'esyaGruplari', width: 140,
            render: (val) => <Select placeholder="" size="small" style={{ width: 110 }} value={val} allowClear options={[]} />
        },
        {
            title: '', key: 'firmaKarti', width: 120, align: 'center',
            render: () => <Button type="link" icon={<FileTextOutlined />} style={{ color: '#1890ff', cursor: 'pointer' }}>Firma Kartı</Button>
        },
    ];

    const filteredBulkUsers = allUsers.filter(u => !bulkUserSearch || u.name.toLowerCase().includes(bulkUserSearch.toLowerCase()) || u.email.toLowerCase().includes(bulkUserSearch.toLowerCase()));
    const hasActiveFilters = firmaSearch || userSearch;
    const matchedCompanyCount = userSearch ? getUserCompanyCount(userSearch) : 0;

    const renderBulkStepContent = () => {
        // STEP 0: User Selection
        if (bulkStep === 0) {
            return (<div>
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 15, color: '#1d3557' }}><TeamOutlined style={{ marginRight: 8 }} />Kullanıcıları Seçin</Text>
                    <div style={{ marginTop: 4 }}><Text type="secondary" style={{ fontSize: 13 }}>Firmalara eklemek istediğiniz kullanıcıları seçin veya yeni kullanıcı oluşturun</Text></div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <Input prefix={<SearchOutlined style={{ color: '#bbb' }} />} placeholder="Kullanıcı ara (ad veya e-posta)..."
                        value={bulkUserSearch} onChange={e => setBulkUserSearch(e.target.value)} allowClear style={{ borderRadius: 8, flex: 1 }} />
                    <Button icon={<UserAddOutlined />} onClick={() => setShowNewUserForm(!showNewUserForm)}
                        type={showNewUserForm ? 'primary' : 'default'}
                        style={{ borderRadius: 8, cursor: 'pointer' }}>Yeni</Button>
                </div>
                {showNewUserForm && (
                    <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 14, marginBottom: 12, border: '1px solid #bae7ff' }}>
                        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}><UserAddOutlined style={{ marginRight: 6 }} />Yeni Kullanıcı Oluştur</Text>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Input placeholder="Ad Soyad" value={newUserName} onChange={e => setNewUserName(e.target.value)} style={{ borderRadius: 6 }} />
                            <Input placeholder="E-posta" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} style={{ borderRadius: 6 }} />
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <Button size="small" onClick={() => { setShowNewUserForm(false); setNewUserName(''); setNewUserEmail(''); }} style={{ cursor: 'pointer' }}>İptal</Button>
                                <Button size="small" type="primary" onClick={handleAddNewUser} style={{ cursor: 'pointer' }}>Ekle ve Seç</Button>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{filteredBulkUsers.length} kullanıcı</Text>
                    {bulkSelectedUsers.length > 0 && <Tag color="blue" style={{ borderRadius: 12, margin: 0 }}>{bulkSelectedUsers.length} seçildi</Tag>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: showNewUserForm ? 280 : 400, overflowY: 'auto' }}>
                    {filteredBulkUsers.map(user => {
                        const selected = bulkSelectedUsers.includes(user.key);
                        return (<div key={user.key} onClick={() => setBulkSelectedUsers(prev => selected ? prev.filter(k => k !== user.key) : [...prev, user.key])}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                                border: selected ? '2px solid #1890ff' : '1px solid #f0f0f0', background: selected ? '#e6f7ff' : '#fafafa',
                                cursor: 'pointer', transition: 'all 0.2s ease'
                            }}>
                            <Checkbox checked={selected} style={{ pointerEvents: 'none' }} />
                            <Avatar size={36} style={{ background: selected ? '#1890ff' : '#d9d9d9', transition: 'background 0.2s ease' }}>{user.name.charAt(0)}</Avatar>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, fontSize: 14, color: '#1d3557' }}>{user.name}</div>
                                <div style={{ fontSize: 12, color: '#8c8c8c' }}>{user.email}</div>
                            </div>
                            {selected && <CheckCircleFilled style={{ color: '#1890ff', fontSize: 18 }} />}
                        </div>);
                    })}
                </div>
            </div>);
        }

        // STEP 1: Per-user Permissions
        if (bulkStep === 1) {
            const applyFirstToAll = () => {
                if (bulkSelectedUsers.length === 0) return;
                const firstPerms = bulkUserPermissions[bulkSelectedUsers[0]];
                if (!firstPerms) return;
                const next = {};
                bulkSelectedUsers.forEach(uKey => { next[uKey] = { ...firstPerms }; });
                setBulkUserPermissions(next);
                message.success('İlk kullanıcının yetkileri tüm kullanıcılara uygulandı');
            };

            return (<div>
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 15, color: '#1d3557' }}><SafetyCertificateOutlined style={{ marginRight: 8 }} />Yetkileri Belirleyin</Text>
                    <div style={{ marginTop: 4 }}><Text type="secondary" style={{ fontSize: 13 }}>Her kullanıcı için ayrı yetki ve erişim ayarları yapabilirsiniz</Text></div>
                </div>
                {bulkSelectedUsers.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                        <Button size="small" type="link" style={{ padding: 0 }} onClick={applyFirstToAll}>
                            İlk kullanıcının yetkilerini tümüne uygula
                        </Button>
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 500, overflowY: 'auto' }}>
                    {bulkSelectedUsers.map(uKey => {
                        const user = allUsers.find(u => u.key === uKey);
                        const perms = bulkUserPermissions[uKey] || emptyUserPerms();
                        const permCount = PERMISSIONS.filter(p => perms[p.key]).length;
                        return (
                            <div key={uKey} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 10, padding: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
                                    <Avatar size={32} style={{ background: '#1890ff', flexShrink: 0 }}>{user?.name?.charAt(0)}</Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ fontSize: 13, color: '#1d3557' }}>{user?.name}</Text>
                                        <div style={{ fontSize: 11, color: '#8c8c8c' }}>{user?.email}</div>
                                    </div>
                                    {permCount > 0 && <Tag color="blue" style={{ borderRadius: 12, margin: 0 }}>{permCount} yetki</Tag>}
                                </div>
                                <PermissionEditor
                                    perms={perms}
                                    onChange={newPerms => setBulkUserPermissions(prev => ({ ...prev, [uKey]: newPerms }))}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>);
        }

        // STEP 2: Per-user company mapping
        if (bulkStep === 2) {
            const companyOptions = companies.map(c => ({ value: c.key, label: `${c.firma} (${c.vkn})` }));
            return (<div>
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 15, color: '#1d3557' }}><BankOutlined style={{ marginRight: 8 }} />Kullanıcı – Firma Eşleştirmesi</Text>
                    <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Firma seçin, ardından her firma için yetkileri özelleştirin. Özelleştirilmeyenler Step 1'deki base yetkilerle eklenir.
                        </Text>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <Button size="small" type="link" style={{ padding: 0 }}
                        onClick={() => {
                            const allKeys = companies.map(c => c.key);
                            const allFull = bulkSelectedUsers.every(uKey => (bulkUserCompanyMap[uKey] || []).length === allKeys.length);
                            const map = {};
                            bulkSelectedUsers.forEach(uKey => { map[uKey] = allFull ? [] : [...allKeys]; });
                            setBulkUserCompanyMap(map);
                        }}>
                        {bulkSelectedUsers.every(uKey => (bulkUserCompanyMap[uKey] || []).length === companies.length) ? 'Tümünü Kaldır' : 'Tümüne Tüm Firmaları Ata'}
                    </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 460, overflowY: 'auto' }}>
                    {bulkSelectedUsers.map(uKey => {
                        const user = allUsers.find(u => u.key === uKey);
                        const assigned = bulkUserCompanyMap[uKey] || [];
                        return (
                            <div key={uKey} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 10, padding: 14 }}>
                                {/* User header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <Avatar size={28} style={{ background: '#1890ff', flexShrink: 0 }}>{user?.name?.charAt(0)}</Avatar>
                                    <Text strong style={{ fontSize: 14, color: '#1d3557', flex: 1 }}>{user?.name}</Text>
                                    <Tag color="blue" style={{ borderRadius: 12, margin: 0 }}>{assigned.length} firma</Tag>
                                </div>

                                {/* Company selector */}
                                <Select
                                    mode="multiple"
                                    placeholder="Firma seçin..."
                                    style={{ width: '100%', marginBottom: assigned.length > 0 ? 10 : 0 }}
                                    value={assigned}
                                    onChange={(values) => {
                                        setBulkUserCompanyMap(prev => ({ ...prev, [uKey]: values }));
                                        // Collapse if the expanded company was removed
                                        if (expandedCompanyPerm?.userKey === uKey && !values.includes(expandedCompanyPerm.companyKey)) {
                                            setExpandedCompanyPerm(null);
                                        }
                                    }}
                                    options={companyOptions}
                                    maxTagCount={2}
                                    allowClear
                                />

                                {/* Per-company permission rows */}
                                {assigned.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {assigned.map(cKey => {
                                            const company = companies.find(c => c.key === cKey);
                                            const hasOverride = !!bulkUserCompanyOverrides[uKey]?.[cKey];
                                            const effectivePerms = getEffectivePerms(uKey, cKey);
                                            const isExpanded = expandedCompanyPerm?.userKey === uKey && expandedCompanyPerm?.companyKey === cKey;
                                            const activePermLabels = PERMISSIONS.filter(p => effectivePerms[p.key]).map(p => p.label);

                                            return (
                                                <div key={cKey} style={{ border: `1px solid ${hasOverride ? '#ffd591' : '#e8e8e8'}`, borderRadius: 8, overflow: 'hidden' }}>
                                                    {/* Company row header – click to toggle */}
                                                    <div
                                                        onClick={() => setExpandedCompanyPerm(isExpanded ? null : { userKey: uKey, companyKey: cKey })}
                                                        style={{ display: 'flex', alignItems: 'center', padding: '7px 10px', background: hasOverride ? '#fffbe6' : '#fafafa', cursor: 'pointer', gap: 6 }}
                                                    >
                                                        <BankOutlined style={{ color: '#8c8c8c', fontSize: 12, flexShrink: 0 }} />
                                                        <Text style={{ fontSize: 12, flex: 1 }}>{company?.firma}</Text>
                                                        {hasOverride
                                                            ? <Tag color="orange" style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>Özel</Tag>
                                                            : <Tag color="default" style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>Base</Tag>
                                                        }
                                                        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 180 }}>
                                                            {activePermLabels.length > 0
                                                                ? activePermLabels.slice(0, 2).map(l => (
                                                                    <Tag key={l} color="blue" style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>{l}</Tag>
                                                                ))
                                                                : <Text type="secondary" style={{ fontSize: 10 }}>Yetki yok</Text>
                                                            }
                                                            {activePermLabels.length > 2 && (
                                                                <Tag style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>+{activePermLabels.length - 2}</Tag>
                                                            )}
                                                        </div>
                                                        <DownOutlined style={{ fontSize: 9, flexShrink: 0, color: '#8c8c8c', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                                    </div>

                                                    {/* Expanded permission editor */}
                                                    {isExpanded && (
                                                        <div style={{ padding: 12, borderTop: '1px solid #e8e8e8', background: '#fff' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                                    {hasOverride ? 'Bu firmaya özel yetkiler uygulanıyor' : 'Base yetkiler kullanılıyor (Step 1)'}
                                                                </Text>
                                                                {hasOverride && (
                                                                    <Button
                                                                        size="small" type="link" danger
                                                                        style={{ padding: 0, fontSize: 11, height: 'auto' }}
                                                                        onClick={(e) => { e.stopPropagation(); clearCompanyPermOverride(uKey, cKey); }}
                                                                    >
                                                                        Base'e döndür
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            <PermissionEditor
                                                                perms={effectivePerms}
                                                                onChange={newPerms => setCompanyPermOverride(uKey, cKey, newPerms)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>);
        }

        // STEP 3: Summary
        const totalMappings = Object.values(bulkUserCompanyMap).reduce((sum, arr) => sum + arr.length, 0);
        return (<div>
            <div style={{ marginBottom: 20 }}>
                <Text strong style={{ fontSize: 16, color: '#1d3557' }}><CheckCircleFilled style={{ marginRight: 8, color: '#52c41a' }} />Özet ve Onay</Text>
                <div style={{ marginTop: 4 }}><Text type="secondary" style={{ fontSize: 13 }}>Tüm atama ve yetkilendirme işlemleri aşağıda listelenmiştir. Lütfen kontrol edip onaylayın.</Text></div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24, padding: '20px 0' }}>
                <div style={{ background: 'linear-gradient(135deg, #e6f7ff, #bae7ff)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', border: '1px solid #91d5ff', flex: 1, boxShadow: '0 2px 8px rgba(24,144,255,0.1)' }}>
                    <TeamOutlined style={{ fontSize: 24, color: '#1890ff', display: 'block', marginBottom: 6 }} />
                    <div style={{ fontWeight: 600, fontSize: 22, color: '#1890ff' }}>{bulkSelectedUsers.length}</div>
                    <div style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>Kullanıcı</div>
                </div>
                <ArrowRightOutlined style={{ fontSize: 20, color: '#bbb' }} />
                <div style={{ background: 'linear-gradient(135deg, #fff7e6, #ffe7ba)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', border: '1px solid #ffd591', flex: 1, boxShadow: '0 2px 8px rgba(250,140,22,0.1)' }}>
                    <BankOutlined style={{ fontSize: 24, color: '#fa8c16', display: 'block', marginBottom: 6 }} />
                    <div style={{ fontWeight: 600, fontSize: 22, color: '#fa8c16' }}>{totalMappings}</div>
                    <div style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>Firma Atama</div>
                </div>
            </div>

            <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e6f7ff', paddingBottom: 4, marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 14, color: '#1d3557' }}>
                        <TeamOutlined style={{ marginRight: 6 }} />
                        Kullanıcı Atama ve Yetki Detayları
                    </Text>
                </div>

                <List
                    size="small"
                    dataSource={bulkSelectedUsers}
                    renderItem={uKey => {
                        const user = allUsers.find(u => u.key === uKey);
                        const assigned = bulkUserCompanyMap[uKey] || [];
                        return (
                            <List.Item style={{ padding: '14px 16px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 10, marginBottom: 10, display: 'block' }}>
                                {/* User header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <Avatar size="large" style={{ background: '#1890ff' }}>{user?.name?.charAt(0)}</Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ fontSize: 15, color: '#1d3557', display: 'block', lineHeight: 1.2 }}>{user?.name}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{user?.email}</Text>
                                    </div>
                                    <Tag color={assigned.length > 0 ? 'geekblue' : 'default'} style={{ margin: 0, borderRadius: 16, padding: '4px 10px', fontSize: 13, border: 'none', background: assigned.length > 0 ? '#e6f4ff' : '#f5f5f5' }}>
                                        <BankOutlined style={{ marginRight: 6 }} />
                                        {assigned.length} Firma
                                    </Tag>
                                </div>

                                {/* Per-company permission breakdown */}
                                {assigned.length === 0
                                    ? <Text type="secondary" style={{ fontSize: 13 }}><InfoCircleOutlined style={{ marginRight: 6 }} />Bu kullanıcıya firma atanmadı.</Text>
                                    : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {assigned.map(cKey => {
                                                const company = companies.find(c => c.key === cKey);
                                                const hasOverride = !!bulkUserCompanyOverrides[uKey]?.[cKey];
                                                const perms = getEffectivePerms(uKey, cKey);
                                                const activePerms = PERMISSIONS.filter(p => perms[p.key]);
                                                return (
                                                    <div key={cKey} style={{ background: hasOverride ? '#fffbe6' : '#fafafa', border: `1px solid ${hasOverride ? '#ffd591' : '#f0f0f0'}`, borderRadius: 8, padding: '8px 12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                                            <BankOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                                                            <Text strong style={{ fontSize: 13, flex: 1 }}>{company?.firma}</Text>
                                                            <Tooltip title={`VKN: ${company?.vkn}`}>
                                                                <Text type="secondary" style={{ fontSize: 11 }}>{company?.vkn}</Text>
                                                            </Tooltip>
                                                            {hasOverride
                                                                ? <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>Özel Yetkiler</Tag>
                                                                : <Tag color="default" style={{ fontSize: 10, margin: 0 }}>Base Yetkiler</Tag>
                                                            }
                                                        </div>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                                                            {perms.exIm && <Tag color="cyan" style={{ fontSize: 10, margin: 0 }}>{perms.exIm === 'both' ? 'Her İkisi' : perms.exIm}</Tag>}
                                                            {(perms.esyaGruplari || []).map(g => {
                                                                const opt = ESYA_GRUPLARI_OPTIONS.find(o => o.value === g);
                                                                return <Tag key={g} color="orange" style={{ fontSize: 10, margin: 0 }}>{opt?.label}</Tag>;
                                                            })}
                                                            {activePerms.length > 0
                                                                ? activePerms.map(p => <Tag key={p.key} color="blue" style={{ fontSize: 10, margin: 0 }}>{p.label}</Tag>)
                                                                : <Text type="secondary" style={{ fontSize: 11 }}>Yetki seçilmedi</Text>
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                }
                            </List.Item>
                        );
                    }}
                />
            </div>
        </div>);
    };

    return (<div>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
                <Title level={2} style={{ margin: 0 }}>Firmalarım</Title>
                <Text type="secondary">Firmalarınızı ve kullanıcı yetkilerini yönetin.</Text>
            </div>
            <Button type="primary" icon={<UsergroupAddOutlined />} onClick={openBulkDrawer} size="large"
                style={{ borderRadius: 10, height: 44, background: 'linear-gradient(135deg, #1890ff, #096dd9)', border: 'none', fontWeight: 500, boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                Toplu Kullanıcı Ekle
            </Button>
        </div>

        {/* Summary Bar */}
        <div style={{ background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 8, padding: '10px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 16 }} />
            <Text style={{ color: '#333' }}>Aktif Firmalarım : <Text strong style={{ color: '#1890ff' }}>{aktifCount}</Text></Text>
            <Text style={{ color: '#333', marginLeft: 16 }}>Pasif Firmalarım : <Text strong style={{ color: '#1890ff' }}>{pasifCount}</Text></Text>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 260px', maxWidth: 320 }}>
                <Input prefix={<BankOutlined style={{ color: '#bbb' }} />} placeholder="Firma adı, VKN veya yetkili ara..."
                    value={firmaSearch} onChange={e => setFirmaSearch(e.target.value)} allowClear style={{ borderRadius: 8, height: 38 }} />
            </div>
            <div style={{ flex: '1 1 260px', maxWidth: 320 }}>
                <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="Kullanıcı adına göre filtrele..."
                    value={userSearch} onChange={e => setUserSearch(e.target.value)} allowClear style={{ borderRadius: 8, height: 38 }} />
            </div>
            {hasActiveFilters && (<Button size="small" type="text" icon={<CloseOutlined />}
                onClick={() => { setFirmaSearch(''); setUserSearch(''); }} style={{ color: '#ff4d4f', fontSize: 12, cursor: 'pointer' }}>Filtreleri Temizle</Button>)}
            {hasActiveFilters && (<Tag color="blue" style={{ borderRadius: 12, marginLeft: 'auto' }}>{filteredCompanies.length} / {companies.length} firma gösteriliyor</Tag>)}
        </div>

        {/* User bulk actions when filter is active */}
        {userSearch && matchedCompanyCount > 0 && (
            <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <Text style={{ fontSize: 13 }}>
                    <UserOutlined style={{ marginRight: 6 }} />
                    <Text strong>"{userSearch}"</Text> adlı kullanıcı <Text strong>{matchedCompanyCount}</Text> firmada bulunuyor.
                </Text>
                <Popconfirm title={`"${userSearch}" ile eşleşen tüm kullanıcılar tüm firmalardan kaldırılacak. Emin misiniz?`}
                    onConfirm={handleRemoveUserFromAll} okText="Evet, Kaldır" cancelText="Hayır" okButtonProps={{ danger: true }}>
                    <Button danger size="small" icon={<DeleteOutlined />} style={{ borderRadius: 6, cursor: 'pointer' }}>
                        Tüm Firmalardan Kaldır
                    </Button>
                </Popconfirm>
            </div>
        )}

        {/* Main Table */}
        <Card style={{ borderRadius: 8, overflow: 'hidden' }} styles={{ body: { padding: 0 } }}>
            <Table columns={columns} dataSource={filteredCompanies} pagination={false}
                expandable={{
                    expandedRowKeys,
                    onExpand: (expanded, record) => toggleExpand(record.key),
                    showExpandColumn: false,
                    expandedRowRender: (record) => {
                        const filteredUsers = filterUsersBySearch(record.kullanicilar);
                        return (<div style={{ padding: '16px 24px 16px 48px', background: '#fafafa' }}>
                            {userSearch && (<div style={{ marginBottom: 8 }}><Text type="secondary" style={{ fontSize: 12 }}>{filteredUsers.length} / {record.kullanicilar.length} kullanıcı eşleşiyor</Text></div>)}
                            <Table columns={getUserColumns(record.key)} dataSource={filteredUsers} pagination={false} size="small" bordered style={{ marginBottom: 12 }}
                                locale={{ emptyText: <Text type="secondary" style={{ fontSize: 13 }}>{userSearch ? 'Bu filtre ile eşleşen kullanıcı yok' : 'Henüz kullanıcı eklenmemiş'}</Text> }} />
                            <Button size="small" onClick={() => handleAddUser(record.key)} style={{ borderRadius: 6, border: '1px solid #d9d9d9', background: '#fff', cursor: 'pointer' }}>Ekle</Button>
                        </div>);
                    },
                }}
                bordered size="middle" style={{ background: '#fff' }}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">Bu filtre ile eşleşen firma bulunamadı</Text>}><Button size="small" onClick={() => setFirmaSearch('')}>Filtreyi Temizle</Button></Empty> }}
            />
        </Card>

        {/* Move / Copy User Modal */}
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {moveAction === 'move' ? <SwapOutlined style={{ color: '#1890ff' }} /> : <CopyOutlined style={{ color: '#52c41a' }} />}
                    <span>Kullanıcı Taşı / Kopyala</span>
                </div>
            }
            open={moveModalOpen}
            onCancel={() => setMoveModalOpen(false)}
            onOk={handleMoveOrCopy}
            okText={moveAction === 'move' ? `Taşı (${moveToCompanyKeys.length} firma)` : `Kopyala (${moveToCompanyKeys.length} firma)`}
            cancelText="İptal"
            okButtonProps={{ disabled: moveToCompanyKeys.length === 0 }}
            width={520}
        >
            {/* Action selector */}
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>İşlem</Text>
                <Radio.Group value={moveAction} onChange={e => setMoveAction(e.target.value)} optionType="button" buttonStyle="solid">
                    <Radio.Button value="move"><SwapOutlined style={{ marginRight: 6 }} />Taşı</Radio.Button>
                    <Radio.Button value="copy"><CopyOutlined style={{ marginRight: 6 }} />Kopyala</Radio.Button>
                </Radio.Group>
            </div>

            <div style={{ marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Kullanıcı</Text>
                <Text strong>{moveUserName}</Text>
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    ({companies.find(c => c.key === moveFromCompanyKey)?.firma})
                </Text>
            </div>

            {/* Multi-target company selector */}
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    Hedef Firma(lar)
                </Text>
                <Select
                    mode="multiple"
                    placeholder="Firma seçin (birden fazla seçebilirsiniz)"
                    style={{ width: '100%' }}
                    value={moveToCompanyKeys}
                    onChange={values => {
                        setMoveToCompanyKeys(values);
                        // collapse editor if its company was removed
                        if (moveExpandedCompanyPerm && !values.includes(moveExpandedCompanyPerm)) {
                            setMoveExpandedCompanyPerm(null);
                        }
                    }}
                    options={companies.filter(c => c.key !== moveFromCompanyKey).map(c => ({ value: c.key, label: c.firma }))}
                    maxTagCount={3}
                    allowClear
                />
            </div>

            {/* Per-company permission rows */}
            {moveToCompanyKeys.length > 0 && (
                <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                        <SafetyCertificateOutlined style={{ marginRight: 4 }} />
                        Firma Bazında Yetkiler — tıklayarak özelleştirin
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
                        {moveToCompanyKeys.map(cKey => {
                            const company = companies.find(c => c.key === cKey);
                            const hasOverride = !!moveCompanyPerms[cKey];
                            const effectivePerms = getMoveEffectivePerms(cKey);
                            const isExpanded = moveExpandedCompanyPerm === cKey;
                            const activePermLabels = PERMISSIONS.filter(p => effectivePerms[p.key]).map(p => p.label);

                            return (
                                <div key={cKey} style={{ border: `1px solid ${hasOverride ? '#ffd591' : '#e8e8e8'}`, borderRadius: 8, overflow: 'hidden' }}>
                                    {/* Row header */}
                                    <div
                                        onClick={() => setMoveExpandedCompanyPerm(isExpanded ? null : cKey)}
                                        style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: hasOverride ? '#fffbe6' : '#fafafa', cursor: 'pointer', gap: 8 }}
                                    >
                                        <BankOutlined style={{ color: '#8c8c8c', fontSize: 12, flexShrink: 0 }} />
                                        <Text style={{ fontSize: 13, flex: 1 }}>{company?.firma}</Text>
                                        {hasOverride
                                            ? <Tag color="orange" style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>Özel</Tag>
                                            : <Tag color="default" style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>Mevcut</Tag>
                                        }
                                        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 160 }}>
                                            {activePermLabels.length > 0
                                                ? activePermLabels.slice(0, 2).map(l => (
                                                    <Tag key={l} color="blue" style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>{l}</Tag>
                                                ))
                                                : <Text type="secondary" style={{ fontSize: 10 }}>Yetki yok</Text>
                                            }
                                            {activePermLabels.length > 2 && (
                                                <Tag style={{ fontSize: 10, margin: 0, lineHeight: '16px' }}>+{activePermLabels.length - 2}</Tag>
                                            )}
                                        </div>
                                        <DownOutlined style={{ fontSize: 9, flexShrink: 0, color: '#8c8c8c', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                    </div>

                                    {/* Expanded permission editor */}
                                    {isExpanded && (
                                        <div style={{ padding: 12, borderTop: '1px solid #e8e8e8', background: '#fff' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    {hasOverride ? 'Bu firmaya özel yetkiler uygulanıyor' : 'Kullanıcının mevcut yetkileri kullanılıyor'}
                                                </Text>
                                                {hasOverride && (
                                                    <Button
                                                        size="small" type="link" danger
                                                        style={{ padding: 0, fontSize: 11, height: 'auto' }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setMoveCompanyPerms(prev => {
                                                                const next = { ...prev };
                                                                delete next[cKey];
                                                                return next;
                                                            });
                                                        }}
                                                    >
                                                        Mevcut'a döndür
                                                    </Button>
                                                )}
                                            </div>
                                            <PermissionEditor
                                                perms={effectivePerms}
                                                onChange={newPerms => setMoveCompanyPerms(prev => ({ ...prev, [cKey]: newPerms }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Modal>

        {/* Bulk Action Drawer */}
        <Drawer
            title={<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1890ff, #096dd9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ThunderboltOutlined style={{ color: '#fff', fontSize: 18 }} />
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.3 }}>Toplu Kullanıcı Ekleme</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>Birden fazla kullanıcıyı birden fazla firmaya ekleyin</div>
                </div>
            </div>}
            placement="right" width={560} open={bulkDrawerOpen} onClose={() => setBulkDrawerOpen(false)}
            styles={{ body: { padding: '16px 24px', display: 'flex', flexDirection: 'column' }, footer: { padding: '12px 24px', borderTop: '1px solid #f0f0f0' } }}
            footer={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled={bulkStep === 0} onClick={() => setBulkStep(s => s - 1)} style={{ borderRadius: 8, cursor: bulkStep === 0 ? 'not-allowed' : 'pointer' }}>Geri</Button>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button onClick={() => setBulkDrawerOpen(false)} style={{ borderRadius: 8, cursor: 'pointer' }}>İptal</Button>
                    {bulkStep < 3 ? (
                        <Button type="primary" disabled={!canProceedStep(bulkStep)} onClick={() => handleStepChange(bulkStep + 1)}
                            style={{ borderRadius: 8, cursor: canProceedStep(bulkStep) ? 'pointer' : 'not-allowed' }}>İleri <ArrowRightOutlined /></Button>
                    ) : (
                        <Button type="primary" onClick={handleBulkApply} icon={<CheckOutlined />}
                            style={{ borderRadius: 8, background: 'linear-gradient(135deg, #52c41a, #389e0d)', border: 'none', cursor: 'pointer' }}>Uygula</Button>
                    )}
                </div>
            </div>}
        >
            <Steps current={bulkStep} size="small" style={{ marginBottom: 24 }} items={[
                { title: 'Kullanıcılar', icon: <TeamOutlined /> },
                { title: 'Yetkiler', icon: <SafetyCertificateOutlined /> },
                { title: 'Firmalar', icon: <BankOutlined /> },
                { title: 'Onay', icon: <CheckCircleFilled /> },
            ]} />
            <div style={{ flex: 1, overflowY: 'auto' }}>{renderBulkStepContent()}</div>
        </Drawer>
    </div>);
};

export default MyCompaniesPage;
