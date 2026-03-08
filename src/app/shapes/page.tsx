'use client';
import { useState } from 'react';
import { Row, Col, Space } from 'antd';
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


export default function ShapesPage() {
  const { t } = useTranslation();
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
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: 40 }}>
        <h1 className="page-title">{t('page1.title')}</h1>
      </div>

      {/* Control Panel */}
      <div className="control-panel" style={{ marginBottom: 48 }}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={6}>
            <div className="control-shape-wrapper" onClick={handleMoveLeft}>
              <div className="control-action">
                <div className="shape-triangle-left" />
                <span className="shape-badge">{t('page1.moveShape')}</span>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div className="control-shape-wrapper" onClick={handleMovePosition}>
              <div className="control-action dual">
                <Space size={40}>
                  <div className="shape-triangle-up" />
                  <div className="shape-triangle-down" />
                </Space>
                <span className="shape-badge">{t('page1.movePosition')}</span>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={6}>
            <div className="control-shape-wrapper" onClick={handleMoveRight}>
              <div className="control-action">
                <div className="shape-triangle-right" />
                <span className="shape-badge">{t('page1.moveShape')}</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="ui-divider" style={{ marginBottom: 48 }} />

      {/* Shape Grid */}
      <div className="shape-grid-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px', transform: 'translateX(-60px)' }}>
          {displayShapes.slice(0, 3).map((shape, idx) => (
            <div key={`r1-${idx}`} className={`shape-wrapper shape-color-${idx % 2}`} onClick={handleShapeBtn}>
              <div className={`shape-${shape}`} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', transform: 'translateX(60px)' }}>
          {displayShapes.slice(3, 6).map((shape, idx) => (
            <div key={`r2-${idx}`} className={`shape-wrapper shape-color-${(idx + 1) % 2}`} onClick={handleShapeBtn}>
              <div className={`shape-${shape}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
