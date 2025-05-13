import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function OrderConsole() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      orderDate: '2024-03-20',
      status: 'pending',
      customerName: '홍길동',
      options: [
        { id: 1, name: '기본 옵션', price: 100000 },
        { id: 2, name: '프리미엄 옵션', price: 50000 }
      ],
      totalPrice: 0,
      supplyPrice: 0,
      vat: 0
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      orderDate: '2024-03-19',
      status: 'completed',
      customerName: '김철수',
      options: [
        { id: 1, name: '기본 옵션', price: 150000 }
      ],
      totalPrice: 0,
      supplyPrice: 0,
      vat: 0
    }
  ]);

  // 가격 계산 함수
  const calculatePrices = (options) => {
    const totalPrice = options.reduce((sum, option) => sum + option.price, 0);
    const supplyPrice = Math.floor(totalPrice / 1.1);
    const vat = totalPrice - supplyPrice;
    return { totalPrice, supplyPrice, vat };
  };

  // 주문 데이터 업데이트 시 가격 계산
  useEffect(() => {
    setOrders(orders.map(order => {
      const prices = calculatePrices(order.options);
      return { ...order, ...prices };
    }));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (order = null) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOpenDialog(false);
  };

  const handleSaveOrder = (orderData) => {
    if (selectedOrder) {
      // 수정
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...order, ...orderData } : order
      ));
    } else {
      // 새 주문 추가
      const newOrder = {
        id: orders.length + 1,
        orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        options: [],
        ...orderData,
      };
      const prices = calculatePrices(newOrder.options);
      setOrders([...orders, { ...newOrder, ...prices }]);
    }
    handleCloseDialog();
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleAddOption = (orderId) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const newOption = {
          id: order.options.length + 1,
          name: '새 옵션',
          price: 0
        };
        const newOptions = [...order.options, newOption];
        const prices = calculatePrices(newOptions);
        return { ...order, options: newOptions, ...prices };
      }
      return order;
    }));
  };

  const handleUpdateOption = (orderId, optionId, field, value) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const newOptions = order.options.map(option => 
          option.id === optionId ? { ...option, [field]: value } : option
        );
        const prices = calculatePrices(newOptions);
        return { ...order, options: newOptions, ...prices };
      }
      return order;
    }));
  };

  const handleDeleteOption = (orderId, optionId) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const newOptions = order.options.filter(option => option.id !== optionId);
        const prices = calculatePrices(newOptions);
        return { ...order, options: newOptions, ...prices };
      }
      return order;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          주문 관리 콘솔
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
        >
          새 주문
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>주문번호</TableCell>
              <TableCell>등록일</TableCell>
              <TableCell>처리상태</TableCell>
              <TableCell>고객명</TableCell>
              <TableCell>옵션</TableCell>
              <TableCell>총액</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        order.status === 'pending' ? '대기중' :
                        order.status === 'completed' ? '완료' : '취소'
                      }
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {order.options.map((option) => (
                        <Typography key={option.id} variant="body2">
                          {option.name} ({option.price.toLocaleString()}원)
                        </Typography>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{order.totalPrice.toLocaleString()}원</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(order)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteOrder(order.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행 수"
        />
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {selectedOrder ? '주문 수정' : '새 주문'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="고객명"
                  fullWidth
                  defaultValue={selectedOrder?.customerName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>처리상태</InputLabel>
                  <Select
                    label="처리상태"
                    defaultValue={selectedOrder?.status || 'pending'}
                  >
                    <MenuItem value="pending">대기중</MenuItem>
                    <MenuItem value="completed">완료</MenuItem>
                    <MenuItem value="cancelled">취소</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">옵션 목록</Typography>
              {selectedOrder && (
                <Button
                  startIcon={<AddCircleIcon />}
                  onClick={() => handleAddOption(selectedOrder.id)}
                >
                  옵션 추가
                </Button>
              )}
            </Box>

            {selectedOrder && (
              <List>
                {selectedOrder.options.map((option) => (
                  <ListItem key={option.id}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={5}>
                        <TextField
                          label="옵션명"
                          fullWidth
                          value={option.name}
                          onChange={(e) => handleUpdateOption(selectedOrder.id, option.id, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          label="가격"
                          fullWidth
                          type="number"
                          value={option.price}
                          onChange={(e) => handleUpdateOption(selectedOrder.id, option.id, 'price', parseInt(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteOption(selectedOrder.id, option.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            )}

            {selectedOrder && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">공급가액</Typography>
                    <Typography variant="h6">{selectedOrder.supplyPrice.toLocaleString()}원</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">VAT</Typography>
                    <Typography variant="h6">{selectedOrder.vat.toLocaleString()}원</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">총액</Typography>
                    <Typography variant="h6">{selectedOrder.totalPrice.toLocaleString()}원</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button 
            onClick={() => handleSaveOrder({
              customerName: selectedOrder?.customerName || '새 고객',
              status: selectedOrder?.status || 'pending',
              options: selectedOrder?.options || [],
            })}
            variant="contained"
            sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OrderConsole; 