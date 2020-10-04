// Pull down to refresh content
// https://dev.to/vijitail/pull-to-refresh-animation-with-vanilla-javascript-17oc
const pStart = { x: 0, y: 0 };
const pCurrent = { x: 0, y: 0 };
const loading = document.querySelector("body > .loading-container");
var isLoading = false; // Yeah, yeah. Using a global.

if (loading){
  function swipeStart(e) {
    if (typeof e["targetTouches"] !== "undefined") {
      let touch = e.targetTouches[0];
      pStart.x = touch.screenX;
      pStart.y = touch.screenY;
    } 
    else {
      pStart.x = e.screenX;
      pStart.y = e.screenY;
    }
  }
  
  
  function swipeEnd(e) {
    isLoading=false;
  }

  function swipe(e) {
    if (typeof e["changedTouches"] !== "undefined") {
      let touch = e.changedTouches[0];
      pCurrent.x = touch.screenX;
      pCurrent.y = touch.screenY;
    } 
    else {
      pCurrent.x = e.screenX;
      pCurrent.y = e.screenY;
    }
  
    let changeY = pStart.y < pCurrent.y ? Math.abs(pStart.y - pCurrent.y) : 0;
    if (document.body.scrollTop === 0) {
      if (changeY > 100 && isLoading == false) {
        loading.style.display = 'flex';
        isLoading = true;
        fetch('/refresh');
        setTimeout(() => {
          loading.style.display = 'none';
          window.location = '/';
        }, 3000);
      }
    }
  }

  document.addEventListener("touchstart", e => swipeStart(e), false);
  document.addEventListener("touchmove", e => swipe(e), false);
}

// Create a Checkout Session with the selected plan ID
var createCheckoutSession = function(priceId) {
  return fetch("/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      priceId: priceId
    })
  }).then(function(result) {
    return result.json();
  });
};

// Handle any errors returned from Checkout
var handleResult = function(result) {
  if (result.error) {
    console.log(document.getElementById("error-message").error.message);
  }
};



// Get Stripe publishable key to initialize Stripe.js
document.addEventListener("DOMContentLoaded", function(event) {
  if (document.getElementById("activate-premium-plan-btn")){
    fetch("/setup").then(function(result) {
        return result.json();
      })
    .then(function(json) {
      var publishableKey = json.publishableKey;
      var subcriptionPriceId = json.basicPrice;

      var stripe = Stripe(publishableKey);
      // Setup event handler to create a Checkout Session when button is clicked
      var subcriptionButton = document.getElementById("activate-premium-plan-btn");

      if ( subcriptionButton ){
        subcriptionButton.addEventListener("click", function(evt) {
          evt.target.innerHTML = "Loading..."
          evt.target.className = "button is-light"
        
          createCheckoutSession(subcriptionPriceId).then(function(data) {
            // Call Stripe.js method to redirect to the new Checkout page
            stripe.redirectToCheckout({
              sessionId: data.sessionId
            }).then(handleResult);
          });
        });
      }
    });  
  }
  
});

  

// Cancel subscription link
var form = document.getElementById("cancel-subscription-form");
if (form){
  document.getElementById("cancel-subscription-link").addEventListener("click", function () {
    form.submit();
  });  
}

// Use backup image with Favicon does not load
document.addEventListener("DOMContentLoaded", function(event) {
   document.querySelectorAll('img').forEach(function(img){
  	img.onerror = function(){
      this.onerror=null;
      console.log(this.getAttribute('data-backup'));
      this.src = this.getAttribute('data-backup');
    };
   })


   document.querySelectorAll('.hide-alert').forEach(function(btn){
     btn.addEventListener("click", function (e) {
       e.target.parentElement.style.display = 'none';
     });
   })
});


// Get user timezone
user_timezone = new Date().toString().match(/GMT([^ ]+)/)[1];
document.cookie = `user_timezone=${user_timezone.slice(0, 3)}:${user_timezone.slice(3,5)};secure`;


// Use backup image with Favicon does not load
document.querySelectorAll('.unlock-button').forEach(function(btn){

  btn.addEventListener("click", function (e) {
    postData('/profile/visibility', { public: e.target.value })
      .then(data => {
        // console.log(data); // JSON data parsed by `data.json()` call
        // TODO: Don't want to deal with state management now. Just refresh.
        window.location = '/profile'
    });
  });
});
  



// Delete old cookies
document.querySelectorAll('.disconnect-button').forEach(function(btn){

  btn.addEventListener("click", function (e) {
    // debugger;
    postData('/disconnect/session', { public_id: e.target.dataset.publicId })
      .then(data => {
        // console.log(data); // JSON data parsed by `data.json()` call
        // TODO: Don't want to deal with state management now. Just refresh.
        window.location = '/security'
    });
  });
});
  


// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}




// Menu
document.addEventListener('DOMContentLoaded', () => {
  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if (navbarBurgers.length > 0) {

    // Add a click event on each of them
    navbarBurgers.forEach( burger => {
      
      burger.addEventListener('blur', () => {

        // Get the target from the "data-target" attribute
        const nav = document.getElementById( burger.dataset.target );

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        burger.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        console.log('blur');
        
      });


      burger.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const nav = document.getElementById( burger.dataset.target );

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        burger.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        nav.focus();
        
        // nav.burger.addEventListener('blur', () => {
        //   burger.classList.toggle('is-active');
        //   nav.classList.toggle('is-active');
        // });
        
        // document.querySelectorAll('.logo').forEach(function(logo){
        //   logo.classList.toggle('is-hidden');
        // })
        
      });
    });
    
    
    
    
  }

});