import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle2, Wallet, Smartphone, CreditCard, X, Receipt, BookOpen } from 'lucide-react';
import { customers as INITIAL_CUSTOMERS } from '../data/businessData';

interface POSCustomer {
  id: string;
  name: string;
  phone: string;
  segment: string;
  totalSpent: number;
  visits: number;
  avgSpend: number;
  lastVisit: string;
  loyaltyPoints: number;
  pendingDue: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  icon: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 'pos_1', name: 'Aashirvaad Atta 5kg', price: 245, stock: 22, icon: '🌾' },
  { id: 'pos_2', name: 'Amul Butter 500g', price: 280, stock: 10, icon: '🧈' },
  { id: 'pos_3', name: 'Amul Milk 500ml', price: 28, stock: 45, icon: '🥛' },
  { id: 'pos_4', name: 'Basmati Rice 5kg', price: 385, stock: 14, icon: '🍚' },
  { id: 'pos_5', name: 'Coca Cola 2L', price: 88, stock: 3, icon: '🥤' },
  { id: 'pos_6', name: 'Colgate Toothpaste 100g', price: 58, stock: 20, icon: '🪥' },
  { id: 'pos_7', name: 'Dettol Soap 75g', price: 38, stock: 25, icon: '🧼' },
  { id: 'pos_8', name: 'Fortune Sunflower Oil 1L', price: 148, stock: 17, icon: '🧴' },
  { id: 'pos_9', name: 'Lay\'s Classic 90g', price: 40, stock: 40, icon: '🥔' },
  { id: 'pos_10', name: 'Maggi 2-Min Noodles 12pk', price: 168, stock: 8, icon: '🍜' },
  { id: 'pos_11', name: 'Nescafe Classic 50g', price: 198, stock: 9, icon: '☕' },
  { id: 'pos_12', name: 'Parle-G Biscuits 800g', price: 62, stock: 35, icon: '🍪' },
  { id: 'pos_13', name: 'Red Label Tea 500g', price: 178, stock: 12, icon: '🍵' },
  { id: 'pos_14', name: 'Surf Excel 500g', price: 145, stock: 15, icon: '🧼' },
  { id: 'pos_15', name: 'Tata Salt 1kg', price: 22, stock: 29, icon: '🧂' }
];

interface CartItem {
  product: Product;
  quantity: number;
}

export function POSBillingView() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vyapaar-pos-products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'udhaar'>('cash');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{
    id: string;
    items: CartItem[];
    total: number;
    method: 'cash' | 'upi' | 'card' | 'udhaar';
    time: string;
  } | null>(null);

  const [customersList, setCustomersList] = useState<POSCustomer[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('vyapaar-customers');
    if (saved) return JSON.parse(saved);
    const initial = INITIAL_CUSTOMERS.map((c, i) => ({
      ...c,
      pendingDue: i % 3 === 0 ? 850 : i % 3 === 1 ? 0 : 1200
    }));
    localStorage.setItem('vyapaar-customers', JSON.stringify(initial));
    return initial;
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('walk-in');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('vyapaar-pos-products', JSON.stringify(products));
  }, [products]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          const product = products.find(p => p.id === productId);
          if (!product) return item;
          if (newQty <= 0) return null;
          if (newQty > product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const completeCheckout = (methodOverride?: 'cash' | 'upi' | 'card' | 'udhaar') => {
    const finalMethod = methodOverride || paymentMethod;

    // Deduct stock levels in state
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
    });

    // Update today's total sales in localStorage
    const savedSales = localStorage.getItem('vyapaar-today-sales');
    const currentSales = savedSales ? parseFloat(savedSales) : 0;
    const newSalesTotal = currentSales + cartTotal;
    localStorage.setItem('vyapaar-today-sales', newSalesTotal.toString());

    // Update customer pending due if payment method is udhaar
    if (finalMethod === 'udhaar' && selectedCustomerId !== 'walk-in') {
      setCustomersList(prevList => {
        const updated = prevList.map(c => {
          if (c.id === selectedCustomerId) {
            return {
              ...c,
              pendingDue: c.pendingDue + cartTotal,
              totalSpent: c.totalSpent + cartTotal,
              visits: c.visits + 1,
              lastVisit: 'Today'
            };
          }
          return c;
        });
        localStorage.setItem('vyapaar-customers', JSON.stringify(updated));
        return updated;
      });
    }

    // Record receipt details
    const receiptId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const receiptTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastReceipt({
      id: receiptId,
      items: [...cart],
      total: cartTotal,
      method: finalMethod,
      time: receiptTime
    });

    // Clear cart and trigger success UI
    setCart([]);
    setCheckoutSuccess(true);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setErrorMsg(null);

    if (paymentMethod === 'udhaar' && selectedCustomerId === 'walk-in') {
      setErrorMsg('Please select a customer to log Udhaar (Credit) transaction.');
      return;
    }

    if (paymentMethod === 'upi') {
      setUpiModalOpen(true);
    } else {
      completeCheckout();
    }
  };

  const handleSendWhatsAppReport = () => {
    if (!lastReceipt) return;
    const customer = customersList.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    const cleanPhone = customer.phone.replace(/[^\d]/g, '');
    const itemsText = lastReceipt.items
      .map(item => `- ${item.product.name} (x${item.quantity}) - ₹${item.product.price * item.quantity}`)
      .join('\n');

    const message = `Dear ${customer.name},

Your purchase of ₹${lastReceipt.total} at Bunny Kirana has been added to your Bahi Khata (Udhaar balance).

Items:
${itemsText}

Previous Pending Due: ₹${customer.pendingDue - lastReceipt.total}
New Pending Due Balance: ₹${customer.pendingDue}

Please clear the dues at your earliest convenience.

Regards,
Bunny Kirana (VyapaarAI)`;

    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-6rem)]">
      {/* Catalog panel */}
      <div className="lg:col-span-8 space-y-4 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">QUICK BILLING · त्वरित बिलिंग</span>
            <h1 className="font-serif text-2xl font-bold text-ink flex items-center gap-2">
              POS <span className="text-primary-deep">•</span> <span className="text-secondary">बिक्री</span>
            </h1>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search product or scan barcode..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all placeholder:text-ink-faint shadow-sm"
            />
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="flex-1 overflow-y-auto pr-1 max-h-[70vh]">
          {filteredProducts.length === 0 ? (
            <div className="card p-12 text-center text-ink-soft">
              <p className="text-sm font-semibold">No products found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {filteredProducts.map(p => {
                const inCartItem = cart.find(item => item.product.id === p.id);
                const currentStock = p.stock - (inCartItem ? inCartItem.quantity : 0);
                const isOutOfStock = currentStock <= 0;

                return (
                  <motion.div
                    key={p.id}
                    whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                    whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`card p-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-200 relative select-none min-h-[140px] ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed bg-ink-50' : 'bg-paper-card hover:shadow-md'
                    }`}
                  >
                    {/* Badge showing quantity in cart */}
                    {inCartItem && (
                      <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm animate-scaleIn">
                        {inCartItem.quantity}
                      </span>
                    )}

                    <span className="text-3xl mb-2">{p.icon}</span>
                    <h3 className="text-xs font-bold text-ink leading-tight line-clamp-2 max-w-full px-1">
                      {p.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm font-bold text-secondary">₹{p.price}</p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${currentStock <= 5 ? 'text-overdue-deep' : 'text-ink-soft'}`}>
                        {currentStock > 0 ? `${currentStock} left` : 'Out of stock'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart panel */}
      <div className="lg:col-span-4 card flex flex-col justify-between overflow-hidden bg-paper-card shadow-lg border border-ink-150 min-h-[500px]">
        {/* Cart Header */}
        <div className="p-4 border-b border-ink-200/50 flex items-center gap-3 bg-white">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary-deep shadow-sm">
            <ShoppingCart className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-ink flex items-center justify-between">
              <span>Cart</span>
              <span className="text-xs font-semibold text-ink-soft">• {totalItemsCount} items</span>
            </h2>
            <div className="mt-1">
              <select
                value={selectedCustomerId}
                onChange={e => {
                  setSelectedCustomerId(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full text-xs font-bold text-secondary bg-transparent focus:outline-none border-none cursor-pointer focus:ring-0 truncate"
              >
                <option value="walk-in">👤 Walk-in Customer</option>
                {customersList.map(c => (
                  <option key={c.id} value={c.id}>
                    👤 {c.name} ({c.phone}) - Due: ₹{c.pendingDue}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cart Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-paper-card/40">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-ink-50 border border-ink-150 flex items-center justify-center text-ink-faint mb-3 shadow-inner">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-xs font-bold text-ink mb-0.5">Cart is empty</h3>
                <p className="text-[10px] text-ink-soft">Tap a product to add</p>
              </motion.div>
            ) : (
              cart.map(item => (
                <motion.div
                  key={item.product.id}
                  layoutId={item.product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-ink-100 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-2xl shrink-0">{item.product.icon}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-ink truncate max-w-[150px]">{item.product.name}</h4>
                      <p className="text-[10px] font-semibold text-secondary">₹{item.product.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center border border-ink-150 rounded-lg bg-paper">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 text-ink-soft hover:text-secondary hover:bg-ink-100 rounded-l-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-ink min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 text-ink-soft hover:text-secondary hover:bg-ink-100 rounded-r-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-ink-faint hover:text-overdue-deep hover:bg-overdue-light rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer Billing Details */}
        <div className="p-4 border-t border-ink-200/50 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-soft">Total ({totalItemsCount} items)</span>
            <span className="font-serif text-2xl font-black text-sale-deep">₹{cartTotal}</span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setPaymentMethod('cash'); setErrorMsg(null); }}
                className={`py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-secondary bg-secondary/10 text-secondary-deep shadow-sm'
                    : 'border-ink-200 text-ink hover:bg-ink-50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" /> Cash
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMethod('upi'); setErrorMsg(null); }}
                className={`py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-secondary bg-secondary/10 text-secondary-deep shadow-sm'
                    : 'border-ink-200 text-ink hover:bg-ink-50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> UPI
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMethod('card'); setErrorMsg(null); }}
                className={`py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-secondary bg-secondary/10 text-secondary-deep shadow-sm'
                    : 'border-ink-200 text-ink hover:bg-ink-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Card
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMethod('udhaar'); setErrorMsg(null); }}
                className={`py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  paymentMethod === 'udhaar'
                    ? 'border-secondary bg-secondary/10 text-secondary-deep shadow-sm'
                    : 'border-ink-200 text-ink hover:bg-ink-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Udhaar
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-[10px] font-bold text-overdue-deep bg-overdue-light border border-overdue/20 rounded-lg p-2 text-center">
              ⚠️ {errorMsg}
            </p>
          )}

          <motion.button
            whileHover={cart.length > 0 ? { scale: 1.02 } : {}}
            whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Checkout
          </motion.button>
        </div>
      </div>

      {/* Checkout Receipt Modal */}
      <AnimatePresence>
        {checkoutSuccess && lastReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-ink-150 shadow-2xl relative"
            >
              <button
                onClick={() => setCheckoutSuccess(false)}
                className="absolute top-4 right-4 p-1.5 text-ink-soft hover:text-ink hover:bg-ink-50 rounded-lg transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-sale-light flex items-center justify-center mx-auto mb-3 text-sale-deep animate-scaleIn">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink">Checkout Successful!</h3>
                <p className="text-[10px] text-ink-soft mt-0.5">Payment received successfully</p>
              </div>

              {/* Receipt Structure */}
              <div className="border border-dashed border-ink-200 rounded-xl p-4 bg-paper space-y-4">
                <div className="flex items-center gap-1.5 border-b border-dashed border-ink-200 pb-2 text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                  <Receipt className="w-4 h-4 text-primary" /> Receipt Details
                </div>

                <div className="text-xs space-y-1 bg-white p-2.5 rounded-lg border border-ink-100">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Txn ID:</span>
                    <span className="font-bold text-ink">{lastReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Time:</span>
                    <span className="font-bold text-ink">{lastReceipt.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Method:</span>
                    <span className="font-bold text-ink uppercase">{lastReceipt.method}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-1 text-xs">
                  {lastReceipt.items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-ink-soft">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span className="font-semibold text-ink">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-ink-200 pt-3 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-ink">Total Paid</span>
                  <span className="font-serif text-lg font-black text-sale-deep">₹{lastReceipt.total}</span>
                </div>
              </div>

              {lastReceipt.method === 'udhaar' && (
                <button
                  onClick={handleSendWhatsAppReport}
                  className="w-full mt-5 py-3 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-glow hover:bg-[#1ebd59] flex items-center justify-center gap-1.5 transition-all duration-200 animate-pulseSoft"
                >
                  💬 Send WhatsApp Report
                </button>
              )}
              <button
                onClick={() => setCheckoutSuccess(false)}
                className="w-full mt-2.5 py-3 bg-secondary text-white text-xs font-bold rounded-xl shadow-glow hover:bg-secondary-deep transition-all duration-200"
              >
                New Bill
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UPI QR Payment Modal */}
      <AnimatePresence>
        {upiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-ink-150 shadow-2xl relative"
            >
              <button
                onClick={() => setUpiModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-ink-soft hover:text-ink hover:bg-ink-50 rounded-lg transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3 text-secondary shadow-sm">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink">UPI Payment</h3>
                <p className="text-[10px] text-ink-soft mt-0.5">Scan to pay with any UPI App</p>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center p-4 bg-paper border border-ink-200 rounded-2xl space-y-3.5 shadow-inner">
                {/* Real UPI QR via API */}
                <div className="w-48 h-48 bg-white p-2.5 rounded-xl border border-ink-100 flex items-center justify-center shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `upi://pay?pa=bunnykirana@okaxis&pn=Bunny%20Kirana&am=${cartTotal}&cu=INR&tn=VyapaarAI%20POS%20Bill`
                    )}`}
                    alt="Scan UPI QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Amount to Pay</p>
                  <p className="font-serif text-2xl font-black text-sale-deep mt-0.5">₹{cartTotal}</p>
                </div>
              </div>

              {/* Pulsing Status */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-secondary">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse" />
                <span>Awaiting payment confirmation...</span>
              </div>

              {/* Simulated Actions */}
              <div className="mt-5 space-y-2">
                <button
                  onClick={() => {
                    setUpiModalOpen(false);
                    completeCheckout('upi');
                  }}
                  className="w-full py-3 bg-secondary text-white text-xs font-bold rounded-xl shadow-glow hover:bg-secondary-deep transition-all duration-200"
                >
                  Confirm Payment Success
                </button>
                <button
                  onClick={() => setUpiModalOpen(false)}
                  className="w-full py-2.5 bg-white border border-ink-200 text-ink text-xs font-semibold rounded-xl hover:bg-ink-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
