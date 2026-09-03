import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { Image, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getUserProfile,
  updateNotification,
  updatePassword,
  updateProfile,
  updateSignature,
} from "../api/profileApi.js";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const COUNTRIES = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Japan",
  "Singapore",
  "United Arab Emirates",
];

const profileSchema = z.object({
  businessName: z
    .string()
    .min(3, "Business Name should be between 3 and 30 characters")
    .max(30, "Business Name should be between 3 and 30 characters"),
  country: z.string().min(2, "Country is required"),
});

const signatureSchema = z.object({
  signature: z
    .string()
    .max(1000, "Signature cannot exceed 1000 characters")
    .optional(),
});

const notificationSchema = z.object({
  invoiceViewed: z.boolean(),
  overdueReminders: z.boolean(),
  paymentReceived: z.boolean(),
});

const securitySchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password should be between 8 and 16")
      .max(16, "Password should be between 8 and 16"),
    newPassword: z
      .string()
      .min(8, "Password should be between 8 and 16")
      .max(16, "Password should be between 8 and 16"),
    confirmPassword: z
      .string()
      .min(8, "Password should be between 8 and 16")
      .max(16, "Password should be between 8 and 16"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    setError: setProfileError,
    formState: {
      errors: profileErrors,
      isSubmitting: isProfileSubmitting,
      isDirty: isProfileDirty,
    },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: profile?.businessName || "",
      country: profile?.country || "",
    },
  });

  const {
    register: registerSignature,
    handleSubmit: handleSubmitSignature,
    reset: resetSignature,
    watch: watchSignature,
    setError: setSignatureError,
    formState: {
      errors: signatureErrors,
      isSubmitting: isSignatureSubmitting,
      isDirty: isSignatureDirty,
    },
  } = useForm({
    resolver: zodResolver(signatureSchema),
    defaultValues: {
      signature: "",
    },
  });

  const {
    register: registerNotification,
    handleSubmit: handleSubmitNotification,
    reset: resetNotification,
    setError: setNotificationError,
    formState: {
      errors: notificationErrors,
      isSubmitting: isNotificationSubmitting,
      isDirty: isNotificationDirty,
    },
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      invoiceViewed: false,
      overdueReminders: false,
      paymentReceived: false,
    },
  });

  const {
    register: registerSecurity,
    handleSubmit: handleSubmitSecurity,
    reset: resetSecurity,
    setError: setSecurityError,
    formState: {
      errors: securityErrors,
      isSubmitting: isSecuritySubmitting,
      isDirty: isSecurityDirty,
    },
  } = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onValidProfile = async (data) => {
    if (!isProfileDirty) {
      toast("No changes to save.");
      return;
    }

    try {
      const payload = {
        businessName: data.businessName,
        country: data.country,
      };
      await updateProfile(payload);
      resetProfile(data);
      toast.success("Profile saved Successfully");
    } catch (err) {
      setProfileError("root", {
        message:
          err.response?.data?.error ||
          "Failed to update profile. Please try again.",
      });
    }
  };

  const onValidSignature = async (data) => {
    if (!isSignatureDirty) {
      toast("No changes to save.");
      return;
    }
    try {
      const payload = {
        signature: data.signature,
      };
      await updateSignature(payload);
      resetSignature(data);
      toast.success("Signature saved Successfully");
    } catch (err) {
      setSignatureError("root", {
        message:
          err.response?.data?.error ||
          "Failed to update signature. Please try again.",
      });
    }
  };

  const onValidNotification = async (data) => {
    if (!isNotificationDirty) {
      toast("No changes to save.");
      return;
    }
    try {
      const payload = {
        invoiceViewed: data.invoiceViewed,
        overdueReminders: data.overdueReminders,
        paymentReceived: data.paymentReceived,
      };
      await updateNotification(payload);
      resetNotification(data);
      toast.success("Notification preference saved Successfully");
    } catch (err) {
      setNotificationError("root", {
        message:
          err.response?.data?.error ||
          "Failed to update notification. Please try again.",
      });
    }
  };

  const onValidSecurity = async (data) => {
    if (!isSecurityDirty) {
      toast("No changes to save.");
      return;
    }
    try {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      await updatePassword(payload);
      resetSecurity();
      toast.success("Password Changed Successfully");
    } catch (err) {
      setSecurityError("root", {
        message:
          err.response?.data?.error ||
          "Failed to update password. Please try again.",
      });
    }
  };

  useEffect(() => {
    getUserProfile()
      .then((res) => {
        setProfile(res.data);
        resetProfile({
          businessName: res.data.businessName || "",
          country: res.data.country || "",
        });
        resetSignature({
          signature: res.data.signature || "",
        });
        resetNotification({
          invoiceViewed: res.data.invoiceViewed ?? false,
          overdueReminders: res.data.overdueReminders ?? false,
          paymentReceived: res.data.paymentReceived ?? false,
        });
        resetSecurity({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        console.log("Failed to load profile:", err);
      })
      .finally(() => setLoading(false));
  }, [resetProfile, resetSignature, resetNotification, resetSecurity]);

  if (loading) {
    return <LoadingSpinner size="md" text="Loading..." fullScreen />;
  } else
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link
                to="/hub"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span className="sm:hidden">← Back</span>
                <span className="hidden sm:inline">← Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>

          <div className="my-3 sticky z-20 bg-gray-50 dark:bg-gray-900">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              Profile & Settings
            </h1>
            <p className="dark:text-white text-[14px]">
              Manage your account, invoice branding, and preferences
            </p>
          </div>

          <div className="h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
            <form onSubmit={handleSubmitProfile(onValidProfile)}>
              <div className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl my-6">
                <div className="flex flex-col p-1">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Profile
                    </h3>
                    <p className="text-[14px] text-gray-600 dark:text-gray-400">
                      Your business identity. Your email is tied to your login
                      and can't be changed here.
                    </p>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="businessName"
                      className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      {...registerProfile("businessName")}
                      placeholder="SoloPilot"
                      className="p-2 px-4 text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 w-full my-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {profileErrors.businessName && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {profileErrors.businessName.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <label
                      htmlFor="email"
                      className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="someone@solopilot.com"
                      value={profile?.email || ""}
                      className="p-2 px-4 text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 w-full my-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                    <p className="text-[14px] text-gray-600 dark:text-gray-400">
                      Email is tied to your login and can't be changed here.
                    </p>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="country"
                      className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      {...registerProfile("country")}
                      className="p-2 px-4 text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 w-full my-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {profileErrors.country && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {profileErrors.country.message}
                      </p>
                    )}
                    <p className="text-[14px] text-gray-600 dark:text-gray-400">
                      Used to determine your invoice currency.
                    </p>
                  </div>
                  <div className="mt-2">
                    <button
                      type="submit"
                      disabled={isProfileSubmitting}
                      className="my-2 py-2 px-3 text-[14px] text-white rounded-xl bg-blue-600 cursor-pointer"
                    >
                      {isProfileSubmitting ? (
                        <LoadingSpinner size="sm" text="Saving..." light />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl my-6">
              <div className="flex flex-col p-1 relative">
                <span className="absolute right-0 flex gap-1 text-[8px] sm:text-[9px] lg:text-[10px] font-semibold text-amber-600 dark:text-amber-200">
                  <Clock size={10} className="sm:w-3 sm:h-3 " />
                  COMING SOON
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Branding
                  </h3>
                  <p className="text-[14px] text-gray-600 dark:text-gray-400">
                    Upload a logo to appear on your invoice PDF's
                  </p>
                </div>
                <div className="mt-2">
                  <label
                    htmlFor=""
                    className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                  >
                    Logo
                  </label>
                  <div className="flex mt-2">
                    <div className="p-3 mr-4 border rounded-2xl text-gray-700 dark:text-gray-200">
                      <Image size={30} />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="logo-upload"
                        className="py-1 px-3 rounded-xl w-min text-nowrap border cursor-pointer text-[14px] font-medium text-gray-700 dark:text-gray-200 disabled cursor-not-allowed opacity-50 pointer-events-none"
                        onClick={(e) => e.preventDefault()}
                      >
                        Upload Logo
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                      <span className="text-[13px] mt-1 text-gray-700 dark:text-gray-200">
                        PNG, JPG, or SVG. Max 2 MB
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <button className="my-2 py-2 px-3 text-[14px] text-white rounded-xl bg-blue-600 disabled cursor-not-allowed">
                    Save
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitSignature(onValidSignature)}>
              <div className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl my-6">
                <div className="flex flex-col p-1">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Email Signature
                    </h3>
                    <p className="text-[14px] text-gray-600 dark:text-gray-400">
                      Appending to outgoing invoice emails sent to your clients.
                    </p>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor=""
                      className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                    >
                      Signature
                    </label>
                    <div className="mt-2">
                      <div className="w-full max-w">
                        <textarea
                          {...registerSignature("signature")}
                          className="w-full min-h-32 max-h-50 resize-y rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-400
                  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={1000}
                          placeholder="Enter your description..."
                        />
                      </div>
                    </div>
                    <p className="text-[13px] mt-1 font-extralight text-gray-700 dark:text-gray-200">
                      {watchSignature("signature").length}/1000 characters
                    </p>
                  </div>
                  {signatureErrors.signature && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {signatureErrors.signature.message}
                    </p>
                  )}
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="my-2 py-2 px-3 text-[14px] text-white rounded-xl bg-blue-600"
                    >
                      {isSignatureSubmitting ? (
                        <LoadingSpinner size="sm" text="Saving..." light />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <form onSubmit={handleSubmitNotification(onValidNotification)}>
              <div className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl my-6">
                <div className="flex flex-col p-1">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Notification Preferences
                    </h3>
                    <p className="text-[14px] text-gray-600 dark:text-gray-400">
                      Choose which email notifications you'd like to receive.
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mt-2">
                      <div>
                        <label
                          htmlFor="invoice-view"
                          className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                        >
                          Invoice viewed
                        </label>
                        <p className="font-[400] text-[14px] text-gray-600 dark:text-gray-400">
                          Email me when an invoice is viewed by a client
                        </p>
                      </div>
                      <div>
                        <label className="relative inline-block w-10 h-[22px] cursor-pointer">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            {...registerNotification("invoiceViewed")}
                          />
                          <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-gray-600 transition duration-300 peer-checked:bg-blue-500" />
                          <span className="absolute left-[3px] bottom-[3px] h-4 w-4 rounded-full bg-white dark:bg-gray-200 transition duration-300 peer-checked:translate-x-[18px]" />
                        </label>
                      </div>
                      {notificationErrors.invoiceViewed && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {notificationErrors.invoiceViewed.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between mt-2">
                      <div>
                        <label
                          htmlFor="invoice-view"
                          className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                        >
                          Overdue reminders
                        </label>
                        <p className="font-[400] text-[14px] text-gray-600 dark:text-gray-400">
                          Send me overdue invoice reminders.
                        </p>
                      </div>
                      <div>
                        <label className="relative inline-block w-10 h-[22px] cursor-pointer">
                          <input
                            {...registerNotification("overdueReminders")}
                            type="checkbox"
                            className="peer sr-only"
                          />
                          <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-gray-600 transition duration-300 peer-checked:bg-blue-500" />
                          <span className="absolute left-[3px] bottom-[3px] h-4 w-4 rounded-full bg-white dark:bg-gray-200 transition duration-300 peer-checked:translate-x-[18px]" />
                        </label>
                      </div>
                    </div>
                    {notificationErrors.overdueReminders && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {notificationErrors.overdueReminders.message}
                      </p>
                    )}
                    <div className="flex justify-between mt-2">
                      <div>
                        <label
                          htmlFor="invoice-view"
                          className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                        >
                          Payment received
                        </label>
                        <p className="font-[400] text-[14px] text-gray-600 dark:text-gray-400">
                          Email me when an invoice is paid
                        </p>
                      </div>
                      <div>
                        <label className="relative inline-block w-10 h-[22px] cursor-pointer">
                          <input
                            {...registerNotification("paymentReceived")}
                            type="checkbox"
                            className="peer sr-only"
                          />
                          <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-gray-600 transition duration-300 peer-checked:bg-blue-500" />
                          <span className="absolute left-[3px] bottom-[3px] h-4 w-4 rounded-full bg-white dark:bg-gray-200 transition duration-300 peer-checked:translate-x-[18px]" />
                        </label>
                      </div>
                      {notificationErrors.paymentReceived && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {notificationErrors.paymentReceived.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="my-2 py-2 px-3 text-[14px] text-white rounded-xl bg-blue-600"
                    >
                      {isNotificationSubmitting ? (
                        <LoadingSpinner size="sm" text="Saving..." light />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <form onSubmit={handleSubmitSecurity(onValidSecurity)}>
              <div className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl my-6">
                <div className="flex flex-col p-1">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Security
                    </h3>
                    <p className="text-[14px] text-gray-600 dark:text-gray-400">
                      Change the password you use to sign in to SoloPilot
                    </p>
                  </div>
                  <div className="mt-2 relative">
                    <label
                      htmlFor="currentPassword"
                      className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                    >
                      Current Password
                    </label>
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      id="currentPassword"
                      {...registerSecurity("currentPassword")}
                      className="p-2 px-4 text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 w-full my-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("current")}
                      className="absolute right-3 top-1/2 text-gray-500"
                    >
                      {showPassword.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {securityErrors.currentPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {securityErrors.currentPassword.message}
                    </p>
                  )}

                  <div className="relative mt-2">
                    <label
                      htmlFor="newPassword"
                      className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                    >
                      New Password
                    </label>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      {...registerSecurity("newPassword")}
                      className="p-2 px-4 text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 w-full my-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("new")}
                      className="absolute right-3 top-1/2 text-gray-500"
                    >
                      {showPassword.new ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {securityErrors.newPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {securityErrors.newPassword.message}
                    </p>
                  )}
                  <div className="mt-2 relative">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[14px] font-medium text-gray-700 dark:text-gray-200"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      {...registerSecurity("confirmPassword")}
                      className="p-2 px-4 text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 w-full my-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("confirm")}
                      className="absolute right-3 top-1/2 text-gray-500"
                    >
                      {showPassword.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {securityErrors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {securityErrors.confirmPassword.message}
                    </p>
                  )}
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="my-2 py-2 px-3 text-[14px] text-white rounded-xl bg-blue-600"
                    >
                      {isSecuritySubmitting ? (
                        <LoadingSpinner size="sm" text="Saving..." light />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}

export default ProfileSettings;
