"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Mail, User, Calendar, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { BACKEND_URL } from "@/constants/url";

interface WorkspaceInquiryFormProps {
  workspaceId: string | number;
  workspaceTitle?: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  number?: string;
  date?: string;
  time?: string;
  submit?: string;
}

const WorkspaceInquiryForm = ({ workspaceId, workspaceTitle }: WorkspaceInquiryFormProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    number: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.number.trim()) {
      newErrors.number = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.number.trim())) {
      newErrors.number = "Please enter a valid phone number";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("workspace_id", String(workspaceId));
      formDataToSend.append("first_name", formData.first_name.trim());
      formDataToSend.append("last_name", formData.last_name.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("number", formData.number.trim());
      formDataToSend.append("date", formData.date);
      formDataToSend.append("time", formData.time);

      const response = await fetch(`${BACKEND_URL}/workspace-inquiry`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit inquiry");
      }

      // Success
      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        number: "",
        date: "",
        time: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      setErrors({
        submit: error.message || "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900">
          Schedule a Visit
        </CardTitle>
        <CardDescription className="text-base">
          {workspaceTitle
            ? `Fill out the form below to inquire about ${workspaceTitle}`
            : "Fill out the form below and we'll get back to you soon."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-semibold">Inquiry Submitted Successfully!</p>
              <p className="text-green-700 text-sm mt-1">
                We've received your inquiry and will contact you shortly.
              </p>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-gray-500" />
                First Name *
              </label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className={errors.first_name ? "border-red-500" : ""}
                disabled={loading}
                required
              />
              {errors.first_name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.first_name}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-gray-500" />
                Last Name *
              </label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className={errors.last_name ? "border-red-500" : ""}
                disabled={loading}
                required
              />
              {errors.last_name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-gray-500" />
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={errors.email ? "border-red-500" : ""}
              disabled={loading}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label
              htmlFor="number"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-gray-500" />
              Phone Number *
            </label>
            <Input
              id="number"
              name="number"
              type="tel"
              value={formData.number}
              onChange={handleInputChange}
              placeholder="+44 648 8877"
              className={errors.number ? "border-red-500" : ""}
              disabled={loading}
              required
            />
            {errors.number && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.number}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                Preferred Date *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                className={errors.date ? "border-red-500" : ""}
                disabled={loading}
                required
              />
              {errors.date && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label
                htmlFor="time"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-gray-500" />
                Preferred Time *
              </label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className={errors.time ? "border-red-500" : ""}
                disabled={loading}
                required
              />
              {errors.time && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="orange"
            size="lg"
            className="w-full text-base py-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Submit Inquiry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkspaceInquiryForm;
