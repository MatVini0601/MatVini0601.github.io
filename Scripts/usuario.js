const url = "http://https://deploy-planalto.onrender.com//"

$(document).on('click', "#alterarUsuario", function(){

    $("#rowPageContent").empty()

    $.ajax({
        url: `http://127.0.0.1:5500/View/Usuario/AlterarUsuario.html`,
        type: "GET",
        success: function (data) {
           $("#pageContent #rowPageContent").append(data)  
           var idUsuario = localStorage.getItem("id")
            getData(idUsuario) 
        }
    })

})

// $(document).on('click', "#salvarUser", function(){

//     atualizarCadastro()

// })

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

            if(data.status === 500){
                alert("Erro ao buscar dados")
            } else {
                document.getElementById("caduser_cpf").value = data.cpf
                document.getElementById("caduser_nome").value = data.nome
                document.getElementById("caduser_rg").value = data.rg
                document.getElementById("caduser_email").value = data.usuario.email
                document.getElementById("caduser_senha").value = data.usuario.senha
                document.getElementById("caduser_profissao").value = data.profissao
                document.getElementById("caduser_rua").value = data.rua
                document.getElementById("caduser_bairro").value = data.bairro
                document.getElementById("caduser_numero").value = data.numero
                document.getElementById("caduser_complemento").value = data.complemento
            }
            
        })
    }
}

function atualizarCadastro(){
    const email = document.getElementById("caduser_email").value
    if(email === ""){
        alert("Preencha os dados corretamente");
    }
    else{
        const id = localStorage.getItem("id")
        const clienteData = {
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
            "senha": document.getElementById("caduser_senha").value,
        }
        fetch(url+"Cliente/"+id, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(clienteData)
        })
        fetch(url+`Usuario/`+id, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(dataUsuario)
            }).then(res => {
                alert("Cadastro atualizado com sucesso")
        })
    }
}