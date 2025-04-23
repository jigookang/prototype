import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardMedia } from '@mui/material';

function MainPage() {
  const navigate = useNavigate();

  // 인라인 SVG로 직접 계산기 아이콘 구현 - 사용자 이미지와 유사하게 수정
  const calculatorSvg = (
    <svg width="150" height="150" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* 계산기 본체 */}
      <path d="M50 50 C 50 45, 60 45, 65 45 L 140 50 C 145 50, 150 55, 150 60 L 145 165 C 145 170, 140 170, 135 170 L 55 170 C 50 170, 50 165, 50 160 Z" stroke="#333" strokeWidth="3" fill="none" />
      
      {/* 계산기 화면 */}
      <path d="M60 60 C 65 55, 140 55, 140 60 L 138 85 C 138 90, 135 90, 130 90 L 65 90 C 60 90, 60 85, 62 80 Z" stroke="#333" strokeWidth="2" fill="none" />
      
      {/* 계산기 버튼들 */}
      <path d="M70 110 L90 110 M80 100 L80 120" stroke="#333" strokeWidth="3" /> {/* + */}
      <path d="M110 110 L130 110" stroke="#333" strokeWidth="3" /> {/* - */}
      <path d="M70 140 L85 140 M80 140 L85 150" stroke="#333" strokeWidth="3" /> {/* ÷ */}
      <path d="M110 130 L130 150 M110 150 L130 130" stroke="#333" strokeWidth="3" /> {/* x */}
      
      {/* 추가 버튼들 */}
      <rect x="70" y="170" width="20" height="20" stroke="#333" strokeWidth="2" fill="none" rx="2" />
      <rect x="110" y="170" width="20" height="20" stroke="#333" strokeWidth="2" fill="none" rx="2" />
    </svg>
  );

  // 달력 아이콘을 전기차 아이콘으로 변경
  const carSvg = (
    <svg width="150" height="150" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* 전기차 본체 */}
      <path d="M30 120 C 30 100, 50 90, 70 90 L 140 90 C 160 90, 170 100, 170 120 L 165 140 C 165 150, 155 150, 155 150 L 45 150 C 45 150, 35 150, 35 140 Z" stroke="#333" strokeWidth="3" fill="none" />
      
      {/* 차 창문 */}
      <path d="M60 90 L 60 110 L 140 110 L 140 90" stroke="#333" strokeWidth="2" fill="none" />
      <path d="M90 90 L 90 110" stroke="#333" strokeWidth="2" />
      <path d="M115 90 L 115 110" stroke="#333" strokeWidth="2" />
      
      {/* 바퀴 */}
      <circle cx="60" cy="150" r="15" fill="none" stroke="#333" strokeWidth="3" />
      <circle cx="140" cy="150" r="15" fill="none" stroke="#333" strokeWidth="3" />
      
      {/* 전기 기호 */}
      <path d="M100 50 L 110 70 L 95 75 L 105 100" stroke="#333" strokeWidth="3" fill="none" />
      
      {/* 충전 케이블 */}
      <path d="M170 120 C 180 120, 190 110, 190 100 C 190 90, 180 80, 170 80" stroke="#333" strokeWidth="2" fill="none" />
    </svg>
  );

  // 차트 아이콘
  const chartSvg = (
    <svg width="150" height="150" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* 손으로 그린 차트 아이콘 */}
      <path d="M40 160 L 160 160" stroke="#333" strokeWidth="3" /> {/* x축 */}
      <path d="M40 40 L 40 160" stroke="#333" strokeWidth="3" /> {/* y축 */}
      
      {/* 막대 그래프 */}
      <path d="M60 160 L 60 120 L 80 120 L 80 160" stroke="#333" strokeWidth="2" fill="none" />
      <path d="M90 160 L 90 90 L 110 90 L 110 160" stroke="#333" strokeWidth="2" fill="none" />
      <path d="M120 160 L 120 60 L 140 60 L 140 160" stroke="#333" strokeWidth="2" fill="none" />
      
      {/* 꺾은선 그래프 */}
      <path d="M40 130 C 70 120, 90 80, 120 50, 140 70, 160 60" stroke="#333" strokeWidth="2" fill="none" />
      <circle cx="70" cy="120" r="4" fill="white" stroke="#333" strokeWidth="2" />
      <circle cx="100" cy="80" r="4" fill="white" stroke="#333" strokeWidth="2" />
      <circle cx="130" cy="50" r="4" fill="white" stroke="#333" strokeWidth="2" />
    </svg>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          프로토타입 허브
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          다양한 프로토타입 도구 모음
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* 첫 번째 카드 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            onClick={() => navigate('/calculator')}
            sx={{ 
              height: '350px',
              cursor: 'pointer',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              }
            }}
          >
            <Box sx={{ 
              height: '100%',
              bgcolor: '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3
            }}>
              {calculatorSvg}
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  mt: 4, 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                가격 계산기
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2,
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                공급가와 총액 기준의 다양한 가격 계산 도구
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* 두 번째 카드 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            onClick={() => navigate('/evsubsidy')}
            sx={{ 
              height: '350px',
              cursor: 'pointer',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              }
            }}
          >
            <Box sx={{ 
              height: '100%',
              bgcolor: '#f1f3f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3
            }}>
              {carSvg}
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  mt: 4, 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                전기차 지원금 확인
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2,
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                지역별 전기차 구매 지원금을 확인해보세요
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* 세 번째 카드 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '350px',
              cursor: 'pointer',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              }
            }}
          >
            <Box sx={{ 
              height: '100%',
              bgcolor: '#e9ecef',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3
            }}>
              {chartSvg}
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  mt: 4, 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                데이터 분석
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2,
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                곧 출시 예정
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainPage;