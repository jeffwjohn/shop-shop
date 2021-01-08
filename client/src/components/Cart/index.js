import React, { useEffect } from "react";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import { useStoreContext } from "../../utils/GlobalState";
import "./style.css";

const Cart = () => {
  const [state, dispatch] = useStoreContext();

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    };
  
    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);
  // You may wonder what happens if there's nothing to retrieve from the cached object store and state.cart.length is still 0. Does this useEffect() function just continuously run because of that? Well, it could very easily do that if we neglect to pass the state.cart.length value into useEffect()'s dependency array. That's the whole point of the dependency array. We list all of the data that this useEffect() Hook is dependent on to execute. The Hook runs on load no matter what, but then it only runs again if any value in the dependency array has changed since the last time it ran.
  
  function toggleCart() {
    dispatch({ type: TOGGLE_CART });    
  }
  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span
          role="img"
          aria-label="trash">🛒</span>
      </div>
    );
  } 
  
  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  console.log(state)
  //       // You should always wrap emojis (like the shopping cart icon) in a <span> element that includes role and aria-label attributes. Doing so will help screen readers understand the context of the emoji.
  return (
<div className="cart">
  <div className="close" onClick={toggleCart}>[close]</div>
  <h2>Shopping Cart</h2>
  {state.cart.length ? (
    <div>
      {state.cart.map(item => (
        <CartItem key={item._id} item={item} />
      ))}
      <div className="flex-row space-between">
        <strong>Total: ${calculateTotal()}</strong>
        {
          Auth.loggedIn() ?
            <button>
              Checkout
            </button>
            :
            <span>(log in to check out)</span>
        }
      </div>
    </div>
  ) : (
    <h3>
      <span role="img" aria-label="shocked">
        😱
      </span>
      You haven't added anything to your cart yet!
    </h3>
  )}
</div>
  );
};

export default Cart;
