'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  email: Yup.string()
    .required('Email is a required field')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is a required field')
    .min(7, 'Password must be at least 7 characters'),
});

function SignInForm() {
  const [shouldRemember, setShouldRemember] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: 'admin/listings/',
  });

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in to your account
        </h1>

        <Formik
          validationSchema={schema}
          initialValues={{ email: '', password: '' }}
          onSubmit={(values) => {
            login({
              email: values?.email,
              password: values?.password,
              remember: shouldRemember,
              setApiError,
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <>
              <form noValidate onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                  <p className="text-red-500 mt-1" role="alert">
                    {errors.email && touched.email && errors.email}
                  </p>
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <p className="text-red-500 mt-1" role="alert">
                    {errors.password && touched.password && errors.password}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 mb-5">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        checked={shouldRemember}
                        onChange={(e) => setShouldRemember(e.target.checked)}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800 cursor-pointer"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>
                <button className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Sign in
                </button>

                <div>
                  {apiError && (
                    <p className="text-red-500 mt-3" role="alert">
                      {apiError}
                    </p>
                  )}
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignInForm;
