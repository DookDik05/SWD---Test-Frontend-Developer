'use client';
import { useCallback, useEffect, useMemo, useState, Key, useRef } from 'react';
import {
  Button, Col, DatePicker, Form, Input, Popconfirm,
  Radio, Row, Select, Table, Typography, message, Modal, Space
} from 'antd';
import type { InputRef } from 'antd';
import { UserOutlined } from '@ant-design/icons';
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

const { Text } = Typography;

interface FormValues {
  prefix: string;
  firstName: string;
  lastName: string;
  birthday?: ReturnType<typeof dayjs>;
  nationality?: string;
  gender?: string;
  citizenId1?: string;
  citizenId2?: string;
  citizenId3?: string;
  citizenId4?: string;
  citizenId5?: string;
  countryCode?: string;
  phone?: string;
  passport?: string;
  expectedSalary?: string;
}


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


// ───────────────────────────────────────────────────────────────────
// Main Page
// ───────────────────────────────────────────────────────────────────

export default function PersonsPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const persons = useAppSelector((state) => state.persons.persons);
  
  const [form] = Form.useForm<FormValues>();
  const [editForm] = Form.useForm<FormValues>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (persons.length === 0) {
      const stored = loadFromStorage();
      if (stored.length > 0) dispatch(setPersons(stored));
    }
  }, [dispatch, persons.length]);

  const mapFormToPerson = (values: FormValues, id: string): Person => {
    // Combine Citizen ID
    const cid = [
      values.citizenId1 || '',
      values.citizenId2 || '',
      values.citizenId3 || '',
      values.citizenId4 || '',
      values.citizenId5 || '',
    ].join('');

    return {
      id,
      prefix: values.prefix,
      firstName: values.firstName,
      lastName: values.lastName,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
      nationality: values.nationality ?? '',
      gender: values.gender ?? '',
      citizenId: cid,
      passport: values.passport ?? '',
      countryCode: values.countryCode ?? '',
      phone: values.phone ?? '',
      expectedSalary: values.expectedSalary ?? '',
    };
  };

  const handleSubmit = useCallback((values: FormValues) => {
    dispatch(addPerson(mapFormToPerson(values, uuidv4())));
    message.success(t('page2.added'));
    form.resetFields();
  }, [dispatch, form, t]);

  const handleEditSubmit = useCallback((values: FormValues) => {
    if (!editingId) return;
    dispatch(updatePerson(mapFormToPerson(values, editingId)));
    message.success(t('page2.updated'));
    setIsEditModalOpen(false);
    setEditingId(null);
    editForm.resetFields();
  }, [dispatch, editingId, editForm, t]);

  const handleEdit = useCallback((record: Person) => {
    setEditingId(record.id);
    
    // Split citizen ID back into 5 parts
    const cid = record.citizenId || '';
    
    editForm.setFieldsValue({
      prefix: record.prefix,
      firstName: record.firstName,
      lastName: record.lastName,
      birthday: record.birthday ? dayjs(record.birthday) : undefined,
      nationality: record.nationality,
      gender: record.gender,
      citizenId1: cid.substring(0, 1),
      citizenId2: cid.substring(1, 5),
      citizenId3: cid.substring(5, 10),
      citizenId4: cid.substring(10, 12),
      citizenId5: cid.substring(12, 13),
      passport: record.passport,
      countryCode: record.countryCode,
      phone: record.phone,
      expectedSalary: record.expectedSalary,
    });
    setIsEditModalOpen(true);
  }, [editForm]);

  const handleModalCancel = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingId(null);
    editForm.resetFields();
  }, [editForm]);

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
  }, [form]);

  // Citizen ID Focus management refs
  const inputRefs = {
    c1: useRef<InputRef>(null),
    c2: useRef<InputRef>(null),
    c3: useRef<InputRef>(null),
    c4: useRef<InputRef>(null),
    c5: useRef<InputRef>(null),
  };

  const handleCitizenIdChange = (e: React.ChangeEvent<HTMLInputElement>, nextRef: React.RefObject<InputRef | null>, maxLength: number) => {
    if (e.target.value.length >= maxLength && nextRef.current) {
      nextRef.current.focus();
    }
  };


  const columns = useMemo<ColumnsType<Person>>(() => [
    {
      title: t('page2.name'),
      render: (_: unknown, r: Person) => `${r.firstName} ${r.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName)
    },
    {
      title: t('page2.gender'),
      dataIndex: 'gender',
      render: (val: string) => val === 'unspecified' ? 'Unsex' : (t(`page2.${val}`) || val),
      sorter: (a, b) => a.gender.localeCompare(b.gender)
    },
    {
      title: t('page2.mobilePhone'),
      render: (_: unknown, r: Person) => {
        if (!r.phone) return <span style={{ color: '#ccc' }}>—</span>;
        return `${r.countryCode || ''}${r.phone}`;
      },
      sorter: (a, b) => a.phone.localeCompare(b.phone)
    },
    {
      title: t('page2.nationality'),
      dataIndex: 'nationality',
      render: (val: string) =>
        val ? t(`page2.${val}`) || val : <span style={{ color: '#ccc' }}>—</span>,
      sorter: (a, b) => a.nationality.localeCompare(b.nationality)
    },
    {
      title: t('page2.manage').toUpperCase(),
      width: 140,
      render: (_: unknown, record: Person) => (
        <Row gutter={12} wrap={false}>
          <Col>
            <span style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#4B5563' }} onClick={() => handleEdit(record)}>
              {t('page2.edit').toUpperCase()}
            </span>
          </Col>
          <Col>
             <Popconfirm
              title={t('page2.confirmDelete')}
              onConfirm={() => handleDelete(record.id)}
              okText={t('page2.yes')}
              cancelText={t('page2.no')}
            >
              <span style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#4B5563' }}>
                {t('page2.delete').toUpperCase()}
              </span>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ], [t, handleEdit, handleDelete]);

  const renderFormFields = () => (
    <>
      {/* Row 1: Title, Firstname, Lastname */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Form.Item name="prefix" label={<span className="required-star">{t('page2.prefix')}</span>} rules={[{ required: true, message: '' }]}>
            <Select placeholder={t('page2.prefix')}>
              <Select.Option value="mr">{t('page2.mr')}</Select.Option>
              <Select.Option value="mrs">{t('page2.mrs')}</Select.Option>
              <Select.Option value="ms">{t('page2.ms')}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={9}>
          <Form.Item name="firstName" label={<span className="required-star">{t('page2.firstName')}</span>} rules={[{ required: true, message: '' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={9}>
          <Form.Item name="lastName" label={<span className="required-star">{t('page2.lastName')}</span>} rules={[{ required: true, message: '' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      
      {/* Row 2: Birthday, Nationality */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Form.Item name="birthday" label={<span className="required-star">{t('page2.birthday')}</span>} rules={[{ required: true, message: '' }]}>
            <DatePicker format="MM/DD/YY" style={{ width: '100%' }} placeholder="mm/dd/yy" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={10}>
          <Form.Item name="nationality" label={t('page2.nationality')}>
            <Select placeholder={t('page2.pleaseSelect')}>
              <Select.Option value="thai">{t('page2.thai')}</Select.Option>
              <Select.Option value="american">{t('page2.american')}</Select.Option>
              <Select.Option value="japanese">{t('page2.japanese')}</Select.Option>
              <Select.Option value="other">{t('page2.other')}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Row 3: CitizenID (5 boxes) */}
      <Form.Item label={t('page2.citizenId')} style={{ marginBottom: 16 }}>
        <Row gutter={8} align="middle" wrap={false}>
          <Col><Form.Item name="citizenId1" noStyle><Input ref={inputRefs.c1} maxLength={1} style={{ width: 40, textAlign: 'center' }} onChange={(e) => handleCitizenIdChange(e, inputRefs.c2, 1)} /></Form.Item></Col>
          <Col><Text type="secondary">-</Text></Col>
          <Col><Form.Item name="citizenId2" noStyle><Input ref={inputRefs.c2} maxLength={4} style={{ width: 70, textAlign: 'center' }} onChange={(e) => handleCitizenIdChange(e, inputRefs.c3, 4)} /></Form.Item></Col>
          <Col><Text type="secondary">-</Text></Col>
          <Col><Form.Item name="citizenId3" noStyle><Input ref={inputRefs.c3} maxLength={5} style={{ width: 80, textAlign: 'center' }} onChange={(e) => handleCitizenIdChange(e, inputRefs.c4, 5)} /></Form.Item></Col>
          <Col><Text type="secondary">-</Text></Col>
          <Col><Form.Item name="citizenId4" noStyle><Input ref={inputRefs.c4} maxLength={2} style={{ width: 50, textAlign: 'center' }} onChange={(e) => handleCitizenIdChange(e, inputRefs.c5, 2)} /></Form.Item></Col>
          <Col><Text type="secondary">-</Text></Col>
          <Col><Form.Item name="citizenId5" noStyle><Input ref={inputRefs.c5} maxLength={1} style={{ width: 40, textAlign: 'center' }} /></Form.Item></Col>
        </Row>
      </Form.Item>

      {/* Row 4: Gender */}
      <Form.Item name="gender" label={<span className="required-star">{t('page2.gender')}</span>} rules={[{ required: true, message: '' }]}>
        <Radio.Group>
          <Radio value="male">{t('page2.male')}</Radio>
          <Radio value="female">{t('page2.female')}</Radio>
          <Radio value="unspecified">{t('page2.unsex')}</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Row 5: Mobile Phone */}
      <Form.Item label={<span className="required-star">{t('page2.mobilePhone')}</span>} required>
        <Space.Compact style={{ width: '100%', maxWidth: 400 }}>
          <Form.Item name="countryCode" rules={[{ required: true, message: '' }]} noStyle>
            <Select style={{ width: '30%' }}>
              <Select.Option value="+66">+66</Select.Option>
              <Select.Option value="+1">+1</Select.Option>
              <Select.Option value="+81">+81</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" rules={[{ required: true, message: '' }]} noStyle>
            <Input style={{ width: '70%' }} />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      {/* Row 6: Passport */}
      <Form.Item name="passport" label={t('page2.passportPlaceholder')}>
        <Input style={{ maxWidth: 300 }} />
      </Form.Item>

      {/* Row 7: Expected Salary */}
      <Row justify="space-between" align="bottom">
        <Col>
          <Form.Item 
            name="expectedSalary" 
            label={<span className="required-star">{t('page2.expectedSalary')}</span>} 
            rules={[{ required: true, message: '' }]}
            style={{ marginBottom: 0 }}
          >
            <Input style={{ maxWidth: 300 }} />
          </Form.Item>
        </Col>
        <Col>
           {/* Form actions pushed to bottom right as in design */}
           <Row gutter={16}>
              <Col>
                <Button onClick={handleReset} style={{ borderRadius: 6 }}>
                  {t('page2.reset').toUpperCase()}
                </Button>
              </Col>
              <Col>
                <Button htmlType="submit" style={{ borderRadius: 6, opacity: 0.8 }} className="custom-submit-btn">
                  {t('page2.submit').toUpperCase()}
                </Button>
              </Col>
            </Row>
        </Col>
      </Row>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="app-navbar" style={{ justifyContent: 'space-between', padding: '12px 24px' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Form & Table</h2>
        <div className="app-navbar__nav">
          <Link href="/"><Button size="small" style={{ borderRadius: 6 }}>{t('nav.page1')}</Button></Link>
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

      <div className="page-container" style={{ padding: '20px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {/* Create Form Card */}
        <div className="ui-card" style={{ marginBottom: 40, padding: '30px 40px', border: '1px solid black' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .required-star::before {
              content: "*";
              color: red;
              margin-right: 4px;
            }
            .ant-form-item-label > label::before {
              display: none !important; /* hide default antd star */
            }
            .custom-submit-btn {
               /* Styling to match screenshot basic button */
            }
          `}} />
          <Form form={form} layout="horizontal" labelAlign="left" labelCol={{ flex: 'none' }} wrapperCol={{ flex: 'auto' }} onFinish={handleSubmit}>
            {renderFormFields()}
          </Form>
        </div>

        {/* Table Controls */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Button 
                onClick={handleBulkDelete}
                disabled={selectedRowKeys.length === 0}
                style={{ borderRadius: 0, fontWeight: 600 }}
              >
                {t('page2.delete').toUpperCase()}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Table Card */}
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={persons}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['topRight'],
              itemRender: (page, type, originalElement) => {
                if (type === 'prev') return <Button type="link" style={{ color: '#4B5563', fontSize: 12 }}>{t('page2.prev')}</Button>;
                if (type === 'next') return <Button type="link" style={{ color: '#4B5563', fontSize: 12 }}>{t('page2.next')}</Button>;
                return originalElement;
              },
              style: { marginBottom: 16, marginRight: 16 }
            }}
            rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
            locale={{ emptyText: <EmptyPersonState label={t('page2.noData')} /> }}
            size="middle"
            rowClassName={() => 'custom-table-row'}
          />
        </div>

      </div>

      {/* Edit Form Modal */}
      <Modal
        title={t('page2.editPerson')}
        open={isEditModalOpen}
        onCancel={handleModalCancel}
        onOk={() => editForm.submit()}
        okText={t('page2.submit')}
        cancelText={t('page2.no')}
        width={800}
      >
        <Form form={editForm} layout="horizontal" labelAlign="left" onFinish={handleEditSubmit} style={{ marginTop: 20 }}>
          {renderFormFields()}
        </Form>
      </Modal>
    </div>
  );
}
