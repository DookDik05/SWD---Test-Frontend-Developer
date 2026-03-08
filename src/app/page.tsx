'use client';
import { useState } from 'react';
import { Button, Row, Col, Select, Tag } from 'antd';
import { SwapOutlined, RetweetOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '@/styles/shapes.scss';

type ShapeType = 'circle' | 'square' | 'trapezoid' | 'parallelogram';

const ALL_SHAPES: ShapeType[] = ['circle', 'square', 'trapezoid', 'parallelogram'];

function shuffleArray(arr: ShapeType[]): ShapeType[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

function rotateLeft(arr: ShapeType[]): ShapeType[] {
  if (arr.length === 0) return arr;
  return [...arr.slice(1), arr[0]];
}

const shapeKeys: Record<ShapeType, string> = {
  circle: 'page1.circle',
  square: 'page1.square',
  trapezoid: 'page1.trapezoid',
  parallelogram: 'page1.parallelogram',
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [shapes, setShapes] = useState<ShapeType[]>([...ALL_SHAPES]);
  const [swapped, setSwapped] = useState<boolean>(false);

  const handleMoveShape = () => setShapes((prev) => rotateLeft(prev));
  const handleMovePosition = () => setSwapped((prev) => !prev);
  const handleShapeBtn = () => setShapes(shuffleArray([...ALL_SHAPES]));

  const displayShapes: ShapeType[] = swapped
    ? [...shapes.slice(2, 4), ...shapes.slice(0, 2)]
    : shapes;

  return (
    <>
      {/* Navbar */}
      <nav className="app-navbar">
        <span className="app-navbar__logo">SWD Test</span>
        <div className="app-navbar__nav">
          <Link href="/"><Button type="primary" size="small">{t('nav.page1')}</Button></Link>
          <Link href="/persons"><Button size="small">{t('nav.page2')}</Button></Link>
        </div>
        <div className="app-navbar__right">
          <Select
            value={i18n.language}
            onChange={(val: string) => i18n.changeLanguage(val)}
            size="small"
            style={{ width: 80 }}
            options={[{ value: 'en', label: '🇬🇧 EN' }, { value: 'th', label: '🇹🇭 TH' }]}
          />
        </div>
      </nav>

      <div className="page-container">

        {/* Action Buttons Card */}
        <div className="ui-card" style={{ marginBottom: 20 }}>
          <p className="section-label">{t('page1.title')}</p>

          {/* Primary action buttons */}
          <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
            <Col>
              <Button
                icon={<RetweetOutlined />}
                onClick={handleMoveShape}
                style={{
                  backgroundColor: '#FFA200',
                  borderColor: '#FFA200',
                  color: '#fff',
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 40,
                  paddingInline: 20,
                }}
              >
                {t('page1.moveShape')}
              </Button>
            </Col>
            <Col>
              <Button
                icon={<SwapOutlined rotate={90} />}
                onClick={handleMovePosition}
                style={{
                  backgroundColor: '#6EDA78',
                  borderColor: '#6EDA78',
                  color: '#fff',
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 40,
                  paddingInline: 20,
                }}
              >
                {t('page1.movePosition')}
              </Button>
            </Col>
          </Row>

          <hr className="ui-divider" />

          {/* Shape selector buttons */}
          <p className="section-label" style={{ marginBottom: 10 }}>
            {i18n.language === 'th' ? 'เลือกรูปทรงเพื่อสุ่มใหม่' : 'Click a shape to randomize'}
          </p>
          <Row gutter={[8, 8]}>
            {ALL_SHAPES.map((shape) => (
              <Col key={shape}>
                <Button
                  onClick={handleShapeBtn}
                  style={{ borderRadius: 8, height: 36 }}
                >
                  {t(shapeKeys[shape])}
                </Button>
              </Col>
            ))}
          </Row>
        </div>

        {/* Shapes Display Card */}
        <div className="ui-card">
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <p className="section-label" style={{ margin: 0 }}>
              {i18n.language === 'th' ? 'รูปทรง' : 'Shapes'}
            </p>
            {swapped && (
              <Tag color="green" style={{ borderRadius: 6 }}>
                {i18n.language === 'th' ? 'สลับตำแหน่งแล้ว' : 'Position swapped'}
              </Tag>
            )}
          </Row>
          <div className="shape-grid">
            {displayShapes.map((shape, idx) => (
              <div className={`shape-wrapper shape-color-${idx % 2}`} key={idx}>
                <div className={`shape-${shape}`} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
