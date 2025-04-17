import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Grid } from "@mui/material";

export default function PrettyPriceChecker() {
  // 공급가 기준 계산기 상태
  const [supplyBasePrice, setSupplyBasePrice] = useState("");
  const [supplyDiscountRate, setSupplyDiscountRate] = useState("");
  const [supplyResult, setSupplyResult] = useState(null);

  // 총액 기준 계산기 상태
  const [totalBasePrice, setTotalBasePrice] = useState("");
  const [totalDiscountRate, setTotalDiscountRate] = useState("");
  const [totalResult, setTotalResult] = useState(null);

  // 세 번째 계산기 상태
  const [splitBasePrice, setSplitBasePrice] = useState("");
  const [splitDiscountRate, setSplitDiscountRate] = useState("");
  const [splitResult, setSplitResult] = useState(null);

  const validate = (basePrice, discountRate) => {
    const basePriceNum = Number(basePrice);
    const discountRateNum = Number(discountRate);
    return basePrice && basePriceNum > 0 && discountRate && discountRateNum >= 0 && discountRateNum <= 100;
  };

  const calculateSupply = () => {
    const basePriceNum = Number(supplyBasePrice);
    const discountRateNum = Number(supplyDiscountRate);
    const discountAmount = Math.round(basePriceNum * (discountRateNum / 100));
    const discountedPrice = basePriceNum - discountAmount;
    const vat = Math.round(discountedPrice * 0.1);
    const total = discountedPrice + vat;
    const pretty = total % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨";

    setSupplyResult({ basePrice: basePriceNum, discountAmount, discountedPrice, vat, total, pretty });
  };

  const calculateTotal = () => {
    const basePriceNum = Number(totalBasePrice);
    const discountRateNum = Number(totalDiscountRate);
    
    // 입력된 금액을 공급가액과 부가세로 분리
    const supplyPrice = Math.round(basePriceNum / 1.1);
    const vat = basePriceNum - supplyPrice;
    const subtotal = supplyPrice + vat;
    
    // 할인 계산
    const discountAmount = Math.round(subtotal * (discountRateNum / 100));
    const total = subtotal - discountAmount;
    const pretty = total % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨";

    setTotalResult({ 
      basePrice: basePriceNum,
      supplyPrice,
      vat,
      subtotal,
      discountAmount,
      total,
      pretty
    });
  };

  const calculateSplit = () => {
    const basePriceNum = Number(splitBasePrice);
    const discountRateNum = Number(splitDiscountRate);
    
    // 입력된 금액을 공급가액과 부가세로 분리
    const originalSupplyPrice = Math.round(basePriceNum / 1.1);
    
    // 공급가액에서 할인 계산
    const discountAmount = Math.round(originalSupplyPrice * (discountRateNum / 100));
    const discountedSupplyPrice = originalSupplyPrice - discountAmount;
    
    // 할인된 공급가액에 대한 부가세 계산
    const vat = basePriceNum - discountedSupplyPrice;
    const total = discountedSupplyPrice + vat;

    setSplitResult({
      originalSupplyPrice,
      discountAmount,
      discountedSupplyPrice,
      vat,
      total,
      pretty: total % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨"
    });
  };

  const ReceiptRow = ({ label, amount, isDiscount, isTotal }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <Typography variant="body2" style={{ color: isDiscount ? '#2962ff' : 'inherit' }}>{label}</Typography>
      <Typography variant="body2" style={{ color: isDiscount ? '#2962ff' : 'inherit', fontWeight: isTotal ? 'bold' : 'normal' }}>
        {isDiscount ? '-' : ''}{amount.toLocaleString()}원
      </Typography>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Typography variant="h5">공급가 기준 계산기</Typography>
              <Typography variant="body2" color="textSecondary">
                공급가액에서 할인율을 적용한 후 VAT를 계산합니다.
              </Typography>
              <TextField 
                label="공급가액 (원)" 
                type="number" 
                value={supplyBasePrice} 
                onChange={(e) => setSupplyBasePrice(e.target.value)} 
                fullWidth 
              />
              <TextField 
                label="할인율 (%)" 
                type="number" 
                value={supplyDiscountRate} 
                onChange={(e) => setSupplyDiscountRate(e.target.value)} 
                fullWidth 
              />
              <Button 
                variant="contained" 
                onClick={calculateSupply} 
                disabled={!validate(supplyBasePrice, supplyDiscountRate)} 
                fullWidth
              >
                계산하기
              </Button>

              {supplyResult && (
                <div style={{ marginTop: 16, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
                  <Typography variant="subtitle1">요금 내역</Typography>
                  <ReceiptRow label="공급가액" amount={supplyResult.basePrice} />
                  <ReceiptRow 
                    label={`비즈니스 할인 ${supplyDiscountRate}%`} 
                    amount={supplyResult.discountAmount} 
                    isDiscount={true} 
                  />
                  <ReceiptRow 
                    label="할인 후 공급가액" 
                    amount={supplyResult.discountedPrice} 
                    isTotal={true} 
                  />
                  <ReceiptRow label="부가세 (VAT)" amount={supplyResult.vat} />
                  <div style={{ 
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '2px solid #eee'
                  }}>
                    <ReceiptRow 
                      label="합계" 
                      amount={supplyResult.total} 
                      isTotal={true} 
                    />
                  </div>
                  <Typography 
                    align="right" 
                    style={{ 
                      color: supplyResult.pretty.includes('예쁨') ? '#4caf50' : '#f44336', 
                      marginTop: 8 
                    }}
                  >
                    {supplyResult.pretty}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Typography variant="h5">총액 기준 계산기</Typography>
              <Typography variant="body2" color="textSecondary">
                입력된 금액을 공급가액과 부가세로 분리한 후, 소계에서 할인을 적용합니다.
              </Typography>
              <TextField 
                label="총액 (원)" 
                type="number" 
                value={totalBasePrice} 
                onChange={(e) => setTotalBasePrice(e.target.value)} 
                fullWidth 
                helperText="VAT가 포함된 금액을 입력하세요"
              />
              <TextField 
                label="할인율 (%)" 
                type="number" 
                value={totalDiscountRate} 
                onChange={(e) => setTotalDiscountRate(e.target.value)} 
                fullWidth 
              />
              <Button 
                variant="contained" 
                onClick={calculateTotal} 
                disabled={!validate(totalBasePrice, totalDiscountRate)} 
                fullWidth
              >
                계산하기
              </Button>

              {totalResult && (
                <div style={{ marginTop: 16, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
                  <Typography variant="subtitle1">요금 내역</Typography>
                  <ReceiptRow label="공급가액" amount={totalResult.supplyPrice} />
                  <ReceiptRow label="부가세 (VAT)" amount={totalResult.vat} />
                  <ReceiptRow 
                    label="소계" 
                    amount={totalResult.subtotal} 
                    isTotal={true} 
                  />
                  <ReceiptRow 
                    label={`비즈니스 할인 ${totalDiscountRate}%`} 
                    amount={totalResult.discountAmount} 
                    isDiscount={true} 
                  />
                  <div style={{ 
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '2px solid #eee'
                  }}>
                    <ReceiptRow 
                      label="합계" 
                      amount={totalResult.total} 
                      isTotal={true} 
                    />
                  </div>
                  <Typography 
                    align="right" 
                    style={{ 
                      color: totalResult.pretty.includes('예쁨') ? '#4caf50' : '#f44336', 
                      marginTop: 8 
                    }}
                  >
                    {totalResult.pretty}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Typography variant="h5">총액(공급가액에서 할인)</Typography>
              <Typography variant="body2" color="textSecondary">
                총액을 공급가액으로 분리한 후, 공급가액에 할인을 적용합니다.
              </Typography>
              <TextField 
                label="총액 (원)" 
                type="number" 
                value={splitBasePrice} 
                onChange={(e) => setSplitBasePrice(e.target.value)} 
                fullWidth 
                helperText="VAT가 포함된 금액을 입력하세요"
              />
              <TextField 
                label="할인율 (%)" 
                type="number" 
                value={splitDiscountRate} 
                onChange={(e) => setSplitDiscountRate(e.target.value)} 
                fullWidth 
              />
              <Button 
                variant="contained" 
                onClick={calculateSplit} 
                disabled={!validate(splitBasePrice, splitDiscountRate)} 
                fullWidth
              >
                계산하기
              </Button>

              {splitResult && (
                <div style={{ marginTop: 16, background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
                  <Typography variant="subtitle1">요금내역</Typography>
                  <ReceiptRow label="공급가액" amount={splitResult.originalSupplyPrice} />
                  <ReceiptRow 
                    label={`비즈니스 할인 ${splitDiscountRate}%`} 
                    amount={splitResult.discountAmount} 
                    isDiscount={true} 
                  />
                  <ReceiptRow 
                    label="할인 후 공급가액" 
                    amount={splitResult.discountedSupplyPrice} 
                  />
                  <ReceiptRow label="부가세 (VAT)" amount={splitResult.vat} />
                  <div style={{ 
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '2px solid #eee'
                  }}>
                    <ReceiptRow 
                      label="합계" 
                      amount={splitResult.total} 
                      isTotal={true} 
                    />
                  </div>
                  <Typography 
                    align="right" 
                    style={{ 
                      marginTop: 8,
                      color: splitResult.total % 10 === 0 ? '#4caf50' : '#f44336'
                    }}
                  >
                    {splitResult.total % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨"}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
} 