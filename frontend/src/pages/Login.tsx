import { FormEvent, useState, type ReactElement } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLogin } from "../hooks/useLogin";

function Login(): ReactElement {
  const [email, setEmail] = useState("ayls@example.com");
  const [password, setPassword] = useState("test1234");
  const { loginFn } = useLogin();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    loginFn({ email, password });
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="login-form">
          <h2 className="heading-secondary ma-bt-lg">log into your account</h2>
          <form action="" className="form" onSubmit={handleSubmit}>
            <div className="form__group">
              <label htmlFor="email" className="form__label">
                Email address
              </label>
              <input
                type="email"
                className="form__input"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form__group">
              <label htmlFor="password" className="form__label">
                password
              </label>
              <input
                type="password"
                className="form__input"
                id="password"
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form__group">
              <button className="btn btn--green">Login</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
