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
  Stepper, 
  Step, 
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EVSubsidy() {
  const navigate = useNavigate();

  // 현재 단계 (유류비 입력 단계가 첫 번째)
  const [activeStep, setActiveStep] = useState(0);
  
  // 유류비 상태 관리
  const [fuelCost, setFuelCost] = useState('');
  const [fuelCostError, setFuelCostError] = useState('');
  
  // 차량 정보 상태 관리
  const [fuelType, setFuelType] = useState('diesel'); // 기본값: 경유
  const [fuelEfficiency, setFuelEfficiency] = useState('8'); // 기본값: 8km/L
  const [evEfficiency, setEvEfficiency] = useState('5'); // 기본값: 5km/kWh
  const [electricityRate, setElectricityRate] = useState('100'); // 기본값: 100원/kWh
  
  // 지역 정보 상태 관리
  const [region, setRegion] = useState('서울특별시');
  const [subRegion, setSubRegion] = useState('');
  
  // 계산 결과
  const [monthlyDistance, setMonthlyDistance] = useState(0);
  const [isCustomDistance, setIsCustomDistance] = useState(false); // 사용자가 직접 주행거리를 변경했는지 여부
  const [fuelPrice, setFuelPrice] = useState(0);
  const [evChargingCost, setEvChargingCost] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  
  // 지역 및 보조금 정보
  const regions = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도'
  ];
  
  // 시/도별 보조금 정보 (만원 단위)
  const subsidyData = {
    '서울특별시': {
      '국고보조금': 700,
      '지자체보조금': 400,
      '총 지원금': 1100
    },
    '부산광역시': {
      '국고보조금': 700,
      '지자체보조금': 300,
      '총 지원금': 1000
    },
    '대구광역시': {
      '국고보조금': 700,
      '지자체보조금': 350,
      '총 지원금': 1050
    },
    '인천광역시': {
      '국고보조금': 700,
      '지자체보조금': 420,
      '총 지원금': 1120
    },
    '광주광역시': {
      '국고보조금': 700,
      '지자체보조금': 380,
      '총 지원금': 1080
    },
    '대전광역시': {
      '국고보조금': 700,
      '지자체보조금': 330,
      '총 지원금': 1030
    },
    '울산광역시': {
      '국고보조금': 700,
      '지자체보조금': 300,
      '총 지원금': 1000
    },
    '세종특별자치시': {
      '국고보조금': 700,
      '지자체보조금': 450,
      '총 지원금': 1150
    },
    '경기도': {
      '국고보조금': 700,
      '지자체보조금': 380,
      '총 지원금': 1080
    },
    '강원도': {
      '국고보조금': 700,
      '지자체보조금': 400,
      '총 지원금': 1100
    },
    '충청북도': {
      '국고보조금': 700,
      '지자체보조금': 350,
      '총 지원금': 1050
    },
    '충청남도': {
      '국고보조금': 700,
      '지자체보조금': 370,
      '총 지원금': 1070
    },
    '전라북도': {
      '국고보조금': 700,
      '지자체보조금': 400,
      '총 지원금': 1100
    },
    '전라남도': {
      '국고보조금': 700,
      '지자체보조금': 450,
      '총 지원금': 1150
    },
    '경상북도': {
      '국고보조금': 700,
      '지자체보조금': 330,
      '총 지원금': 1030
    },
    '경상남도': {
      '국고보조금': 700,
      '지자체보조금': 350,
      '총 지원금': 1050
    },
    '제주특별자치도': {
      '국고보조금': 700,
      '지자체보조금': 500,
      '총 지원금': 1200
    }
  };
  
  // 연료 가격 (원/L)
  const fuelPrices = {
    gasoline: 1600, // 휘발유 가격
    diesel: 1500,   // 경유 가격
    lpg: 1000       // LPG 가격
  };
  
  // 유류비 입력 처리
  const handleFuelCostChange = (e) => {
    const value = e.target.value;
    setFuelCost(value);
    
    // 유효성 검사: 숫자만 입력 가능
    if (value && !/^\d+$/.test(value)) {
      setFuelCostError('숫자만 입력해주세요');
    } else {
      setFuelCostError('');
    }
  };
  
  // 주행거리 직접 변경 처리
  const handleDistanceChange = (e) => {
    const value = e.target.value;
    
    // 유효성 검사: 숫자만 입력 가능
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    setMonthlyDistance(value ? parseInt(value) : 0);
    setIsCustomDistance(true);
  };
  
  // 차량 정보 입력 처리
  const handleFuelTypeChange = (e) => {
    setFuelType(e.target.value);
  };
  
  const handleFuelEfficiencyChange = (e) => {
    setFuelEfficiency(e.target.value);
  };
  
  const handleEvEfficiencyChange = (e) => {
    setEvEfficiency(e.target.value);
  };
  
  const handleElectricityRateChange = (e) => {
    setElectricityRate(e.target.value);
  };
  
  // 지역 선택 처리
  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };
  
  // 주행거리 계산
  useEffect(() => {
    if (activeStep === 1 && fuelCost && fuelType && fuelEfficiency && !isCustomDistance) {
      // 주행거리 계산 공식: 월 주행거리 = 한 달 유류비 / (연료가격 × (1 / 연비))
      const currentFuelPrice = fuelPrices[fuelType];
      setFuelPrice(currentFuelPrice);
      
      // 만원 단위로 입력된 값을 원 단위로 변환 (× 10000)
      const fuelCostInWon = parseFloat(fuelCost) * 10000;
      const distance = fuelCostInWon / (currentFuelPrice * (1 / parseFloat(fuelEfficiency)));
      setMonthlyDistance(Math.round(distance));
    }
  }, [activeStep, fuelCost, fuelType, fuelEfficiency, isCustomDistance]);
  
  // 전기차 충전 비용 계산
  useEffect(() => {
    if (activeStep === 1 && monthlyDistance && evEfficiency && electricityRate) {
      // 전기차 충전 비용 공식: 충전비용 = 월 주행거리 ÷ 전비 × 전기요금
      const chargingCost = monthlyDistance / parseFloat(evEfficiency) * parseFloat(electricityRate);
      setEvChargingCost(Math.round(chargingCost));
      
      // 월간 절약 비용 (만원 단위 입력값 → 원 단위 변환)
      const fuelCostInWon = parseFloat(fuelCost) * 10000;
      const savings = fuelCostInWon - chargingCost;
      setMonthlySavings(Math.round(savings));
      
      // 연간 절약 비용
      setAnnualSavings(Math.round(savings * 12));
    }
  }, [activeStep, monthlyDistance, evEfficiency, electricityRate, fuelCost]);
  
  // 다음 단계로 진행
  const handleNext = () => {
    // 유효성 검사
    if (activeStep === 0) {
      if (!fuelCost) {
        setFuelCostError('한달 유류비를 입력해주세요');
        return;
      }
      
      if (fuelCostError) {
        return;
      }
    }
    
    // 다음 단계로 진행
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // 이전 단계로 돌아가기
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // 처음으로 돌아가기 처리
  const handleReset = () => {
    setActiveStep(0);
    setIsCustomDistance(false);
  };
  
  // 단계 정의
  const steps = ['유류비 입력', '차량 정보 입력', '지원금 확인'];
  
  // 트럭 SVG 아이콘
  const truckSvg = (
    <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="80" width="80" height="50" fill="#e0e0e0" stroke="#333" strokeWidth="2" />
      <rect x="100" y="100" width="60" height="30" fill="#333" />
      <rect x="20" y="130" width="140" height="15" fill="#d3d3d3" stroke="#333" strokeWidth="2" />
      <circle cx="50" cy="155" r="15" fill="#f5f5f5" stroke="#333" strokeWidth="3" />
      <circle cx="140" cy="155" r="15" fill="#f5f5f5" stroke="#333" strokeWidth="3" />
    </svg>
  );

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
          전기차 보조금 계산기
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
          {truckSvg}
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            전기차 지원금 확인하기
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            한달 유류비 기준으로 전기차로 전환 시 얼마나 절약할 수 있는지 계산해드립니다.
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {activeStep === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                현재 한달 유류비를 입력해주세요
              </Typography>
              
              <TextField
                fullWidth
                label="한달 유류비"
                variant="outlined"
                value={fuelCost}
                onChange={handleFuelCostChange}
                error={!!fuelCostError}
                helperText={fuelCostError || "만원 단위로 입력해주세요 (예: 40 = 40만원)"}
                sx={{ mt: 2, mb: 4, maxWidth: '400px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">만원</InputAdornment>,
                }}
              />
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleNext}
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontSize: '1.1rem'
                }}
              >
                다음 단계
              </Button>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom align="center">
                차량 정보 입력
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>연료 종류</InputLabel>
                    <Select
                      value={fuelType}
                      onChange={handleFuelTypeChange}
                      label="연료 종류"
                    >
                      <MenuItem value="gasoline">휘발유</MenuItem>
                      <MenuItem value="diesel">경유</MenuItem>
                      <MenuItem value="lpg">LPG</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    연비와 전기 요금은 평균값으로 자동 계산됩니다.
                  </Typography>
                </Grid>
              </Grid>
              
              {monthlyDistance > 0 && (
                <Card sx={{ mt: 4, bgcolor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      전기차 전환 시 예상 비용 절감
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" gutterBottom>
                          월간 주행거리
                        </Typography>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={monthlyDistance}
                          onChange={handleDistanceChange}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">km</InputAdornment>,
                          }}
                          fullWidth
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" gutterBottom>
                          월간 유류비
                        </Typography>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={fuelCost}
                          onChange={(e) => {
                            handleFuelCostChange(e);
                            setIsCustomDistance(false);
                          }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">만원</InputAdornment>,
                          }}
                          fullWidth
                        />
                      </Grid>
                      
                      {isCustomDistance && (
                        <Grid item xs={12}>
                          <Button 
                            size="small" 
                            onClick={() => {
                              setIsCustomDistance(false);
                              // 원래 계산된 주행거리로 복원
                              const fuelCostInWon = parseFloat(fuelCost) * 10000;
                              const distance = fuelCostInWon / (fuelPrice * (1 / parseFloat(fuelEfficiency)));
                              setMonthlyDistance(Math.round(distance));
                            }}
                          >
                            기본값으로
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    
                    <Box sx={{ mt: 3, p: 3, bgcolor: '#e8f4fd', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        한 달에 약 <span style={{ color: '#1976d2', fontSize: '1.2em' }}>{Math.round(monthlySavings/10000)}</span>만원 절감
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        (기존 {parseInt(fuelCost).toLocaleString()}만원 → 전기차 {Math.round(evChargingCost/10000).toLocaleString()}만원)
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
                        연간 최대 <span style={{ color: '#1976d2', fontSize: '1.2em' }}>{Math.round(annualSavings/10000).toLocaleString()}</span>만원 절감 가능!
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="body2" color="text.secondary">
                      계산 기준: {monthlyDistance.toLocaleString()}km 월간 주행거리, {fuelEfficiency}km/L 연비(현재), {evEfficiency}km/kWh 전비(전기차)
                    </Typography>
                  </CardContent>
                </Card>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Box>
                  <Button 
                    variant="outlined" 
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    이전 단계
                  </Button>
                  <Button 
                    variant="text"
                    onClick={handleReset}
                  >
                    처음으로
                  </Button>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleNext}
                >
                  다음 단계: 지원금 확인
                </Button>
              </Box>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom align="center">
                전기차 지원금 정보
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>지역 선택</InputLabel>
                    <Select
                      value={region}
                      onChange={handleRegionChange}
                      label="지역 선택"
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return "지역을 선택하세요";
                        }
                        return (
                          <Typography 
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }}
                          >
                            {selected}
                          </Typography>
                        );
                      }}
                    >
                      {regions.map((regionName) => (
                        <MenuItem 
                          key={regionName} 
                          value={regionName}
                        >
                          {regionName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {region && (
                <Card sx={{ mt: 4, bgcolor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {region} 전기차 구매 보조금 정보
                    </Typography>
                    
                    <List>
                      <ListItem 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #e0e0e0',
                          py: 2
                        }}
                      >
                        <ListItemText primary="국고보조금" />
                        <Typography variant="body1" fontWeight="bold">
                          {subsidyData[region]['국고보조금']}만원
                        </Typography>
                      </ListItem>
                      
                      <ListItem 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          borderBottom: '1px solid #e0e0e0',
                          py: 2
                        }}
                      >
                        <ListItemText primary="지자체보조금" />
                        <Typography variant="body1" fontWeight="bold">
                          {subsidyData[region]['지자체보조금']}만원
                        </Typography>
                      </ListItem>
                      
                      <ListItem 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          bgcolor: '#e8f4fd',
                          py: 2
                        }}
                      >
                        <ListItemText 
                          primary="총 지원금액" 
                          primaryTypographyProps={{ fontWeight: 'bold' }}
                        />
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {subsidyData[region]['총 지원금']}만원
                        </Typography>
                      </ListItem>
                    </List>
                    
                    <Box sx={{ mt: 3, p: 3, bgcolor: '#e8f4fd', borderRadius: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        전기차 구매 시 절감 효과
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                        연간 <span style={{ color: '#1976d2' }}>{Math.round(annualSavings/10000).toLocaleString()}</span>만원 절약 + 보조금 <span style={{ color: '#1976d2' }}>{subsidyData[region]['총 지원금']}</span>만원
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                        = 총 <span style={{ color: '#1976d2', fontSize: '1.2em' }}>{Math.round(annualSavings/10000) + subsidyData[region]['총 지원금']}</span>만원 혜택
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                      * 보조금은 차종과 지역 세부 조건에 따라 변동될 수 있습니다.<br />
                      * 최신 정보는 환경부 저공해차 통합누리집(ev.or.kr)에서 확인하세요.
                    </Typography>
                  </CardContent>
                </Card>
              )}
              
              <Box sx={{ mt: 4 }}>
                <Box>
                  <Button 
                    variant="outlined" 
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    이전 단계
                  </Button>
                  <Button 
                    variant="text"
                    onClick={handleReset}
                  >
                    처음으로
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default EVSubsidy; 