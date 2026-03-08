'use client';
import { Card, Col, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function Home() {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar with Language Switcher ONLY */}
      <nav className="app-navbar" style={{ justifyContent: 'flex-end' }}>
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
      </nav>

      {/* Main Content */}
      <div 
        className="page-container" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <Row gutter={[24, 24]} justify="center" style={{ width: '100%', maxWidth: 900 }}>
          
          <Col span={10}>
            <Link href="/shapes" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
              <Card 
                hoverable 
                className="ui-card"
                style={{ minHeight: 120, display: 'flex', alignItems: 'center' }}
                styles={{ body: { padding: '0 24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' } }}
              >
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>{t('home.test1')}</Title>
                <Text type="secondary" style={{ margin: 0 }}>
                  {t('home.layoutStyle')}
                </Text>
              </Card>
            </Link>
          </Col>



          <Col span={10}>
            <Link href="/persons" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
              <Card 
                hoverable 
                className="ui-card"
                style={{ minHeight: 120, display: 'flex', alignItems: 'center' }}
                styles={{ body: { padding: '0 24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' } }}
              >
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>{t('home.test3')}</Title>
                <Text type="secondary" style={{ margin: 0 }}>
                  {t('home.formTable')}
                </Text>
              </Card>
            </Link>
          </Col>

        </Row>
      </div>
    </div>
  );
}
