import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { getInvoice, updateInvoice } from "../api/invoiceApi.js";

import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const today = new Date().toISOString().split("T")[0];

const invoiceSchema = z.object({
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((date) => date >= today, "Due date cannot be in the past"),

  taxPercent: z
    .number()
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot exceed 100"),

  items: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),

        quantity: z.number().int().min(1, "Quantity must be at least 1"),

        unitPrice: z.number().min(0, "Unit price cannot be negative"),
      }),
    )
    .min(1, "At least one item is required"),
});

export default function EditInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(invoiceSchema),

    defaultValues: {
      dueDate: "",
      taxPercent: 0,

      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const taxPercent = watch("taxPercent");

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),

      0,
    );
  }, [items]);

  const taxAmount = useMemo(() => {
    return (subtotal * (Number(taxPercent) || 0)) / 100;
  }, [subtotal, taxPercent]);

  const total = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  /*
   * Load invoice
   */
  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        const response = await getInvoice(id);
        const data = response.data;
        /*
         * Only DRAFT invoices can be edited.
         */
        if (data.status !== "DRAFT") {
          toast.error("Only draft invoices can be edited.");
          navigate("/invoices");
          return;
        }
        setInvoice(data);
        reset({
          dueDate: data.dueDate ?? "",
          taxPercent: Number(data.taxPercent ?? 0),
          items: (data.items ?? []).map((item) => ({
            description: item.description ?? "",
            quantity: Number(item.quantity ?? 1),
            unitPrice: Number(item.unitPrice ?? 0),
          })),
        });
      } catch (err) {
        console.error("Failed to load invoice:", err);

        toast.error(err.response?.data?.error || "Failed to load invoice.");

        navigate("/invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id, navigate, reset]);

  /*
   * Submit update
   */
  const onSubmit = async (data) => {
    try {
      const payload = {
        dueDate: data.dueDate,

        taxPercent: data.taxPercent,

        items: data.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      await updateInvoice(id, payload);

      toast.success("Invoice updated successfully!");

      navigate("/invoices");
    } catch (err) {
      console.error("Failed to update invoice:", err);

      toast.error(err.response?.data?.error || "Failed to update invoice.");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading invoice..." />;
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
      <div className="h-full flex items-center justify-center px-4 py-4">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-full flex flex-col">
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Link
                to="/invoices"
                className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Edit Invoice
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>

            <ThemeToggle />
          </div>

          {/* Scrollable Form */}
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Invoice Details */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Invoice Details
                </h2>

                <div className="space-y-3">
                  {/* Client */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Client
                    </label>

                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                      {invoice.clientName}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Client cannot be changed after invoice creation.
                    </p>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Due Date
                    </label>

                    <input
                      id="dueDate"
                      type="date"
                      min={today}
                      {...register("dueDate")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {errors.dueDate && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {errors.dueDate.message}
                      </p>
                    )}
                  </div>

                  {/* Tax */}
                  <div>
                    <label
                      htmlFor="taxPercent"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Tax %
                    </label>

                    <input
                      id="taxPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      {...register("taxPercent", {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {errors.taxPercent && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {errors.taxPercent.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Invoice Items
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      append({
                        description: "",
                        quantity: 1,
                        unitPrice: 0,
                      })
                    }
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      {/* Item Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Item {index + 1}
                        </span>

                        <button
                          type="button"
                          disabled={fields.length === 1}
                          onClick={() => remove(index)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>

                        <input
                          {...register(`items.${index}.description`)}
                          placeholder="e.g. Website Development"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {errors.items?.[index]?.description && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {errors.items[index].description.message}
                          </p>
                        )}
                      </div>

                      {/* Quantity + Unit Price */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Quantity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantity
                          </label>

                          <input
                            type="number"
                            min="1"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                          {errors.items?.[index]?.quantity && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {errors.items[index].quantity.message}
                            </p>
                          )}
                        </div>

                        {/* Unit Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unit Price
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(`items.${index}.unitPrice`, {
                              valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                          {errors.items?.[index]?.unitPrice && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {errors.items[index].unitPrice.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Tax ({Number(taxPercent || 0)}%)</span>

                    <span>{taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => navigate("/invoices")}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" light />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
