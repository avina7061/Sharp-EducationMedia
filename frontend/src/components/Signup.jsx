import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8003/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          username: "",
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
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full sm:w-96 p-8 bg-white shadow-xl rounded-xl border border-gray-200">
        <h1 className="text-center text-4xl font-semibold text-gray-800 mb-6">
          Create Your Account
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Join us and start exploring amazing content.
        </p>
        <form onSubmit={signupHandler} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              type="text"
              name="username"
              id="username"
              value={input.username}
              onChange={changeEventHandler}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out"
              placeholder="Enter your username"
            />
          </div>

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
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out"
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
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out"
              placeholder="Enter your password"
            />
          </div>

          {loading ? (
            <Button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition duration-200">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing Up...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full py-3 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition duration-200"
            >
              Signup
            </Button>
          )}
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-500 hover:underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
