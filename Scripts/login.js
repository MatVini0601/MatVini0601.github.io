const URL = "https://deploy-planalto.onrender.com"

// function atualizarCadastro(){
//     const email = document.getElementById("caduser_email").value
//     const senha = document.getElementById("caduser_senha").value
//     const repetesenha = document.getElementById("caduser_conSenha").value
//     if(email === ""){
//         alert("Preencha os dados corretamente");
//     }
//     else{
//         if(senha === "" || repetesenha === "" || senha !== repetesenha){
//             alert("Senhas não conferem")
//             return
//         }
//         const id = localStorage.getItem("id")
//         const clienteData = {
//            "cpf": document.getElementById("caduser_cpf").value,
//            "rg": document.getElementById("caduser_rg").value,
//            "nome": document.getElementById("caduser_nome").value,
//            "endereco": document.getElementById("caduser_endereco").value,
//            "profissao": document.getElementById("caduser_profissao").value,
//         }
//         const dataUsuario = {
//             "email": document.getElementById("caduser_email").value,
//             "senha": document.getElementById("caduser_conSenha").value,
//         }
//         fetch(url+"Cliente/"+id, {
//             method: "PUT",
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify(clienteData)
//         })
//         fetch(url+`Usuario/`+id, {
//             method: "PUT",
//             headers: {'Content-Type': 'application/json'}, 
//             body: JSON.stringify(dataUsuario)
//             }).then(res => {
//                 alert("Cadastro atualizado com sucesso")
//                 window.location.href = "login.html"
//         })
//     }
// }

function getData(idUsuario){
    if(idUsuario === null || idUsuario === undefined){
        var id = localStorage.getItem("id")
    } else {
        var id = idUsuario
    }
    
    if(id === null || id === undefined){
        alert("Você precisa estar logado para executar essa ação")
        window.location.href = "/login"
    }else{
        fetch(url+"Cliente/"+id, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log(data)
            document.getElementById("caduser_cpf").value = data.cpf
            document.getElementById("caduser_nome").value = data.nome
            document.getElementById("caduser_rg").value = data.rg
            document.getElementById("caduser_email").value = data.usuario.email
            document.getElementById("caduser_senha").value = data.usuario.senha
            document.getElementById("caduser_profissao").value = data.profissao
            document.getElementById("caduser_endereco").value = data.endereco
        })
    }
}
//Cadastra um cliente
// function cadastrarCliente(){
//     const dataCliente = {
//         "cpf": document.getElementById("caduser_cpf").value,
//         "rg": document.getElementById("caduser_rg").value,
//         "nome": document.getElementById("caduser_nome").value,
//         "endereco": document.getElementById("caduser_endereco").value,
//         "profissao": document.getElementById("caduser_profissao").value,
//      }
//      const dataUsuario = {
//          "email": document.getElementById("caduser_email").value,
//          "senha": document.getElementById("caduser_conSenha").value,
//      }

//     fetch(url+"Usuario", {
//         method: "POST",
//         headers: {'Content-Type': 'application/json'}, 
//         body: JSON.stringify(dataUsuario)
//       }).then(res => {
//         return res.json();
//     }).then(data => {
//         debugger
//         console.log(data)
//         fetch(url+`Cliente/`+data.id, {
//             method: "POST",
//             headers: {'Content-Type': 'application/json'}, 
//             body: JSON.stringify(dataCliente)
//           }).then(res => {
//             if(res.status === 201){
//                 window.location.href = "/src/main/java/com/labsoftware/Rent/View/login.html"
//             }
//         })
//     });
// }

function fetchUser(){
    const email = document.getElementById("caduser_email").value
    fetch(url+`Usuario/logar/${email}`, {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        return res.json()
    }).then(data => {
        const senha = document.getElementById("caduser_senha").value
        if(senha === data.senha){
            console.log(data)
            localStorage.setItem("id", data.id)
            localStorage.setItem("nome", data.email)
            let hrefOficina = window.location.href = `/src/main/java/com/labsoftware/Rent/View/alterarUsuario.html`
            window.location.href = hrefOficina
        }else{
            alert("Senha incorreta")
        } 
    })
}

function getDataLista(){
    fetch(url+"Cliente", {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        return res.json()
    }).then(data => {
        console.log(data)
        var tableContent = ""
        document.getElementById("tableUsuario").innerHTML = "";
        for(var i = 0; i < data.length; i++){
            tableContent +=  `<tr><td class="table-dark" >${data[i].id}</td>
            <td class="table-dark">${data[i].usuario.email}</td>
            <td class="table-dark">${data[i].cpf}</td>
            <td class="table-dark">${data[i].rg}</td>
            <td class="table-dark">${data[i].nome}</td>
            <td class="table-dark">${data[i].endereco}</td>
            <td class="table-dark">${data[i].profissao}</td>
            </tr>
            `   
        }
        $("#tableUsuario").append(tableContent)
    })
}

//Loga o usuario no sistema
$(document).on('click', "#loginUsuario", function(){

    $.ajax({
        url: URL+`/Usuario/logar/${$('#caduser_email').val()}`,
        type: "GET",
        success: function (data) {
            if(data != null){
                if(data.senha == $('#caduser_senha').val()){
                    localStorage.setItem("id", data.id)
                    localStorage.setItem("nome", data.email)
                    localStorage.setItem("tipo", data.tipo)
                    window.location.href = window.location.origin + "/View/Bebidas/bebidas.html"
                }else{
                    alert("Senha incorreta")
                }
            }
        }, error: function (data) {
            alert("Usuário não encontrado")
        }
    });
})

$(document).on('click', "#cadUser", function(){

    const dataCliente = {
        "cpf": document.getElementById("caduser_cpf").value,
        "rg": document.getElementById("caduser_rg").value,
        "nome": document.getElementById("caduser_nome").value,
        "profissao": document.getElementById("caduser_profissao").value,
        "rua": document.getElementById("caduser_rua").value,
        "bairro": document.getElementById("caduser_bairro").value,
        "numero": document.getElementById("caduser_numero").value,
        "complemento": document.getElementById("caduser_complemento").value
     }
     const dataUsuario = {
         "email": document.getElementById("caduser_email").value,
         "senha": document.getElementById("caduser_conSenha").value,
         "tipo": 0
     }

    $.ajax({
        url: URL+`/Usuario`,
        type: "POST",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(dataUsuario),
        success: function (data) {
            vincularCliente(data.id, dataCliente)
        }, error: function (data) {
            console.log(data)
        }
    });
})

//Vincula o cliente ao usuário criado anteriormente
function vincularCliente(id, dataCliente){
    $.ajax({
        url: URL+`/Cliente/${id}`,
        type: "POST",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(dataCliente),
        success: function (data) {
            window.location.href = window.location.origin + "/View/Login/Login.html"
        }
    });
}