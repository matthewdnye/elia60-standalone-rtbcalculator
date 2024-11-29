import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBrandingStore } from '../store/brandingStore';
import type { BrandingSettings } from '../types/branding';

const inputClasses = "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4";

export function BrandingSettings() {
  const { settings, loading, error, loadBranding, saveBranding } = useBrandingStore();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<BrandingSettings>();

  useEffect(() => {
    loadBranding();
  }, [loadBranding]);

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data: BrandingSettings) => {
    await saveBranding(data);
  };

  const ColorInput = ({ name, label, ...props }: { name: keyof BrandingSettings; label: string }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex gap-3 items-center">
        <div className="relative">
          <input
            type="color"
            {...register(name)}
            className="h-11 w-14 rounded border border-gray-300 p-1 cursor-pointer"
          />
        </div>
        <input
          type="text"
          {...register(name, {
            pattern: {
              value: /^#[0-9A-Fa-f]{6}$/,
              message: 'Please enter a valid hex color code'
            }
          })}
          className={inputClasses}
          placeholder="#000000"
          {...props}
        />
      </div>
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-2xl font-bold text-white">Branding Settings</h1>
            <p className="mt-2 text-blue-100">Customize how your calculators and reports appear to clients.</p>
          </div>

          {error && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Company Information */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    {...register('companyName', { required: 'Company name is required' })}
                    className={inputClasses}
                  />
                  {errors.companyName && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Website
                  </label>
                  <input
                    type="url"
                    {...register('website')}
                    className={inputClasses}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    {...register('logoUrl')}
                    className={inputClasses}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Brand Colors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ColorInput name="primaryColor" label="Primary Color" />
                <ColorInput name="secondaryColor" label="Secondary Color" />
                <ColorInput name="accentColor" label="Accent Color" />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className={inputClasses}
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className={inputClasses}
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={inputClasses}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={inputClasses}
                    placeholder="+1 (555) 555-5555"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...register('streetAddress')}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    {...register('postalCode')}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => reset(settings)}
                disabled={!isDirty || loading}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!isDirty || loading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}