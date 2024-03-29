import { NavLink } from "react-router-dom";

export default function CartIcon() {
  return (
    <div>
      <NavLink to={"/cart"}>
        <div className="cursor-pointer px-1 py-1">
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
      </NavLink>
    </div>
  );
}
