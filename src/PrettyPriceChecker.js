import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, Grid, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * PrettyPriceChecker
 * - 공급가 기준: 총액이 0(또는 원하는 자리수)으로 예쁘게 끝나도록 0~99원 범위 내에서 최소 추가 할인 자동 탐색
 * - PRETTY_MOD 값을 10(1의 자리가 0) ‑or‑ 100(두 자리 00) 등으로 바꾸면 규칙을 손쉽게 변경할 수 있다.
 */
export default function PrettyPriceChecker() {
  const navigate = useNavigate();

  /* ──────────① 공급가 기준────────── */
  const [supplyBasePrice, setSupplyBasePrice] = useState("");
  const [supplyDiscountRate, setSupplyDiscountRate] = useState("");
  const [supplyResult, setSupplyResult] = useState(null);

  /* ──────────② 총액 기준────────── */
  const [totalBasePrice, setTotalBasePrice] = useState("");
  const [totalDiscountRate, setTotalDiscountRate] = useState("");
  const [totalResult, setTotalResult] = useState(null);

  /* ──────────③ 총액(공급가 할인)────────── */
  const [splitBasePrice, setSplitBasePrice] = useState("");
  const [splitDiscountRate, setSplitDiscountRate] = useState("");
  const [splitResult, setSplitResult] = useState(null);

  /* ──────────④ 최종가격 역산────────── */
  const [finalPrice, setFinalPrice] = useState("");
  const [finalDiscountRate, setFinalDiscountRate] = useState("");
  const [finalResult, setFinalResult] = useState(null);

  // "예쁜" 금액 정의 (10 → 1의 자리가 0, 100 → 두 자리가 00)
  const PRETTY_MOD = 10;

  /* ────────── 공통 검증 ────────── */
  const validate = (basePrice, discountRate) => {
    const basePriceNum = Number(basePrice);
    const discountRateNum = Number(discountRate);
    return (
      basePrice &&
      basePriceNum > 0 &&
      discountRate &&
      discountRateNum >= 0 &&
      discountRateNum < 100
    );
  };

  /* ────────── ① 공급가 기준 계산 ────────── */
  const calculateSupply = () => {
    const base = Number(supplyBasePrice);
    const rate = Number(supplyDiscountRate);

    // 1) 기본 비즈니스 할인
    const businessDiscount = Math.round(base * (rate / 100));

    // 2) 할인 금액을 100원 단위로 올림 처리
    const rawTotalDiscount = businessDiscount;
    const roundedTotalDiscount = Math.ceil(rawTotalDiscount / 100) * 100;
    const additionalDiscount = roundedTotalDiscount - businessDiscount;

    // 3) 결과 계산
    const finalDiscounted = base - roundedTotalDiscount;
    const finalVat = Math.round(finalDiscounted * 0.1);
    const finalTotal = finalDiscounted + finalVat;

    setSupplyResult({
      basePrice: base,
      businessDiscountRate: rate,
      businessDiscount,
      additionalDiscount,
      additionalDiscountRate: (additionalDiscount / base) * 100,
      totalDiscount: roundedTotalDiscount,
      discountedPrice: finalDiscounted,
      vat: finalVat,
      total: finalTotal,
      pretty: finalTotal % PRETTY_MOD === 0,
    });
  };

  /* ────────── ② 총액 기준 계산 (변경 없음) ────────── */
  const calculateTotal = () => {
    const base = Number(totalBasePrice);
    const rate = Number(totalDiscountRate);
    const supplyPrice = Math.round(base / 1.1);
    const vat = base - supplyPrice;
    const subtotal = supplyPrice + vat;
    const discount = Math.round(subtotal * (rate / 100));
    const total = subtotal - discount;
    setTotalResult({
      supplyPrice,
      vat,
      subtotal,
      discountAmount: discount,
      total,
      pretty: total % PRETTY_MOD === 0 ? "✅ 예쁨" : "❌ 안 예쁨",
    });
  };

  /* ────────── ③ 총액(공급가 할인) 계산 (변경 없음) ────────── */
  const calculateSplit = () => {
    const base = Number(splitBasePrice);
    const rate = Number(splitDiscountRate);
    const originalSupply = Math.round(base / 1.1);
    const discount = Math.round(originalSupply * (rate / 100));
    const discountedSupply = originalSupply - discount;
    const vat = Math.round(discountedSupply * 0.1);
    const calcTotal = discountedSupply + vat;
    const roundedTotal = Math.floor(calcTotal / PRETTY_MOD) * PRETTY_MOD;
    const adjustment = Math.abs(base - roundedTotal) < PRETTY_MOD ? base - roundedTotal : 0;
    setSplitResult({
      originalSupplyPrice: originalSupply,
      discountAmount: discount,
      discountedSupplyPrice: discountedSupply,
      vat,
      adjustmentFee: adjustment,
      total: base,
    });
  };

  /* ────────── ④ 최종가격 역산 계산 (변경 없음) ────────── */
  const calculateFinalReverse = () => {
    const final = Number(finalPrice);
    const rate = Number(finalDiscountRate);
    const rateFactor = 1 - rate / 100;
    if (rateFactor <= 0) return; // 할인율 100% 이상 방지

    const rawSubtotal = final / rateFactor;
    const subtotal = Math.round(rawSubtotal);
    const supplyPrice = Math.round(subtotal / 1.1);
    const vat = subtotal - supplyPrice;
    const discount = Math.round(subtotal * (rate / 100));
    const recalculatedTotal = subtotal - discount;
    const adjustment = final - recalculatedTotal;

    setFinalResult({
      supplyPrice,
      vat,
      subtotal,
      discountAmount: discount,
      adjustmentFee: adjustment,
      total: final,
      pretty: final % PRETTY_MOD === 0 ? "✅ 예쁨" : "❌ 안 예쁨",
    });
  };

  /* ────────── 공통 ReceiptRow 컴포넌트 ────────── */
  const ReceiptRow = ({ label, amount, isDiscount, isTotal, subText, color }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
      <div>
        <Typography variant="body2" style={{ color: color || (isDiscount ? "#2962ff" : "inherit") }}>
          {label}
        </Typography>
        {subText && (
          <Typography variant="caption" style={{ color: "#666", display: "block", marginTop: "2px" }}>
            {subText}
          </Typography>
        )}
      </div>
      <Typography
        variant="body2"
        style={{
          color: color || (isDiscount ? "#2962ff" : "inherit"),
          fontWeight: isTotal ? "bold" : "normal",
        }}
      >
        {isDiscount ? "-" : ""}
        {amount.toLocaleString()}원
      </Typography>
    </div>
  );

  /* ────────── 렌더링 ────────── */
  return (
    <div style={{ maxWidth: "100%", margin: "40px auto", padding: "0 40px" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/')} 
          aria-label="back to home" 
          size="large"
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h4" component="h1">
          가격 계산기
        </Typography>
      </Box>
      
      <Grid container spacing={4} justifyContent="center">
        {/* ① 공급가 기준 */}
        <Grid item>
          <Card style={{ width: 320, height: 600 }}>
            <CardContent style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "100%",
              boxSizing: "border-box",
              overflow: "auto"
            }}>
              <Typography variant="h5">공급가 기준 계산기(0단위 총액)</Typography>
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
                <div style={{ marginTop: 16, background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
                  <Typography variant="subtitle1">요금 내역</Typography>
                  <Typography variant="caption" style={{ color: "#666", display: "block", marginBottom: "8px" }}>
                    사용자 입력: {supplyBasePrice.toLocaleString()}원 (공급가), {supplyDiscountRate}% (할인율)
                  </Typography>

                  <ReceiptRow label="공급가액" amount={supplyResult.basePrice} />

                  <ReceiptRow
                    label={`비즈니스 할인 ${supplyResult.businessDiscountRate}%`}
                    amount={supplyResult.businessDiscount}
                    isDiscount
                  />

                  <ReceiptRow
                    label="추가 할인"
                    amount={supplyResult.additionalDiscount}
                    isDiscount
                    subText={`실제 추가 할인율: ${supplyResult.additionalDiscountRate.toFixed(2)}%`}
                  />

                  <ReceiptRow
                    label="총 할인 금액"
                    amount={supplyResult.totalDiscount}
                    isDiscount
                    isTotal
                  />

                  <ReceiptRow
                    label="할인 후 공급가액"
                    amount={supplyResult.discountedPrice}
                  />

                  <ReceiptRow label="부가세 (VAT)" amount={supplyResult.vat} />

                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "2px solid #eee",
                    }}
                  >
                    <ReceiptRow label="합계" amount={supplyResult.total} isTotal />
                  </div>
                  <Typography
                    align="right"
                    style={{
                      marginTop: 8,
                      color: supplyResult.pretty ? "#4caf50" : "#f44336",
                    }}
                  >
                    {supplyResult.pretty ? "✅ 예쁨" : "❌ 안 예쁨"}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ② 총액 기준 */}
        <Grid item>
          <Card style={{ width: 320, height: 600 }}>
            <CardContent style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "100%",
              boxSizing: "border-box",
              overflow: "auto"
            }}>
              <Typography variant="h5">총액 기준 계산기</Typography>
              <TextField
                label="총액 (원)"
                type="number"
                value={totalBasePrice}
                onChange={(e) => setTotalBasePrice(e.target.value)}
                fullWidth
                helperText="VAT 포함 금액 입력"
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
                <div style={{ marginTop: 16, background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
                  <Typography variant="subtitle1">요금 내역</Typography>
                  <ReceiptRow label="공급가액" amount={totalResult.supplyPrice} />
                  <ReceiptRow label="부가세 (VAT)" amount={totalResult.vat} />
                  <ReceiptRow label="소계" amount={totalResult.subtotal} isTotal />
                  <ReceiptRow
                    label={`비즈니스 할인 ${totalDiscountRate}%`}
                    amount={totalResult.discountAmount}
                    isDiscount
                  />
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "2px solid #eee",
                    }}
                  >
                    <ReceiptRow label="합계" amount={totalResult.total} isTotal />
                  </div>
                  <Typography
                    align="right"
                    style={{
                      marginTop: 8,
                      color: totalResult.pretty.includes("예쁨") ? "#4caf50" : "#f44336",
                    }}
                  >
                    {totalResult.pretty}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ③ 총액(공급가 할인) */}
        <Grid item>
          <Card style={{ width: 320, height: 600 }}>
            <CardContent style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "100%",
              boxSizing: "border-box",
              overflow: "auto"
            }}>
              <Typography variant="h5">총액(공급가 할인)</Typography>
              <TextField
                label="총액 (원)"
                type="number"
                value={splitBasePrice}
                onChange={(e) => setSplitBasePrice(e.target.value)}
                fullWidth
                helperText="VAT 포함 금액 입력"
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
                <div style={{ marginTop: 16, background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
                  <Typography variant="subtitle1">요금 내역</Typography>
                  <ReceiptRow label="공급가액" amount={splitResult.originalSupplyPrice} />
                  <ReceiptRow
                    label={`비즈니스 할인 ${splitDiscountRate}%`}
                    amount={splitResult.discountAmount}
                    isDiscount
                  />
                  <ReceiptRow label="할인 후 공급가액" amount={splitResult.discountedSupplyPrice} />
                  <ReceiptRow label="부가세 (VAT)" amount={splitResult.vat} />
                  {splitResult.adjustmentFee !== 0 && (
                    <ReceiptRow label="조정비" amount={splitResult.adjustmentFee} />
                  )}
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "2px solid #eee",
                    }}
                  >
                    <ReceiptRow label="합계" amount={splitResult.total} isTotal />
                  </div>
                  <Typography
                    align="right"
                    style={{
                      marginTop: 8,
                      color: splitResult.total % PRETTY_MOD === 0 ? "#4caf50" : "#f44336",
                    }}
                  >
                    {splitResult.total % PRETTY_MOD === 0 ? "✅ 예쁨" : "❌ 안 예쁨"}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ④ 최종가격 역산 */}
        <Grid item>
          <Card style={{ width: 320, height: 600 }}>
            <CardContent style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "100%",
              boxSizing: "border-box",
              overflow: "auto"
            }}>
              <Typography variant="h5">최종가격 역산 계산기</Typography>
              <TextField
                label="최종가격 (원)"
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                fullWidth
                helperText="실제 청구·결제된 금액"
              />
              <TextField
                label="할인율 (%)"
                type="number"
                value={finalDiscountRate}
                onChange={(e) => setFinalDiscountRate(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={calculateFinalReverse}
                disabled={!validate(finalPrice, finalDiscountRate)}
                fullWidth
              >
                계산하기
              </Button>
              {finalResult && (
                <div style={{ marginTop: 16, background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
                  <Typography variant="subtitle1">요금 내역</Typography>
                  <ReceiptRow label="공급가액" amount={finalResult.supplyPrice} />
                  <ReceiptRow label="부가세 (VAT)" amount={finalResult.vat} />
                  <ReceiptRow label="소계" amount={finalResult.subtotal} isTotal />
                  <ReceiptRow
                    label={`비즈니스 할인 ${finalDiscountRate}%`}
                    amount={finalResult.discountAmount}
                    isDiscount
                  />
                  {finalResult.adjustmentFee !== 0 && (
                    <ReceiptRow label="조정비" amount={finalResult.adjustmentFee} />
                  )}
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "2px solid #eee",
                    }}
                  >
                    <ReceiptRow label="합계" amount={finalResult.total} isTotal />
                  </div>
                  <Typography
                    align="right"
                    style={{
                      marginTop: 8,
                      color: finalResult.pretty.includes("예쁨") ? "#4caf50" : "#f44336",
                    }}
                  >
                    {finalResult.pretty}
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