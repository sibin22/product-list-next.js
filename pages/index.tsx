"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/router";
import React from "react";

// Define the schema using Zod and set the validation message
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
type LoginFormInputs = z.infer<typeof loginSchema>;

// Login component
const LoginPage = () => {
  // Using next router
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Login API call
  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true); // Set loading to true when starting the request
    setError(null); // Clear any previous errors

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // localStorage.setItem('authToken', result.token);
        // Route to products table page
        router.push("/products");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" {...register("username")} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit" aria-label="login" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
