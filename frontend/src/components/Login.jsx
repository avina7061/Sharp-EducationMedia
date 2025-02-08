import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8003/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-blue-100 via-teal-100 to-lime-100">
      <div className="w-full sm:w-96 p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        <h1 className="text-center text-4xl font-semibold text-gray-800 mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Login to access your account and see the latest updates.
        </p>
        <form onSubmit={signupHandler} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              value={input.email}
              onChange={changeEventHandler}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-teal-400 transition duration-300 ease-in-out"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              value={input.password}
              onChange={changeEventHandler}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-teal-400 transition duration-300 ease-in-out"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {loading ? (
                <Button className="flex items-center w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-3 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition duration-200"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-500 hover:underline">
              Signup
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
