import { FormEvent, useEffect, useState, type ReactElement } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useUpdateMe } from "../hooks/useUpdateMe";
import UpdatePasswordForm from "./UpdatePasswordFrom";
import SideAdminNav from "./SideAdminNav";
import SideNav from "./SideNav";

function MeTemplate(): ReactElement {
  const { user } = useAuthContext();
  const [name, setName] = useState<string>(() => user?.name || "");
  const [email, setEmail] = useState<string>(() => user?.email || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const { updateMe, newUserData } = useUpdateMe();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const userFormData = new FormData();
    userFormData.append("name", name);
    userFormData.append("email", email);
    if (photo) userFormData.append("photo", photo);

    updateMe({ userFormData });
  }

  useEffect(() => {
    if (!newUserData) return;
    setName(newUserData?.data.data.user.name);
    setEmail(newUserData?.data.data.user.email);
  }, [user, newUserData]);

  return (
    <>
      <main className="main">
        <div className="user-view">
          <nav className="user-view__menu">
            <SideNav />
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <SideAdminNav />
            </div>
          </nav>

          <div className="user-view__content">
            <div className="user-view__form-container">
              <h2 className="heading-secondary ma-bt-md">
                Your account settings
              </h2>
              <form className="form form-user-data" onSubmit={handleSubmit}>
                <div className="form__group">
                  <label className="form__label" htmlFor="name">
                    {user?.name}
                  </label>
                  <input
                    id="name"
                    className="form__input"
                    type="text"
                    value={`${name}`}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form__group ma-bt-md">
                  <label className="form__label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    className="form__input"
                    type="email"
                    value={`${email}`}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form__group form__photo-upload">
                  <img
                    className="form__user-photo"
                    src={`/img/users/${user?.photo}`}
                    alt="User photo"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form__upload"
                    id="photo"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="photo">Choose new photo</label>
                </div>
                <div className="form__group right">
                  <button className="btn btn--small btn--green" type="submit">
                    Save settings
                  </button>
                </div>
              </form>
            </div>
            <div className="line">&nbsp;</div>
            <div className="user-view__form-container">
              <h2 className="heading-secondary ma-bt-md">Password change</h2>

              <UpdatePasswordForm />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default MeTemplate;
