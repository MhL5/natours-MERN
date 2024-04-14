import { type ReactElement } from "react";
import OverviewBoxDetail from "./OverviewBoxDetail";
import ReviewCard from "./ReviewCard";
import { TourData } from "../pages/TourOverview";
import { useAuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

type TourProps = { tour: TourData };
function Tour({ tour }: TourProps): ReactElement {
  const { user } = useAuthContext();
  const tourData = tour?.data || "";
  if (!tourData) return <div>NOT FOUND</div>;
  if (!tour) return <div>NOT FOUND</div>;

  const date = new Date(tourData.startDates[0]).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            alt={`${tourData.name}`}
            src={`/img/tours/${tourData.imageCover}`}
            className="header__hero-img"
          />
        </div>

        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tourData.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use href="/img/icons.svg#icon-clock"></use>
              </svg>
              <span className="heading-box__text">
                {tourData.duration} days
              </span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use href="/img/icons.svg#icon-map-pin"></use>
              </svg>
              <span className="heading-box__text">
                {tourData.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <OverviewBoxDetail
                label="Next date"
                text={date}
                icon="calendar"
                key={Math.random()}
              />
              <OverviewBoxDetail
                label="Difficulty"
                text={tourData.difficulty}
                icon="trending-up"
                key={Math.random()}
              />
              <OverviewBoxDetail
                label="Participants"
                text={tourData.maxGroupSize.toString()}
                icon="user"
                key={Math.random()}
              />
              <OverviewBoxDetail
                label="Rating"
                text={tourData.ratingsAverage.toString()}
                icon="star"
                key={Math.random()}
              />
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>

              {tourData.guides.map((guide) => {
                return (
                  <div key={guide._id} className="overview-box__detail">
                    <img
                      src={`/img/users/${guide.photo}`}
                      alt={`${guide.name}`}
                      className="overview-box__img"
                    />
                    <span className="overview-box__label">
                      {guide.role === "lead-guide"
                        ? "lead guide"
                        : "tour guide"}
                    </span>
                    <span className="overview-box__text">{guide.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">
            About {tourData.name} tour
          </h2>
          {tourData.description.split("\n").map((desc) => (
            <p key={999 * Math.random()} className="description__text">
              {desc}
            </p>
          ))}
        </div>
      </section>

      <section className="section-pictures">
        {tourData.images.map((img, i) => (
          <div key={Math.random() * 999} className="picture-box">
            <img
              className={`picture-box__img picture-box__img--${i + 1}`}
              src={`/img/tours/${img}`}
              alt={`The Park Camper Tour ${i + 1}`}
            />
          </div>
        ))}
      </section>

      <section className="section-map">
        <div id="map"></div>
      </section>

      <section className="section-reviews">
        <div className="reviews">
          {tourData.reviews.map((review) => (
            <ReviewCard review={review} />
          ))}
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" className="" />
          </div>
          <img
            src={`/img/tours/${tourData.images[1]}`}
            alt="Tour picture"
            className="cta__img cta__img--1"
          />
          <img
            src={`/img/tours/${tourData.images[2]}`}
            alt="Tour picture"
            className="cta__img cta__img--2"
          />

          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tourData.duration} days. 1 adventure. Infinite memories. Make it
              yours today!
            </p>
            {user ? (
              <button className="btn btn--green span-all-rows">
                Book tour now!
              </button>
            ) : (
              <Link to="/login" className="btn btn--green span-all-rows">
                log in to book tour
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Tour;
