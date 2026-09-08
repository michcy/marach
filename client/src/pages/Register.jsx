import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {register} from "../services/apiClient.js";
import Notification from "../components/Notification.jsx";
import {InfoIcon} from "lucide-react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [toggleVisibility, setToggleVisibility] = useState("/eye.png");
    const [loading, setLoading] = useState(false);

    async function validateForm() {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!username.trim()) {
            setError("Username is required");
            return false;
        }
        if (!password.trim()) {
            setError("Password is required");
            return false;
        }
        setError(null);
        return true;
    }

    const togglePasswordVisibility = () => {
        const passwordInput = document.getElementById("password");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            setToggleVisibility("/hidden.png");
        } else {
            passwordInput.type = "password";
            setToggleVisibility("/eye.png");
        }
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (isValid) {
            try {
                setLoading(true);
                await register({email: email.trim(), username: username.trim(), password: password.trim()}).then(
                    (response) => {
                        if (response.status === 201) {
                            navigate("/login");
                        } else {
                            setError(response.data.error || "Register failed");
                            setLoading(false);
                        }
                    }
                ).catch((error) => {
                    setError(error.response?.data?.error || "An error occurred during registration");
                    setLoading(false);
                })
            } catch (error) {
                setError("An error occurred during registration");
                setLoading(false);
            }
        }
    }

    return (
        <div
            className="text-white bg-[url(/img_1.png)] bg-no-repeat bg-cover min-h-dvh lg:max-h-lvh flex items-center justify-center">
            <div
                className="bg-white/10 gap-8 shadow-md backdrop-blur-2xl p-[min(2rem,6%)] border items-center w-full max-w-sm flex flex-col border-neutral-200 rounded-sm">
                <h1 className="text-4xl font-bold text-white">Register</h1>
                <form className="flex flex-col gap-6 w-full items-center"
                      onSubmit={async (e) => {
                          await handleSubmit(e);
                      }}>
                    {error &&
                        <Notification type="error" message={error}>
                            <InfoIcon className="text-red-800 size-5"/>
                        </Notification>
                    }
                    <input type="email"
                           placeholder="email"
                           id="email"
                           name="email"
                           className="border-white/50 focus:border-white w-full text-[clamp(0.15rem,calc(2vw+1rem),1rem)] min-w-0 appearance-none outline-none border rounded-2xl p-[min(0.5rem,5%)]"
                           onChange={(e) => setEmail(e.target.value)}
                           value={email}
                           required
                    />
                    <div
                        className="flex items-center border-white/50 focus-within:border-white w-full appearance-none outline-none border rounded-2xl p-[min(0.5rem,5%)]">
                        <span className="text-white/50">@</span>
                        <input type="text"
                               placeholder="username"
                               id="username"
                               name="username"
                               className="outline-none text-[clamp(0.15rem,calc(2vw+1rem),1rem)] min-w-0"
                               onChange={(e) => setUsername(e.target.value)}
                               value={username}
                               required/>
                    </div>
                    <div
                        className="flex items-center justify-between border-white/50 focus-within:border-white w-full appearance-none outline-none border rounded-2xl p-[min(0.5rem,5%)]">
                        <input type="password"
                               id="password"
                               placeholder="password"
                               className="outline-none text-[clamp(0.15rem,calc(2vw+1rem),1rem)] min-w-0"
                               name="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               required/>
                        <img src={toggleVisibility} alt="Toggle Password Visibility"
                             className="size-5 invert-100 cursor-pointer"
                             onClick={togglePasswordVisibility}
                        />
                    </div>
                    {loading ? (
                        <button
                            className="bg-gray-400 cursor-not-allowed rounded-2xl w-full text-black"
                            type="submit"
                            disabled>
                            <img src="/spinner.gif" alt="Loading..." className="size-10 mx-auto"/>
                        </button>
                    ) : (
                        <button
                            className="bg-white w-full text-[clamp(0.15rem,calc(2vw+1rem),1rem)] min-w-0 cursor-pointer rounded-2xl text-black p-[min(0.5rem,5%)]"
                            type="submit"
                            onClick={async (e) => {
                                await handleSubmit(e);
                            }}>Register
                        </button>
                    )}
                    <p className="text-neutral-200 text-[clamp(0.15rem,calc(2vw+1rem),1rem)] min-w-0 text-center items-center">Already have an account?
                        <Link to="/login"
                              className="text-white font-bold"> SIGN IN
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}