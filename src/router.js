import Vue from 'vue';
import VueRouter from "vue-router";
import ProductList from "./component/product/ProductList";
import ProductPurchase from "./component/product/ProductPurchase";
import ProductSell from "./component/product/ProductSell";

Vue.use(VueRouter);

const routes = [
  { path : "/", component : ProductList },
  { path : "/urun-islemleri", component : ProductPurchase },
  { path : "/urun-cikisi", component : ProductSell },
  { path:  "*", redirect : "/"}
];


export const router = new VueRouter({
  mode : "history",
  routes
});
