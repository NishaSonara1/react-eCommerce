import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, clearCart } from './redux/store';
import Cart from "./Cart";

const Checkout: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const [orderPlaced, setOrderPlaced] = React.useState(false);

  const handleConfirmOrder = () => {
    setOrderPlaced(true);
    dispatch(clearCart());
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="body1" paragraph>
          Your order has been placed successfully.
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      mt: 4,
      height: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <h1 style={{ marginTop: 0 }}>Checkout</h1>
      {cartItems.length > 0 ? (
        <div style={{ 
          flex: 1, 
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Cart 
            text="Review your order and click Confirm Order to complete your purchase" 
            mode="confirm"
            onConfirmOrder={handleConfirmOrder}
          />
        </div>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
          <ShoppingCartIcon 
            sx={{ 
              fontSize: 120, 
              color: 'action.disabled',
              mb: 3,
              opacity: 0.6
            }} 
          />
          <Typography variant="h5" component="h2" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, px: 4, py: 1.5 }}
          >
            Browse Products
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Checkout;