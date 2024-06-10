let qfFoodDiv = document.getElementById("qfFoodCartContainer");
qfFoodDiv.style.backgroundColor = "black";
let qfFoodCartStoreBtn = document.getElementById("qfFoodcartOrderBtn");
let qfMyOrder = document.getElementById("qfFoodOrdersSection");
qfMyOrder.style.backgroundColor = "black";
let qfDeletePrevOrders = document.getElementById("qf-foodcart-delete-order");


let allOrders = JSON.parse(localStorage.getItem("foodCartList")) || [];
let foodCart = [];
let foodUniqueId = 1;
let orderId = 0;

/*Below function iterates over the foodCart Array of Objects 
and fetches the price of each foodItem inside it and stores & returns it in a newArray called foodBill*/
function getFoodPrice(foodItem) {
    let foodBill = [];
    for (let eachItem of foodItem) {
        let qfPrices = eachItem.foodPrice;

        foodBill.push(qfPrices);
    }
    return foodBill;
}

/*Below function iterates over the foodItemBill containing the prices of eachFood ordered
and calulates the totalBill and returns it*/
function getTotalBill(foodItemBill) {
    let totalBill = 0;
    for (let eachFood of foodItemBill) {
        totalBill += parseInt(eachFood);
    }

    return totalBill;
}

/*Below function iterates over the foodCart Array of Objects 
and first of all it deletes the foodItem from it then deletes foodItem element from the HTML struct
and recalculates the bill and renders it in real time in the HTML output*/
function delFood(fId) {
    let delItem = document.getElementById(fId);
    qfFoodDiv.removeChild(delItem);
    const sound = new Audio('resources/zoom-sound-effect-125029.mp3');
    sound.play();


    let qfDelIndex = foodCart.findIndex(function(eachFood) {
        let eachFoodId = "qf" + eachFood.foodId;
        if (eachFoodId === fId) {
            return true;
        } else {
            return false;
        }
    });

    foodCart.splice(qfDelIndex, 1);

    let prices = getFoodPrice(foodCart);
    let qfMainBill = getTotalBill(prices);

    document.getElementById("showBill").textContent = "Rs " + qfMainBill;
    console.log(foodCart);

    let lenFoodCart = foodCart.length;
    if (lenFoodCart === 0) {
        alert("Add some food item in your cart, it will be empty now!");
        document.getElementById("jsCheck").classList.remove('d-none');
    }


}

/*Below functions creats a foodItem object and dynamically renders in HTML output
and also pushes this object to the main foodCart Array of objects*/
function addFood(fName, fPrice) {
    let foodItem = {
        foodName: fName,
        foodPrice: fPrice,
        foodId: "qf" + foodUniqueId,
    };

    let foodItemId = "qf" + foodItem.foodId;
    let qfFoodItemDiv = document.createElement('div');
    qfFoodItemDiv.classList.add("qf-menu-section");
    qfFoodItemDiv.id = foodItemId;
    qfFoodDiv.appendChild(qfFoodItemDiv);

    let qfFoodItemCard = document.createElement('div');
    qfFoodItemCard.classList.add("d-flex", "flex-row");
    qfFoodItemDiv.appendChild(qfFoodItemCard);

    let qfFoodName = document.createElement('p');
    qfFoodName.classList.add("qf-menu-item", "p-3");
    qfFoodName.textContent = fName;
    qfFoodItemCard.appendChild(qfFoodName);

    let qfFoodDel = document.createElement('span');
    qfFoodDel.classList.add("ml-auto", "delete-icon", "qf-menu-card-head", "p-3");
    qfFoodDel.textContent = "X";

    qfFoodDel.onclick = function() {
        delFood(foodItemId);
    };

    qfFoodItemCard.appendChild(qfFoodDel);

    let hrFoodLine = document.createElement('hr');
    hrFoodLine.classList.add("bg-white");
    qfFoodDiv.appendChild(hrFoodLine);

    foodCart.push(foodItem);
    foodUniqueId += 1;

    let prices = getFoodPrice(foodCart);
    let qfMainBill = getTotalBill(prices);

    document.getElementById("showBill").textContent = "Rs " + qfMainBill;


    document.getElementById("jsCheck").classList.add('d-none');

}

/*Below function iterates over locally stored foodCart and dynamically appends the order*/
function createMyOrder(name,price, orderDiv){
    console.log(orderDiv);
    let mainOrderDiv = document.getElementById(orderDiv);
    console.log(mainOrderDiv)
    

    let qfMyOrderDiv = document.createElement('div');
    qfMyOrderDiv.classList.add("p-3");
    mainOrderDiv.appendChild(qfMyOrderDiv);

    let qfMyOrders = document.createElement('div');
    qfMyOrders.classList.add("d-flex", "flex-row", "justify-content-center");
    qfMyOrderDiv.appendChild(qfMyOrders);

    let qfMyOrderName = document.createElement('p');
    qfMyOrderName.classList.add("qf-menu-item", "p-3");
    qfMyOrderName.textContent = name;
    qfMyOrders.appendChild(qfMyOrderName);

    let hrMyOrderLine = document.createElement('hr');
    hrMyOrderLine.classList.add("bg-white");
    qfMyOrderDiv.appendChild(hrMyOrderLine);


}


function getMyOrder(foodItems){
        console.log(foodItems);

        let qfOrderDiv = document.createElement('div');
        qfOrderDiv.id = "orderID" + orderId;
        qfOrderDiv.classList.add("qf-order-Div");
        qfOrderDiv.textContent = "Order Placed On: " +  Date().toString();
        qfMyOrder.appendChild(qfOrderDiv);
        let qfOrderId  = qfOrderDiv.id

        for(let eachFood of foodItems){
        let name = eachFood.foodName;
        let price = eachFood.foodPrice;
        
        createMyOrder(name, price, qfOrderId);

    };
    
    orderId += 1;
}

/*Below function is used to store the foodCart object in the local storage*/
qfFoodCartStoreBtn.onclick = function(){

    if(foodCart.length === 0){
        alert("Your Food Cart is empty, kindly add some Food Items before ordering")
        return ;
    }

    allOrders.push(foodCart);
    localStorage.setItem("foodCartList", JSON.stringify(allOrders));

    getMyOrder(foodCart);

    const sound = new Audio('resources/069193_cutlery-draw-open-amp-closemp3-81304.mp3');
    sound.play();

    qfFoodDiv.textContent="";
    document.getElementById("showBill").textContent = "";
    
    foodCart = [];

    alert("Your Order is getting placed, wait for a moment !!!")
}

/*Below function gets the locally stored previous food Orders*/
function getPrevFoodOrder(){
    let stringifiedFoodOrder = localStorage.getItem("foodCartList")
    let parsedFoodOrder = JSON.parse(stringifiedFoodOrder);

    console.log(parsedFoodOrder);
    if(parsedFoodOrder === null){
        return []
    }else{
        return parsedFoodOrder;
    }
    
}

/*Below function deletes the locally stored previous food Orders*/
qfDeletePrevOrders.onclick = function(){
    localStorage.removeItem("foodCartList");
    qfMyOrder.textContent = ""
    const sound = new Audio('resources/zoom-sound-effect-125029.mp3');
    sound.play();
    alert("Dear User you are about to delete all your previous orders");
}

let prevOrders = getPrevFoodOrder();
console.log(prevOrders);
for(let eachOrder of prevOrders){
   let id = "orderID" + (prevOrders.length);
   console.log(id);
   
   console.log(eachOrder);
   getMyOrder(eachOrder);
    
}


/*Below function calculates the total bill and displays it to the user*/
let qfBill = document.getElementById("calculateBill");
qfBill.onclick = function() {
    let prices = getFoodPrice(foodCart); /*Gets all the prices of the ordered foodItems*/
    let qfMainBill = getTotalBill(prices); /*Calculates & returns the total price of the ordered foodItems*/

    document.getElementById("showBill").textContent = "Rs " + qfMainBill;
};

function addFoodSound(){
    const sound = new Audio('resources/tap-notification-180637 (1).mp3');
    sound.play();
}

/*Below functions are for adding the Starters Menu  foodItems to foodCart Array of objects*/
let addMenuS1 = document.getElementById("add-menu-s1");
addMenuS1.onclick = function() {
    let fName = document.getElementById("add-menu-name-s1").textContent;
    let fPrice = document.getElementById("qf-starter-s1").textContent;
    const icon = this;
    addMenuS1.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuS1.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};
let addMenuS2 = document.getElementById("add-menu-s2");
addMenuS2.onclick = function() {
    let fName = document.getElementById("add-menu-name-s2").textContent;
    let fPrice = document.getElementById("qf-starter-s2").textContent;
    const icon = this;
    addMenuS2.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuS2.classList.add("animate", true);

    addFoodSound();
    addFood(fName, fPrice);
};
let addMenuS3 = document.getElementById("add-menu-s3");
addMenuS3.onclick = function() {
    let fName = document.getElementById("add-menu-name-s3").textContent;
    let fPrice = document.getElementById("qf-starter-s3").textContent;
    const icon = this;
    addMenuS3.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuS3.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};
let addMenuS4 = document.getElementById("add-menu-s4");
addMenuS4.onclick = function() {
    let fName = document.getElementById("add-menu-name-s4").textContent;
    let fPrice = document.getElementById("qf-starter-s4").textContent;
    const icon = this;
    addMenuS4.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuS4.classList.add("animate", true);

    addFoodSound();
    addFood(fName, fPrice);
};
let addMenuS5 = document.getElementById("add-menu-s5");
addMenuS5.onclick = function() {
    let fName = document.getElementById("add-menu-name-s5").textContent;
    let fPrice = document.getElementById("qf-starter-s5").textContent;
    const icon = this;
    addMenuS5.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuS5.classList.add("animate", true);

    addFoodSound();
    addFood(fName, fPrice);
};
let addMenuS6 = document.getElementById("add-menu-s6");
addMenuS6.onclick = function() {
    let fName = document.getElementById("add-menu-name-s6").textContent;
    let fPrice = document.getElementById("qf-starter-s6").textContent;
    const icon = this;
    addMenuS6.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuS6.classList.add("animate", true);

    addFoodSound();
    addFood(fName, fPrice);
};


/*Below functions are for adding the Juices & Cold Drinks Menu  foodItems to foodCart Array of objects*/
let addMenuD1 = document.getElementById("add-menu-d1");
addMenuD1.onclick = function() {
    let fName = document.getElementById("add-menu-name-d1").textContent;
    let fPrice = document.getElementById("qf-juice-1").textContent;
    const icon = this;
    addMenuD1.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuD1.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuD2 = document.getElementById("add-menu-d2");
addMenuD2.onclick = function() {
    let fName = document.getElementById("add-menu-name-d2").textContent;
    let fPrice = document.getElementById("qf-juice-2").textContent;
    const icon = this;
    addMenuD2.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuD2.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuD3 = document.getElementById("add-menu-d3");
addMenuD3.onclick = function() {
    let fName = document.getElementById("add-menu-name-d3").textContent;
    let fPrice = document.getElementById("qf-juice-3").textContent;
    const icon = this;
    addMenuD3.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuD3.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuD4 = document.getElementById("add-menu-d4");
addMenuD4.onclick = function() {
    let fName = document.getElementById("add-menu-name-d4").textContent;
    let fPrice = document.getElementById("qf-juice-4").textContent;
    const icon = this;
    addMenuD4.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuD4.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuD5 = document.getElementById("add-menu-d5");
addMenuD5.onclick = function() {
    let fName = document.getElementById("add-menu-name-d5").textContent;
    let fPrice = document.getElementById("qf-juice-5").textContent;
    const icon = this;
    addMenuD5.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuD5.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuD6 = document.getElementById("add-menu-d6");
addMenuD6.onclick = function() {
    let fName = document.getElementById("add-menu-name-d6").textContent;
    let fPrice = document.getElementById("qf-juice-6").textContent;
    const icon = this;
    addMenuD6.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuD6.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

/*Below functions are for adding the Juices & Cold Drinks Menu  foodItems to foodCart Array of objects*/
let addMenuF1 = document.getElementById("add-menu-f1");
addMenuF1.onclick = function() {
    let fName = document.getElementById("add-menu-name-f1").textContent;
    let fPrice = document.getElementById("qf-ffood-1").textContent;
    const icon = this;
    addMenuF1.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuF1.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuF2 = document.getElementById("add-menu-f2");
addMenuF2.onclick = function() {
    let fName = document.getElementById("add-menu-name-f2").textContent;
    let fPrice = document.getElementById("qf-ffood-2").textContent;
    const icon = this;
    addMenuF2.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuF2.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuF3 = document.getElementById("add-menu-f3");
addMenuF3.onclick = function() {
    let fName = document.getElementById("add-menu-name-f3").textContent;
    let fPrice = document.getElementById("qf-ffood-3").textContent;
    const icon = this;
    addMenuF3.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuF3.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuF4 = document.getElementById("add-menu-f4");
addMenuF4.onclick = function() {
    let fName = document.getElementById("add-menu-name-f4").textContent;
    let fPrice = document.getElementById("qf-ffood-4").textContent;
    const icon = this;
    addMenuF4.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuF4.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuF5 = document.getElementById("add-menu-f5");
addMenuF5.onclick = function() {
    let fName = document.getElementById("add-menu-name-f5").textContent;
    let fPrice = document.getElementById("qf-ffood-5").textContent;
    const icon = this;
    addMenuF5.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuF5.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuF6 = document.getElementById("add-menu-f6");
addMenuF6.onclick = function() {
    let fName = document.getElementById("add-menu-name-f6").textContent;
    let fPrice = document.getElementById("qf-ffood-6").textContent;
    const icon = this;
    addMenuF6.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuF6.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

/*Below functions are for adding the Indian Cuisine Menu  foodItems to foodCart Array of objects*/
let addMenuI1 = document.getElementById("add-menu-i1");
addMenuI1.onclick = function() {
    let fName = document.getElementById("add-menu-name-i1").textContent;
    let fPrice = document.getElementById("qf-i-1").textContent;
    const icon = this;
    addMenuI1.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuI1.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuI2 = document.getElementById("add-menu-i2");
addMenuI2.onclick = function() {
    let fName = document.getElementById("add-menu-name-i2").textContent;
    let fPrice = document.getElementById("qf-i-2").textContent;
    const icon = this;
    addMenuI2.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuI2.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuI3 = document.getElementById("add-menu-i3");
addMenuI3.onclick = function() {
    let fName = document.getElementById("add-menu-name-i3").textContent;
    let fPrice = document.getElementById("qf-i-3").textContent;
    const icon = this;
    addMenuI3.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuI3.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuI4 = document.getElementById("add-menu-i4");
addMenuI4.onclick = function() {
    let fName = document.getElementById("add-menu-name-i4").textContent;
    let fPrice = document.getElementById("qf-i-4").textContent;
    const icon = this;
    addMenuI4.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuI4.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuI5 = document.getElementById("add-menu-i5");
addMenuI5.onclick = function() {
    let fName = document.getElementById("add-menu-name-i5").textContent;
    let fPrice = document.getElementById("qf-i-5").textContent;
    const icon = this;
    addMenuI5.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuI5.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuI6 = document.getElementById("add-menu-i6");
addMenuI6.onclick = function() {
    let fName = document.getElementById("add-menu-name-i6").textContent;
    let fPrice = document.getElementById("qf-i-6").textContent;
    const icon = this;
    addMenuI6.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuI6.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

/*Below functions are for adding the Veg Cuisine Menu  foodItems to foodCart Array of objects*/
let addMenuV1 = document.getElementById("add-menu-v1");
addMenuV1.onclick = function() {
    let fName = document.getElementById("add-menu-name-v1").textContent;
    let fPrice = document.getElementById("qf-v-1").textContent;
    const icon = this;
    addMenuV1.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuV1.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuV2 = document.getElementById("add-menu-v2");
addMenuV2.onclick = function() {
    let fName = document.getElementById("add-menu-name-v2").textContent;
    let fPrice = document.getElementById("qf-v-2").textContent;
    const icon = this;
    addMenuV2.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuV2.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuV3 = document.getElementById("add-menu-v3");
addMenuV3.onclick = function() {
    let fName = document.getElementById("add-menu-name-v3").textContent;
    let fPrice = document.getElementById("qf-v-3").textContent;
    const icon = this;
    addMenuV3.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuV3.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuV4 = document.getElementById("add-menu-v4");
addMenuV4.onclick = function() {
    let fName = document.getElementById("add-menu-name-v4").textContent;
    let fPrice = document.getElementById("qf-v-4").textContent;
    const icon = this;
    addMenuV4.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuV4.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuV5 = document.getElementById("add-menu-v5");
addMenuV5.onclick = function() {
    let fName = document.getElementById("add-menu-name-v5").textContent;
    let fPrice = document.getElementById("qf-v-5").textContent;
    const icon = this;
    addMenuV5.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuV5.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuV6 = document.getElementById("add-menu-v6");
addMenuV6.onclick = function() {
    let fName = document.getElementById("add-menu-name-v6").textContent;
    let fPrice = document.getElementById("qf-v-6").textContent;
    const icon = this;
    addMenuV6.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuV6.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

/*Below functions are for adding the Non-Veg Cuisine Menu  foodItems to foodCart Array of objects*/
let addMenuNV1 = document.getElementById("add-menu-nv1");
addMenuNV1.onclick = function() {
    let fName = document.getElementById("add-menu-name-nv1").textContent;
    let fPrice = document.getElementById("qf-nv-1").textContent;
    const icon = this;
    addMenuNV1.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuNV1.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuNV2 = document.getElementById("add-menu-nv2");
addMenuNV2.onclick = function() {
    let fName = document.getElementById("add-menu-name-nv2").textContent;
    let fPrice = document.getElementById("qf-nv-2").textContent;
    const icon = this;
    addMenuNV2.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuNV2.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuNV3 = document.getElementById("add-menu-nv3");
addMenuNV3.onclick = function() {
    let fName = document.getElementById("add-menu-name-nv3").textContent;
    let fPrice = document.getElementById("qf-nv-3").textContent;
    const icon = this;
    addMenuNV3.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuNV3.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuNV4 = document.getElementById("add-menu-nv4");
addMenuNV4.onclick = function() {
    let fName = document.getElementById("add-menu-name-nv4").textContent;
    let fPrice = document.getElementById("qf-nv-4").textContent;
    const icon = this;
    addMenuNV4.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuNV4.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuNV5 = document.getElementById("add-menu-nv5");
addMenuNV5.onclick = function() {
    let fName = document.getElementById("add-menu-name-nv5").textContent;
    let fPrice = document.getElementById("qf-nv-5").textContent;
    const icon = this;
    addMenuNV5.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuNV5.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};

let addMenuNV6 = document.getElementById("add-menu-nv6");
addMenuNV6.onclick = function() {
    let fName = document.getElementById("add-menu-name-nv6").textContent;
    let fPrice = document.getElementById("qf-nv-6").textContent;
    const icon = this;
    addMenuNV6.classList.remove("animate", false);
    void icon.offsetWidth; // Trigger reflow
    addMenuNV6.classList.add("animate", true);
    
    addFoodSound();
    addFood(fName, fPrice);
};