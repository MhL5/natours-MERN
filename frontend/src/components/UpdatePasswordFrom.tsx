import { FormEvent, useState } from "react";
import { useUpdateMyPassword } from "../hooks/useUpdateMyPassword";

function UpdatePasswordForm() {
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { isPending: loading, updateMyPassword } = useUpdateMyPassword();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateMyPassword({ password, passwordConfirm, passwordCurrent });
  }

  return (
    <form className="form form-user-settings" onSubmit={handleSubmit}>
      <div className="form__group">
        <label className="form__label" htmlFor="password-current">
          Current password
        </label>
        <input
          id="password-current"
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          value={passwordCurrent}
          onChange={(e) => setPasswordCurrent(e.target.value)}
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form__group ma-bt-lg">
        <label className="form__label" htmlFor="password-confirm">
          Confirm password
        </label>
        <input
          id="password-confirm"
          className="form__input"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="form__group right">
        <button className="btn btn--small btn--green" type="submit">
          {loading ? "loading..." : `Save password`}
        </button>
      </div>
    </form>
  );
}

export default UpdatePasswordForm;
