import React, { useState } from "react";
const API_URL = import.meta.env.SERVER_API_URL; // Base URL from .env file

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const AuthSystem = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  //Validate Login form
  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Validate Register Form
  const validateRegisterForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!registerData.name?.trim()) {
      newErrors.name = "Full name is required";
    } else if (registerData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!registerData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(registerData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginInputChange = (field: keyof FormData, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setSuccess("");
  };

  const handleRegisterInputChange = (field: keyof FormData, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
    if (registerErrors[field]) {
      setRegisterErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setSuccess("");
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setLoginErrors({});
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // ✅ Success
      setSuccess(data.message || "Login successful! Welcome back.");

      // Reset form
      setLoginData({ email: "", password: "" });

      // Store JWT token if available
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Optionally store user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch {
      setLoginErrors({
        general: "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setRegisterErrors({});
    setSuccess("");

    try {
      // Call your backend API
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      // ✅ Success
      setSuccess("Account created successfully! You can now sign in.");
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Switch to login tab after a delay
      setTimeout(() => {
        setActiveTab("login");
        setSuccess(
          "Registration complete! Please sign in with your credentials."
        );
      }, 2000);
    } catch {
      setRegisterErrors({
        general: "Registration failed. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setLoginErrors({});
    setRegisterErrors({});
    setSuccess("");

    try {
      // Redirect user to Google OAuth backend route
      window.location.href = `${API_URL}/auth/google`;
    } catch {
      const errorMsg = "Google authentication failed. Please try again.";
      if (activeTab === "login") {
        setLoginErrors({ general: errorMsg });
      } else {
        setRegisterErrors({ general: errorMsg });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const currentErrors = activeTab === "login" ? loginErrors : registerErrors;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border bg-card text-card-foreground">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Research Mate
            </CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {success && (
              <Alert variant="default" className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {currentErrors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{currentErrors.general}</AlertDescription>
              </Alert>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              {/* --- Login Form --- */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) =>
                      handleLoginInputChange("email", e.target.value)
                    }
                    className={loginErrors.email ? "border-destructive" : ""}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {loginErrors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        handleLoginInputChange("password", e.target.value)
                      }
                      className={
                        loginErrors.password ? "border-destructive" : ""
                      }
                      disabled={isLoading || isGoogleLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || isGoogleLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              {/* --- Register Form --- */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.name || ""}
                    onChange={(e) =>
                      handleRegisterInputChange("name", e.target.value)
                    }
                    className={registerErrors.name ? "border-destructive" : ""}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {registerErrors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registerErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email Address</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) =>
                      handleRegisterInputChange("email", e.target.value)
                    }
                    className={registerErrors.email ? "border-destructive" : ""}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {registerErrors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registerErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) =>
                      handleRegisterInputChange("password", e.target.value)
                    }
                    className={
                      registerErrors.password ? "border-destructive" : ""
                    }
                    disabled={isLoading || isGoogleLoading}
                  />
                  {registerErrors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registerErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">
                    Confirm Password
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword || ""}
                    onChange={(e) =>
                      handleRegisterInputChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    className={
                      registerErrors.confirmPassword ? "border-destructive" : ""
                    }
                    disabled={isLoading || isGoogleLoading}
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleRegister}
                  className="w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={isLoading || isGoogleLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Button variant="link" className="p-0 h-auto font-medium">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="p-0 h-auto font-medium">
                Privacy Policy
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthSystem;
