import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  InputAdornment,
  Grid,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EVComparison() {
  const navigate = useNavigate();

  // 주행거리 상태 관리
  const [monthlyDistance, setMonthlyDistance] = useState(6000);
  const [distanceError, setDistanceError] = useState('');
  
  // 전기차 스펙
  const OLD_TRUCK_EFFICIENCY = 3;     // 기존 전기트럭 전비 (km/kWh)
  const OLD_TRUCK_CHARGING_SPEED = 40; // 기존 전기트럭 충전속도 (kWh/h)
  
  const ST1_TRUCK_EFFICIENCY = 5;     // ST1 전비 (km/kWh)
  const ST1_TRUCK_CHARGING_SPEED = 80; // ST1 충전속도 (kWh/h)
  
  const ELECTRICITY_PRICE = 100;      // 전기 요금 (원/kWh)
  
  // 충전 시간 및 비용 상태
  const [oldTruckChargingTime, setOldTruckChargingTime] = useState(0);
  const [st1TruckChargingTime, setSt1TruckChargingTime] = useState(0);
  const [chargingTimeSaving, setChargingTimeSaving] = useState(0);
  
  const [oldTruckChargingCost, setOldTruckChargingCost] = useState(0);
  const [st1TruckChargingCost, setSt1TruckChargingCost] = useState(0);
  const [chargingCostSaving, setChargingCostSaving] = useState(0);
  const [annualCostSaving, setAnnualCostSaving] = useState(0);
  
  // 주행거리 입력 처리
  const handleDistanceChange = (e) => {
    const value = e.target.value;
    
    // 유효성 검사: 숫자만 입력 가능
    if (value && !/^\d+$/.test(value)) {
      setDistanceError('숫자만 입력해주세요');
      return;
    }
    
    setDistanceError('');
    setMonthlyDistance(value ? parseInt(value) : 0);
  };
  
  // 충전시간 계산 함수
  const calculateChargingTime = (distance, efficiency, chargingSpeed) => {
    const monthlyElectricityUsage = distance / efficiency; // 월 사용 전력량 (kWh)
    const chargingTime = monthlyElectricityUsage / chargingSpeed; // 충전 소요시간 (시간)
    return chargingTime;
  };
  
  // 충전비용 계산 함수
  const calculateChargingCost = (distance, efficiency) => {
    const monthlyElectricityUsage = distance / efficiency; // 월 사용 전력량 (kWh)
    const chargingCost = monthlyElectricityUsage * ELECTRICITY_PRICE; // 충전 비용 (원)
    return chargingCost;
  };
  
  // 주행거리 변경 시 자동 계산
  useEffect(() => {
    if (monthlyDistance > 0) {
      // 충전 시간 계산
      const oldTime = calculateChargingTime(monthlyDistance, OLD_TRUCK_EFFICIENCY, OLD_TRUCK_CHARGING_SPEED);
      const st1Time = calculateChargingTime(monthlyDistance, ST1_TRUCK_EFFICIENCY, ST1_TRUCK_CHARGING_SPEED);
      const timeSaving = oldTime - st1Time;
      
      setOldTruckChargingTime(oldTime);
      setSt1TruckChargingTime(st1Time);
      setChargingTimeSaving(timeSaving);
      
      // 충전 비용 계산
      const oldCost = calculateChargingCost(monthlyDistance, OLD_TRUCK_EFFICIENCY);
      const st1Cost = calculateChargingCost(monthlyDistance, ST1_TRUCK_EFFICIENCY);
      const costSaving = oldCost - st1Cost;
      
      setOldTruckChargingCost(oldCost);
      setSt1TruckChargingCost(st1Cost);
      setChargingCostSaving(costSaving);
      setAnnualCostSaving(costSaving * 12);
    }
  }, [monthlyDistance]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/evtools')}
          sx={{ mr: 2 }}
          aria-label="계산기 목록으로 돌아가기"
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h5" component="h1">
          전기트럭 비교 계산기
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          mb: 4
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ElectricCarIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            전기트럭 비교 계산기
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            기존 전기트럭과 최신 ST1 전기트럭의 충전시간 및 비용을 비교해보세요.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            월간 주행거리를 입력해주세요
          </Typography>
          
          <TextField
            fullWidth
            label="월간 주행거리"
            variant="outlined"
            value={monthlyDistance}
            onChange={handleDistanceChange}
            error={!!distanceError}
            helperText={distanceError}
            sx={{ maxWidth: '400px', mx: 'auto', display: 'block' }}
            InputProps={{
              endAdornment: <InputAdornment position="end">km</InputAdornment>,
            }}
          />
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            비교 결과
          </Typography>
          
          <Grid container spacing={4}>
            {/* 충전 시간 비교 카드 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TimerIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">충전 시간 비교</Typography>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>구분</TableCell>
                          <TableCell align="right">월 충전시간</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>기존 전기트럭</TableCell>
                          <TableCell align="right">{oldTruckChargingTime.toFixed(1)}시간</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ST1 전기트럭</TableCell>
                          <TableCell align="right">{st1TruckChargingTime.toFixed(1)}시간</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#e8f4fd' }}>
                          <TableCell><strong>절약 시간</strong></TableCell>
                          <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            {chargingTimeSaving.toFixed(1)}시간
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>ST1 전기트럭은 기존 대비 월 {Math.round(chargingTimeSaving)} 시간의 충전시간을 절약합니다.</strong> 
                      <br />
                      이는 연간 {Math.round(chargingTimeSaving * 12)} 시간의 절약 효과가 있습니다.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* 충전 비용 비교 카드 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BatteryChargingFullIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">충전 비용 비교</Typography>
                  </Box>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>구분</TableCell>
                          <TableCell align="right">월 충전비용</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>기존 전기트럭</TableCell>
                          <TableCell align="right">{Math.round(oldTruckChargingCost/10000)}만원</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ST1 전기트럭</TableCell>
                          <TableCell align="right">{Math.round(st1TruckChargingCost/10000)}만원</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#e8f4fd' }}>
                          <TableCell><strong>절약 비용</strong></TableCell>
                          <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            {Math.round(chargingCostSaving/10000)}만원
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 3, p: 3, bgcolor: '#e8f4fd', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      연간 <span style={{ color: '#1976d2', fontSize: '1.2em' }}>{Math.round(annualCostSaving/10000)}</span>만원 절약
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      ST1 전기트럭은 높은 전비(5km/kWh)로 더 적은 전력을 사용하여 비용을 절감합니다.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Card sx={{ mt: 4, bgcolor: '#f9f9f9', p: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                ST1 전기트럭 총 절감 효과
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-around', mt: 2 }}>
                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 0 } }}>
                  <TimerIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">충전시간</Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    연간 {Math.round(chargingTimeSaving * 12)}시간 절약
                  </Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                <Divider sx={{ my: 2, display: { xs: 'block', md: 'none' } }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <BatteryChargingFullIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">충전비용</Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    연간 {Math.round(annualCostSaving/10000)}만원 절약
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 4, px: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  * 계산 기준: 월간 주행거리 {monthlyDistance.toLocaleString()}km, 전기요금 {ELECTRICITY_PRICE}원/kWh
                  <br />
                  * 기존 전기트럭: 전비 {OLD_TRUCK_EFFICIENCY}km/kWh, 충전속도 {OLD_TRUCK_CHARGING_SPEED}kWh/h
                  <br />
                  * ST1 전기트럭: 전비 {ST1_TRUCK_EFFICIENCY}km/kWh, 충전속도 {ST1_TRUCK_CHARGING_SPEED}kWh/h
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}

export default EVComparison; 