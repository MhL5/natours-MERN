import { type ReactElement } from "react";

type OverviewBoxDetailProps = {
  label: string;
  text: string;
  icon: string;
};

function OverviewBoxDetail({
  label,
  text,
  icon,
}: OverviewBoxDetailProps): ReactElement {
  return (
    <div className="overview-box__detail">
      <svg className="overview-box__icon">
        <use href={`/img/icons.svg#icon-${icon}`}></use>
      </svg>
      <span className="overview-box__label">{label}</span>
      <span className="overview-box__text">{text}</span>
    </div>
  );
}

export default OverviewBoxDetail;
