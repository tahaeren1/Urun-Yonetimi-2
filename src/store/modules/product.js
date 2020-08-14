import Vue from "vue";
import {router} from "../../router";
import response from "vue-resource/src/http/response";

const state = {
product : []
}


const getters = {
    getProducts(state) {
        return state.product;
    },
      getProduct(state){
      return key => state.product.filter(element => {
        return element.key == key;
      })
  }
}

const mutations = {
  updateProductList(state, product) {
    console.log("updateProductList");
    console.log(product);
    state.product.push(product);

  }

}

const actions = {
  initApp({commit}){
      //Vue Resource işlemleri...
    Vue.http.get("https://urun-islemleri-prod-5c25a.firebaseio.com/products.json")
      .then(response => {
        let data = response.body;
        for (let key in data) {
          data[key].key = key;
          commit("updateProductList", data[key]);
        }
      })
  },
  saveProduct({ dispatch, commit, state }, product) {
    //Vue Resource işlemleri...
     Vue.http.post("https://urun-islemleri-prod-5c25a.firebaseio.com/products.json", product)
       .then((response) =>{
         /****** ÜRÜN LİSTESİNİN GÜNCELLENMESİ *************/
         product.key = response.body.name;
         console.log("saveProduct");
         console.log(response);
          commit("updateProductList", product);

          /*********ALIŞ, SATIŞ, BAKİYE BİLGİLERİNİN GÜNCELLENMESİ  *///
         let tradeResult = {
           purchase: product.price,
            sale: 0,
            count : product.count
          }
         dispatch("setTradeResult", tradeResult)
         router.replace("/")

       })
  },
  sellProduct({state, commit, dispatch}, payload){
    //Vue Resource işlemleri...
    let product = state.product.filter(element => {
      return element.key == payload.key;
    })
      if (product) {
        let totalCount = product[0].count - payload.count;
      Vue.http.patch("https://urun-islemleri-prod-5c25a.firebaseio.com/products/" + payload.key + ".json", {count : totalCount})
        .then(response => {
          product[0].count = totalCount;
          let tradeResult = {
            purchase: 0,
            sale: product[0].price,
            count : product.count
          }
          dispatch("setTradeResult", tradeResult)
          router.replace("/")
        })
      }

  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
