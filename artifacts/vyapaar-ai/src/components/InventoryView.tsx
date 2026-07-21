import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, AlertTriangle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  reorderLevel: number;
  icon: string;
  category: string;
  unit: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 'pos_1', name: 'Aashirvaad Atta 5kg', price: 245, stock: 22, reorderLevel: 5, icon: '🌾', category: 'Staples', unit: 'bags' },
  { id: 'pos_2', name: 'Amul Butter 500g', price: 280, stock: 10, reorderLevel: 3, icon: '🧈', category: 'Dairy', unit: 'packets' },
  { id: 'pos_3', name: 'Amul Milk 500ml', price: 28, stock: 45, reorderLevel: 15, icon: '🥛', category: 'Dairy', unit: 'packets' },
  { id: 'pos_4', name: 'Basmati Rice 5kg', price: 385, stock: 14, reorderLevel: 5, icon: '🍚', category: 'Staples', unit: 'bags' },
  { id: 'pos_5', name: 'Coca Cola 2L', price: 88, stock: 3, reorderLevel: 5, icon: '🥤', category: 'Beverages', unit: 'bottles' },
  { id: 'pos_6', name: 'Colgate Toothpaste 100g', price: 58, stock: 20, reorderLevel: 5, icon: '🪥', category: 'Personal Care', unit: 'tubes' },
  { id: 'pos_7', name: 'Dettol Soap 75g', price: 38, stock: 25, reorderLevel: 5, icon: '🧼', category: 'Personal Care', unit: 'bars' },
  { id: 'pos_8', name: 'Fortune Sunflower Oil 1L', price: 148, stock: 17, reorderLevel: 5, icon: '🧴', category: 'Oils', unit: 'bottles' },
  { id: 'pos_9', name: 'Lay\'s Classic 90g', price: 40, stock: 40, reorderLevel: 10, icon: '🥔', category: 'Snacks', unit: 'packets' },
  { id: 'pos_10', name: 'Maggi 2-Min Noodles 12pk', price: 168, stock: 8, reorderLevel: 5, icon: '🍜', category: 'Ready to Eat', unit: 'packets' },
  { id: 'pos_11', name: 'Nescafe Classic 50g', price: 198, stock: 9, reorderLevel: 4, icon: '☕', category: 'Beverages', unit: 'jars' },
  { id: 'pos_12', name: 'Parle-G Biscuits 800g', price: 62, stock: 35, reorderLevel: 10, icon: '🍪', category: 'Snacks', unit: 'packets' },
  { id: 'pos_13', name: 'Red Label Tea 500g', price: 178, stock: 12, reorderLevel: 5, icon: '🍵', category: 'Beverages', unit: 'packets' },
  { id: 'pos_14', name: 'Surf Excel 500g', price: 145, stock: 15, reorderLevel: 5, icon: '🧼', category: 'Household', unit: 'packets' },
  { id: 'pos_15', name: 'Tata Salt 1kg', price: 22, stock: 29, reorderLevel: 10, icon: '🧂', category: 'Staples', unit: 'packets' }
];

const CATEGORIES = [
  'All',
  'Dairy',
  'Staples',
  'Snacks',
  'Personal Care',
  'Household',
  'Beverages',
  'Ready to Eat',
  'Oils'
];

export function InventoryView() {
  const { navigate } = useNavigation();
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vyapaar-pos-products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Map missing properties (reorderLevel, category, unit) back onto saved products
      return INITIAL_PRODUCTS.map(initial => {
        const savedItem = parsed.find((p: any) => p.id === initial.id);
        return savedItem ? { ...initial, stock: savedItem.stock } : initial;
      });
    }
    return INITIAL_PRODUCTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Staples');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');

  useEffect(() => {
    // Sync with POS local storage
    localStorage.setItem('vyapaar-pos-products', JSON.stringify(products));
  }, [products]);

  // Find lowest stock product that is below reorder level
  const lowStockItem = [...products]
    .filter(p => p.stock <= p.reorderLevel)
    .sort((a, b) => a.stock - b.stock)[0];

  const handleReorder = () => {
    navigate('suppliers');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductStock) return;

    const newProd: Product = {
      id: 'pos_' + (products.length + 1),
      name: newProductName,
      price: parseFloat(newProductPrice),
      stock: parseInt(newProductStock),
      reorderLevel: 5,
      icon: '📦',
      category: newProductCategory,
      unit: 'packets'
    };

    setProducts(prev => [...prev, newProd]);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    setAddItemOpen(false);
  };

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate counts for category pills
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">माल · Stock Management</span>
          <h1 className="font-serif text-2xl font-bold text-ink flex items-center gap-2">
            Inventory <span className="text-primary-deep">•</span> <span className="text-secondary">माल-सूची</span>
          </h1>
        </div>
        <button
          onClick={() => setAddItemOpen(true)}
          className="btn-primary py-2 px-4 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-200 text-xs font-bold shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Low Stock Banner Alert */}
      <AnimatePresence>
        {lowStockItem && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-secondary-200/60 p-5 shadow-sm animate-slideUp flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-overdue-light border border-overdue/25 flex items-center justify-center text-overdue-deep shrink-0 shadow-sm mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                  Stock low <span className="text-secondary-deep">• {lowStockItem.name}</span>
                </h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  <span className="font-bold text-overdue-deep">{lowStockItem.stock} {lowStockItem.unit} left</span> · velocity 2/day · runs out in <span className="font-bold text-overdue-deep">1.5d</span>
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReorder}
              className="py-2.5 px-4 bg-secondary text-white text-xs font-bold rounded-xl shadow-glow hover:bg-secondary-deep flex items-center gap-2 transition-all shrink-0"
            >
              <ShoppingBag className="w-4 h-4" /> Reorder now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search products... e.g. Maggi, Sugar, Oil"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-ink-200 bg-paper-card text-ink text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all placeholder:text-ink-faint shadow-sm"
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0 -mx-4 px-4 lg:mx-0 lg:px-0">
        {CATEGORIES.map(cat => {
          const count = getCategoryCount(cat);
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${
                isSelected
                  ? 'bg-secondary border-secondary text-white shadow-glow-sm'
                  : 'bg-white border-ink-150 text-ink hover:bg-ink-50'
              }`}
            >
              {cat === 'All' ? 'All' : cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Product Stock List section */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-1.5 justify-center text-xs font-bold text-ink-soft uppercase tracking-wider select-none py-1 border-b border-ink-100/50">
          📦 Stock • माल ({filteredProducts.length})
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {filteredProducts.map(p => {
            const isLowStock = p.stock <= p.reorderLevel;
            return (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.02 }}
                className={`card p-4 flex flex-col justify-between items-center text-center relative select-none min-h-[140px] shadow-sm transition-all duration-200 border ${
                  isLowStock
                    ? 'border-secondary bg-gradient-to-br from-[#FFF9F2] to-[#FFF0DE] shadow-glow-sm'
                    : 'border-ink-150 bg-paper-card'
                }`}
              >
                <span className="text-3xl mb-1.5">{p.icon}</span>
                <h3 className="text-[11px] font-bold text-ink leading-tight line-clamp-2 max-w-full px-1">
                  {p.name}
                </h3>
                <div className="mt-2.5">
                  <p className={`text-xs font-bold leading-tight ${isLowStock ? 'text-overdue-deep' : 'text-sale-deep'}`}>
                    {p.stock} {p.unit}
                  </p>
                  <p className="text-[10px] text-ink-soft font-semibold mt-0.5">₹{p.price}</p>
                </div>

                {isLowStock && (
                  <span className="mt-1.5 text-[8px] font-black uppercase tracking-widest text-overdue-deep bg-overdue-light px-2 py-0.5 rounded-full border border-overdue/15">
                    LOW
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {addItemOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-ink-150 shadow-2xl relative"
            >
              <button
                onClick={() => setAddItemOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-ink-soft hover:text-ink hover:bg-ink-50 rounded-lg transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <h3 className="font-serif text-lg font-bold text-ink mb-4">Add New Item</h3>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5">Product Name</label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={e => setNewProductName(e.target.value)}
                    required
                    placeholder="e.g. Britannia Bread 400g"
                    className="w-full px-3 py-2 rounded-xl border border-ink-200 text-ink text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5">Price (₹)</label>
                    <input
                      type="number"
                      value={newProductPrice}
                      onChange={e => setNewProductPrice(e.target.value)}
                      required
                      min="1"
                      placeholder="e.g. 45"
                      className="w-full px-3 py-2 rounded-xl border border-ink-200 text-ink text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5">Opening Stock</label>
                    <input
                      type="number"
                      value={newProductStock}
                      onChange={e => setNewProductStock(e.target.value)}
                      required
                      min="0"
                      placeholder="e.g. 20"
                      className="w-full px-3 py-2 rounded-xl border border-ink-200 text-ink text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={e => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ink-200 text-ink text-sm bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-secondary text-white text-xs font-bold rounded-xl shadow-glow hover:bg-secondary-deep transition-all duration-200"
                >
                  Save Product
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple close icon for modal
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
