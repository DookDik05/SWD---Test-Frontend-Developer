'use client';
import { Card, Col, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function Home() {
  const { i18n } = useTranslation();

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
          
          <Col xs={24} sm={12} md={8}>
            <Link href="/shapes" style={{ textDecoration: 'none' }}>
              <Card 
                hoverable 
                className="ui-card"
                style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                bodyStyle={{ padding: 24 }}
              >
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Test 1</Title>
                <Text type="secondary" style={{ marginTop: 20, display: 'block' }}>
                  Layout & Style
                </Text>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable 
              className="ui-card"
              style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              bodyStyle={{ padding: 24 }}
            >
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Test 2</Title>
              <Text type="secondary" style={{ marginTop: 20, display: 'block' }}>
                Connect API
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Link href="/persons" style={{ textDecoration: 'none' }}>
              <Card 
                hoverable 
                className="ui-card"
                style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                bodyStyle={{ padding: 24 }}
              >
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Test 3</Title>
                <Text type="secondary" style={{ marginTop: 20, display: 'block' }}>
                  Form & Table
                </Text>
              </Card>
            </Link>
          </Col>

        </Row>
      </div>
    </div>
  );
}
