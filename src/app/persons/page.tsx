'use client';
import { useCallback, useEffect, useMemo, useState, Key } from 'react';
import {
  Button, Col, DatePicker, Form, Input, Popconfirm,
  Radio, Row, Select, Table, Tag, Typography, message,
} from 'antd';
import {
  UserAddOutlined, DeleteOutlined, EditOutlined,
  UserOutlined, PhoneOutlined, GlobalOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addPerson, deletePerson, deletePersons, setPersons, updatePerson, loadFromStorage,
} from '@/store/personsSlice';
import type { Person } from '@/store/personsSlice';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

const { Title } = Typography;

interface FormValues {
  prefix: string;
  firstName: string;
  lastName: string;
  birthday?: ReturnType<typeof dayjs>;
  nationality?: string;
  gender?: string;
  citizenId?: string;
  passport?: string;
  phone?: string;
}

const genderColor: Record<string, string> = {
  male: 'blue',
  female: 'pink',
  unspecified: 'default',
};

// ───────────────────────────────────────────────────────────────────
// Sub-components
// ───────────────────────────────────────────────────────────────────

function EmptyPersonState({ label }: { label: string }) {
  return (
    <div style={{ padding: '32px 0', color: '#9CA3AF', textAlign: 'center' }}>
      <UserOutlined style={{ fontSize: 32, marginBottom: 8, display: 'block' }} />
      {label}
    </div>
  );
}

const avatarStyle: React.CSSProperties = {
  width: 36, height: 36, borderRadius: '50%',
  background: 'linear-gradient(135deg, #FFA200, #FFD166)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
};

// ───────────────────────────────────────────────────────────────────
// Main Page
// ───────────────────────────────────────────────────────────────────

export default function PersonsPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const persons = useAppSelector((state) => state.persons.persons);
  const [form] = Form.useForm<FormValues>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (persons.length === 0) {
      const stored = loadFromStorage();
      if (stored.length > 0) dispatch(setPersons(stored));
    }
  }, [dispatch, persons.length]);

  const handleSubmit = useCallback((values: FormValues) => {
    const person: Person = {
      id: editingId ?? uuidv4(),
      prefix: values.prefix,
      firstName: values.firstName,
      lastName: values.lastName,
      // birthday is already a dayjs object from DatePicker
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
      nationality: values.nationality ?? '',
      gender: values.gender ?? '',
      citizenId: values.citizenId ?? '',
      passport: values.passport ?? '',
      phone: values.phone ?? '',
    };

    if (editingId) {
      dispatch(updatePerson(person));
      message.success(t('page2.updated'));
    } else {
      dispatch(addPerson(person));
      message.success(t('page2.added'));
    }
    form.resetFields();
    setEditingId(null);
  }, [dispatch, editingId, form, t]);

  const handleEdit = useCallback((record: Person) => {
    setEditingId(record.id);
    form.setFieldsValue({
      prefix: record.prefix,
      firstName: record.firstName,
      lastName: record.lastName,
      birthday: record.birthday ? dayjs(record.birthday) : undefined,
      nationality: record.nationality,
      gender: record.gender,
      citizenId: record.citizenId,
      passport: record.passport,
      phone: record.phone,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [form]);

  const handleDelete = useCallback((id: string) => {
    dispatch(deletePerson(id));
    message.success(t('page2.deleted'));
  }, [dispatch, t]);

  const handleBulkDelete = useCallback(() => {
    dispatch(deletePersons(selectedRowKeys as string[]));
    setSelectedRowKeys([]);
    message.success(t('page2.deletedSelected'));
  }, [dispatch, selectedRowKeys, t]);

  const handleReset = useCallback(() => {
    form.resetFields();
    setEditingId(null);
  }, [form]);

  const prefixLabel = useMemo<Record<string, string>>(() => ({
    mr: t('page2.mr'),
    mrs: t('page2.mrs'),
    ms: t('page2.ms'),
  }), [t]);

  const columns = useMemo<ColumnsType<Person>>(() => [
    {
      title: t('page2.name'),
      render: (_: unknown, r: Person) => (
        <Row align="middle" gutter={8} wrap={false}>
          <Col>
            <div style={avatarStyle}>
              {r.firstName.charAt(0).toUpperCase()}
            </div>
          </Col>
          <Col>
            <div style={{ fontWeight: 600, lineHeight: '1.3' }}>
              {`${prefixLabel[r.prefix] ?? r.prefix} ${r.firstName} ${r.lastName}`}
            </div>
            {r.birthday && (
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>{r.birthday}</div>
            )}
          </Col>
        </Row>
      ),
    },
    {
      title: t('page2.gender'),
      dataIndex: 'gender',
      render: (val: string) => (
        <Tag color={genderColor[val] ?? 'default'} style={{ borderRadius: 6 }}>
          {t(`page2.${val}`) || val}
        </Tag>
      ),
    },
    {
      title: <><PhoneOutlined /> {t('page2.phone')}</>,
      dataIndex: 'phone',
      render: (val: string) => val || <span style={{ color: '#ccc' }}>—</span>,
    },
    {
      title: <><GlobalOutlined /> {t('page2.nationality')}</>,
      dataIndex: 'nationality',
      render: (val: string) =>
        val ? t(`page2.${val}`) || val : <span style={{ color: '#ccc' }}>—</span>,
    },
    {
      title: '',
      width: 140,
      render: (_: unknown, record: Person) => (
        <Row gutter={6} wrap={false}>
          <Col>
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ borderRadius: 7 }}>
              {t('page2.edit')}
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title={t('page2.confirmDelete')}
              onConfirm={() => handleDelete(record.id)}
              okText={t('page2.yes')}
              cancelText={t('page2.no')}
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 7 }}>
                {t('page2.delete')}
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ], [t, prefixLabel, handleEdit, handleDelete]);

  return (
    <>
      {/* Navbar */}
      <nav className="app-navbar">
        <span className="app-navbar__logo">SWD Test</span>
        <div className="app-navbar__nav">
          <Link href="/"><Button size="small" style={{ borderRadius: 6 }}>{t('nav.page1')}</Button></Link>
          <Link href="/persons"><Button type="primary" size="small" style={{ borderRadius: 6 }}>{t('nav.page2')}</Button></Link>
        </div>
        <div className="app-navbar__right">
          <Select
            value={i18n.language}
            onChange={(val: string) => i18n.changeLanguage(val)}
            size="small"
            style={{ width: 80 }}
            options={[
              { value: 'en', label: '🇬🇧 EN' },
              { value: 'th', label: '🇹🇭 TH' },
            ]}
          />
        </div>
      </nav>

      <div className="page-container">

        {/* Form Card */}
        <div className="ui-card" style={{ marginBottom: 20 }}>
          <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                <UserAddOutlined style={{ marginRight: 8, color: '#FFA200' }} />
                {editingId ? t('page2.editPerson') : t('page2.title')}
              </Title>
            </Col>
            {editingId && (
              <Col>
                <Tag color="orange" style={{ borderRadius: 6 }}>
                  {t('page2.editMode')}
                </Tag>
              </Col>
            )}
          </Row>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Row 1 */}
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={6} md={4}>
                <Form.Item name="prefix" label={t('page2.prefix')} rules={[{ required: true, message: '' }]}>
                  <Select placeholder={t('page2.prefix')}>
                    <Select.Option value="mr">{t('page2.mr')}</Select.Option>
                    <Select.Option value="mrs">{t('page2.mrs')}</Select.Option>
                    <Select.Option value="ms">{t('page2.ms')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={9} md={10}>
                <Form.Item name="firstName" label={t('page2.firstName')} rules={[{ required: true, message: '' }]}>
                  <Input prefix={<UserOutlined style={{ color: '#ccc' }} />} placeholder={t('page2.firstName')} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={9} md={10}>
                <Form.Item name="lastName" label={t('page2.lastName')} rules={[{ required: true, message: '' }]}>
                  <Input placeholder={t('page2.lastName')} />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item name="birthday" label={t('page2.birthday')}>
                  <DatePicker style={{ width: '100%' }} placeholder={t('page2.birthday')} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="nationality" label={t('page2.nationality')}>
                  <Select placeholder={t('page2.selectNationality')}>
                    <Select.Option value="thai">{t('page2.thai')}</Select.Option>
                    <Select.Option value="american">{t('page2.american')}</Select.Option>
                    <Select.Option value="japanese">{t('page2.japanese')}</Select.Option>
                    <Select.Option value="other">{t('page2.other')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="gender" label={t('page2.gender')}>
                  <Radio.Group>
                    <Radio value="male">{t('page2.male')}</Radio>
                    <Radio value="female">{t('page2.female')}</Radio>
                    <Radio value="unspecified">{t('page2.unspecified')}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            {/* Row 3 — Fix #5: validation for citizenId and phone */}
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="citizenId"
                  label={t('page2.citizenId')}
                  rules={[{ pattern: /^\d{13}$/, message: t('page2.citizenIdError') }]}
                >
                  <Input placeholder="x-xxxx-xxxxx-xx-x" maxLength={13} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="passport" label={t('page2.passport')}>
                  <Input placeholder={t('page2.passport')} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="phone"
                  label={t('page2.phone')}
                  rules={[{ pattern: /^0\d{8,9}$/, message: t('page2.phoneError') }]}
                >
                  <Input prefix={<PhoneOutlined style={{ color: '#ccc' }} />} placeholder="0xx-xxx-xxxx" maxLength={10} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8} justify="end">
              <Col>
                <Button onClick={handleReset} style={{ borderRadius: 9 }}>
                  {t('page2.reset')}
                </Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit" icon={<UserAddOutlined />} style={{ borderRadius: 9, fontWeight: 600 }}>
                  {t('page2.submit')}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Table Card */}
        <div className="ui-card">
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{t('page2.personList')}</span>
              <Tag style={{ marginLeft: 8, borderRadius: 6 }} color="default">
                {persons.length} {t('page2.records')}
              </Tag>
            </Col>
            <Col>
              <Popconfirm
                title={t('page2.confirmDelete')}
                onConfirm={handleBulkDelete}
                okText={t('page2.yes')}
                cancelText={t('page2.no')}
                disabled={selectedRowKeys.length === 0}
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={selectedRowKeys.length === 0}
                  style={{ borderRadius: 9 }}
                >
                  {t('page2.deleteSelected')}
                  {selectedRowKeys.length > 0 && ` (${selectedRowKeys.length})`}
                </Button>
              </Popconfirm>
            </Col>
          </Row>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={persons}
            pagination={{ pageSize: 10, showSizeChanger: false, style: { marginBottom: 0 } }}
            rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
            locale={{ emptyText: <EmptyPersonState label={t('page2.noData')} /> }}
            style={{ borderRadius: 12, overflow: 'hidden' }}
            size="middle"
          />
        </div>

      </div>
    </>
  );
}
