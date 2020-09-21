$(document).ready(function () {
   let shoppingCart = (function () {
      cart = [];

      // Item Constructor:
      class Item {
         constructor(name, price, count) {
            this.name = name;
            this.price = price;
            this.count = count;
         }
      }

      // Save cart:
      function saveCart() {
         localStorage.setItem('shoppingCart', JSON.stringify(cart));
      }

      // Load cart:
      function loadCart() {
         cart = JSON.parse(localStorage.getItem('shoppingCart'));
      }
      if (localStorage.getItem("shoppingCart") != null) {
         loadCart();
      }

      let product = {};

      // Add to cart:
      product.addItemToCart = function (name, price, count) {
         for (let item in cart) {
            if (cart[item].name === name) {
               cart[item].count++;
               saveCart();
               return;
            }
         }
         let item = new Item(name, price, count);
         cart.push(item);
         saveCart();
      }
      // Set count from item:
      product.setCountForItem = function (name, count) {
         for (let i in cart) {
            if (cart[i].name === name) {
               cart[i].count = count;
               break;
            }
         }
      };
      // Remove item from cart:
      product.removeItemFromCart = function (name) {
         for (let item in cart) {
            if (cart[item].name === name) {
               cart[item].count--;
               if (cart[item].count === 0) {
                  cart.splice(item, 1);
               }
               break;
            }
         }
         saveCart();
      }

      // Remove all items from cart:
      product.removeItemFromCartAll = function (name) {
         for (let item in cart) {
            if (cart[item].name === name) {
               cart.splice(item, 1);
               break;
            }
         }
         saveCart();
      }

      // Count cart: 
      product.totalCount = function () {
         let totalCount = 0;
         for (let item in cart) {
            totalCount += cart[item].count;
         }
         return totalCount;
      }

      // Total cart:
      product.totalCart = function () {
         let totalCart = 0;
         for (let item in cart) {
            totalCart += cart[item].price * cart[item].count;
         }
         return Number(totalCart.toFixed(2));
      }

      // VAT Calculator:
      product.vat = function () {
         let vatPercentage = (15 / 100);
         let vatAmount = this.totalCart() * vatPercentage;
         return vatAmount;
      }

      // Total Amount Including VAT:
      product.totalAfterVAT = function () {
         let totalIncludingVAT = this.totalCart() + this.vat();
         return totalIncludingVAT;
      }

      // Discount Code:
      product.discount = function () {
         let discountAmount = (10 / 100);
         let totalAfterCode = this.totalAfterVAT() - (this.totalAfterVAT() * discountAmount);
         return totalAfterCode;
      }

      // Total Amount if Click and Collect is selected:
      product.clickAndCollect = function () {
         let collectTotal = this.totalAfterVAT() + 0;
         return collectTotal;
      }

      // Express Delivery Calculation:
      product.expressDelivery = function () {
         let express = 20;
         let totalAfterExpress = this.totalAfterVAT() + express;
         return totalAfterExpress;
      }

      // Standard Delivery Calculation:
      product.standardDelivery = function () {
         let standard = 10;
         let totalAfterStandard = this.totalAfterVAT() + standard;
         return totalAfterStandard;
      }

      // Next Day Delivery Calculation:
      product.nextDayDelivery = function () {
         let nextDay = 50;
         let totalAfterNextDay = this.totalAfterVAT() + nextDay;
         return totalAfterNextDay;
      }

      // List cart:
      product.listCart = function () {
         let cartCopy = [];
         for (i in cart) {
            item = cart[i];
            itemCopy = {};
            for (p in item) {
               itemCopy[p] = item[p];

            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy)
         }
         return cartCopy;
      }

      return product;
   })();

   // Display Cart Function:
   function displayCart() {

      let cartArray = shoppingCart.listCart();
      let output = "";
      for (let i in cartArray) {
         output +=
            `<tr>
        <td>
         ${cartArray[i].name}
        </td>
         <td>
            <div class='input-group'>
               <button class='minusItem input-group-addon btn btn-light' data-name= '${cartArray[i].name}'>-</button>
               <input type='number' class='itemCount form-control' data-name= '${cartArray[i].name}' value='${cartArray[i].count}'>
               <button class='plusItem btn btn-light input-group-addon' data-name= '${cartArray[i].name}'>+</button>
            </div>
         </td>
         <td>
            <button class='deleteItem btn btn-light' data-name='${cartArray[i].name}'>X</button>
         </td>
         <td>R${cartArray[i].total}</td>
      </tr>`
      }
      $('.showCart').html(output);
      $('.cartTotal').html(shoppingCart.totalCart());
      $('.vatAmount').html(shoppingCart.vat());
      $('.totalAmount').html(shoppingCart.totalAfterVAT());
      $('.totalCount').html(shoppingCart.totalCount());

   }

   // Add item:
   $('.cartBtn').click(function (event) {
      event.preventDefault();
      let name = $(this).data('name');
      let price = Number($(this).data('price'));
      shoppingCart.addItemToCart(name, price, 1);
      let currentTotal = shoppingCart.totalCart();
      alert(`The ${name} has been added to your cart and your current total is R${currentTotal}`);
      displayCart();
      saveCart();
   });

   // Delete item button:
   $('.showCart').on("click", ".deleteItem", function (event) {
      let name = $(this).data('name')
      shoppingCart.removeItemFromCartAll(name);
      displayCart();
      saveCart();
   })


   // Minus One:
   $('.showCart').on("click", ".minusItem", function (event) {
      let name = $(this).data('name')
      shoppingCart.removeItemFromCart(name);
      displayCart();
      saveCart();
   })
   // Add One:
   $('.showCart').on("click", ".plusItem", function (event) {
      let name = $(this).data('name')
      shoppingCart.addItemToCart(name);
      displayCart();
      saveCart();
   })

   // Item count Input:
   $('.showCart').on("change", ".itemCount", function (event) {
      let name = $(this).data('name');
      let count = Number($(this).val());
      shoppingCart.setCountForItem(name, count);
      displayCart();
      saveCart();
   });

   // Adding the discount amount to total amount:
   $('.codeBtn').click(function (event) {
      let codeInput = document.getElementById("codeInput").value;
      if (codeInput === 'SKIN10') {
         alert(`Great! The discount has been added to your final amount.`);
         let discount = shoppingCart.discount();
         $('.totalAmount').html(discount);

      } else {
         alert(`Do you not want to get 10% off your order?`);
         $('.totalAmount').html(shoppingCart.totalAfterVAT());
      }
      saveCart();
      displayCart();
   });

   // Show/Hide delivery option:
   $('.drop-down-show-hide').hide();
   $('#deliveryOptions').change(function () {
      $('.drop-down-show-hide').hide()
      $('#' + this.value).show();
      // saveCart();
      displayCart();
   });

   // Adding the delivery amount to the total:
   $('#deliveryOptions').change(function () {
      let optionSelected = $(this).children("option:selected").val();
      if (optionSelected === '20') {
         alert(`R${optionSelected} has been added to your total amount.`);
         let express = shoppingCart.expressDelivery();
         $('.totalAmount').html(express);

      } else if (optionSelected === '10') {
         alert(`R${optionSelected} has been added to your total amount.`);
         let standard = shoppingCart.standardDelivery();
         $('.totalAmount').html(standard);

      } else if (optionSelected === '50') {
         alert(`R${optionSelected} has been added to your total amount.`);
         let nextDay = shoppingCart.nextDayDelivery();
         $('.totalAmount').html(nextDay);
      }
      saveCart();
      displayCart();
   });

   // Random Number Generator:
   $('.confirmButton').click(function (event) {
      let referenceNumber = 1 + Math.floor(Math.random() * 10000000000);
      alert(`Your order is successful! Here is your reference number: ${referenceNumber}.`);

      // Animation:
      $('.thanksBanner').animate({
         height: '300px',
         width: '500px'
         
      }).css("color", "white").slideUp(4000).slideDown(4000); // Chained effects
      saveCart();
      displayCart();
   });

   // Drop-down Menu:
   $('.dropdown').click(function () {
      $('.dropdown-toggle').dropdown()
      saveCart();
      displayCart();
   });
   displayCart();
});