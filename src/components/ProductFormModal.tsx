import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Product, CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const PRESET_IMAGES = [
  { label: 'Veg Chopper', url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&h=800&q=80' },
  { label: 'Oil Dispenser', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&h=800&q=80' },
  { label: 'Silicone Utensils', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&h=800&q=80' },
  { label: 'Spice Rack', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&h=800&q=80' },
  { label: 'Electric Whisk', url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&h=800&q=80' },
  { label: 'Kitchen Knife Set', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&h=800&q=80' },
  { label: 'Airtight Containers', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&h=800&q=80' },
  { label: 'Sink Organizer', url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&h=800&q=80' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, formatPrice } = useShop();

  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState<CategoryId>('kitchen-gadgets');
  const [originalPrice, setOriginalPrice] = useState(1999);
  const [salePrice, setSalePrice] = useState(1499);
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState(50);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isSale, setIsSale] = useState(true);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [tagsInput, setTagsInput] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setHandle(productToEdit.handle);
      setCategory(productToEdit.category);
      setOriginalPrice(productToEdit.originalPrice);
      setSalePrice(productToEdit.salePrice);
      setInStock(productToEdit.inStock);
      setStockCount(productToEdit.stockCount);
      setIsBestSeller(!!productToEdit.isBestSeller);
      setIsNewArrival(!!productToEdit.isNewArrival);
      setIsSale(productToEdit.isSale);
      setImage(productToEdit.image);
      setShortDescription(productToEdit.shortDescription);
      setDescription(productToEdit.description);
      setFeatures(productToEdit.features?.length ? productToEdit.features : ['']);
      setTagsInput(productToEdit.tags?.join(', ') || '');
    } else {
      // Default blank/new form
      setTitle('');
      setHandle('');
      setCategory('kitchen-gadgets');
      setOriginalPrice(2499);
      setSalePrice(1799);
      setInStock(true);
      setStockCount(40);
      setIsBestSeller(false);
      setIsNewArrival(true);
      setIsSale(true);
      setImage(PRESET_IMAGES[0].url);
      setShortDescription('');
      setDescription('');
      setFeatures([
        'Premium food-grade BPA-free material',
        'Easy to clean and dishwasher safe',
        'Compact ergonomic space-saving design',
      ]);
      setTagsInput('kitchen, gadgets, home, new');
    }
  }, [productToEdit, isOpen]);

  // Auto-generate handle from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!productToEdit) {
      setHandle(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const addFeatureInput = () => {
    setFeatures([...features, '']);
  };

  const updateFeatureInput = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const removeFeatureInput = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const categoryObj = CATEGORIES.find((c) => c.id === category);
    const categoryName = categoryObj ? categoryObj.name : 'Kitchen Gadgets';
    const cleanFeatures = features.filter((f) => f.trim().length > 0);
    const cleanTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const productPayload: Omit<Product, 'id'> = {
      title: title.trim(),
      handle: handle.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      categoryName,
      originalPrice: Number(originalPrice) || Number(salePrice),
      salePrice: Number(salePrice),
      isSale: Number(originalPrice) > Number(salePrice) || isSale,
      isBestSeller,
      isNewArrival,
      rating: productToEdit ? productToEdit.rating : 5.0,
      reviewsCount: productToEdit ? productToEdit.reviewsCount : 1,
      inStock,
      stockCount: Number(stockCount),
      image: image.trim() || PRESET_IMAGES[0].url,
      additionalImages: productToEdit?.additionalImages || [image],
      shortDescription: shortDescription.trim() || title.trim(),
      description: description.trim() || shortDescription.trim() || title.trim(),
      features: cleanFeatures.length > 0 ? cleanFeatures : ['Premium durable build quality', '100% satisfaction guaranteed'],
      specifications: productToEdit?.specifications || {
        'Material': 'BPA-Free Food Grade ABS / Stainless Steel',
        'Warranty': '7 Days Replacement Warranty',
        'Origin': 'Imported Quality',
      },
      reviews: productToEdit?.reviews || [
        {
          id: 'rev_1',
          author: 'Customer',
          city: 'Lahore',
          rating: 5,
          date: 'Just now',
          comment: 'Outstanding quality and fast delivery. Very satisfied!',
          verified: true,
        },
      ],
      tags: cleanTags,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {productToEdit ? 'Edit Product Catalogue' : 'Add New Product to Ideal Collections'}
            </h2>
            <p className="text-xs text-slate-500">
              Manage inventory, pricing, high-res photos, and tags in real-time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Inputs */}
            <div className="lg:col-span-2 space-y-5">
              {/* Product Title & Handle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 12-in-1 Multi Vegetable Chopper & Slicer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL Handle
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="multi-vegetable-chopper"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sale Price (PKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Original Price (PKR)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Inventory Stock Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stockCount}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setStockCount(count);
                      setInStock(count > 0);
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Badges & Stock toggles */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-slate-900 focus:ring-slate-900"
                  />
                  <span className="font-medium text-xs text-slate-800">In Stock for Ordering</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-medium text-xs text-slate-800">🔥 Mark as Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-xs text-slate-800">✨ New Arrival Badge</span>
                </label>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Quick summary shown on cards and product previews"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Detailed Description & Usage
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of materials, benefits, and kitchen use cases..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-sm"
                />
              </div>

              {/* Bullet Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Key Features & Highlights
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="text-xs text-slate-900 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Point
                  </button>
                </div>
                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => updateFeatureInput(idx, e.target.value)}
                        placeholder={`Feature point #${idx + 1}`}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Search & Filter Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="chopper, organizer, storage, bestseller"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm"
                />
              </div>
            </div>

            {/* Right 1 Col: Image URL & Quick Presets & Preview */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs mb-2"
                />

                {/* Quick Presets */}
                <div className="mb-3">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Pick Preset Image:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          image === preset.url ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                        {image === preset.url && (
                          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Live Preview */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Storefront Card Preview:
                </span>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img
                      src={image || PRESET_IMAGES[0].url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                      }}
                    />
                    {isBestSeller && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-0.5">
                      {CATEGORIES.find((c) => c.id === category)?.name || 'Category'}
                    </p>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1">
                      {title || 'Sample Product Title'}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatPrice(salePrice || 0)}
                      </span>
                      {originalPrice > salePrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {productToEdit ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
