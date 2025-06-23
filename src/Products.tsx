import React, { useEffect, useState, useRef } from 'react';
import './Products.css';
import { getProducts } from './services/productService';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  CardMedia,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addToCart } from './redux/store';
import Cart from './Cart';


export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  discountPercentage?: number;
  description?: string;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  images?: string[];
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const effectRan = useRef(false);

  useEffect(() => {
    // Prevent double call in development with React.StrictMode
    if (effectRan.current === false) {
      /**
       * get a product list
       */
      const fetchProducts = async () => {
        try {
          const products = await getProducts();
          setProducts(products);
        } catch (err) {
          setError('Failed to fetch products');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  /**
   * Update the store for selected item. if product is already exist it update quantity, otherwise will add new product in store
   * @param product selected product
   */
  const handleAddToCart = (product: Product) => {
    const existingProduct = cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      dispatch(addToCart({
        ...existingProduct,
        quantity: existingProduct.quantity + 1
      }));
    } else {
      dispatch(addToCart({
        ...product,
        quantity: 1
      }));
    }
  };

  if (loading || error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        {loading && (
          <>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="textSecondary">
              Loading products...
            </Typography>
          </>
        )}

        {!loading && error && (
          <>
            <Typography variant="h6" color="textSecondary">
              Error: {error}
            </Typography>
          </>
        )}
      </Box>
    );
  }

  return (
    <div className="products-container">
      {/* Products Section */}
      <div className="products-list">
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <Card className="product-card">
                <div className="product-image-container">
                  <CardMedia
                    component="img"
                    className="product-image"
                    image={product.thumbnail}
                    alt={product.title}
                  />
                </div>
                <CardContent className="product-content">
                  <Typography className="product-title">
                    {product.title}
                  </Typography>
                  <Box className="product-price-container">
                    {product.discountPercentage ? (
                      <Box display="flex" alignItems="center">
                        <span className="original-price">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="discounted-price">
                          ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="discount-badge">
                          {product.discountPercentage}% off
                        </span>
                      </Box>
                    ) : (
                      <span className="regular-price">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </Box>
                </CardContent>
                <CardActions className="card-actions">
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      
      {/* Cart Section */}
      <div className="cart-section">
        <Cart products={cartItems} />
      </div>
    </div>
  );
};

export default Products;
