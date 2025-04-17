import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Grid } from "@mui/material";

export default function PrettyPriceChecker() {
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

  /* ────────── 계산 함수들 ────────── */
  const calculateSupply = () => {
    const base = Number(supplyBasePrice);
    const rate = Number(supplyDiscountRate);
    const discount = Math.round(base * (rate / 100));
    const discounted = base - discount;
    const vat = Math.round(discounted * 0.1);
    const total = discounted + vat;
    setSupplyResult({
      basePrice: base,
      discountAmount: discount,
      discountedPrice: discounted,
      vat,
      total,
      pretty: total % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨",
    });
  };

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
      pretty: total % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨",
    });
  };

  const calculateSplit = () => {
    const base = Number(splitBasePrice);
    const rate = Number(splitDiscountRate);
    const originalSupply = Math.round(base / 1.1);
    const discount = Math.round(originalSupply * (rate / 100));
    const discountedSupply = originalSupply - discount;
    const vat = Math.round(discountedSupply * 0.1);
    const calcTotal = discountedSupply + vat;
    const roundedTotal = Math.floor(calcTotal / 10) * 10;
    const adjustment = Math.abs(base - roundedTotal) < 10 ? base - roundedTotal : 0;
    setSplitResult({
      originalSupplyPrice: originalSupply,
      discountAmount: discount,
      discountedSupplyPrice: discountedSupply,
      vat,
      adjustmentFee: adjustment,
      total: base,
    });
  };

  /* ────────── NEW: 최종가격 역산 ────────── */
  const calculateFinalReverse = () => {
    const final = Number(finalPrice);
    const rate = Number(finalDiscountRate);
    const rateFactor = 1 - rate / 100;
    if (rateFactor <= 0) return; // 할인율 100% 이상 방지

    // 1) 소계(할인 전) 역추적
    const rawSubtotal = final / rateFactor;
    const subtotal = Math.round(rawSubtotal);

    // 2) 공급가·부가세 분리
    const supplyPrice = Math.round(subtotal / 1.1);
    const vat = subtotal - supplyPrice;

    // 3) 할인액, 재계산한 총액 및 조정비
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
      pretty: final % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨",
    });
  };

  /* ────────── 공통 영수증 행 ────────── */
  const ReceiptRow = ({ label, amount, isDiscount, isTotal }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
      <Typography variant="body2" style={{ color: isDiscount ? "#2962ff" : "inherit" }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        style={{
          color: isDiscount ? "#2962ff" : "inherit",
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
              <Typography variant="h5">공급가 기준 계산기</Typography>
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
                  <ReceiptRow label="공급가액" amount={supplyResult.basePrice} />
                  <ReceiptRow
                    label={`비즈니스 할인 ${supplyDiscountRate}%`}
                    amount={supplyResult.discountAmount}
                    isDiscount
                  />
                  <ReceiptRow
                    label="할인 후 공급가액"
                    amount={supplyResult.discountedPrice}
                    isTotal
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
                      color: supplyResult.pretty.includes("예쁨") ? "#4caf50" : "#f44336",
                      marginTop: 8,
                    }}
                  >
                    {supplyResult.pretty}
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
                      color: totalResult.pretty.includes("예쁨") ? "#4caf50" : "#f44336",
                      marginTop: 8,
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
                      color: splitResult.total % 10 === 0 ? "#4caf50" : "#f44336",
                    }}
                  >
                    {splitResult.total % 10 === 0 ? "✅ 예쁨" : "❌ 안 예쁨"}
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