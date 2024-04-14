import { type ReactElement } from "react";
import { Review } from "../pages/TourOverview";

type ReviewCardProps = {
  review: Review;
};
function ReviewCard({ review }: ReviewCardProps): ReactElement {
  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          src={`/img/users/${review.user.photo}`}
          alt={`${review.user.name}`}
          className="reviews__avatar-img"
        />
        <h6 className="reviews__user">{review.user.name}</h6>
      </div>
      <p className="reviews__text">{review.review}</p>

      <div className="reviews__rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={Math.random() * 999}
            className={`reviews__star reviews__star--${
              review.rating >= i + 1 ? "active" : "inactive"
            }`}
          >
            <use href="/img/icons.svg#icon-star"></use>
          </svg>
        ))}
      </div>
    </div>
  );
}

export default ReviewCard;
