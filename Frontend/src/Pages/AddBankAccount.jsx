
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBankAccount = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "Savings",
  });

  const [accountNumberVisible, setAccountNumberVisible] = useState(false);
  const [confirmAccountVisible, setConfirmAccountVisible] =
    useState(false);

  const [bankImage, setBankImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // Handle Image Upload
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        bankImage: "Only JPG, PNG or WEBP images are allowed.",
      }));

      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        bankImage: "Image size must be less than 5MB.",
      }));

      return;
    }

    setBankImage(file);

    setImagePreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      bankImage: "",
    }));
  };

  // =========================
  // Remove Image
  // =========================

  const removeImage = () => {
    setBankImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // Validation
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName =
        "Account holder name is required.";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber =
        "Account number is required.";
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber =
        "Account number must contain 9–18 digits.";
    }

    if (!formData.confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber =
        "Please confirm your account number.";
    } else if (
      formData.accountNumber !==
      formData.confirmAccountNumber
    ) {
      newErrors.confirmAccountNumber =
        "Account numbers do not match.";
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required.";
    } else if (
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)
    ) {
      newErrors.ifscCode =
        "Please enter a valid IFSC code.";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required.";
    }

    if (!formData.branchName.trim()) {
      newErrors.branchName =
        "Branch name is required.";
    }

    if (!bankImage) {
      newErrors.bankImage =
        "Please upload your bank account/passbook image.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      /*
       * Backend integration
       *
       * Later you can send this using FormData:
       *
       * const data = new FormData();
       *
       * data.append(
       *   "accountHolderName",
       *   formData.accountHolderName
       * );
       *
       * data.append(
       *   "accountNumber",
       *   formData.accountNumber
       * );
       *
       * data.append(
       *   "ifscCode",
       *   formData.ifscCode
       * );
       *
       * data.append(
       *   "bankName",
       *   formData.bankName
       * );
       *
       * data.append(
       *   "branchName",
       *   formData.branchName
       * );
       *
       * data.append(
       *   "accountType",
       *   formData.accountType
       * );
       *
       * data.append("bankImage", bankImage);
       *
       * await axios.post(
       *   "http://localhost:9090/user/bank-account/add",
       *   data,
       *   {
       *     headers: {
       *       Authorization:
       *         `Bearer ${localStorage.getItem("token")}`,
       *     },
       *   }
       * );
       */

      // Temporary simulation
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      alert("Bank account added successfully!");

      navigate("/my-profile");
    } catch (error) {
      console.error(
        "Error adding bank account:",
        error
      );

      alert(
        "Failed to add bank account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Cancel
  // =========================

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-6">

          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            Add Bank Account
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add your bank account details for secure
            payments and transactions.
          </p>

        </div>

        {/* =========================
            Main Card
        ========================= */}

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">

          <form onSubmit={handleSubmit}>

            {/* =========================
                Bank Details
            ========================= */}

            <div className="mb-8">

              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Bank Details
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Account Holder Name */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Account Holder Name
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="Enter account holder name"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                      errors.accountHolderName
                        ? "border-red-400"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />

                  {errors.accountHolderName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.accountHolderName}
                    </p>
                  )}
                </div>

                {/* Bank Name */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Bank Name
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                      errors.bankName
                        ? "border-red-400"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />

                  {errors.bankName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.bankName}
                    </p>
                  )}
                </div>

                {/* Account Number */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Account Number
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <div className="relative">

                    <input
                      type={
                        accountNumberVisible
                          ? "text"
                          : "password"
                      }
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setFormData((prev) => ({
                          ...prev,
                          accountNumber: value,
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          accountNumber: "",
                        }));
                      }}
                      placeholder="Enter account number"
                      maxLength={18}
                      inputMode="numeric"
                      className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition ${
                        errors.accountNumber
                          ? "border-red-400"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setAccountNumberVisible(
                          !accountNumberVisible
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                      aria-label={
                        accountNumberVisible
                          ? "Hide account number"
                          : "Show account number"
                      }
                    >
                      {accountNumberVisible ? "🙈" : "👁️"}
                    </button>

                  </div>

                  {errors.accountNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.accountNumber}
                    </p>
                  )}

                </div>

                {/* Confirm Account Number */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm Account Number
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <div className="relative">

                    <input
                      type={
                        confirmAccountVisible
                          ? "text"
                          : "password"
                      }
                      name="confirmAccountNumber"
                      value={
                        formData.confirmAccountNumber
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setFormData((prev) => ({
                          ...prev,
                          confirmAccountNumber:
                            value,
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          confirmAccountNumber: "",
                        }));
                      }}
                      placeholder="Re-enter account number"
                      maxLength={18}
                      inputMode="numeric"
                      className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition ${
                        errors.confirmAccountNumber
                          ? "border-red-400"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAccountVisible(
                          !confirmAccountVisible
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                      aria-label={
                        confirmAccountVisible
                          ? "Hide account number"
                          : "Show account number"
                      }
                    >
                      {confirmAccountVisible
                        ? "🙈"
                        : "👁️"}
                    </button>

                  </div>

                  {errors.confirmAccountNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmAccountNumber}
                    </p>
                  )}

                </div>

                {/* IFSC */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    IFSC Code
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => {
                      const value =
                        e.target.value.toUpperCase();

                      setFormData((prev) => ({
                        ...prev,
                        ifscCode: value,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        ifscCode: "",
                      }));
                    }}
                    placeholder="e.g. SBIN0001234"
                    maxLength={11}
                    className={`w-full rounded-lg border px-4 py-3 text-sm uppercase outline-none transition ${
                      errors.ifscCode
                        ? "border-red-400"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />

                  {errors.ifscCode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.ifscCode}
                    </p>
                  )}

                </div>

                {/* Branch Name */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Branch Name
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    placeholder="Enter branch name"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                      errors.branchName
                        ? "border-red-400"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />

                  {errors.branchName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.branchName}
                    </p>
                  )}

                </div>

                {/* Account Type */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Account Type
                  </label>

                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Savings">
                      Savings Account
                    </option>

                    <option value="Current">
                      Current Account
                    </option>
                  </select>

                </div>

              </div>
            </div>

            {/* =========================
                Bank Image Upload
            ========================= */}

            <div className="mb-7">

              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                Bank Account Proof
              </h2>

              <p className="mb-4 text-sm text-gray-500">
                Upload a clear image of your passbook,
                cancelled cheque, or bank account document.
              </p>

              {!imagePreview ? (

                <div
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition hover:border-blue-500 hover:bg-blue-50 ${
                    errors.bankImage
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                >

                  <div className="mb-3 text-4xl">
                    📄
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    Click to upload bank document
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP • Maximum 5MB
                  </p>

                </div>

              ) : (

                <div className="rounded-xl border border-gray-200 p-4">

                  <div className="mb-4 overflow-hidden rounded-lg bg-gray-100">

                    <img
                      src={imagePreview}
                      alt="Bank document preview"
                      className="max-h-80 w-full object-contain"
                    />

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Change Image
                    </button>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {errors.bankImage && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.bankImage}
                </p>
              )}

              {bankImage && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {bankImage.name}
                </p>
              )}

            </div>

            {/* =========================
                Security Notice
            ========================= */}

            <div className="mb-6 rounded-xl bg-blue-50 p-4">

              <div className="flex gap-3">

                <div className="text-xl">
                  🔒
                </div>

                <div>

                  <h3 className="text-sm font-semibold text-blue-800">
                    Keep your banking information secure
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Never share your ATM PIN, CVV, OTP,
                    internet banking password, or UPI PIN.
                    Only upload the requested bank account
                    document.
                  </p>

                </div>

              </div>

            </div>

            {/* =========================
                Buttons
            ========================= */}

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Adding..."
                  : "Add Bank Account"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccount;


