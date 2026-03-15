import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserRole = {
    #manufacturer;
    #vendor;
  };

  type ProductCategory = {
    #boneStraight;
    #curlyWig;
    #blondeWig;
    #bodyWave;
    #frontalWig;
    #deepWave;
    #bobWig;
    #closureWig;
    #closure12Inch;
    #closure14Inch;
    #closure16Inch;
    #closure18Inch;
    #closure20Inch;
    #bundle12Inch;
    #bundle14Inch;
    #bundle16Inch;
    #bundle18Inch;
    #bundle20Inch;
    #supplyBundle;
  };

  type BusinessProfile = {
    businessName : Text;
    role : UserRole;
    avatarUrl : Text;
    createdAt : Int;
  };

  type Product = {
    id : Nat;
    manufacturerId : Principal;
    name : Text;
    category : ProductCategory;
    priceFromCents : Nat;
    lengthOptions : [Text];
    moq : Nat;
    imageUrl : Text;
    createdAt : Int;
    lastUpdated : Int;
  };

  type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
  };

  type Order = {
    id : Nat;
    productId : Nat;
    sellerId : Principal;
    buyerId : Principal;
    quantity : Nat;
    totalCents : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  type ProductKey = {
    productId : Nat;
    manufacturerId : Principal;
  };

  module ProductKey {
    public func compare(a : ProductKey, b : ProductKey) : Order.Order {
      switch (Nat.compare(a.productId, b.productId)) {
        case (#equal) { Principal.compare(a.manufacturerId, b.manufacturerId) };
        case (other) { other };
      };
    };
  };

  type ProductMessage = {
    senderId : Principal;
    receiverId : Principal;
    productId : Nat;
    text : Text;
    timestamp : Int;
  };

  module ProductMessage {
    public func compare(a : ProductMessage, b : ProductMessage) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  var nextProductId = 1;
  var nextOrderId = 1;

  let businessProfiles = Map.empty<Principal, BusinessProfile>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let productMessages = Map.empty<Nat, List.List<ProductMessage>>();
  let productQuantities = Map.empty<ProductKey, Nat>();

  public query ({ caller }) func getCallerUserProfile() : async ?BusinessProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    businessProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?BusinessProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    businessProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : BusinessProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (businessProfiles.containsKey(caller)) {
      switch (businessProfiles.get(caller)) {
        case (?existing) {
          let updated = {
            profile with
            createdAt = existing.createdAt;
          };
          businessProfiles.add(caller, updated);
        };
        case (null) {};
      };
    } else {
      let profileWithTimestamps : BusinessProfile = {
        profile with
        createdAt = Time.now();
      };
      businessProfiles.add(caller, profileWithTimestamps);
    };
  };

  public query ({ caller }) func getBusinessProfile(user : Principal) : async ?BusinessProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    businessProfiles.get(user);
  };

  public shared ({ caller }) func createBusinessProfile(profile : BusinessProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    if (businessProfiles.containsKey(caller)) {
      Runtime.trap("Business profile already exists");
    };
    let profileWithTimestamps : BusinessProfile = {
      profile with
      createdAt = Time.now();
    };
    businessProfiles.add(caller, profileWithTimestamps);
  };

  public shared ({ caller }) func updateBusinessProfile(profile : BusinessProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (businessProfiles.get(caller)) {
      case (null) { Runtime.trap("Business profile does not exist") };
      case (?existing) {
        let updated = {
          profile with
          createdAt = existing.createdAt;
        };
        businessProfiles.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func createProduct(name : Text, category : ProductCategory, priceFromCents : Nat, lengthOptions : [Text], moq : Nat, imageUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create products");
    };
    switch (businessProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#manufacturer) {};
          case (#vendor) {
            Runtime.trap("Unauthorized: Only manufacturers can create products");
          };
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Profile required to create products");
      };
    };
    let product : Product = {
      id = nextProductId;
      manufacturerId = caller;
      name;
      category;
      priceFromCents;
      lengthOptions;
      moq;
      imageUrl;
      createdAt = Time.now();
      lastUpdated = Time.now();
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public shared ({ caller }) func updateProduct(productId : Nat, name : Text, priceFromCents : Nat, lengthOptions : [Text], moq : Nat, imageUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update products");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        if (existing.manufacturerId != caller) {
          Runtime.trap("Only product owner can update their product");
        };
        let updatedProduct = {
          existing with
          name;
          priceFromCents;
          lengthOptions;
          moq;
          imageUrl;
          lastUpdated = Time.now();
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    let productsList = List.empty<Product>();
    let iter = products.values();
    for (product in iter) {
      productsList.add(product);
    };
    productsList.toArray();
  };

  public query ({ caller }) func getProductsForManufacturer(manufacturerId : Principal) : async [Product] {
    let filteredProducts = products.values().toArray().filter(
      func(product) { product.manufacturerId == manufacturerId }
    );
    filteredProducts;
  };

  public query ({ caller }) func getProductsByCategory(category : ProductCategory) : async [Product] {
    let filteredProducts = products.values().toArray().filter(
      func(product) { product.category == category }
    );
    filteredProducts;
  };

  public shared ({ caller }) func placeOrder(productId : Nat, quantity : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    switch (businessProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#vendor) {};
          case (#manufacturer) {
            Runtime.trap("Unauthorized: Only vendors can place orders");
          };
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Profile required to place orders");
      };
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        loop {
          let stock = switch (productQuantities.get({ productId; manufacturerId = product.manufacturerId })) {
            case (?s) { s };
            case (null) { 0 };
          };

          if (stock < quantity) {
            Runtime.trap("Not enough stock available");
          };

          let totalCents = quantity * product.priceFromCents;

          let order : Order = {
            id = nextOrderId;
            productId;
            sellerId = product.manufacturerId;
            buyerId = caller;
            quantity;
            totalCents;
            status = #pending;
            createdAt = Time.now();
          };

          orders.add(nextOrderId, order);
          productQuantities.add(
            { productId; manufacturerId = product.manufacturerId },
            stock,
          );
          nextOrderId += 1;
          return order.id;
        };
      };
    };
  };

  public shared ({ caller }) func completeOrder(orderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.sellerId != caller) {
          Runtime.trap("Only seller can complete the order");
        };
        switch (order.status) {
          case (#delivered) { Runtime.trap("Order already completed") };
          case (#pending or #shipped) {
            let orderWithStatus = {
              order with
              status = #delivered;
            };
            orders.add(orderId, orderWithStatus);
          };
        };
      };
    };
  };

  public shared ({ caller }) func setProductQuantity(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set product quantity");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (product.manufacturerId != caller) {
          Runtime.trap("Only product owner can update quantity");
        };
        productQuantities.add(
          { productId; manufacturerId = product.manufacturerId },
          quantity,
        );
      };
    };
  };

  public query ({ caller }) func getProductQuantity(productId : Nat) : async Nat {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        switch (productQuantities.get({ productId; manufacturerId = product.manufacturerId })) {
          case (?quantity) { quantity };
          case (null) { 0 };
        };
      };
    };
  };

  public shared ({ caller }) func sendProductMessage(receiverId : Principal, productId : Nat, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let message : ProductMessage = {
      senderId = caller;
      receiverId;
      productId;
      text;
      timestamp = Time.now();
    };

    let existingMessages = switch (productMessages.get(productId)) {
      case (?messages) { messages };
      case (null) { List.empty<ProductMessage>() };
    };

    existingMessages.add(message);
    productMessages.add(productId, existingMessages);
  };

  public query ({ caller }) func getProductMessagesForProduct(productId : Nat) : async [ProductMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    switch (productMessages.get(productId)) {
      case (?messages) {
        let filteredMessages = messages.toArray().filter(
          func(msg : ProductMessage) : Bool {
            msg.senderId == caller or msg.receiverId == caller
          }
        );
        filteredMessages.sort();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func seedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed data");
    };
    products.clear();
    nextProductId := 1;

    let manufacturer1 : Principal = Principal.fromText("mf1");
    let manufacturer2 : Principal = Principal.fromText("mf2");
    let manufacturer3 : Principal = Principal.fromText("mf3");

    let manufacturer1Profile : BusinessProfile = {
      businessName = "Ray Hair Factory";
      role = #manufacturer;
      avatarUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/rayhairfactory.jpg";
      createdAt = Time.now();
    };

    let manufacturer2Profile : BusinessProfile = {
      businessName = "Saee Hair Factory";
      role = #manufacturer;
      avatarUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/saeehairfactory.jpg";
      createdAt = Time.now();
    };

    let manufacturer3Profile : BusinessProfile = {
      businessName = "Adamulo Wig Factory";
      role = #manufacturer;
      avatarUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/adamulohairfactory.jpg";
      createdAt = Time.now();
    };

    businessProfiles.add(manufacturer1, manufacturer1Profile);
    businessProfiles.add(manufacturer2, manufacturer2Profile);
    businessProfiles.add(manufacturer3, manufacturer3Profile);

    let productsArray : [Product] = [
      {
        id = nextProductId;
        manufacturerId = manufacturer1;
        name = "Bone Straight Closure Wig, 20 Inch";
        category = #boneStraight;
        priceFromCents = 16000;
        lengthOptions = ["18 inch", "20 inch", "24 inch", "26 inch"];
        moq = 2;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/bonestraight_closure_wig.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 1;
        manufacturerId = manufacturer2;
        name = "Curly Lace Frontal Wig, 16 Inch";
        category = #curlyWig;
        priceFromCents = 12000;
        lengthOptions = ["12 inch", "14 inch", "16 inch", "18 inch"];
        moq = 25;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/curly_lace_frontal_wig.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 2;
        manufacturerId = manufacturer3;
        name = "Blonde Bone Straight Closure Wig, 24 Inch";
        category = #boneStraight;
        priceFromCents = 55000;
        lengthOptions = ["22 inch", "24 inch", "26 inch"];
        moq = 15;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/bonestraight_blonde_closure_wig.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 3;
        manufacturerId = manufacturer1;
        name = "Body Wave Closure Wig, 20 Inch";
        category = #bodyWave;
        priceFromCents = 21000;
        lengthOptions = ["16 inch", "18 inch", "20 inch", "24 inch"];
        moq = 5;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/body_wave_closure_wig.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 4;
        manufacturerId = manufacturer2;
        name = "Curly Frontal Wig, 16 Inch";
        category = #curlyWig;
        priceFromCents = 25000;
        lengthOptions = ["12 inch", "16 inch", "20 inch"];
        moq = 18;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/curly_frontal_wave.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 5;
        manufacturerId = manufacturer2;
        name = "Deep Wave Closure Wig";
        category = #deepWave;
        priceFromCents = 14000;
        lengthOptions = ["12 inch", "14 inch", "16 inch", "18 inch"];
        moq = 5;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/deep_wave_closure_wig.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 6;
        manufacturerId = manufacturer3;
        name = "Blonde Body Wave Closure Wig, 26 Inch";
        category = #bodyWave;
        priceFromCents = 48000;
        lengthOptions = ["26 inch", "28 inch", "30 inch"];
        moq = 10;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/body_wave_blonde_clojure_wig.jpg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 7;
        manufacturerId = manufacturer1;
        name = "Bob Wig, 14 Inch";
        category = #bobWig;
        priceFromCents = 12000;
        lengthOptions = ["12 inch", "14 inch"];
        moq = 15;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/bob_wig.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 8;
        manufacturerId = manufacturer2;
        name = "Bob Wig, 12 Inch";
        category = #bobWig;
        priceFromCents = 12000;
        lengthOptions = ["12 inch", "14 inch"];
        moq = 18;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/bob_12inch.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
      {
        id = nextProductId + 9;
        manufacturerId = manufacturer3;
        name = "Frontal Wig, 20 Inch";
        category = #frontalWig;
        priceFromCents = 40000;
        lengthOptions = ["10 inch", "12 inch", "16 inch", "20 inch"];
        moq = 10;
        imageUrl = "https://oceanhair.s3.eu-central-1.amazonaws.com/frontal_20inch.jpeg";
        createdAt = Time.now();
        lastUpdated = Time.now();
      },
    ];

    for (product in productsArray.values()) {
      products.add(product.id, product);
      nextProductId += 1;
    };

    nextOrderId := 1;
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (orders.get(orderId)) {
      case (?order) {
        if (order.buyerId != caller and order.sellerId != caller) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getOrdersForProduct(productId : Nat) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (products.get(productId)) {
      case (?product) {
        if (product.manufacturerId != caller) {
          Runtime.trap("Unauthorized: Only product owner can view product orders");
        };
        orders.values().toArray().filter(
          func(order) { order.productId == productId }
        );
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query ({ caller }) func getOrdersForVendor(vendorId : Principal) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    if (caller != vendorId) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(
      func(order) { order.buyerId == vendorId }
    );
  };

  public query ({ caller }) func getOrdersForManufacturer(manufacturerId : Principal) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    if (caller != manufacturerId) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(
      func(order) { order.sellerId == manufacturerId }
    );
  };

  public query ({ caller }) func isVendor(profileId : Principal) : async Bool {
    switch (businessProfiles.get(profileId)) {
      case (?profile) { profile.role == #vendor };
      case (_) { false };
    };
  };

  public query ({ caller }) func isManufacturer(profileId : Principal) : async Bool {
    switch (businessProfiles.get(profileId)) {
      case (?profile) { profile.role == #manufacturer };
      case (_) { false };
    };
  };

  public query ({ caller }) func getProductQuantities() : async [(Nat, Nat)] {
    let resultList = List.empty<(Nat, Nat)>();

    for (product in products.values()) {
      switch (productQuantities.get({ productId = product.id; manufacturerId = product.manufacturerId })) {
        case (?quantity) {
          resultList.add((product.id, quantity));
        };
        case (null) {
          resultList.add((product.id, 0));
        };
      };
    };

    resultList.toArray();
  };

  public query ({ caller }) func filterProducts(sort : Text) : async [Product] {
    if (products.isEmpty()) {
      [];
    } else {
      let productsArray = products.values().toArray();
      switch (sort) {
        case ("newest") {
          let reversedList = List.empty<Product>();
          reversedList.add(Array.repeat(productsArray[0], 1)[0]);
          reversedList.toArray();
        };
        case (_) { productsArray };
      };
    };
  };

  module ListObjectOrder {
    public func compare(a : List.List<Product>, b : List.List<Product>) : Order.Order {
      Nat.compare(a.size(), b.size());
    };
  };

  module ListObjectFuncOrder {
    public func compare(a : List.List<Product>, b : List.List<Product>) : Order.Order {
      ListObjectOrder.compare(a, b);
    };
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    if (products.isEmpty() or searchTerm == "") {
      [];
    } else {
      products.values().toArray().filter(
        func(item) { item.name.contains(#text searchTerm) }
      );
    };
  };
};
