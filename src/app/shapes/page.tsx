'use client';
import { useState } from 'react';
import { Row, Col, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import '@/styles/shapes.scss';

type ShapeType = 'circle' | 'square' | 'triangle' | 'oval' | 'trapezoid' | 'parallelogram';

const ALL_SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'oval', 'trapezoid', 'parallelogram'];

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

function rotateRight(arr: ShapeType[]): ShapeType[] {
  if (arr.length === 0) return arr;
  return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
}


export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [shapes, setShapes] = useState<ShapeType[]>([...ALL_SHAPES]);
  const [swapped, setSwapped] = useState<boolean>(false);

  const handleMoveLeft = () => setShapes((prev) => rotateLeft(prev));
  const handleMoveRight = () => setShapes((prev) => rotateRight(prev));
  const handleMovePosition = () => setSwapped((prev) => !prev);
  const handleShapeBtn = () => setShapes(shuffleArray([...ALL_SHAPES]));

  const displayShapes: ShapeType[] = swapped
    ? [...shapes.slice(3, 6), ...shapes.slice(0, 3)]
    : shapes;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav className="app-navbar" style={{ justifyContent: 'space-between', padding: '12px 24px' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Layout & Style</h2>
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

      <div 
        className="page-container" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div style={{ maxWidth: 1000, width: '100%' }}>
          
          {/* Top Control Shapes */}
          <Row gutter={[24, 24]} justify="center" style={{ marginBottom: 40 }}>
            {/* Left Control */}
            <Col xs={24} sm={8} md={6}>
              <div className="control-shape-wrapper" onClick={handleMoveLeft}>
                <div className="shape-triangle-left" />
                <span className="shape-badge">{t('page1.moveShape')}</span>
              </div>
            </Col>
            
            {/* Center Control */}
            <Col xs={24} sm={8} md={6}>
              <div className="control-shape-wrapper" style={{ flexDirection: 'row', gap: 20 }} onClick={handleMovePosition}>
                <div className="shape-triangle-up" />
                <div className="shape-triangle-down" />
                <span className="shape-badge">{t('page1.movePosition')}</span>
              </div>
            </Col>

            {/* Right Control */}
            <Col xs={24} sm={8} md={6}>
              <div className="control-shape-wrapper" onClick={handleMoveRight}>
                <div className="shape-triangle-right" />
                <span className="shape-badge">{t('page1.moveShape')}</span>
              </div>
            </Col>
          </Row>
          
          <div style={{ borderBottom: '1px solid #ddd', width: '90%', margin: '0 auto 40px auto' }}></div>

          {/* Bottom Grid Shapes */}
          <div className="ui-card" style={{ background: '#fff', padding: '40px 0', borderRadius: 16, border: '1px solid #eee', width: '90%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', marginRight: '95px' }}>
              {displayShapes.slice(0, 3).map((shape, idx) => (
                <div key={`r1-${idx}`} className={`shape-wrapper shape-color-${idx % 2}`} onClick={handleShapeBtn}>
                  <div className={`shape-${shape}`} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginLeft: '95px' }}>
              {displayShapes.slice(3, 6).map((shape, idx) => (
                <div key={`r2-${idx}`} className={`shape-wrapper shape-color-${(idx + 1) % 2}`} onClick={handleShapeBtn}>
                  <div className={`shape-${shape}`} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
