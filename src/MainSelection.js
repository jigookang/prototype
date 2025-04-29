import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  IconButton
} from '@mui/material';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MainSelection() {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
          aria-label="홈으로 돌아가기"
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h1">
          전기차 계산기
        </Typography>
      </Box>
      
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          원하시는 계산기를 선택해주세요
        </Typography>
      </Box>
      
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: 5
            }
          }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <ElectricCarIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
              <Typography variant="h5" component="h2" gutterBottom align="center" fontWeight="bold">
                전기차 보조금 계산기
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                한달 유류비 기준으로 전기차로 전환 시 절약 금액과 국가 및 지자체 보조금을 확인해보세요.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                component={Link} 
                to="/subsidy" 
                variant="contained" 
                size="large" 
                fullWidth
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                보조금 계산기 이용하기
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: 5
            }
          }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <LocalShippingIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
              <Typography variant="h5" component="h2" gutterBottom align="center" fontWeight="bold">
                전기트럭 비교 계산기
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                기존 전기트럭과 최신 ST1 전기트럭의 충전시간 및 비용을 비교해보세요.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                component={Link} 
                to="/comparison" 
                variant="contained" 
                size="large" 
                fullWidth
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                트럭 비교 계산기 이용하기
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainSelection; 