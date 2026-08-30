import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getClients } from '../api/clientApi.js';
import { createInvoice } from '../api/invoiceApi.js';

const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Please select a client'),
  dueDate: z.string().min(1, 'Due date is required'),
  taxPercent: z.coerce.number().min(0, 'Tax cannot be negative').max(100, 'Tax cannot exceed 100%'),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
        unitPrice: z.coerce.number().min(0, 'Unit price cannot be negative'),
      })
    )
    .min(1, 'Add at least one line item'),
});

const COUNTRY_CURRENCY_SYMBOL = {
  'United States': '$',
  'India': '₹',
  'United Kingdom': '£',
  'Canada': 'CA$',
  'Australia': 'A$',
  'Germany': '€',
  'France': '€',
  'Spain': '€',
  'Italy': '€',
  'Netherlands': '€',
  'Japan': '¥',
  'Singapore': 'S$',
  'United Arab Emirates': 'AED ',
};

export default function CreateInvoicePage() {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: '',
      dueDate: '',
      taxPercent: 0,
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');
  const watchedTax = watch('taxPercent');
  const watchedClientId = watch('clientId');

  const selectedClient = clients.find((c) => String(c.id) === String(watchedClientId));
  const currencySymbol = COUNTRY_CURRENCY_SYMBOL[selectedClient?.country] || '$';

  useEffect(() => {
    getClients()
      .then((res) => setClients(res.data))
      .finally(() => setLoadingClients(false));
  }, []);

  const subtotal = watchedItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const taxAmount = subtotal * ((Number(watchedTax) || 0) / 100);
  const total = subtotal + taxAmount;

  const onValid = async (data) => {
    try {
      const payload = {
        clientId: Number(data.clientId),
        dueDate: data.dueDate,
        taxPercent: data.taxPercent,
        items: data.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };
      await createInvoice(payload);
      navigate('/invoices');
    } catch (err) {
      setError('root', {
        message: err.response?.data?.error || 'Failed to create invoice. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-6">Create Invoice</h1>

        <form onSubmit={handleSubmit(onValid)} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
              <select
                {...register('clientId')}
                disabled={loadingClients}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {loadingClients ? 'Loading clients...' : 'Select a client'}
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.clientId.message}</p>}
              {!loadingClients && clients.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  No clients yet.{' '}
                  <Link to="/clients" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Add one first
                  </Link>
                </p>
              )}
              {selectedClient && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Currency: {selectedClient.country || 'Not set'} ({currencySymbol})
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dueDate && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.dueDate.message}</p>}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Line Items</label>
              <button
                type="button"
                onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    {index === 0 && (
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                    )}
                    <input
                      placeholder="Description"
                      {...register(`items.${index}.description`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.items?.[index]?.description && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {errors.items[index].description.message}
                      </p>
                    )}
                  </div>
                  <div className="w-20">
                    {index === 0 && (
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Qty</label>
                    )}
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-28">
                    {index === 0 && (
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit Price</label>
                    )}
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unitPrice`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className={`text-red-600 dark:text-red-400 hover:underline text-sm px-2 py-2 disabled:opacity-30 disabled:cursor-not-allowed ${index === 0 ? 'mt-6' : ''}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {errors.items && !Array.isArray(errors.items) && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.items.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax %</label>
              <input
                type="number"
                step="0.01"
                {...register('taxPercent')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.taxPercent && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.taxPercent.message}</p>}
            </div>

            <div className="text-right space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">Subtotal: {currencySymbol}{subtotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tax: {currencySymbol}{taxAmount.toFixed(2)}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Total: {currencySymbol}{total.toFixed(2)}</p>
            </div>
          </div>

          {errors.root && <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}
