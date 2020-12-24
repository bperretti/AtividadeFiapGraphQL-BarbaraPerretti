const admin = require('firebase-admin');

const serviceAccount = require('./fiapgraphql-barbara-firebase-adminsdk-6omwk-7f1588aa4a.json')

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://fiapgraphql-barbara-default-rtdb.firebaseio.com/"
})

module.exports = {
    Query:{
        produto:()=>{
            return admin.database()
                   .ref("produtos")
                   .once("value")
                   .then(snap => snap.val())
                   .then(val => Object.keys(val)
                   .map((key)=>val[key]))
        }
    },
    Mutation:{
        novoProduto(_,{id,nomeproduto,descricao,fornecedor,preco,datacadastro}){
                const novo = {
                id:id,
                nomeproduto:nomeproduto,
                descricao:descricao,
                fornecedor:fornecedor,
                preco:preco,
                datacadastro:datacadastro
            }
            admin.database()
            .ref("produtos")
            .push(novo)
        
            return admin.database()
                    .ref("produtos")
                    .limitToLast(1)
                    .once("value")
                    .then(snap => snap.val())
                    .then(val => Object.keys(val)
                    .map((key)=>val[key]))
        },
        atualizarProduto(_,{ id, nomeproduto, descricao, fornecedor, preco}) {
            const update = {
              nomeproduto: nomeproduto,
              descricao: descricao,
              fornecedor: fornecedor,
              preco: preco,
            };
            admin
              .database()
              .ref("produtos/" + id)
              .update(update);
            return admin
              .database()
              .ref("produtos")
              .child(id)
              .once("value")
              .then((snap) => snap.val())
              .then((val) => val);
          },
          excluirProduto(_, { id }) {
            return admin
              .database()
              .ref("produtos/" + id)
              .remove();
          }
        }
}