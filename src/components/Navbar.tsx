'use client';
import { Layout, Select, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Header className="global-navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-logo">
          <Title level={4} style={{ margin: 0, color: '#FFA200' }}>
            SWD Test
          </Title>
        </Link>

        <div className="navbar-links">
          <Space size="large">
            <Link 
              href="/shapes" 
              className={`nav-link ${pathname === '/shapes' ? 'active' : ''}`}
            >
              {t('home.test1')}: {t('home.layoutStyle')}
            </Link>
            <Link 
              href="/persons" 
              className={`nav-link ${pathname === '/persons' ? 'active' : ''}`}
            >
              {t('home.test2')}: {t('home.formTable')}
            </Link>
          </Space>
        </div>

        <div className="navbar-right">
          <Select
            value={i18n.language}
            onChange={changeLanguage}
            size="small"
            className="language-selector"
            options={[
              { value: 'en', label: 'EN' },
              { value: 'th', label: 'TH' },
            ]}
          />
        </div>
      </div>
    </Header>
  );
}
