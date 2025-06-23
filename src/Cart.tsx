import React from "react";
import { 
  Button, 
  List, 
  ListItem, 
  Typography, 
  Box, 
  IconButton,
  Divider,
  TextField
} from "@mui/material";
import { 
  Add as AddIcon, 
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, updateQuantity, removeFromCart } from "./redux/store";
import { Product } from "./types";

type CartProps = {
  products?: Product[];
  text?: string;
  mode?: "browse" | "confirm";
  onConfirmOrder?: () => void;
};

const Cart: React.FC<CartProps> = ({
  text = "Browse the items in your cart and then click Checkout",
  mode = "browse",
  onConfirmOrder
}) => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.cart.items);
  
  /**
   * calculate total of all the product based on product price and discount
   */
  const calculateTotal = () => {
    return products.reduce((acc, item: Product) => {
      const itemTotal = item.price * item.quantity;
      const itemDiscountedTotal = item.discountPercentage 
        ? itemTotal * (1 - item.discountPercentage / 100)
        : itemTotal;
      
      return {
        subtotal: acc.subtotal + itemTotal,
        discountedTotal: acc.discountedTotal + itemDiscountedTotal
      };
    }, { subtotal: 0, discountedTotal: 0 });
  };
  
  const { subtotal, discountedTotal } = calculateTotal();
  const totalSavings = subtotal - discountedTotal;

  /**
   * update product Quantity based on performed action
   */
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity(productId, newQuantity));
  };

  /**
   * remove selected product
   */
  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  if (products.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        py: 8,
        px: 3
      }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '20px 0'
        }}>
          <ShoppingCartIcon 
            sx={{ 
              fontSize: 120, 
              color: 'action.disabled',
              mb: 3,
              opacity: 0.6
            }} 
          />
          <Typography variant="h5" component="h1" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
        </Box>
        {mode !== "browse" && (
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
        )}
      </Box>
    );
  }

  const handleConfirmClick = () => {
    if (onConfirmOrder) {
      onConfirmOrder();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '16px' }}>
        {mode === "browse" && <h1>Shopping Cart</h1>}
        <p>{text}</p>
      </div>
      <div style={{
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingBottom: '20px'
      }}>
        <List style={{
          flex: '1',
          overflowY: 'auto',
          margin: 0,
          padding: '0 16px'
        }}>
        {products.map((product: Product) => (
          <React.Fragment key={`${product.id}-${product.title}`}>
            <ListItem sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {product.title}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    {product.discountPercentage ? (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="error.main" ml={1}>
                          ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                        </Typography>
                        <Typography 
                          component="span" 
                          color="error.main" 
                          ml={1}
                          fontSize="0.8rem"
                        >
                          {product.discountPercentage}% off
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        ${product.price.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box display="flex" alignItems="center" mt={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                      sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', p: 0.5 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    
                    <TextField
                      value={product.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        handleQuantityChange(product.id, value);
                      }}
                      type="number"
                      inputProps={{ 
                        min: 1,
                        style: { 
                          textAlign: 'center',
                          padding: '8px',
                          width: '60px'
                        } 
                      }}
                      variant="outlined"
                      size="small"
                      sx={{ mx: 1 }}
                    />
                    
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                      sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', p: 0.5 }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveItem(product.id)}
                      sx={{ ml: 2 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        </List>
      </div>
      
      <Box sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
        padding: '16px',
      }}>
        <Box textAlign="right">
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1" color="text.secondary">
              Subtotal ({products.reduce((sum, item) => sum + item.quantity, 0)} items):
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ${subtotal.toFixed(2)}
            </Typography>
          </Box>
          
          {totalSavings > 0 && (
            <>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="success.main">
                  Total Savings:
                </Typography>
                <Typography variant="body2" color="success.main">
                  -${totalSavings.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">
                  Total After Discount:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${discountedTotal.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
          
          <Divider sx={{ my: 1 }} />
          
          {mode === "browse" ? (
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleConfirmClick}
              fullWidth
              sx={{ mt: 2 }}
            >
              Confirm Order
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Cart;
